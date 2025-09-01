export const buildMode = import.meta.env.MODE as "development" | "production";
export const siteUrl = import.meta.env.DEV
	? "http://localhost:4321"
	: import.meta.env.SITE;

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
