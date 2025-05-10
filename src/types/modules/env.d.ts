declare global {
	namespace NodeJS {
		interface ProcessEnv {
			CI?: string;
			BUILD_ENV: "development" | "beta" | "production";
			SITE_URL?: string;
			VERCEL_URL?: string;

			GITHUB_TOKEN?: string;
			PUBLIC_CLOUDINARY_CLOUD_NAME?: string;
			ORAMA_PRIVATE_API_KEY?: string;
		}
	}
}

export {};
