import preview from "../../../.storybook/preview.ts";
import TranslationsHeader from "./translations-header.astro";
import type { ComponentProps } from "astro/types";

type Args = ComponentProps<typeof TranslationsHeader> & {
	slots?: Record<string, string>;
};
const meta = preview.type<{ args: Args }>().meta({
	title: "Astro/TranslationsHeader",
	component: TranslationsHeader,
	args: { locales: ["en", "es", "fr"] },
	argTypes: { slots: { control: false, table: { disable: true } } },
});
export const Default = meta.story({});
