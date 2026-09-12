import { markdownLineEnding, markdownSpace } from "micromark-util-character";
import { htmlFlow } from "micromark-core-commonmark";
import type {
	Code,
	Construct,
	Extension,
	State,
	Token,
	TokenizeContext,
	Tokenizer,
} from "micromark-util-types";
import { parseComponentAttributes } from "./attributes.ts";
import { updateHtmlStack } from "./html-context.ts";

export interface Marker {
	kind: "ranged" | "standalone" | "end" | "invalid";
	component: string;
	attributes: Record<string, string>;
}

declare module "micromark-util-types" {
	interface TokenTypeMap {
		playfulComponent: "playfulComponent";
		playfulComponentMarker: "playfulComponentMarker";
		playfulComponentClosingMarker: "playfulComponentClosingMarker";
		playfulComponentUnexpectedMarker: "playfulComponentUnexpectedMarker";
		playfulComponentMarkerData: "playfulComponentMarkerData";
	}
	interface Token {
		_commentComponent?: Marker;
		_commentComponentOwner?: Token;
		_commentComponentOpening?: Token;
		_commentComponentClosed?: boolean;
		_commentComponentSuppressed?: boolean;
	}
}

interface ActiveRange {
	component: string;
	document?: TokenizeContext;
}

// Context-local state, including when several processors parse concurrently.
const activeRanges = new WeakMap<TokenizeContext, ActiveRange>();

/** A flow construct runs before CommonMark's HTML construct at `<`. */
export function commentComponents(): Extension {
	return {
		flow: {
			60: [
				{ name: "commentComponents", concrete: true, tokenize },
				{ ...htmlFlow, tokenize: tokenizeHtml },
			],
		},
	};
}

/**
 * A complete HTML block can otherwise absorb the next component marker line
 * (for example `<br/>\n<!-- ::user -->`). Keep CommonMark's HTML tokenizer and
 * add that one boundary alongside its existing blank-line check.
 */
const tokenizeHtml: Tokenizer = function (effects, ok, nok) {
	// eslint-disable-next-line @typescript-eslint/no-this-alias
	const context = this;
	const tail = context.events.at(-1);
	const indentation =
		tail?.[1].type === "linePrefix"
			? context.sliceSerialize(tail[1], true).length
			: 0;
	const eligible = context.now().column === indentation + 1;
	const start = context.now();
	return htmlFlow.tokenize.call(
		context,
		{
			...effects,
			check(construct, yes, no) {
				if (!eligible) return effects.check(construct, yes, no);
				const source = context.sliceSerialize({ start, end: context.now() });
				const stack: string[] = [];
				updateHtmlStack(stack, source);
				// HTML comments and other declarations have their own terminators.
				if (stack.length || !/^<\/?[a-zA-Z]/.test(source))
					return effects.check(construct, yes, no);
				return effects.check(
					construct,
					yes,
					effects.check(componentFollowingLine, yes, no),
				);
			},
		},
		ok,
		nok,
	);
};

const componentFollowingLine: Construct = {
	partial: true,
	tokenize(effects, ok, nok) {
		let spaces = 0;
		return start;
		function start(code: Code): State | undefined {
			if (!markdownLineEnding(code)) return nok(code);
			effects.enter("lineEnding");
			effects.consume(code);
			effects.exit("lineEnding");
			return prefix;
		}
		function prefix(code: Code): State | undefined {
			if (code === 32 && spaces < 3) {
				if (spaces++ === 0) effects.enter("linePrefix");
				effects.consume(code);
				return prefix;
			}
			if (spaces) effects.exit("linePrefix");
			return effects.attempt(
				markerConstruct("playfulComponentMarker", () => {}),
				ok,
				nok,
			)(code);
		}
	},
};

