import preview from "../../../.storybook/preview.ts";
import { illustration } from "../../../.storybook/fixtures.ts";

import PageCard, { type Props as PageCardProps } from "./page-card.astro";

type PageCardStoryArgs = PageCardProps & {
	slots?: {
		button?: string;
		"second-button"?: string;
	};
};

const primaryAction = `
	<a class="button large primary text-style-button-large" href="/join-us">
		<span class="innerText">Join the community</span>
	</a>
`;

const secondaryAction = `
	<a class="button large secondary text-style-button-large" href="/about">
		<span class="innerText">Learn more</span>
	</a>
`;

const meta = preview.type<{ args: PageCardStoryArgs }>().meta({
	title: "components/Page Card",
	component: PageCard,
	parameters: {
		layout: "centered",
	},
	args: {
		title: "Learn together",
		description:
			"Meet kind people, share what you know, and make programming feel a bit more playful.",
		imageSrc: illustration,
		imageAlt: "Three people smiling together",
		numberOfButtons: 1,
		slots: {
			button: primaryAction,
		},
	},
	argTypes: {
		slots: {
			control: false,
			table: { disable: true },
		},
	},
});

export const Default = meta.story({});

export const TwoActions = Default.extend({
	args: {
		numberOfButtons: 2,
		slots: {
			button: primaryAction,
			"second-button": secondaryAction,
		},
	},
});

export const LongContent = Default.extend({
	args: {
		title: "A deliberately long heading for responsive layouts",
		description:
			"This variation gives the card enough content to expose wrapping, spacing, and button alignment issues at narrow and wide viewport sizes.",
	},
});
