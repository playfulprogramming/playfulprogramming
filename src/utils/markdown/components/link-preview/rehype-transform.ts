import { Element } from "hast";
import { find } from "unist-util-find";
import { LinkPreview } from "./link-preview";
import { toString } from "hast-util-to-string";
import { URL } from "url";
import { Picture } from "../../picture/picture";
import { RehypeFunctionComponent } from "../types";
import { isElement } from "utils/markdown/unist-is-element";
import { fetchPreviewForUrl } from "./fetchPreviewForUrl";

async function createLinkElement(anchorNode: Element) {
	let url: URL;
	try {
		url = new URL(anchorNode.properties.href + "");
	} catch (e) {
		return;
	}

	const result = await fetchPreviewForUrl(url);
	if (!result) return;

	const picture = Picture({
		result,
		noZoom: true,
		imgAttrs: {},
	});

	return LinkPreview({
		type: "link",
		label: toString(anchorNode),
		children: [picture],
		anchorAttrs: anchorNode.properties,
	});
}

export const transformLinkPreview: RehypeFunctionComponent = ({ children }) => {
	const paragraphNode = children.filter(isElement).at(0);
	if (!paragraphNode) return;
	const anchorNode = find<Element>(paragraphNode, {
		type: "element",
		tagName: "a",
	});
	if (!anchorNode) return;

	return createLinkElement(anchorNode);
};
