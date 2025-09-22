export interface Environment {
	readonly CI: boolean;
	readonly MODE: "production" | "development" | string;
	readonly PROD: boolean;
	readonly DEV: boolean;
	readonly SITE_URL: string;
	readonly VERCEL_GIT_COMMIT_REF: string | undefined;
	readonly ORAMA_PRIVATE_API_KEY: string | undefined;
	readonly GITHUB_TOKEN: string | undefined;
	readonly HOOF_URL: string;
	readonly HOOF_AUTH_TOKEN: string | undefined;
	readonly PUBLIC_CLOUDINARY_CLOUD_NAME: string | undefined;
	readonly ENABLE_DISCOVERABILITY: boolean;
}
