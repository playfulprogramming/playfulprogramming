import { PlatformDetector } from "utils/markdown/iframes/platform-detectors/types";
import { createComponent } from "utils/markdown/components";

export const videoPlatformDetector: PlatformDetector = {
	detect: ({ metadata }) => metadata?.embedType === "video",
	rehypeTransform: async ({ parent, metadata, index }) => {
		const embed = metadata?.embed;
		if (!embed) throw new Error("This shouldn't happen");

		parent.children.splice(
			index,
			1,
			createComponent("VideoPlaceholder", {
				width: embed.width ?? 240,
				height: embed.height ?? 160,
				src: embed.src,
				pageTitle: metadata?.title ?? "",
				pageIcon: metadata?.icon?.src,
				pageThumbnail:
					metadata?.banner?.src ?? "/illustrations/illustration-webpage.svg",
				iframeAttrs: {},
			}),
		);

		return;
	},
};
