import { BUILD_MODE, SITE_URL, VERCEL_URL } from "astro:env/client";

export const buildMode = BUILD_MODE;
export const siteUrl = (() => {
	let siteUrl = SITE_URL || VERCEL_URL || "";

	if (siteUrl && !siteUrl.startsWith("http")) siteUrl = `https://${siteUrl}`;

	if (!siteUrl) {
		switch (buildMode) {
			case "production":
				return "https://playfulprogramming.com";
			case "development":
				return "http://localhost:4321";
			default:
				return "https://beta.playfulprogramming.com";
		}
	}

	return siteUrl;
})();

// To set for Twitch player embedding in blog posts
export const parent = new URL(siteUrl).hostname;

export const siteMetadata = {
	title: `Playful Programming`,
	description: `Learning programming from magically majestic words. A place to learn about all sorts of programming topics from entry-level concepts to advanced abstractions`,
	siteUrl,
	repoPath: "playfulprogramming/playfulprogramming",
	relativeToPosts: "/content/blog",
	keywords:
		"programming,development,mobile,web,game,playful,software engineering,javascript,angular,react,computer science",
	twitterHandle: "@playful_program",
};
