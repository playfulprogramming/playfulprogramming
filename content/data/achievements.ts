import { posts } from "utils/data";

interface Achievement {
	id: string;
	name: string;
	body: ((userId: string) => string) | string;
}

export const achievements: Achievement[] = [
	{
		id: "30articles",
		name: "Cream of the crop",
		body: "Write 30 articles!",
	},
	{
		id: "wordcount",
		name: "Words word words",
		body: getWordCount,
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

function getWordCount(userId: string) {
	const authoredPosts = posts.filter(
		(post) => post.authors.includes(userId) && post.locale === "en",
	);

	const wordCount = authoredPosts.reduce((acc, post) => {
		return acc + (post.wordCount ?? 0);
	}, 0);

	return `Write ${wordCount} words!`;
}