const tokenize: Tokenizer = function (effects, ok, nok) {
	// Micromark invokes state functions independently; capture its context.
	// eslint-disable-next-line @typescript-eslint/no-this-alias
	const self = this;
	let container: Token;
	let opening: Token;
	let range: ActiveRange;
	let previous: Token | undefined;
	let document: TokenizeContext | undefined;
	let closing: Token | undefined;
	let marker: Marker;
	const tail = self.events.at(-1);
	const indentation =
		tail?.[1].type === "linePrefix"
			? self.sliceSerialize(tail[1], true).length
			: 0;

	return start;

	function start(code: Code): State | undefined {
		// A list/blockquote tokenizer has already removed its prefix. Only
		// physical root lines (or the document inside a component) are eligible.
		const adjacent =
			self.events.findLast(([, token]) => token.type !== "whitespace")?.[1]
				.type === "playfulComponent";
		if (!adjacent && (self.now().column !== indentation + 1 || indentation > 3))
			return nok(code);
		container = effects.enter("playfulComponent");
		return effects.attempt(
			markerConstruct("playfulComponentMarker", (token, value) => {
				opening = token;
				marker = value;
			}),
			afterOpening,
			nok,
		)(code);
	}

	function afterOpening(code: Code): State | undefined {
		container._commentComponent = marker;
		container._commentComponentOpening = opening;
		opening._commentComponentOwner = container;
		if (marker.kind === "end") {
			opening.type = "playfulComponentUnexpectedMarker";
			return finish(code);
		}
		if (marker.kind === "standalone" || marker.kind === "invalid")
			return finish(code);
		if (self.interrupt) return ok(code);
		range = { component: marker.component };
		activeRanges.set(self, range);
		return afterOpeningSpace(code);
	}

	function afterOpeningSpace(code: Code): State | undefined {
		if (markdownSpace(code)) {
			effects.enter("whitespace");
			return openingSpace(code);
		}
		if (markdownLineEnding(code)) {
			effects.enter("lineEnding");
			effects.consume(code);
			effects.exit("lineEnding");
			return lineStart;
		}
		return lineStart(code);
	}

	function openingSpace(code: Code): State | undefined {
		if (markdownSpace(code)) {
			effects.consume(code);
			return openingSpace;
		}
		effects.exit("whitespace");
		return afterOpeningSpace(code);
	}

	function lineStart(code: Code): State | undefined {
		if (code === null) return finishDocument(code);
		// The child document is tokenized as it arrives. Its active construct,
		// rather than a fence-shaped regex, decides whether a marker is literal.
		return effects.attempt(closingConstruct(), afterClosing, chunkStart)(code);
	}

	function chunkStart(code: Code): State | undefined {
		if (code === null) return finishDocument(code);
		document ??= self.parser.document(self.now());
		range.document = document;
		const token = effects.enter("chunkDocument", {
			contentType: "document",
			_tokenizer: document,
			previous,
		});
		if (previous) previous.next = token;
		previous = token;
		return chunkContinue(code);
	}

	function chunkContinue(code: Code): State | undefined {
		if (code === null) {
			writeChunk();
			return finishDocument(code);
		}
		effects.consume(code);
		if (markdownLineEnding(code)) {
			writeChunk();
			return lineStart;
		}
		return chunkContinue;
	}

	function writeChunk() {
		const token = effects.exit("chunkDocument");
		self.parser.lazy[token.start.line] = false;
		document!.defineSkip(token.start);
		document!.write(self.sliceStream(token));
	}

	function afterClosing(code: Code): State | undefined {
		container._commentComponentClosed = true;
		closing!._commentComponentOwner = container;
		return finishDocument(code);
	}

	function finishDocument(code: Code): State | undefined {
		document?.write([null]);
		activeRanges.delete(self);
		return finish(code);
	}

	function finish(code: Code): State | undefined {
		effects.exit("playfulComponent");
		if (code === null || markdownLineEnding(code)) return ok(code);
		if (markdownSpace(code)) {
			effects.enter("whitespace");
			return trailingSpace(code);
		}
		// Adjacent comments are separate sibling components, just as HTML
		// comments were in the old publishing pipeline.
		return effects.attempt({ tokenize, concrete: true }, ok, nok)(code);
	}

	function trailingSpace(code: Code): State | undefined {
		if (markdownSpace(code)) {
			effects.consume(code);
			return trailingSpace;
		}
		effects.exit("whitespace");
		return code === null || markdownLineEnding(code)
			? ok(code)
			: effects.attempt({ tokenize, concrete: true }, ok, nok)(code);
	}

	function closingConstruct(): Construct {
		return {
			partial: true,
			tokenize(effects, ok, nok) {
				let spaces = 0;
				return prefix;
				function prefix(code: Code): State | undefined {
					if (code === 32 && spaces < 3) {
						if (spaces++ === 0) effects.enter("linePrefix");
						effects.consume(code);
						return prefix;
					}
					if (spaces) effects.exit("linePrefix");
					return effects.attempt(
						markerConstruct("playfulComponentClosingMarker", (token, value) => {
							closing = token;
							if (
								value.kind !== "end" ||
								value.component !== marker.component ||
								(document &&
									(hasActiveRange(document, value.component) ||
										literalContext(document, spaces) ||
										inList(document, spaces) ||
										inHtml(document)))
							)
								closing = undefined;
						}),
						after,
						nok,
					)(code);
				}
				function after(code: Code): State | undefined {
					return closing ? ok(code) : nok(code);
				}
			},
		};
	}
};

