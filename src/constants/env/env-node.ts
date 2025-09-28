import { Environment } from "./types";

export default {
	CI: Boolean(process.env.CI),
	MODE: process.env.MODE ?? "development",
	PROD: process.env.MODE == "production",
	DEV: process.env.MODE != "production",
	SITE_URL: process.env.SITE_URL ?? "https://playfulprogramming.com",
	GIT_COMMIT_REF:
		process.env.GIT_COMMIT_REF ?? process.env.VERCEL_GIT_COMMIT_REF,
	ORAMA_PRIVATE_API_KEY: process.env.ORAMA_PRIVATE_API_KEY,
	GITHUB_TOKEN: process.env.GITHUB_TOKEN,
	HOOF_URL: process.env.HOOF_URL ?? "https://hoof.playfulprogramming.com",
	HOOF_AUTH_TOKEN: process.env.HOOF_AUTH_TOKEN,
	PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.PUBLIC_CLOUDINARY_CLOUD_NAME,
	ENABLE_DISCOVERABILITY: Boolean(process.env.ENABLE_DISCOVERABILITY),
} satisfies Environment;
