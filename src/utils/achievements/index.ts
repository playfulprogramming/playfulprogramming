import { getPostsByPerson } from "#src/utils/api.ts";
import type { PersonInfo } from "#types/PersonInfo.ts";
import { contributorYears, fetchGitHubData } from "./github.ts";
import * as api from "#utils/api.ts";
import { m } from "#src/paraglide/messages.js";
import type { Locale } from "#src/paraglide/runtime.js";

export interface Achievement {
	name: string;
	body: string;
}

type StaticMessage = (
	inputs?: Record<string, never>,
	options?: { locale?: Locale },
) => string;

function createAchievement(
	locale: Locale,
	nameMessage: StaticMessage,
	bodyMessage: StaticMessage,
): Achievement {
	return {
		name: nameMessage({}, { locale }),
		body: bodyMessage({}, { locale }),
	};
}

export async function getAchievements(
	person: PersonInfo,
): Promise<Achievement[]> {
	const achievements: Achievement[] = [];

	const data = person.socials.github
		? await fetchGitHubData(person.socials.github)
		: undefined;

	const authoredPosts = getPostsByPerson(person.id, person.locale);

	if (person.achievements.includes("site-redesign")) {
		achievements.push(
			createAchievement(
				person.locale,
				m.achievement_site_redesign_name,
				m.achievement_site_redesign_body,
			),
		);
	}

	if (person.achievements.includes("site-logo")) {
		achievements.push(
			createAchievement(
				person.locale,
				m.achievement_site_logo_name,
				m.achievement_site_logo_body,
			),
		);
	}

	if (person.achievements.includes("code-challenge")) {
		achievements.push(
			createAchievement(
				person.locale,
				m.achievement_code_challenge_name,
				m.achievement_code_challenge_body,
			),
		);
	}

	if (person.roles.includes("translator")) {
		achievements.push(
			createAchievement(
				person.locale,
				m.achievement_translator_name,
				m.achievement_translator_body,
			),
		);
	}

	if (authoredPosts.some((post) => post.wordCount >= 6000)) {
		achievements.push(
			createAchievement(
				person.locale,
				m.achievement_long_article_name,
				m.achievement_long_article_body,
			),
		);
	}

	if (api.getCollectionsByPerson(person.id, person.locale).length > 0) {
		achievements.push(
			createAchievement(
				person.locale,
				m.achievement_collection_author_name,
				m.achievement_collection_author_body,
			),
		);
	}

	if (authoredPosts.some((post) => post.authors.length > 1)) {
		achievements.push(
			createAchievement(
				person.locale,
				m.achievement_article_collaboration_name,
				m.achievement_article_collaboration_body,
			),
		);
	}

	if (person.roles.includes("community")) {
		achievements.push(
			createAchievement(
				person.locale,
				m.achievement_community_leader_name,
				m.achievement_community_leader_body,
			),
		);
	}

	if (person.achievements.includes("partner")) {
		achievements.push(
			createAchievement(
				person.locale,
				m.achievement_partner_name,
				m.achievement_partner_body,
			),
		);
	}

	if (data && data.issueCount >= 25) {
		achievements.push(
			createAchievement(
				person.locale,
				m.achievement_issues_25_name,
				m.achievement_issues_25_body,
			),
		);
	} else if (data && data.issueCount >= 10) {
		achievements.push(
			createAchievement(
				person.locale,
				m.achievement_issues_10_name,
				m.achievement_issues_10_body,
			),
		);
	} else if (data && data.issueCount > 0) {
		achievements.push(
			createAchievement(
				person.locale,
				m.achievement_issue_1_name,
				m.achievement_issue_1_body,
			),
		);
	}

	if (data && data.pullRequestCount >= 30) {
		achievements.push(
			createAchievement(
				person.locale,
				m.achievement_pull_requests_30_name,
				m.achievement_pull_requests_30_body,
			),
		);
	} else if (data && data.pullRequestCount >= 10) {
		achievements.push(
			createAchievement(
				person.locale,
				m.achievement_pull_requests_10_name,
				m.achievement_pull_requests_10_body,
			),
		);
	} else if (data && data.pullRequestCount >= 5) {
		achievements.push(
			createAchievement(
				person.locale,
				m.achievement_pull_requests_5_name,
				m.achievement_pull_requests_5_body,
			),
		);
	} else if (data && data.pullRequestCount >= 3) {
		achievements.push(
			createAchievement(
				person.locale,
				m.achievement_pull_requests_3_name,
				m.achievement_pull_requests_3_body,
			),
		);
	} else if (data && data.pullRequestCount > 0) {
		achievements.push(
			createAchievement(
				person.locale,
				m.achievement_pull_request_1_name,
				m.achievement_pull_request_1_body,
			),
		);
	}

	if (person.achievements.includes("messages-1000")) {
		achievements.push(
			createAchievement(
				person.locale,
				m.achievement_messages_1000_name,
				m.achievement_messages_1000_body,
			),
		);
	} else if (person.achievements.includes("messages-500")) {
		achievements.push(
			createAchievement(
				person.locale,
				m.achievement_messages_500_name,
				m.achievement_messages_500_body,
			),
		);
	} else if (person.achievements.includes("messages-200")) {
		achievements.push(
			createAchievement(
				person.locale,
				m.achievement_messages_200_name,
				m.achievement_messages_200_body,
			),
		);
	}

	for (const year of contributorYears) {
		if (data && data.commitsInYear?.includes(year)) {
			const inputs = { year: String(year) };
			const options = { locale: person.locale };
			achievements.push({
				name: m.achievement_yearly_contributor_name(inputs, options),
				body: m.achievement_yearly_contributor_body(inputs, options),
			});
		}
	}

	if (authoredPosts.length >= 30) {
		achievements.push(
			createAchievement(
				person.locale,
				m.achievement_articles_30_name,
				m.achievement_articles_30_body,
			),
		);
	} else if (authoredPosts.length >= 10) {
		achievements.push(
			createAchievement(
				person.locale,
				m.achievement_articles_10_name,
				m.achievement_articles_10_body,
			),
		);
	} else if (authoredPosts.length >= 5) {
		achievements.push(
			createAchievement(
				person.locale,
				m.achievement_articles_5_name,
				m.achievement_articles_5_body,
			),
		);
	} else if (authoredPosts.length >= 3) {
		achievements.push(
			createAchievement(
				person.locale,
				m.achievement_articles_3_name,
				m.achievement_articles_3_body,
			),
		);
	}

	const wordCount = authoredPosts.reduce((acc, post) => {
		return acc + (post.wordCount ?? 0);
	}, 0);

	if (wordCount > 0) {
		const options = { locale: person.locale };
		achievements.push({
			name: m.achievement_words_written_name({}, options),
			body: m.achievement_words_written_body(
				{ count: wordCount.toLocaleString(person.locale) },
				options,
			),
		});
	}

	if (person.roles.length >= 3) {
		achievements.push(
			createAchievement(
				person.locale,
				m.achievement_role_badges_3_name,
				m.achievement_role_badges_3_body,
			),
		);
	} else if (person.roles.length > 0) {
		achievements.push(
			createAchievement(
				person.locale,
				m.achievement_role_badge_1_name,
				m.achievement_role_badge_1_body,
			),
		);
	}

	return achievements;
}
