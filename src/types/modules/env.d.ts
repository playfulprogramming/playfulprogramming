declare global {
	namespace NodeJS {
		interface ProcessEnv {
			CI?: string;
			ORAMA_PRIVATE_API_KEY?: string;
		}
	}
}

export {};
