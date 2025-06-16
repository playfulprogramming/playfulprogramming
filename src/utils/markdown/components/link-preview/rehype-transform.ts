import { Root, Element } from "hast";
import { find } from "unist-util-find";
import { toString } from "hast-util-to-string";
import { URL } from "url";
import { RehypeFunctionComponent } from "../types";
import { isElement } from "utils/markdown/unist-is-element";
import { fetchPreviewForUrl } from "./fetchPreviewForUrl";
import { createComponent } from "../components";
import { Plugin } from "unified";
import { ComponentElement } from "../rehype-parse-components";

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

export const transformLinkPreview: RehypeFunctionComponent = async ({
	children,
}) => {
	const paragraphNode = children.filter(isElement).at(0);
	if (!paragraphNode) return;
	const anchorNode = find<Element>(paragraphNode, {
		type: "element",
		tagName: "a",
	});
	if (!anchorNode) return;

	let url: URL;
	try {
		url = new URL(anchorNode.properties.href + "");
	} catch (e) {
		return;
	}

	const pictureNode = find<Element>(anchorNode, {
		type: "element",
		tagName: "picture",
	});
	const result = pictureNode ? undefined : await fetchPreviewForUrl(url);
	if (!pictureNode && !result) return;

	return [
		createComponent(
			"LinkPreview",
			{
				type: "link",
				label: toString(anchorNode) || url.toString(),
				href: url.toString(),
				picture: result,
				alt: "",
			},
			pictureNode ? [pictureNode] : [],
		),
	];
};
