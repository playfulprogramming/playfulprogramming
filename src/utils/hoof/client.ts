import createClient from "openapi-fetch";
import type { paths } from "./schema";
import env from "constants/env";

if (env.PROD && !env.HOOF_AUTH_TOKEN) {
	throw new Error("Environment variable HOOF_AUTH_TOKEN is missing!");
}

export const client = createClient<paths>({
	baseUrl: env.HOOF_URL ?? "https://hoof.playfulprogramming.com",
	...(env.HOOF_AUTH_TOKEN && {
		headers: { "x-hoof-auth-token": env.HOOF_AUTH_TOKEN },
	}),
});
