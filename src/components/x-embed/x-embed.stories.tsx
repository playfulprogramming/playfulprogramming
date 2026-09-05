import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { XEmbedPlaceholder } from "./x-embed.tsx";
import { illustration } from "../../../.storybook/fixtures.ts";

const meta = preview
	.type<{ args: ComponentProps<typeof XEmbedPlaceholder> }>()
	.meta({
		title: "Components/XEmbedPlaceholder",
		component: XEmbedPlaceholder,
		args: {
			name: "Alex Example",
			handle: "example",
			profilePic: illustration,
			text: "Small examples make big ideas easier to understand.",
			date: "2026-01-15T12:00:00Z",
			link: "https://x.com",
			likes: 42,
			reposts: 8,
			replies: 3,
		},
	});
export const Default = meta.story({});
export const WithPicture = meta.story({
	args: {
		picture: {
			src: illustration,
			altText: "Learning together",
			width: 480,
			height: 320,
		},
	},
});
