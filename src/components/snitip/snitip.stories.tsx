import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { SnitipContent } from "./snitip.tsx";
import { snitip } from "../../../.storybook/fixtures.ts";

const meta = preview
	.type<{ args: ComponentProps<typeof SnitipContent> }>()
	.meta({
		title: "Components/SnitipContent",
		component: SnitipContent,
		args: { snitip },
	});
export const Default = meta.story({});
