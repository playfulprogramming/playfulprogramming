import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { LinkPreview } from "./link-preview.tsx";
import { illustration } from "../../../.storybook/fixtures.ts";

const meta = preview.type<{ args: ComponentProps<typeof LinkPreview> }>().meta({
	title: "components/Link Preview",
	component: LinkPreview,
	args: {
		type: "link",
		label: "Open example",
		href: "https://playfulprogramming.com",
		alt: "Community illustration",
		children: (
			<img src={illustration} alt="Community illustration" width="480" />
		),
	},
});
export const Default = meta.story({});
export const Zoom = meta.story({
	args: { type: "zoom", label: "View image", href: illustration },
});
