import { Environment } from "./types";

export default {
	CI: Boolean(import.meta.env.CI),
	MODE: import.meta.env.MODE,
	PROD: import.meta.env.PROD,
	DEV: import.meta.env.DEV,
	SITE_URL: import.meta.env.DEV
		? "http://localhost:4321"
		: import.meta.env.SITE,
	GIT_COMMIT_REF:
		import.meta.env.GIT_COMMIT_REF ?? import.meta.env.VERCEL_GIT_COMMIT_REF,
	ORAMA_PRIVATE_API_KEY: import.meta.env.ORAMA_PRIVATE_API_KEY,
	GITHUB_TOKEN: import.meta.env.GITHUB_TOKEN,
	HOOF_URL: import.meta.env.HOOF_URL ?? "https://hoof.playfulprogramming.com",
	HOOF_AUTH_TOKEN: import.meta.env.HOOF_AUTH_TOKEN,
	PUBLIC_CLOUDINARY_CLOUD_NAME: import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME,
	ENABLE_DISCOVERABILITY: Boolean(import.meta.env.ENABLE_DISCOVERABILITY),
} satisfies Environment;
