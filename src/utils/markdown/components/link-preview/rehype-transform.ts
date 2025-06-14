import { Element } from "hast";
import { find } from "unist-util-find";
import { toString } from "hast-util-to-string";
import { URL } from "url";
import { RehypeFunctionComponent } from "../types";
import { isElement } from "utils/markdown/unist-is-element";
import { fetchPreviewForUrl } from "./fetchPreviewForUrl";
import { createComponent } from "../components";

export const transformLinkPreview: RehypeFunctionComponent = async ({
	children,
	processComponents,
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
		createComponent("LinkPreview", {
			type: "link",
			label: toString(anchorNode) || url.toString(),
			href: url.toString(),
			picture: result,
			alt: "",
			children: pictureNode ? await processComponents([pictureNode]) : [],
		}),
	];
};
