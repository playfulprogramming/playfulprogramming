import preview from "../../../.storybook/preview.ts";
import AuthorCard from "./author-card.astro";
import type { ComponentProps } from "astro/types";
import { person } from "../../../.storybook/fixtures.ts";
type Args = ComponentProps<typeof AuthorCard> & {
	slots?: Record<string, string>;
};
const meta = preview.type<{ args: Args }>().meta({
	title: "components/Author Card",
	component: AuthorCard,
	args: { author: person },
	argTypes: { slots: { control: false, table: { disable: true } } },
});
export const Default = meta.story({});
