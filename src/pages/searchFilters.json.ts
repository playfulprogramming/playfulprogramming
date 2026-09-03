import * as api from "#utils/api.ts";
import tagsObj from "../../content/data/tags.json" with { type: "json" };
import type { SearchFiltersData, TagFilterInfo } from "#src/views/search/utils";
import { baseLocale } from "#src/paraglide/runtime.js";

export const GET = async () => {
	const people = api
		.getPeopleByLang(baseLocale)
		.filter((person) => person.totalPostCount > 0);

	const posts = api.getPostsByLang(baseLocale);

	const tags = Object.entries(tagsObj).map(([tag, value]) => {
		return {
			...value,
			id: tag,
			totalPostCount: posts.filter((p) => p.tags.includes(tag)).length,
		} satisfies TagFilterInfo;
	});

	// Maps do not have a JSON representation, and search cards do not render
	// the tag metadata. Keep the endpoint's wire shape honest by omitting it.
	const snitips = api.getSnitips().map(({ tagsMeta: _, ...snitip }) => snitip);

	const response = { people, tags, snitips } satisfies SearchFiltersData;
	return new Response(JSON.stringify(response));
};
