import { PlatformDetector } from "utils/markdown/iframes/platform-detectors/types";
import {
	getIFrameAttributes,
	getVideoDataFromUrl,
	videoHosts,
} from "utils/markdown/data-providers";
import { createComponent } from "utils/markdown/components";

export const videoPlatformDetector: PlatformDetector = {
	detect: (src) => {
		const srcUrl = new URL(src);
		const isVideo = videoHosts.includes(srcUrl.hostname);
		return isVideo;
	},
	rehypeTransform: async ({ parent, index, src, iframeData }) => {
		const json = await getVideoDataFromUrl(src).catch(() => null);

		let pageThumbnail = "/illustrations/illustration-webpage.svg";

		let { pageTitle, iframeAttrs } = iframeData;

		if (json) {
			pageTitle = `${json?.title ?? pageTitle}`;
			pageThumbnail = json?.thumbnail_url ?? pageThumbnail;
			const {
				height: _height,
				width: _width,
				...otherIframeProps
			} = await getIFrameAttributes(json.html);
			iframeAttrs = { ...iframeAttrs, ...otherIframeProps } as never;
		}

		const { height, width, metadata } = iframeData;

		parent.children.splice(
			index,
			1,
			createComponent("VideoPlaceholder", {
				width: width.toString(),
				height: height.toString(),
				src,
				pageTitle,
				pageIcon: metadata?.icon?.src,
				pageThumbnail,
				iframeAttrs,
			}),
		);

		return;
	},
};
