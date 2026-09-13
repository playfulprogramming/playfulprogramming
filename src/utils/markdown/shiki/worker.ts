import rehypeShiki, { type RehypeShikiOptions } from "@shikijs/rehype";
import type { Root, Element } from "hast";
import { find } from "unist-util-find";
import { type Transformer } from "unified";
import {
	transformerMetaHighlight,
	transformerNotationHighlight,
	transformerRemoveLineBreak,
} from "@shikijs/transformers";

const options: RehypeShikiOptions = {
	themes: {
		light: "github-light",
		dark: "github-dark",
	},
	// code blocks use wrapping and not scroll overview, so they don't need to be focusable
	tabindex: false,
	transformers: [
		// supports "[!code highlight]" transforms to add a .highlight class
		transformerNotationHighlight({
			classActiveLine: "highlight",
			matchAlgorithm: "v3",
		}),
		// supports "``` {1,3-4}" transforms to add a .highlight class
		transformerMetaHighlight({
			className: "highlight",
		}),
		transformerRemoveLineBreak(),
	],
};

const shiki: Transformer<Root, Root> = rehypeShiki.call(
	undefined as never,
	options,
)!;

export default async function transform(node: Element): Promise<Element> {
	const tree: Root = {
		type: "root",
		children: [node],
	};
	await shiki(tree, undefined as never, undefined as never);
	// shiki swaps the <pre> for a root fragment wrapping the highlighted <pre>
	const highlighted = find<Element>(tree, { type: "element", tagName: "pre" });
	if (!highlighted) {
		throw new Error("shiki did not return a <pre> element");
	}
	fixShikiOutput(highlighted);
	return highlighted;
}

/**
 * - Moves the tabindex="0" shiki places on <pre> onto the scrollable <code> instead
 * - Removes the extra trailing line shiki adds to each code block
 */
function fixShikiOutput(pre: Element) {
	const code = pre.children.find(
		(child): child is Element =>
			child.type === "element" && child.tagName === "code",
	);
	if (!code) return;

	delete pre.properties.tabindex;
	code.properties.tabindex = "0";

	const lastLine = code.children.at(-1);
	if (
		lastLine?.type === "element" &&
		lastLine.properties.class === "line" &&
		lastLine.children.length === 0
	) {
		code.children.pop();
	}
}
