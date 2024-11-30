import { Root, Element } from "hast";
import { Plugin } from "unified";
import { find, Node } from "unist-util-find";
import { SKIP, visit } from "unist-util-visit";
import { ImageTooltip } from "./image-tooltip";

const isElement = (e: Root | Element | Node | undefined): e is Element =>
	e?.type == "element";

export const rehypeImageTooltip: Plugin<[], Root> = () => {
	return async (tree, file) => {
		visit(tree, { type: "element", tagName: "a" }, (parent: Element) => {
			const pictureIndex = parent.children.findIndex(
				(el) => isElement(el) && el.tagName == "picture",
			);
			if (pictureIndex == -1) return;
			const pictureNode = parent.children[pictureIndex];
			if (!isElement(pictureNode)) return;
			const imgNode = find(pictureNode, { type: "element", tagName: "img" });
			if (!isElement(imgNode)) return;

			// When given an <a><img/></a>, treat it as a link preview
			imgNode.properties["data-nozoom"] = true;

			const tooltip = ImageTooltip({
				type: "link",
				label: parent.properties.href + "",
				children: parent.children,
				anchorAttrs: parent.properties,
			});

			Object.assign(parent, tooltip);
			return SKIP;
		});
	};
};
