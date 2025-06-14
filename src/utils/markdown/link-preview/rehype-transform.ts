import { Root, Element, ElementContent } from "hast";
import { Plugin } from "unified";
import { find } from "unist-util-find";
import { transformLinkPreview } from "../components";
import { toHtml } from "hast-util-to-html";

/**
 * Transform image-wrapped links into a link preview component
 * Expects: <a><picture><img/></picture></a> / [![](image.png)](url)
 */
export const rehypeLinkPreview: Plugin<[], Root> = () => {
	return async (tree, vfile) => {
		for (let i = 0; i < tree.children.length; i++) {
			const element = tree.children[i];
			const node = find<Element>(element, { type: "element", tagName: "a" });
			if (!node) continue;
			const pictureNode = find<Element>(node, {
				type: "element",
				tagName: "picture",
			});
			if (!pictureNode) continue;

			const replacement = await transformLinkPreview({
				vfile,
				attributes: {},
				node,
				children: [element],
				processComponents: (nodes) => [
					{
						type: "html",
						innerHtml: toHtml(nodes as ElementContent[]),
					},
				],
			});

			if (replacement?.length) {
				tree.children.splice(i, 1, ...(replacement as never[]));
				i += replacement.length - 1;
			}
		}
	};
};
