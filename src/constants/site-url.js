export default () => {
	const buildMode = process.env.BUILD_ENV || "production";
	let siteUrl = process.env.SITE_URL || process.env.VERCEL_URL || "";

	if (siteUrl && !siteUrl.startsWith("http")) siteUrl = `https://${siteUrl}`;

	if (!siteUrl) {
		switch (buildMode) {
			case "production":
				siteUrl = "https://unicorn-utterances.com";
				break;
			case "development":
				siteUrl = "http://localhost:3000";
				break;
			default:
				siteUrl = "https://beta.unicorn-utterances.com";
		}
	}

	return {
		buildMode,
		siteUrl,
	};
};
