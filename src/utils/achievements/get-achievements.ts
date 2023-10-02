import { UnicornInfo } from "types/UnicornInfo";
import { achievements } from "./achievements";
import { fetchGitHubData } from "./github";

interface Achievement {
	name: string;
	body: string;
}

export async function getAchievements(
	unicorn: UnicornInfo,
): Promise<Achievement[]> {
	const userAchievements = [];

	const data = unicorn.socials.github
		? await fetchGitHubData(unicorn.socials.github)
		: undefined;

	for (const achievement of achievements) {
		if (!achievement.isAchieved(unicorn, data)) continue;

		const body =
			typeof achievement.body === "function"
				? achievement.body(unicorn)
				: achievement.body;

		userAchievements.push({
			name: achievement.name,
			body,
		});
	}

	return userAchievements;
}
