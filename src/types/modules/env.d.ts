interface ImportMetaEnv {
	readonly CI?: string;
	readonly SITE_URL?: string;
	readonly VERCEL_URL?: string;
	readonly VERCEL_GIT_COMMIT_REF?: string;
	readonly ORAMA_PRIVATE_API_KEY?: string;
	readonly HOOF_URL?: string;
	readonly HOOF_AUTH_TOKEN?: string;
	readonly PUBLIC_CLOUDINARY_CLOUD_NAME?: string;
	readonly ENABLE_DISCOVERABILITY?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
