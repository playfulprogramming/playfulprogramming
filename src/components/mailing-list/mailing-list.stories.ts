import preview from "../../../.storybook/preview.ts";

import MailingList from "./mailing-list.astro";

type MailingListArgs = Record<string, never>;

const meta = preview.type<{ args: MailingListArgs }>().meta({
	title: "Astro/Mailing List",
	component: MailingList,
	parameters: {
		layout: "padded",
	},
});

export const Default = meta.story({});
