import type { RehypeEmbedTransformProps } from "./types.ts";
import {
	type ComponentNode,
	createComponent,
} from "#utils/markdown/components/index.ts";

export function rehypeTransformVideo({
	src,
	embed,
	metadata,
}: RehypeEmbedTransformProps<"video">): ComponentNode[] {
	const embedSrc = embed.src;

	if (!embedSrc) {
		return [
			createComponent("FourOFourPlaceholder", {
				url: src,
			}),
		];
	}

	return [
		createComponent("VideoPlaceholder", {
			width: embed.width ?? 240,
			height: embed.height ?? 160,
			src: embedSrc,
			webUrl: src,
			pageTitle: metadata?.title ?? "",
			pageIcon: metadata?.icon?.src,
			pageThumbnail:
				metadata?.banner?.src ?? "/illustrations/illustration-webpage.svg",
			iframeAttrs: {},
		}),
	];
}
