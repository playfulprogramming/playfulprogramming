const buildMode = import.meta.env.BUILD_ENV || "production";
const siteUrl = (() => {
	let siteUrl = import.meta.env.SITE_URL || import.meta.env.VERCEL_URL || "";

	if (siteUrl && !siteUrl.startsWith("http")) siteUrl = `https://${siteUrl}`;

	if (!siteUrl) {
		switch (buildMode) {
			case "production":
				return "https://playfulprogramming.com";
			case "development":
				return "http://localhost:3000";
			default:
				return "https://beta.playfulprogramming.com";
		}
	}

	return siteUrl;
})();

// To set for Twitch player embedding in blog posts
let parent = new URL(siteUrl).host;

// Twitch embed throws error with strings like 'localhost:3000', but
// those persist with `new URL().host`
if (parent.startsWith("localhost")) {
	parent = "localhost";
}

const siteMetadata = {
	title: `Playful Programming`,
	description: `Learning programming from magically majestic words. A place to learn about all sorts of programming topics from entry-level concepts to advanced abstractions`,
	siteUrl,
	repoPath: "playfulprogramming/playfulprogramming",
	relativeToPosts: "/content/blog",
	keywords:
		"programming,development,mobile,web,game,playful,software engineering,javascript,angular,react,computer science",
	twitterHandle: "@playful_program",
};

export { parent, siteUrl, buildMode, siteMetadata };
