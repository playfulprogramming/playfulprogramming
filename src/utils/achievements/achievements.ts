import { getPostsByUnicorn } from "src/utils/api";
import { UnicornInfo } from "types/UnicornInfo";
import { GitHubData, contributorYears } from "./github";
import { collections } from "utils/data";

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
		name: "Badge Collector",
		body: "Have at least 3 role badges",
		isAchieved: (unicorn) => unicorn.roles.length >= 3,
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
		name: "Code Challenger",
		body: "Made a code challenge in our Discord",
		isAchieved: (unicorn) => unicorn.achievements.includes("code-challenge"),
	},
	{
		name: "Localizer 9000",
		body: "Translate part of Unicorn Utterances into another language!",
		isAchieved: (unicorn) => unicorn.roles.includes("translator"),
	},
	{
		name: "Collect 'em all",
		body: "Author a collection of posts!",
		isAchieved: (unicorn) =>
			collections.filter((collection) =>
				collection.authors.includes(unicorn.id),
			).length > 0,
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
		body: "Earn your first role badge",
		isAchieved: () => true,
	},
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

	return `Wrote ${wordCount.toLocaleString("en")} words!`;
}
