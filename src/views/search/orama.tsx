import type { TypedDocument, Orama, Results, Nullable } from "@orama/orama";
import { OramaClient } from "@oramacloud/client";
import { PostInfo } from "types/PostInfo";
import { CollectionInfo } from "types/CollectionInfo";
import { PropsWithChildren } from "components/types";
import { createContext } from "preact";
import { useContext } from "preact/hooks";

const postSchema = {
	slug: "string",
	tags: "string[]",
	title: "string",
	excerpt: "string",
	description: "string",
} as const;

const collectionSchema = {
	slug: "string",
	title: "string",
	description: "string",
	tags: "string[]",
} as const;

type PostDocument = TypedDocument<Orama<typeof postSchema>>;
type CollectionDocument = TypedDocument<Orama<typeof collectionSchema>>;

interface SearchContext {
	postClient: OramaClient;
	collectionClient: OramaClient;
}

const SearchClient = createContext<SearchContext>(undefined as never);

interface OramaClientProviderProps extends PropsWithChildren {
	params?: Partial<ConstructorParameters<typeof OramaClient>[0]>;
}

export function OramaClientProvider(props: OramaClientProviderProps) {
	const postClient = new OramaClient({
		endpoint: "https://cloud.orama.run/v1/indexes/playful-programming-p9lpvl",
		api_key: "OLeHrFPWLR0alSSZkMiq4tokMZZNEbDL",
		...props.params
	});

	const collectionClient = new OramaClient({
		endpoint:
			"https://cloud.orama.run/v1/indexes/playful-programming-collections-oksaw0",
		api_key: "yxsPLU2kjhAjjNxTUQ4F6c3bF9eXUSNJ",
		...props.params
	});

	const context: SearchContext = { postClient, collectionClient };

	return (
		<SearchClient.Provider value={context}>
			{props.children}
		</SearchClient.Provider>
	);
}

export function useOramaSearch() {
	const searchCtx = useContext(SearchClient);
	return {
		searchForTerm: (term: string, signal: AbortSignal) => searchForTerm(searchCtx, term, signal),
	};
}

export async function searchForTerm({ postClient, collectionClient }: SearchContext, term: string, signal: AbortSignal) {
	// Schema should be passed to `search` method when:
	// https://github.com/askorama/oramacloud-client-javascript/pull/35
	// Is merged and released.
	const postSearchPromise: Promise<Nullable<Results<PostDocument>>> =
		postClient.search(
			{ term },
			{
				debounce: 0,
				// // TODO: This does nothing yet:
				// // https://github.com/askorama/oramacloud-client-javascript/pull/34
				// abortSignal: signal,
			},
		);

	const collectionSearchPromise: Promise<
		Nullable<Results<CollectionDocument>>
	> = collectionClient.search(
		{ term },
		{
			debounce: 0,
			// abortSignal: signal,
		},
	);

	const [postSearch, collectionSearch] = await Promise.all([
		postSearchPromise,
		collectionSearchPromise,
	]);

	return {
		posts: (postSearch?.hits.map((hit) => hit.document) ?? []) as Array<
			PostDocument & PostInfo
		>,
		totalPosts: postSearch?.count ?? 0,
		collections: (collectionSearch?.hits.map((hit) => hit.document) ??
			[]) as Array<CollectionDocument & CollectionInfo>,
		totalCollections: collectionSearch?.count ?? 0,
	};
}
