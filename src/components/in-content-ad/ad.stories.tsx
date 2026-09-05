import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { InContentAd } from "./ad.tsx";

const meta = preview.type<{ args: ComponentProps<typeof InContentAd> }>().meta({
	title: "Components/InContentAd",
	component: InContentAd,
	args: {
		title: "Help keep learning free",
		body: "Support approachable programming resources for everyone.",
		"button-text": "Support the community",
		"button-href": "https://playfulprogramming.com/donate",
	},
});
export const Default = meta.story({});
