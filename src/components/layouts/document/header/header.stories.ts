import preview from "../../../../../.storybook/preview.ts";
import Header from "./header.astro";
import type { ComponentProps } from "astro/types";

type Args = ComponentProps<typeof Header> & { slots?: Record<string, string> };
const meta = preview.type<{ args: Args }>().meta({
	title: "components/Header",
	component: Header,
	args: { size: "l", disableDiscord: true },
	argTypes: { slots: { control: false, table: { disable: true } } },
});
export const Default = meta.story({});
export const Wide = meta.story({ args: { size: "xl" } });
