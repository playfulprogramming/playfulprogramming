import env from "#src/constants/env/index.ts";
import { createComponent } from "../components.ts";
import type { RehypeFunctionComponent } from "../types.ts";
import { getPersonById } from "#utils/api.ts";

export const transformUser: RehypeFunctionComponent = ({ attributes }) => {
	const user = attributes.id;
	if (!user) return;

	const author = getPersonById(user, "en");

	// Prevent author count increasing from breaking e2e tests
	if (env.MODE === "e2e" && author) {
		author.totalPostCount = 100;
		author.totalWordCount = 10000;
	}

	if (!author) return;

	return [
		createComponent("User", {
			author,
		}),
	];
};
