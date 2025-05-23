function env<K extends keyof NodeJS.ProcessEnv>(name: K): NodeJS.ProcessEnv[K] {
	if (typeof process !== "undefined") {
		return process.env[name];
	} else {
		return import.meta.env[name];
	}
}

export const buildMode = env("BUILD_ENV") || "production";
export const siteUrl = (() => {
	let siteUrl = env("SITE_URL") || env("VERCEL_URL") || "";

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

export const cloudinaryCloudName = env("PUBLIC_CLOUDINARY_CLOUD_NAME");

export const hoofUrl = env("HOOF_URL") || "https://hoof.playfulprogramming.com";
