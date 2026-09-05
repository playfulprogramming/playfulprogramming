import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { Tooltip } from "./tooltip.tsx";

const meta = preview.type<{ args: ComponentProps<typeof Tooltip> }>().meta({
	title: "components/Tooltip",
	component: Tooltip,
	args: {
		icon: "info",
		title: "A helpful detail",
		children: <p>You can navigate these controls with your keyboard.</p>,
	},
});
export const Default = meta.story({});
export const Warning = meta.story({
	args: {
		icon: "warning",
		title: "Watch out",
		children: <p>Remember to save your work.</p>,
	},
});
