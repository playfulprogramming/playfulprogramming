import preview from "../../../../../.storybook/preview.ts";
import type { AchievementsInfo } from "#types/AchievementsInfo.ts";

import AchievementCard from "./achievement-card.astro";

type AchievementCardArgs = {
	achievement: AchievementsInfo;
};

const meta = preview.type<{ args: AchievementCardArgs }>().meta({
	title: "Astro/Achievement Card",
	component: AchievementCard,
	parameters: {
		layout: "centered",
	},
	args: {
		achievement: {
			id: "community-builder",
			name: "Community Builder",
			body: "Helped make programming education a little more welcoming.",
		},
	},
});

export const Default = meta.story({});

export const LongDescription = Default.extend({
	args: {
		achievement: {
			id: "patient-mentor",
			name: "Patient Mentor",
			body: "Explained a tricky idea with care, concrete examples, and enough room for everyone to ask one more question without feeling rushed.",
		},
	},
});
