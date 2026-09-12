import type { Parents } from "mdast";
import type { Info, Options, State } from "mdast-util-to-markdown";
import { find, html } from "property-information";
import type { PlayfulComponent } from "./types.ts";

declare module "mdast-util-to-markdown" {
	interface ConstructNameMap {
		playfulComponent: "playfulComponent";
	}
}

/** Serialize normalized HTML property names back to their attribute spellings. */
function serializeAttributes(attributes: Record<string, string>): string {
	return Object.entries(attributes)
		.map(([property, value]) => {
			const attribute = find(html, property).attribute;
			if (!/^[^\s"'<>/=]+$/.test(attribute)) {
				throw new Error(`Invalid component attribute name: ${attribute}`);
			}
			// Escape line endings and comment delimiters too: markers occupy one line.
			const escaped = value.replace(/[&"<>\r\n]/g, (character) => {
				return {
					"&": "&amp;",
					'"': "&quot;",
					"<": "&lt;",
					">": "&gt;",
					"\r": "&#13;",
					"\n": "&#10;",
				}[character]!;
			});
			return ` ${attribute}="${escaped}"`;
		})
		.join("");
}

function handleComponent(
	node: PlayfulComponent,
	_parent: Parents | undefined,
	state: State,
	info: Info,
): string {
	const exit = state.enter("playfulComponent");
	const tracker = state.createTracker(info);
	const attributes = serializeAttributes(node.attributes);
	const prefix = node.form === "ranged" ? "::start:" : "::";
	let value = tracker.move(`<!-- ${prefix}${node.component}${attributes} -->`);
	if (node.form === "ranged") {
		value += tracker.move("\n\n");
		if (node.children.length) {
			value += tracker.move(state.containerFlow(node, tracker.current()));
			value += tracker.move("\n\n");
		}
		value += tracker.move(`<!-- ::end:${node.component} -->`);
	}
	exit();
	return value;
}

/** An extension for mdast-util-to-markdown (also registered by the Remark plugin). */
export function commentComponentsToMarkdown(): Options {
	return { handlers: { playfulComponent: handleComponent } };
}
