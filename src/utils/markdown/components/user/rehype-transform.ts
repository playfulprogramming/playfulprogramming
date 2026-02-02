import { createComponent } from "../components";
import { RehypeFunctionComponent } from "../types";
import { getPersonById } from "utils/api";

export const transformUser: RehypeFunctionComponent = ({ attributes }) => {
	const user = attributes.id;
	if (!user) return;

	const author = getPersonById(user, "en");

	if (!author) return;

	return [
		createComponent("User", {
			author,
		}),
	];
};
