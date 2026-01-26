import { PostInfo } from "types/PostInfo";
import { CollectionInfo } from "types/CollectionInfo";
import { PropsWithChildren } from "components/types";
import { createContext } from "preact";
import { useContext } from "preact/hooks";
import { SearchQuery } from "./search";
import {
	// HYBRID_SEARCH_ACTIVATION_THRESHOLD,
	MAX_POSTS_PER_PAGE,
	MAX_COLLECTIONS_PER_PAGE,
	PUBLIC_SEARCH_KEY,
	PUBLIC_SEARCH_ENDPOINT_PORT,
	PUBLIC_SEARCH_ENDPOINT_HOST,
	PUBLIC_SEARCH_ENDPOINT_PROTOCOL,
} from "./constants";
import Typesense from "typesense";
import {
	CollectionDocument,
	collectionSchema,
	PostDocument,
	postSchema,
} from "utils/search";

export interface SearchContext {
	client: InstanceType<typeof Typesense.Client>;
}

export const SearchClient = createContext<SearchContext>(undefined as never);

interface SearchProviderProps extends PropsWithChildren {
	params?: Partial<ConstructorParameters<typeof Typesense.Client>[0]>;
}

export function SearchProvider(props: SearchProviderProps) {
	const client = new Typesense.Client({
		nodes: [
			{
				host: PUBLIC_SEARCH_ENDPOINT_HOST,
				port: PUBLIC_SEARCH_ENDPOINT_PORT,
				protocol: PUBLIC_SEARCH_ENDPOINT_PROTOCOL,
			},
		],
		apiKey: PUBLIC_SEARCH_KEY,
		connectionTimeoutSeconds: 2,
	});

	const context: SearchContext = { client };

	return (
		<SearchClient.Provider value={context}>
			{props.children}
		</SearchClient.Provider>
	);
}

export function useSearch() {
	const searchCtx = useContext(SearchClient);
	return {
		searchForTerm: (query: SearchQuery, signal: AbortSignal) =>
			searchForTerm(searchCtx, query, signal),
	};
}

/**
 * Given two Record<string, number>, combines them into one record, summing any overlapping entries.
 * Ex. addMerge({a:1,b:2}, {b:1}) -> {a:1,b:3}
 */
function addMerge(
	obj1: Record<string, number>,
	obj2: Record<string, number>,
): Record<string, number> {
	return Object.entries(obj2).reduce(
		(acc, [key, value]) => ({ ...acc, [key]: (acc[key] || 0) + value }),
		{ ...obj1 },
	);
}

export async function searchForTerm(
	{ client }: SearchContext,
	query: SearchQuery,
	signal: AbortSignal,
) {
	const term = query.searchQuery.trim();

	// const mode =
	// 	term.split(" ").filter((t) => t.trim() !== "").length >=
	// 	HYBRID_SEARCH_ACTIVATION_THRESHOLD
	// 		? "hybrid"
	// 		: "fulltext";

	const postCollection = client.collections<PostDocument>(postSchema.name);
	const collectionCollection = client.collections<CollectionDocument>(
		collectionSchema.name,
	);
	const postCollectionDocuments = postCollection.documents();

	type PostSearchParams = Parameters<
		(typeof postCollectionDocuments)["search"]
	>[0];

	const collectionCollectionDocuments = collectionCollection.documents();

	type CollectionSearchParams = Parameters<
		(typeof collectionCollectionDocuments)["search"]
	>[0];

	// https://typesense.org/docs/29.0/api/search.html#ranking-and-sorting-parameters
	let sort_by:
		| (CollectionSearchParams["sort_by"] & PostSearchParams["sort_by"])
		| undefined;

	if (query.sort === "relevance") {
		// When term is empty (returning all results), there is no "relevance" to sort by - so this defaults to a sort by newest
		if (term.length === 0) {
			sort_by = "publishedTimestamp:desc";
		}
	} else {
		sort_by = `publishedTimestamp:${query.sort === "newest" ? "desc" : "asc"}`;
	}

	// https://typesense.org/docs/29.0/api/search.html#filter-parameters
	const filter_by_strings: string[] = [];
	if (query.filterTags.length) {
		filter_by_strings.push(`tags:[${query.filterTags.join(",")}]`);
	}
	if (query.filterAuthors.length) {
		filter_by_strings.push(`authors:[${query.filterAuthors.join(",")}]`);
	}
	const filter_by:
		| (CollectionSearchParams["filter_by"] & PostSearchParams["filter_by"])
		| undefined = filter_by_strings.length
		? filter_by_strings.join("&&")
		: undefined;

	// https://typesense.org/docs/29.0/api/search.html#faceting-parameters
	const facet_by:
		| (CollectionSearchParams["facet_by"] & PostSearchParams["facet_by"])
		| undefined = "tags,authors";

	const post_query_by = postSchema.fields
		.filter((field) => ["string", "string[]"].includes(field.type))
		.map((field) => field.name)
		.join(",");

	const collection_query_by = collectionSchema.fields
		.filter((field) => ["string", "string[]"].includes(field.type))
		.map((field) => field.name)
		.join(",");

	const postSearchPromise = postCollectionDocuments.search(
		{
			q: term,
			query_by: post_query_by,
			limit: MAX_POSTS_PER_PAGE,
			offset: (query.page - 1) * MAX_POSTS_PER_PAGE,
			sort_by,
			filter_by,
			facet_by,
			max_facet_values: 50,
		},
		{
			abortSignal: signal,
		},
	);

	const collectionSearchPromise = collectionCollectionDocuments.search(
		{
			q: term,
			query_by: collection_query_by,
			limit: MAX_COLLECTIONS_PER_PAGE,
			offset: (query.page - 1) * MAX_COLLECTIONS_PER_PAGE,
			sort_by,
			filter_by,
			facet_by,
			max_facet_values: 50,
		},
		{
			abortSignal: signal,
		},
	);

	const [postSearch, collectionSearch] = await Promise.all([
		postSearchPromise,
		collectionSearchPromise,
	]);

	const findFacetCountByName = (
		search: typeof postSearch | typeof postSearch,
		name: string,
	) => {
		// @example https://typesense.org/docs/guide/building-a-search-application.html#faceting
		const facet = search.facet_counts?.find(
			(facet) => facet.field_name === name,
		);
		if (!facet) return {};
		return facet.counts.reduce(
			(prev, count) => {
				prev[count.value] = count.count + (prev[count.value] ?? 0);
				return prev;
			},
			{} as Record<string, number>,
		);
	};

	// Combine tags & authors facets between the two searches
	const tags = addMerge(
		findFacetCountByName(postSearch, "tags") ?? {},
		findFacetCountByName(collectionSearch, "tags") ?? {},
	);

	const authors = addMerge(
		findFacetCountByName(postSearch, "authors") ?? {},
		findFacetCountByName(collectionSearch, "authors") ?? {},
	);

	return {
		posts: (postSearch?.hits?.map((hit) => hit.document) ?? []) as Array<
			PostDocument & PostInfo
		>,
		totalPosts: postSearch?.found ?? 0,
		collections: (collectionSearch?.hits?.map((hit) => hit.document) ??
			[]) as Array<CollectionDocument & CollectionInfo>,
		totalCollections: collectionSearch?.found ?? 0,
		tags,
		authors,
	};
}
