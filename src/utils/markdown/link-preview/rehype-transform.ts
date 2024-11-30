import { Root, Element } from "hast";
import { Plugin } from "unified";
import { find, Node } from "unist-util-find";
import { SKIP, visit } from "unist-util-visit";
import { LinkPreview } from "./link-preview";
import { toString } from "hast-util-to-string";
import { URL } from "url";

const isElement = (e: Root | Element | Node | undefined): e is Element =>
	e?.type == "element";

function replacePictureElement(anchorNode: Element) {
	const pictureIndex = anchorNode.children.findIndex(
		(el) => isElement(el) && el.tagName == "picture",
	);
	if (pictureIndex == -1) return;
	const pictureNode = anchorNode.children[pictureIndex];
	if (!isElement(pictureNode)) return;
	const imgNode = find(pictureNode, { type: "element", tagName: "img" });
	if (!isElement(imgNode)) return;

	// When given an <a><img/></a>, treat it as a link preview
	imgNode.properties["data-nozoom"] = true;

	const tooltip = LinkPreview({
		type: "link",
		label: anchorNode.properties.href + "",
		children: anchorNode.children,
		anchorAttrs: anchorNode.properties,
	});

	Object.assign(anchorNode, tooltip);
}

function replaceLinkElement(anchorNode: Element) {
	let url: URL;
	try {
		url = new URL(anchorNode.properties.href + "");
	} catch (e) {
		return;
	}

	let src: string | undefined;

	if (url.hostname === "playfulprogramming.com") {
		const path = /^\/posts\/([\w\-]+)/.exec(url.pathname);
		if (!path) return;

		const postSlug = path[1];
		if (!postSlug) return;

		src = `https://playfulprogramming.com/generated/${postSlug}.twitter-preview.jpg`;
	}

	if (!src) return;

	const picture: Element = {
		type: "element",
		tagName: "picture",
		properties: {},
		children: [
			{
				type: "element",
				tagName: "img",
				properties: {
					src,
					alt: "",
					["data-nozoom"]: "",
				},
				children: [],
			},
		],
	};

	const tooltip = LinkPreview({
		type: "link",
		label: toString(anchorNode),
		children: [picture],
		anchorAttrs: anchorNode.properties,
	});

	Object.assign(anchorNode, tooltip);
}

export const rehypeLinkPreview: Plugin<[], Root> = () => {
	return async (tree) => {
		visit(tree, "element", (node: Element) => {
			if (node.tagName === "a") {
				replacePictureElement(node);
			}

			if (node.tagName === "p" && node.children.length === 1) {
				const childNode = node.children[0];
				if (isElement(childNode) && childNode.tagName === "a") {
					replaceLinkElement(childNode);
				}
			}

			return SKIP;
		});
	};
};
