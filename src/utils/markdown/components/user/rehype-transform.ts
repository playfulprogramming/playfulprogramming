import { createComponent } from "../components";
import { RehypeFunctionComponent } from "../types";
import { getPersonById } from "utils/api";

export const transformUser: RehypeFunctionComponent = ({ attributes }) => {
	const user = attributes.id;
	if (!user) return;

	const author = getPersonById(user, "en");

	// Prevent author count increasing from breaking e2e tests
	if (process.env.USE_E2E_MOCKS && author) {
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
