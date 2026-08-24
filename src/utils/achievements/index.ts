import { getPostsByPerson } from "#src/utils/api.ts";
import type { PersonInfo } from "#types/PersonInfo.ts";
import { contributorYears, fetchGitHubData } from "./github.ts";
import * as api from "#utils/api.ts";
import type { TranslationKey } from "#utils/translations.ts";

export interface Achievement {
	name: string;
	body: string;
}

type Translate = (key: TranslationKey, ...args: string[]) => string;

function createAchievement(
	translate: Translate,
	nameKey: TranslationKey,
	bodyKey: TranslationKey,
	nameArgs: string[] = [],
	bodyArgs: string[] = [],
): Achievement {
	return {
		name: translate(nameKey, ...nameArgs),
		body: translate(bodyKey, ...bodyArgs),
	};
}

export async function getAchievements(
	person: PersonInfo,
	translate: Translate,
): Promise<Achievement[]> {
	const achievements: Achievement[] = [];

	const data = person.socials.github
		? await fetchGitHubData(person.socials.github)
		: undefined;

	const authoredPosts = getPostsByPerson(person.id, person.locale);

	if (person.achievements.includes("site-redesign")) {
		achievements.push(
			createAchievement(
				translate,
				"achievement.site_redesign.name",
				"achievement.site_redesign.body",
			),
		);
	}

	if (person.achievements.includes("site-logo")) {
		achievements.push(
			createAchievement(
				translate,
				"achievement.site_logo.name",
				"achievement.site_logo.body",
			),
		);
	}

	if (person.achievements.includes("code-challenge")) {
		achievements.push(
			createAchievement(
				translate,
				"achievement.code_challenge.name",
				"achievement.code_challenge.body",
			),
		);
	}

	if (person.roles.includes("translator")) {
		achievements.push(
			createAchievement(
				translate,
				"achievement.translator.name",
				"achievement.translator.body",
			),
		);
	}

	if (authoredPosts.some((post) => post.wordCount >= 6000)) {
		achievements.push(
			createAchievement(
				translate,
				"achievement.long_article.name",
				"achievement.long_article.body",
			),
		);
	}

	if (api.getCollectionsByPerson(person.id, person.locale).length > 0) {
		achievements.push(
			createAchievement(
				translate,
				"achievement.collection_author.name",
				"achievement.collection_author.body",
			),
		);
	}

	if (authoredPosts.some((post) => post.authors.length > 1)) {
		achievements.push(
			createAchievement(
				translate,
				"achievement.article_collaboration.name",
				"achievement.article_collaboration.body",
			),
		);
	}

	if (person.roles.includes("community")) {
		achievements.push(
			createAchievement(
				translate,
				"achievement.community_leader.name",
				"achievement.community_leader.body",
			),
		);
	}

	if (person.achievements.includes("partner")) {
		achievements.push(
			createAchievement(
				translate,
				"achievement.partner.name",
				"achievement.partner.body",
			),
		);
	}

	if (data && data.issueCount >= 25) {
		achievements.push(
			createAchievement(
				translate,
				"achievement.issues_25.name",
				"achievement.issues_25.body",
			),
		);
	} else if (data && data.issueCount >= 10) {
		achievements.push(
			createAchievement(
				translate,
				"achievement.issues_10.name",
				"achievement.issues_10.body",
			),
		);
	} else if (data && data.issueCount > 0) {
		achievements.push(
			createAchievement(
				translate,
				"achievement.issue_1.name",
				"achievement.issue_1.body",
			),
		);
	}

	if (data && data.pullRequestCount >= 30) {
		achievements.push(
			createAchievement(
				translate,
				"achievement.pull_requests_30.name",
				"achievement.pull_requests_30.body",
			),
		);
	} else if (data && data.pullRequestCount >= 10) {
		achievements.push(
			createAchievement(
				translate,
				"achievement.pull_requests_10.name",
				"achievement.pull_requests_10.body",
			),
		);
	} else if (data && data.pullRequestCount >= 5) {
		achievements.push(
			createAchievement(
				translate,
				"achievement.pull_requests_5.name",
				"achievement.pull_requests_5.body",
			),
		);
	} else if (data && data.pullRequestCount >= 3) {
		achievements.push(
			createAchievement(
				translate,
				"achievement.pull_requests_3.name",
				"achievement.pull_requests_3.body",
			),
		);
	} else if (data && data.pullRequestCount > 0) {
		achievements.push(
			createAchievement(
				translate,
				"achievement.pull_request_1.name",
				"achievement.pull_request_1.body",
			),
		);
	}

	if (person.achievements.includes("messages-1000")) {
		achievements.push(
			createAchievement(
				translate,
				"achievement.messages_1000.name",
				"achievement.messages_1000.body",
			),
		);
	} else if (person.achievements.includes("messages-500")) {
		achievements.push(
			createAchievement(
				translate,
				"achievement.messages_500.name",
				"achievement.messages_500.body",
			),
		);
	} else if (person.achievements.includes("messages-200")) {
		achievements.push(
			createAchievement(
				translate,
				"achievement.messages_200.name",
				"achievement.messages_200.body",
			),
		);
	}

	for (const year of contributorYears) {
		if (data && data.commitsInYear?.includes(year)) {
			achievements.push(
				createAchievement(
					translate,
					"achievement.yearly_contributor.name",
					"achievement.yearly_contributor.body",
					[String(year)],
					[String(year)],
				),
			);
		}
	}

	if (authoredPosts.length >= 30) {
		achievements.push(
			createAchievement(
				translate,
				"achievement.articles_30.name",
				"achievement.articles_30.body",
			),
		);
	} else if (authoredPosts.length >= 10) {
		achievements.push(
			createAchievement(
				translate,
				"achievement.articles_10.name",
				"achievement.articles_10.body",
			),
		);
	} else if (authoredPosts.length >= 5) {
		achievements.push(
			createAchievement(
				translate,
				"achievement.articles_5.name",
				"achievement.articles_5.body",
			),
		);
	} else if (authoredPosts.length >= 3) {
		achievements.push(
			createAchievement(
				translate,
				"achievement.articles_3.name",
				"achievement.articles_3.body",
			),
		);
	}

	const wordCount = authoredPosts.reduce((acc, post) => {
		return acc + (post.wordCount ?? 0);
	}, 0);

	if (wordCount > 0) {
		achievements.push(
			createAchievement(
				translate,
				"achievement.words_written.name",
				"achievement.words_written.body",
				[],
				[wordCount.toLocaleString(person.locale)],
			),
		);
	}

	if (person.roles.length >= 3) {
		achievements.push(
			createAchievement(
				translate,
				"achievement.role_badges_3.name",
				"achievement.role_badges_3.body",
			),
		);
	} else if (person.roles.length > 0) {
		achievements.push(
			createAchievement(
				translate,
				"achievement.role_badge_1.name",
				"achievement.role_badge_1.body",
			),
		);
	}

	return achievements;
}
