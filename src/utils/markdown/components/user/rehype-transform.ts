import env from "#src/constants/env";
import { createComponent } from "../components";
import { RehypeFunctionComponent } from "../types";
import { getPersonById } from "#utils/api";

export const transformUser: RehypeFunctionComponent = async ({
	attributes,
}) => {
	const user = attributes.id;
	if (!user) return;

	const author = await getPersonById(user, "en");

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
