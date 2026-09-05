import preview from "../../../.storybook/preview.ts";
import BowtieButton from "./bowtie-button.astro";
import type { ComponentProps } from "astro/types";

type Args = ComponentProps<typeof BowtieButton> & {
	slots?: Record<string, string>;
};
const meta = preview.type<{ args: Args }>().meta({
	title: "Astro/BowtieButton",
	component: BowtieButton,
	args: {
		href: "https://playfulprogramming.com/donate",
		slots: { default: "Support the community" },
	},
	argTypes: { slots: { control: false, table: { disable: true } } },
});
export const Default = meta.story({});
