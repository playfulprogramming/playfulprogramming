import createClient from "openapi-fetch";
import type { paths } from "./schema";

if (import.meta.env.PROD && !import.meta.env.HOOF_AUTH_TOKEN) {
	throw new Error("Environment variable HOOF_AUTH_TOKEN is missing!");
}

export const client = createClient<paths>({
	baseUrl: import.meta.env.HOOF_URL ?? "https://hoof.playfulprogramming.com",
	...(import.meta.env.HOOF_AUTH_TOKEN && {
		headers: { "x-hoof-auth-token": import.meta.env.HOOF_AUTH_TOKEN },
	}),
});
