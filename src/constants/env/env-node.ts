import type { Environment } from "./types.ts";

const MODE = process.env.MODE ?? "development";

export default {
	CI: Boolean(process.env.CI),
	MODE,
	PROD: MODE === "production",
	DEV: MODE === "development",
	SITE_URL: process.env.SITE_URL ?? "https://playfulprogramming.com",
	GIT_COMMIT_REF:
		process.env.GIT_COMMIT_REF ?? process.env.VERCEL_GIT_COMMIT_REF,
	TYPESENSE_WRITE_API_KEY: process.env.TYPESENSE_WRITE_API_KEY,
	GITHUB_TOKEN: process.env.GITHUB_TOKEN,
	HOOF_URL: process.env.HOOF_URL ?? "https://hoof.playfulprogramming.com",
	HOOF_AUTH_TOKEN: process.env.HOOF_AUTH_TOKEN,
	PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.PUBLIC_CLOUDINARY_CLOUD_NAME,
} satisfies Environment;