function markerConstruct(
	type: "playfulComponentMarker" | "playfulComponentClosingMarker",
	onMarker: (token: Token, marker: Marker) => void,
): Construct {
	return {
		partial: true,
		tokenize(effects, ok, nok) {
			// eslint-disable-next-line @typescript-eslint/no-this-alias
			const self = this;
			const prefix = "<!--";
			let index = 0;
			let dashes = 0;
			let token: Token;
			return start;
			function start(code: Code): State | undefined {
				token = effects.enter(type);
				effects.enter("playfulComponentMarkerData");
				return before(code);
			}
			function before(code: Code): State | undefined {
				if (code !== prefix.charCodeAt(index++)) return nok(code);
				effects.consume(code);
				return index === prefix.length ? inside : before;
			}
			function inside(code: Code): State | undefined {
				if (code === null) return nok(code);
				if (code === 62 && dashes >= 2) {
					effects.consume(code);
					effects.exit("playfulComponentMarkerData");
					effects.exit(type);
					const value = self.sliceSerialize(token).slice(4, -3).trim();
					if (!value.startsWith("::")) return nok;
					const kind: Marker["kind"] = value.startsWith("::start:")
						? "ranged"
						: value.startsWith("::end:")
							? "end"
							: "standalone";
					const content = value.slice(
						kind === "ranged" ? 8 : kind === "end" ? 6 : 2,
					);
					const parsed = parseComponentAttributes(content);
					const marker: Marker =
						!parsed || (kind === "end" && !/^[a-zA-Z][\w-]*$/.test(content))
							? { kind: "invalid", component: content, attributes: {} }
							: { kind, ...parsed };
					token._commentComponent = marker;
					onMarker(token, marker);
					return ok;
				}
				dashes = code === 45 ? dashes + 1 : 0;
				effects.consume(code);
				if (markdownLineEnding(code)) {
					effects.exit("playfulComponentMarkerData");
					return afterLine;
				}
				return inside;
			}
			function afterLine(code: Code): State | undefined {
				effects.enter("playfulComponentMarkerData");
				return inside(code);
			}
		},
	};
}

function activeFlow(document: TokenizeContext): TokenizeContext | undefined {
	for (let index = document.events.length - 1; index >= 0; index--) {
		const token = document.events[index]![1];
		if (token.type === "chunkFlow") return token._tokenizer;
	}
}

function hasActiveRange(document: TokenizeContext, component: string): boolean {
	const flow = activeFlow(document);
	const range = flow && activeRanges.get(flow);
	return (
		!!range &&
		(range.component === component ||
			(!!range.document && hasActiveRange(range.document, component)))
	);
}

function literalContext(document: TokenizeContext, spaces: number): boolean {
	const flow = activeFlow(document);
	if (!flow?.currentConstruct?.concrete) return false;
	if (inNonContinuingContainer(document, spaces)) return false;
	if (flow.currentConstruct.name === "htmlFlow") return inHtml(document);
	const range = activeRanges.get(flow);
	return range
		? !!range.document && literalContext(range.document, spaces)
		: true;
}

function inList(document: TokenizeContext, spaces: number): boolean {
	const containers = document.events.filter(
		([action, token]) => action === "enter" && token._container && !token.end,
	);
	if (containers.some(([, token]) => token.type === "blockQuote")) return false;
	const list = containers.find(
		([, token]) =>
			token.type === "listOrdered" || token.type === "listUnordered",
	);
	if (!list) return false;
	const prefix = document.events.find(
		([action, token]) =>
			action === "exit" &&
			token.type === "listItemPrefix" &&
			token.start.offset >= list[1].start.offset,
	)?.[1];
	return !!prefix && spaces >= prefix.end.column - 1;
}

function inNonContinuingContainer(
	document: TokenizeContext,
	spaces: number,
): boolean {
	const open = document.events.some(
		([action, token]) => action === "enter" && token._container && !token.end,
	);
	return open && !inList(document, spaces);
}

function inHtml(document: TokenizeContext): boolean {
	const stack: string[] = [];
	const seen = new Set<TokenizeContext>();
	let depth = 0;
	for (const [action, token] of document.events) {
		if (token._container) depth += action === "enter" ? 1 : -1;
		if (
			depth ||
			token.type !== "chunkFlow" ||
			!token._tokenizer ||
			seen.has(token._tokenizer)
		)
			continue;
		seen.add(token._tokenizer);
		let componentDepth = 0;
		for (const [action, child, context] of token._tokenizer.events) {
			if (child.type === "playfulComponent")
				componentDepth += action === "enter" ? 1 : -1;
			if (!componentDepth && action === "enter" && child.type === "htmlFlow") {
				const source = context.sliceSerialize({
					start: child.start,
					end: child.end ?? context.now(),
				});
				if (source.lastIndexOf("<!--") > source.lastIndexOf("-->")) return true;
				if (source.lastIndexOf("<![CDATA[") > source.lastIndexOf("]]>"))
					return true;
				updateHtmlStack(stack, source);
			}
		}
	}
	return stack.length > 0;
}
