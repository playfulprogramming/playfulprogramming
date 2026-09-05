import preview from "../../../../../.storybook/preview.ts";

import AchievementCard, {
	type Props as AchievementCardProps,
} from "./achievement-card.astro";

const meta = preview.type<{ args: AchievementCardProps }>().meta({
	title: "components/Achievement Card",
	component: AchievementCard,
	parameters: {
		layout: "centered",
	},
	args: {
		achievement: {
			name: "Community Builder",
			body: "Helped make programming education a little more welcoming.",
		},
	},
});

export const Default = meta.story({});

export const LongDescription = Default.extend({
	args: {
		achievement: {
			name: "Patient Mentor",
			body: "Explained a tricky idea with care, concrete examples, and enough room for everyone to ask one more question without feeling rushed.",
		},
	},
});
