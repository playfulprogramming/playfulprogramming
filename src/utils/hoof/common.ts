import env from "#src/constants/env/index.ts";

export const RETRY_COUNT = env.DEV || env.MODE === "preview" ? 1 : 10;
