import createClient from "openapi-fetch";
import type { paths } from "./schema";
import { env, hoofUrl } from "../../constants/site-config";

const HOOF_AUTH_TOKEN = env("HOOF_AUTH_TOKEN");

export const client = createClient<paths>({
	baseUrl: hoofUrl,
	...(HOOF_AUTH_TOKEN && { headers: { "x-hoof-auth-token": HOOF_AUTH_TOKEN } }),
});
