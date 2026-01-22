import createClient from "openapi-fetch";
import type { paths } from "./schema";
import env from "constants/env";
import { ratelimitMiddleware } from "./ratelimitMiddleware";

if (env.MODE === "production" && !env.HOOF_AUTH_TOKEN) {
	throw new Error("Environment variable HOOF_AUTH_TOKEN is missing!");
}

export const client = createClient<paths>({
	baseUrl: env.HOOF_URL ?? "https://hoof.playfulprogramming.com",
	...(env.HOOF_AUTH_TOKEN && {
		headers: { "x-hoof-auth-token": env.HOOF_AUTH_TOKEN },
	}),
});

// if HOOF_AUTH_TOKEN is missing, hoof will enforce rate limiting!
// - this middleware prevents preview builds from spamming the server
// and getting IP blocked
if (!env.HOOF_AUTH_TOKEN) {
	client.use(ratelimitMiddleware);
}
