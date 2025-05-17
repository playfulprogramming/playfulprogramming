import createClient from "openapi-fetch";
import type { paths } from "./schema";
import { hoofUrl } from "constants/site-config";

export const client = createClient<paths>({ baseUrl: hoofUrl });
