import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { SubHeader } from "./subheader.tsx";

const meta = preview.type<{ args: ComponentProps<typeof SubHeader> }>().meta({
	title: "Components/SubHeader",
	component: SubHeader,
	args: { tag: "h2", text: "Latest articles" },
});
export const Default = meta.story({});
export const WithAction = meta.story({
	args: {
		children: <a href="https://playfulprogramming.com/search">View all</a>,
	},
});
