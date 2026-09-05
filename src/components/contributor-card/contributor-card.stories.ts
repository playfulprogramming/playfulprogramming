import preview from "../../../.storybook/preview.ts";
import ContributorCard from "./contributor-card.astro";
import type { ComponentProps } from "astro/types";
import { person } from "../../../.storybook/fixtures.ts";
type Args = ComponentProps<typeof ContributorCard> & {
	slots?: Record<string, string>;
};
const meta = preview.type<{ args: Args }>().meta({
	title: "components/Contributor Card",
	component: ContributorCard,
	args: { person, overrides: { roles: ["Writer", "Community member"] } },
	argTypes: { slots: { control: false, table: { disable: true } } },
});
export const Default = meta.story({});
export const Partner = meta.story({
	args: { overrides: { roles: ["Educator"], isPartner: true } },
});
