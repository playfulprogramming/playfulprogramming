export interface Environment {
	readonly CI: boolean;
	readonly MODE: "production" | "preview" | "development" | string;
	readonly PROD: boolean;
	readonly DEV: boolean;
	readonly SITE_URL: string;
	readonly GIT_COMMIT_REF: string | undefined;
	readonly TYPESENSE_WRITE_API_KEY: string | undefined;
	readonly GITHUB_TOKEN: string | undefined;
	readonly HOOF_URL: string;
	readonly HOOF_AUTH_TOKEN: string | undefined;
	readonly PUBLIC_CLOUDINARY_CLOUD_NAME: string | undefined;
}
