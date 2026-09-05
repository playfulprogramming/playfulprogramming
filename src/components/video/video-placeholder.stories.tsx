import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { VideoPlaceholder } from "./video-placeholder.tsx";
import { illustration } from "../../../.storybook/fixtures.ts";

const meta = preview
	.type<{ args: ComponentProps<typeof VideoPlaceholder> }>()
	.meta({
		title: "components/Video",
		component: VideoPlaceholder,
		args: {
			width: 640,
			height: 360,
			src: "https://www.youtube.com/embed/example",
			webUrl: "https://www.youtube.com/@playfulprogramming",
			pageTitle: "Learning together",
			pageThumbnail: illustration,
			iframeAttrs: { title: "Learning together" },
		},
	});
export const Default = meta.story({});
