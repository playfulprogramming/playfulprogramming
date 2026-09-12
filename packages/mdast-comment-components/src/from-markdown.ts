import type { Html, Root } from "mdast";
import type { CompileContext, Extension } from "mdast-util-from-markdown";
import type { Token } from "micromark-util-types";
import type { CommentComponentDiagnostic } from "./types.ts";
import {
	markdownParagraphClosers,
	updateHtmlStack,
	updateMarkdownContext,
} from "./html-context.ts";
import "./micromark-extension.ts";

const htmlStacks = new WeakMap<object, string[]>();
const trackedConfigs = new WeakSet<CompileContext["config"]>();

/** Build the nodes directly from token enter/exit events. No tree transform. */
export function commentComponentsFromMarkdown(): Extension {
	return {
		enter: {
			playfulComponent: enterComponent,
			playfulComponentMarker: enterMarker,
			playfulComponentClosingMarker: enterMarker,
			playfulComponentUnexpectedMarker: enterMarker,
			htmlFlow(token) {
				trackMarkdownContext(this);
				this.enter({ type: "html", value: "" }, token);
				this.buffer();
			},
		},
		exit: {
			playfulComponent: exitComponent,
			htmlFlow(token) {
				const value = this.resume();
				(this.stack.at(-1) as Html).value = value;
				this.exit(token);
				const parent = this.stack.at(-1)!;
				let stack = htmlStacks.get(parent);
				if (!stack) htmlStacks.set(parent, (stack = []));
				updateHtmlStack(stack, value);
			},
		},
	};
}

/**
 * Preserve the registered Markdown handlers while observing their block-entry
 * events. Their eventual HTML can close a raw paragraph before the next marker.
 */
function trackMarkdownContext(context: CompileContext) {
	if (trackedConfigs.has(context.config)) return;
	trackedConfigs.add(context.config);
	for (const type of markdownParagraphClosers) {
		const handler = context.config.enter[type];
		if (!handler) continue;
		context.config.enter[type] = function (token) {
			const stack = htmlStacks.get(this.stack.at(-1)!);
			if (stack) updateMarkdownContext(stack, token.type);
			handler.call(this, token);
		};
	}
}

function enterComponent(this: CompileContext, token: Token) {
	const marker = token._commentComponent!;
	const parent = this.stack.at(-1);
	const eligible =
		(parent?.type === "root" || parent?.type === "playfulComponent") &&
		!htmlStacks.get(parent!)?.length;
	token._commentComponentSuppressed =
		!eligible ||
		marker.kind === "invalid" ||
		marker.kind === "end" ||
		(marker.kind === "ranged" && !token._commentComponentClosed);
	if (!eligible) return;
	if (marker.kind === "invalid") {
		diagnose(
			this,
			token,
			"invalid-marker",
			"Unable to parse component marker. Use a component name after ::, ::start:, or ::end: and close the HTML comment with -->.",
		);
		return;
	}
	if (marker.kind === "end") {
		const component =
			parent?.type === "playfulComponent" ? parent.component : undefined;
		diagnose(
			this,
			token,
			component ? "mismatched-close" : "unexpected-close",
			component
				? `Unexpected closing marker "::end:${marker.component}" inside "::start:${component}"; expected "::end:${component}".`
				: `Closing marker "::end:${marker.component}" has no corresponding opening marker.`,
		);
		return;
	}
	if (marker.kind === "ranged" && !token._commentComponentClosed) {
		diagnose(
			this,
			token,
			"missing-close",
			`Ranged component "::start:${marker.component}" is missing its "::end:${marker.component}" marker. The opening comment and its following content were preserved.`,
		);
		return;
	}
	this.enter(
		{
			type: "playfulComponent",
			component: marker.component,
			attributes: marker.attributes,
			form: marker.kind,
			children: [],
		},
		token,
	);
}

function exitComponent(this: CompileContext, token: Token) {
	if (!token._commentComponentSuppressed) this.exit(token);
}

function enterMarker(this: CompileContext, token: Token) {
	if (!token._commentComponentOwner?._commentComponentSuppressed) return;
	this.enter({ type: "html", value: this.sliceSerialize(token) }, token);
	this.exit(token);
}

function diagnose(
	context: CompileContext,
	token: Token,
	ruleId: CommentComponentDiagnostic["ruleId"],
	message: string,
) {
	token = token._commentComponentOpening ?? token;
	const root = context.stack[0] as Root;
	root.data ??= {};
	root.data.commentComponentDiagnostics ??= [];
	root.data.commentComponentDiagnostics.push({
		ruleId,
		message,
		severity: "error",
		position: {
			start: {
				line: token.start.line,
				column: token.start.column,
				offset: token.start.offset,
			},
			end: {
				line: token.end.line,
				column: token.end.column,
				offset: token.end.offset,
			},
		},
	});
}
