import preview from "../../../../.storybook/preview.ts";
import Document from "./document.astro";
import type { ComponentProps } from "astro/types";

type Args = ComponentProps<typeof Document> & {
	slots?: Record<string, string>;
};
const meta = preview.type<{ args: Args }>().meta({
	title: "components/Document",
	component: Document,
	args: {
		size: "l",
		disableDiscord: true,
		slots: {
			default: `<main style="padding: 24px"><h1>Learning together</h1><p>Page content inside the standard document layout.</p></main>`,
		},
	},
	argTypes: { slots: { control: false, table: { disable: true } } },
});
export const Default = meta.story({});
