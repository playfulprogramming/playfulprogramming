import createClient from "openapi-fetch";
import type { paths } from "./schema";
import { BUILD_MODE, HOOF_URL, HOOF_AUTH_TOKEN } from "astro:env/server";

if (BUILD_MODE === "production" && !HOOF_AUTH_TOKEN) {
	throw new Error("Environment variable HOOF_AUTH_TOKEN is missing!");
}

export const client = createClient<paths>({
	baseUrl: HOOF_URL,
	...(HOOF_AUTH_TOKEN && { headers: { "x-hoof-auth-token": HOOF_AUTH_TOKEN } }),
});
