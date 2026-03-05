import env from "#src/constants/env";

export const RETRY_COUNT = env.DEV ? 1 : 10;
