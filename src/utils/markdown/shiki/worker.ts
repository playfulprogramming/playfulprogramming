import rehypeShiki, { type RehypeShikiOptions } from "@shikijs/rehype";
import type { Root, Element } from "hast";
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
	return tree.children[0] as Element;
}
