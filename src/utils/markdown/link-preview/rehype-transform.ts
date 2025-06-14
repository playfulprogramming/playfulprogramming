import { Root, Element } from "hast";
import { Plugin } from "unified";
import { find } from "unist-util-find";
import { ComponentElement } from "../components";
import { isElement } from "../unist-is-element";

/**
 * Transform image-wrapped links into a link preview component
 * Expects: <a><picture><img/></picture></a> / [![](image.png)](url)
 */
export const rehypeLinkPreview: Plugin<[], Root> = () => {
	return (tree, _) => {
		for (let i = 0; i < tree.children.length; i++) {
			const element = tree.children[i];
			if (!isElement(element)) continue;
			const node = find<Element>(element, { type: "element", tagName: "a" });
			if (!node) continue;
			const pictureNode = find<Element>(node, {
				type: "element",
				tagName: "picture",
			});
			if (!pictureNode) continue;

			const replacement: ComponentElement = {
				type: "element",
				tagName: "playful-component",
				position: element.position,
				properties: {
					name: "link-preview",
				},
				data: {
					position: {},
					attributes: {},
				},
				children: [element],
			};

			tree.children.splice(i, 1, replacement);
		}
	};
};
