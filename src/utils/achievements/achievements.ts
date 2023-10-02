import { getPostsByUnicorn } from "src/utils/api";
import { UnicornInfo } from "types/UnicornInfo";
import { GitHubData, contributorYears } from "./github";

interface Achievement {
	name: string;
	body: ((unicorn: UnicornInfo) => string) | string;
	isAchieved: (unicorn: UnicornInfo, data?: GitHubData) => boolean;
}

export const achievements: Achievement[] = [
	{
		name: "Cream of the crop",
		body: "Write 30 articles!",
		isAchieved: (unicorn) => getPostsByUnicorn(unicorn.id).length > 30,
	},
	{
		name: "Redesign Ruler",
		body: "Led a site-wide redesign",
		isAchieved: (unicorn) => unicorn.achievements.includes("site-redesign"),
	},
	{
		name: "Logo Legacy",
		body: "Made our Unicorn logo!",
		isAchieved: (unicorn) => unicorn.achievements.includes("site-logo"),
	},
	{
		name: "Bug!",
		body: "Opened an issue in our GitHub repo",
		isAchieved: (_, data) => data?.issueCount > 0,
	},
	{
		name: "Words words words",
		body: getWordCount,
		isAchieved: (unicorn) => getPostsByUnicorn(unicorn.id).length > 0,
	},
	{
		name: "Hello, World!",
		body: "Earn your first Role badge",
		isAchieved: () => true,
	},
	// First collection
	// First blog post
	// Made a code challenge in our Discord
	// Translated a resource
	// Made a deployment of the site
	// Lead a site redesign (Ed, Tommy)
	// Made our logo (Vuk)
	// Made a PR to the site (break down into different categories? Bugs/feats/refactor?)
	// Partner
	// Sent 1,000 messages in our Discord
	// Sent 500 messages in our Discord
	// Have more than 3 UU roles
];

for (const year of contributorYears) {
	achievements.push({
		name: `${year} Contributor`,
		body: `Made a commit to the site in ${year}!`,
		isAchieved: (_, data) => data?.commitsInYear?.includes(year),
	});
}

function getWordCount(unicorn: UnicornInfo) {
	const authoredPosts = getPostsByUnicorn(unicorn.id, "en");

	const wordCount = authoredPosts.reduce((acc, post) => {
		return acc + (post.wordCount ?? 0);
	}, 0);

	return `Write ${wordCount.toLocaleString("en")} words!`;
}
