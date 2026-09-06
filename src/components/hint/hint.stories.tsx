import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { Hint } from "./hint.tsx";

const meta = preview.type<{ args: ComponentProps<typeof Hint> }>().meta({
	title: "components/Hint",
	component: Hint,
	args: {
		title: "Need a hint?",
		children: <p>Try breaking the problem into smaller steps.</p>,
	},
});
export const Default = meta.story({});
