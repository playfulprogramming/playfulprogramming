import * as api from "utils/api";

export const GET = async () => {
	const people = api
		.getPeopleByLang("en")
		.filter((person) => person.totalPostCount > 0);

	const json = JSON.stringify({ people });

	return new Response(json);
};
