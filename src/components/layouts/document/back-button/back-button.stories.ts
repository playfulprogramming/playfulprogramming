import preview from "../../../../../.storybook/preview.ts";
import BackButton from "./back-button.astro";
import type { ComponentProps } from "astro/types";

type Args = ComponentProps<typeof BackButton> & {
	slots?: Record<string, string>;
};
const meta = preview.type<{ args: Args }>().meta({
	title: "components/Back Button",
	component: BackButton,
	args: {},
	argTypes: { slots: { control: false, table: { disable: true } } },
});
export const Default = meta.story({});
