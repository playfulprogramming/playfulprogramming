import env from "./env/index.ts";

export const siteUrl = env.SITE_URL;

export const siteMetadata = {
	title: `Playful Programming`,
	siteUrl,
	repoPath: "playfulprogramming/playfulprogramming",
	relativeToPosts: "/content/blog",
	twitterHandle: "@playful_program",
};
