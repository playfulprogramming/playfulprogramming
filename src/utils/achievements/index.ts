import { getPostsByPerson } from "#src/utils/api.ts";
import type { PersonInfo } from "#types/PersonInfo.ts";
import { contributorYears, fetchGitHubData } from "./github.ts";
import * as api from "#utils/api.ts";

export interface Achievement {
	name: string;
	body: string;
}

export async function getAchievements(
	person: PersonInfo,
): Promise<Achievement[]> {
	const achievements: Achievement[] = [];

	const data = person.socials.github
		? await fetchGitHubData(person.socials.github)
		: undefined;

	const authoredPosts = getPostsByPerson(person.id, "en");

	if (person.achievements.includes("site-redesign")) {
		achievements.push({
			name: "Redesign Ruler",
			body: "Led a site-wide redesign",
		});
	}

	if (person.achievements.includes("site-logo")) {
		achievements.push({
			name: "Logo Legacy",
			body: "Made our Unicorn logo!",
		});
	}

	if (person.achievements.includes("code-challenge")) {
		achievements.push({
			name: "Code Challenger",
			body: "Make a code challenge in our Discord",
		});
	}

	if (person.roles.includes("translator")) {
		achievements.push({
			name: "Localizer 9000",
			body: "Translate part of Playful Programming into another language!",
		});
	}

	if (authoredPosts.some((post) => post.wordCount >= 6000)) {
		achievements.push({
			name: "It Keeps Going",
			body: "Write a really long article",
		});
	}

	if (api.getCollectionsByPerson(person.id, "en").length > 0) {
		achievements.push({
			name: "Collect 'em all",
			body: "Author a collection of posts!",
		});
	}

	if (authoredPosts.some((post) => post.authors.length > 1)) {
		achievements.push({
			name: "Team Player",
			body: "Collaborate on an article with another author",
		});
	}

	if (person.roles.includes("community")) {
		achievements.push({
			name: "Community crowned",
			body: "Become a community leader",
		});
	}

	if (person.achievements.includes("partner")) {
		achievements.push({
			name: "Proud partner",
			body: "Become a Playful Programming Partner",
		});
	}

	if (data && data.issueCount >= 25) {
		achievements.push({
			name: "Insect infestation!",
			body: `Open 25 issues in our GitHub repo`,
		});
	} else if (data && data.issueCount >= 10) {
		achievements.push({
			name: "Creepy crawlies!",
			body: "Open 10 issues in our GitHub repo",
		});
	} else if (data && data.issueCount > 0) {
		achievements.push({
			name: "Bug!",
			body: "Open an issue in our GitHub repo",
		});
	}

	if (data && data.pullRequestCount >= 30) {
		achievements.push({
			name: "Rabid Requester",
			body: `Open 30 pull requests in our GitHub repo`,
		});
	} else if (data && data.pullRequestCount >= 10) {
		achievements.push({
			name: "Request Rampage",
			body: "Open 10 pull requests in our GitHub repo",
		});
	} else if (data && data.pullRequestCount >= 5) {
		achievements.push({
			name: "Request Robot",
			body: "Open 5 pull requests in our GitHub repo",
		});
	} else if (data && data.pullRequestCount >= 3) {
		achievements.push({
			name: "Request Racer",
			body: "Open 3 pull requests in our GitHub repo",
		});
	} else if (data && data.pullRequestCount > 0) {
		achievements.push({
			name: "Request Ranger",
			body: "Open a pull request in our GitHub repo",
		});
	}

	if (person.achievements.includes("messages-1000")) {
		achievements.push({
			name: "Message Madness",
			body: "Send 1000 messages in our Discord",
		});
	} else if (person.achievements.includes("messages-500")) {
		achievements.push({
			name: "Monstrous Messager",
			body: "Send 500 messages in our Discord",
		});
	} else if (person.achievements.includes("messages-200")) {
		achievements.push({
			name: "Moderate Messager",
			body: "Send 200 messages in our Discord",
		});
	}

	for (const year of contributorYears) {
		if (data && data.commitsInYear?.includes(year)) {
			achievements.push({
				name: `${year} Contributor`,
				body: `Make a commit to the site in ${year}!`,
			});
		}
	}

	if (authoredPosts.length >= 30) {
		achievements.push({
			name: "Cream of the crop",
			body: `Write 30 articles!`,
		});
	} else if (authoredPosts.length >= 10) {
		achievements.push({
			name: "Post-palooza",
			body: "Write 10 articles!",
		});
	} else if (authoredPosts.length >= 5) {
		achievements.push({
			name: "Profusely Posting",
			body: "Write 5 articles!",
		});
	} else if (authoredPosts.length >= 3) {
		achievements.push({
			name: "Politely Posting",
			body: "Write 3 articles!",
		});
	}

	const wordCount = authoredPosts.reduce((acc, post) => {
		return acc + (post.wordCount ?? 0);
	}, 0);

	if (wordCount > 0) {
		achievements.push({
			name: "Words words words",
			body: `Wrote ${wordCount.toLocaleString("en")} words!`,
		});
	}

	if (person.roles.length >= 3) {
		achievements.push({
			name: "Badge Collector",
			body: "Have at least 3 role badges",
		});
	} else if (person.roles.length > 0) {
		achievements.push({
			name: "Hello, World!",
			body: "Earn your first role badge",
		});
	}

	return achievements;
}
