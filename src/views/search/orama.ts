import type { TypedDocument, Orama, Results, Nullable } from "@orama/orama";
import { OramaClient } from "@oramacloud/client";
import { PostInfo } from "types/PostInfo";
import { CollectionInfo } from "types/CollectionInfo";

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

const postClient = new OramaClient({
	endpoint: "https://cloud.orama.run/v1/indexes/playful-programming-p9lpvl",
	api_key: "OLeHrFPWLR0alSSZkMiq4tokMZZNEbDL",
});

const collectionClient = new OramaClient({
	endpoint:
		"https://cloud.orama.run/v1/indexes/playful-programming-collections-oksaw0",
	api_key: "yxsPLU2kjhAjjNxTUQ4F6c3bF9eXUSNJ",
});

export async function searchForTerm(term: string, signal: AbortSignal) {
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
