import preview from "../../../../.storybook/preview.ts";
import Barebones from "./barebones.astro";
import type { ComponentProps } from "astro/types";

type Args = ComponentProps<typeof Barebones> & {
	slots?: Record<string, string>;
};
const meta = preview.type<{ args: Args }>().meta({
	title: "Astro/Barebones",
	component: Barebones,
	args: {
		lang: "en",
		slots: {
			default: `<main style="padding: 24px"><h1>A custom page</h1><p>Content inside the barebones document.</p></main>`,
		},
	},
	argTypes: { slots: { control: false, table: { disable: true } } },
});
export const Default = meta.story({});
