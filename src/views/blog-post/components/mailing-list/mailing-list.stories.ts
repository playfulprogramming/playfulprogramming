import preview from "../../../../../.storybook/preview.ts";

import MailingList, {
	type Props as MailingListProps,
} from "./mailing-list.astro";

const meta = preview.type<{ args: MailingListProps }>().meta({
	title: "Astro/Mailing List",
	component: MailingList,
	parameters: {
		layout: "padded",
	},
});

export const Default = meta.story({});
