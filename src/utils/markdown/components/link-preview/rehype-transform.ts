import { Element } from "hast";
import { find } from "unist-util-find";
import { LinkPreview } from "./link-preview";
import { toString } from "hast-util-to-string";
import { URL } from "url";
import { RehypeFunctionComponent } from "../types";
import { isElement } from "utils/markdown/unist-is-element";
import { logError } from "utils/markdown/logger";
import { getUrlMetadata } from "utils/hoof/get-url-metadata";
import { Picture } from "utils/markdown/picture/picture";
import { GetPictureResult } from "utils/get-picture";

export const transformLinkPreview: RehypeFunctionComponent = async ({
	vfile,
	node,
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
		logError(vfile, node, "HREF is not a valid URL!");
		return anchorNode;
	}

	const metadata = await getUrlMetadata(url.toString()).catch((e) => {
		logError(vfile, node, "Could not fetch URL metadata!", e);
		return undefined;
	});

	if (!metadata || !metadata.banner) {
		logError(vfile, node, "Could not fetch URL metadata!");
		return anchorNode;
	}

	const result: GetPictureResult = {
		urls: {},
		image: metadata.banner,
		sources: [],
	};

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
};
