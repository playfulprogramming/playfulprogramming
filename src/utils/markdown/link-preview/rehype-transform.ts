import { Root, Element, ElementContent } from "hast";
import { Plugin } from "unified";
import { find } from "unist-util-find";
import { isElement } from "../unist-is-element";

function createPictureElement(anchorNode: Element): ElementContent[] {
	const pictureIndex = anchorNode.children.findIndex(
		(el) => isElement(el) && el.tagName == "picture",
	);
	if (pictureIndex == -1) return [];
	const pictureNode = anchorNode.children[pictureIndex];
	if (!isElement(pictureNode)) return [];
	const imgNode = find(pictureNode, { type: "element", tagName: "img" });
	if (!isElement(imgNode)) return [];

	// When given an <a><img/></a>, treat it as a link preview
	imgNode.properties["data-nozoom"] = true;

	return [
		{
			type: "comment",
			value: " ::start:link-preview ",
			position: anchorNode.position,
		},
		{
			type: "element",
			tagName: "p",
			properties: {},
			children: [anchorNode],
			position: anchorNode.position,
		},
		{
			type: "comment",
			value: " ::end:link-preview ",
			position: anchorNode.position,
		},
	];
}

/**
 * Transform image-wrapped links into a link preview component
 * Expects: <a><picture><img/></picture></a> / [![](image.png)](url)
 */
export const rehypeLinkPreview: Plugin<[], Root> = () => {
	return (tree) => {
		for (let i = 0; i < tree.children.length; i++) {
			const element = tree.children[i];
			const node = find<Element>(element, { type: "element", tagName: "a" });
			if (!node) continue;

			const replacement = createPictureElement(node);

			if (replacement.length) {
				tree.children.splice(i, 1, ...replacement);
				i += replacement.length - 1;
			}
		}
	};
};
