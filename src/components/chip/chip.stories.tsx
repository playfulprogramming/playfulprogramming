import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { Chip } from "./chip.tsx";

const meta = preview.type<{ args: ComponentProps<typeof Chip> }>().meta({
	title: "Components/Chip",
	component: Chip,
	args: { tag: "button", children: "JavaScript" },
});
export const Default = meta.story({});
export const Link = meta.story({
	args: { tag: "a", href: "https://playfulprogramming.com/search" },
});
