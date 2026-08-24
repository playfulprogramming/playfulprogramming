import {
	test,
	beforeEach,
	describe,
	expect,
	vi,
	worker,
	type Mock,
} from "#src/ui-test-utils/index.ts";
import { page } from "vitest/browser";
import {
	findByText as findByTextFrom,
	render,
	waitFor,
	cleanup,
} from "@testing-library/preact";
import { SearchPageBase } from "./search-page.tsx";
import { http, HttpResponse } from "msw";
import {
	MockCanonicalPost,
	MockPost,
} from "../../../__mocks__/data/mock-post.ts";
import userEvent from "@testing-library/user-event";
import { MockCollection } from "../../../__mocks__/data/mock-collection.ts";
import {
	MockPerson,
	MockPersonTwo,
} from "../../../__mocks__/data/mock-person.ts";
import {
	buildSearchQuery,
	type SearchFiltersData,
	type SearchSnitipInfo,
} from "#src/views/search/search.ts";
import type { PersonInfo } from "#types/PersonInfo.ts";
import type { PostInfo } from "#types/PostInfo.ts";
import type { CollectionInfo } from "#types/CollectionInfo.ts";
import type { Languages } from "#types/index.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type SearchContext, SearchClient } from "./services.tsx";
import {
	MAX_COLLECTIONS_PER_PAGE,
	MAX_POSTS_PER_PAGE,
	PUBLIC_SEARCH_ENDPOINT_HOST,
	PUBLIC_SEARCH_ENDPOINT_PORT,
	PUBLIC_SEARCH_ENDPOINT_PROTOCOL,
	PUBLIC_SEARCH_KEY,
} from "./constants.ts";
import type Typesense from "typesense";
import type Documents from "typesense/lib/Typesense/Documents";
import type {
	SearchResponse,
	DocumentSchema,
} from "typesense/lib/Typesense/Documents";
import { collectionSchema, postSchema } from "#utils/search.ts";

const user = userEvent.setup();

beforeEach(() => {
	// Reset URL after each test
	window.history.replaceState({}, "", window.location.pathname);
});

interface FnReply {
	posts: PostInfo[];
	totalPosts: number;
	collections: CollectionInfo[];
	totalCollections: number;
	tags?: Record<string, number>;
	authors?: Record<string, number>;
}

type DocumentSearchMethod = Documents["search"];
type DocumentSearchParams = Parameters<DocumentSearchMethod>[0];
type DocumentSearchOptions = Parameters<DocumentSearchMethod>[1];

type MockSearchFn = (
	collectionName: string,
	searchParameters: DocumentSearchParams,
	searchOptions: DocumentSearchOptions,
) => Promise<SearchResponse<DocumentSchema>>;

function mockTypeSenseClient(searchFn: MockSearchFn) {
	const spyRecord = new Map<string, Mock<MockSearchFn>>();

	function MockDocuments(collectionName: string) {
		const spy =
			spyRecord.get(collectionName) ??
			vi.fn<MockSearchFn>().mockImplementation(searchFn);
		spyRecord.set(collectionName, spy);
		return {
			search: (
				searchParameters: DocumentSearchParams,
				searchOptions: DocumentSearchOptions,
			) => spy(collectionName, searchParameters, searchOptions),
		};
	}

	function MockCollection(name: string) {
		return {
			documents(documentId?: string) {
				if (!documentId) {
					return MockDocuments(name);
				}
			},
		};
	}

	class MockClient {
		collections(): never;
		collections(collectionName?: string) {
			if (collectionName === undefined) return undefined;
			return MockCollection(collectionName);
		}
	}

	return {
		ClientClass: MockClient as never as typeof Typesense.Client,
		spyRecord,
	};
}

function mockClient(fn: (searchStr: string) => FnReply) {
	const { ClientClass, spyRecord } = mockTypeSenseClient(
		async (collectionName, searchParameters) => {
			const isPostSearch = collectionName === postSchema.name;
			const searchString = searchParameters.q!;
			const res = fn(searchString);
			const found_docs = isPostSearch
				? res.posts.length
				: res.collections.length;
			const out_of = isPostSearch ? res.totalPosts : res.totalCollections;
			const hits = isPostSearch
				? res.posts.map((post, i) => ({
						id: i + 1,
						document: post,
						highlight: {},
						text_match: 0,
					}))
				: res.collections.map((collection, i) => ({
						id: i + 1,
						document: collection,
						highlight: {},
						text_match: 0,
					}));

			return {
				hits,
				found: found_docs,
				found_docs,
				out_of,
				page: 1,
				request_params: {
					q: searchParameters.q,
					page: searchParameters.page,
					per_page: searchParameters.per_page,
					collection_name: collectionName,
				},
				search_time_ms: 0,
				facet_counts: [
					{
						field_name: "tags",
						sampled: false,
						stats: {},
						counts: res.tags
							? Object.entries(res.tags).map(([tag, count]) => ({
									count,
									value: tag,
									highlighted: "",
								}))
							: [],
					},
					{
						field_name: "authors",
						sampled: false,
						stats: {},
						counts: res.authors
							? Object.entries(res.authors).map(([author, count]) => ({
									count,
									value: author,
									highlighted: "",
								}))
							: [],
					},
				],
			};
		},
	);

	const client = new ClientClass({
		// Not used
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

	return {
		client,
		getDocumentSpy: (collectionName: string) => spyRecord.get(collectionName)!,
	};
}

function mockPeopleIndex(
	people: PersonInfo[],
	snitips: SearchSnitipInfo[] = [],
) {
	worker.use(
		http.get(`*/searchFilters.json`, async () => {
			return HttpResponse.json({
				people,
				tags: [
					{
						displayName: "Angular",
						id: "angular",
						image: "/stickers/angular.svg",
						shownWithBranding: true,
						totalPostCount: 32,
					},
				],
				snitips,
			} satisfies SearchFiltersData);
		}),
	);
}

function SearchPage(props: { mockClient: SearchContext; locale?: Languages }) {
	const queryClient = new QueryClient();
	return (
		<SearchClient.Provider value={props.mockClient}>
			<QueryClientProvider client={queryClient}>
				<SearchPageBase siteTitle="Site Title" locale={props.locale ?? "en"} />
			</QueryClientProvider>
		</SearchClient.Provider>
	);
}

describe("Search page", () => {
	test("Should show initial results", async () => {
		mockPeopleIndex([]);
		const client = mockClient(() => ({
			people: [],
			posts: [],
			totalPosts: 0,
			totalCollections: 0,
			collections: [],
		}));

		const { getByText } = render(<SearchPage mockClient={client} />);

		await waitFor(() =>
			expect(getByText("What would you like to find?")).toBeInTheDocument(),
		);
	});

	test("Should show search results for posts", async () => {
		mockPeopleIndex([]);
		const client = mockClient(() => ({
			posts: [MockPost],
			totalPosts: 1,
			totalCollections: 0,
			collections: [],
		}));

		const { getByText, getByTestId } = render(
			<SearchPage mockClient={client} />,
		);
		const searchInput = getByTestId("search-input");
		await user.type(searchInput, MockPost.title);
		await user.type(searchInput, "{enter}");
		await waitFor(() => expect(getByText(MockPost.title)).toBeInTheDocument());
	});

	test("preserves the UI locale for search links and authored locales for content links", async () => {
		window.history.replaceState(
			{},
			"",
			`?${buildSearchQuery({ searchQuery: MockPost.title })}`,
		);
		mockPeopleIndex([MockPerson]);
		const client = mockClient(() => ({
			posts: [MockPost],
			totalPosts: 1,
			totalCollections: 0,
			collections: [],
		}));

		const { getByRole } = render(
			<SearchPage mockClient={client} locale="fr" />,
		);

		await waitFor(() =>
			expect(getByRole("link", { name: MockPost.title })).toBeInTheDocument(),
		);
		expect(getByRole("link", { name: MockPost.title })).toHaveAttribute(
			"href",
			`/posts/${MockPost.slug}`,
		);
		expect(getByRole("link", { name: MockPerson.name })).toHaveAttribute(
			"href",
			`/people/${MockPerson.id}`,
		);
		expect(getByRole("link", { name: MockPost.tags[0] })).toHaveAttribute(
			"href",
			expect.stringMatching(/^\/fr\/search\?/),
		);
	});

	test("Should show search results for collections", async () => {
		page.viewport(2000, 1000);
		mockPeopleIndex([]);
		const client = mockClient(() => ({
			posts: [],
			totalPosts: 0,
			totalCollections: 1,
			collections: [MockCollection],
		}));

		const { getByText, getByTestId } = render(
			<SearchPage mockClient={client} />,
		);
		const searchInput = getByTestId("search-input");
		await user.type(searchInput, MockCollection.title);
		await user.type(searchInput, "{enter}");

		const showGroupInput = getByTestId("show-group-sidebar");
		const showGroupInputCollections = await findByTextFrom(
			showGroupInput,
			"Collections",
		);
		await user.click(showGroupInputCollections);

		await waitFor(() =>
			expect(getByText(MockCollection.title)).toBeInTheDocument(),
		);
	});

	test("Should show error screen when 500", async () => {
		mockPeopleIndex([]);
		const client = mockClient(() => {
			throw "oops";
		});
		const { getByText, getByTestId } = render(
			<SearchPage mockClient={client} />,
		);
		const searchInput = getByTestId("search-input");
		await user.type(searchInput, MockPost.title);
		await user.type(searchInput, "{enter}");
		await waitFor(() =>
			expect(
				getByText("There was an error fetching your search results."),
			).toBeInTheDocument(),
		);
	});

	test("Should show 'nothing found'", async () => {
		mockPeopleIndex([]);
		const client = mockClient(() => ({
			posts: [],
			totalPosts: 0,
			totalCollections: 0,
			collections: [],
		}));

		const { getByText, getByTestId } = render(
			<SearchPage mockClient={client} />,
		);
		const searchInput = getByTestId("search-input");
		await user.type(searchInput, "Asdfasdfasdf");
		await user.type(searchInput, "{enter}");
		await waitFor(() =>
			expect(getByText("No results found...")).toBeInTheDocument(),
		);
	});

	test("Remove collections header when none found", async () => {
		mockPeopleIndex([]);
		const client = mockClient(() => ({
			people: [],
			posts: [MockPost],
			totalPosts: 1,
			totalCollections: 0,
			collections: [],
		}));

		const { getByTestId, queryByTestId } = render(
			<SearchPage mockClient={client} />,
		);
		const searchInput = getByTestId("search-input");
		await user.type(searchInput, MockPost.title);
		await user.type(searchInput, "{enter}");
		await waitFor(() =>
			expect(getByTestId("articles-header")).toBeInTheDocument(),
		);
		expect(queryByTestId("collections-header")).not.toBeInTheDocument();
	});

	test("Remove posts header when none found", async () => {
		mockPeopleIndex([]);
		const client = mockClient(() => ({
			posts: [],
			totalPosts: 0,
			totalCollections: 1,
			collections: [MockCollection],
		}));

		const { getByTestId, queryByTestId } = render(
			<SearchPage mockClient={client} />,
		);
		const searchInput = getByTestId("search-input");
		await user.type(searchInput, MockCollection.title);
		await user.type(searchInput, "{enter}");

		await waitFor(() =>
			expect(client.getDocumentSpy(postSchema.name)).toHaveBeenCalledTimes(1),
		);

		expect(queryByTestId("articles-header")).not.toBeInTheDocument();
	});

	test("Filter by tag works on desktop sidebar", async () => {
		page.viewport(2000, 1000);
		mockPeopleIndex([]);
		const client = mockClient(() => ({
			posts: [
				{ ...MockPost, tags: ["Angular"], title: "One blog post" },
				{ ...MockCanonicalPost, tags: [], title: "Two blog post" },
			],
			totalPosts: 2,
			totalCollections: 0,
			collections: [],
			tags: { angular: 1 },
			authors: {},
		}));

		const { getByTestId, queryByTestId, getByText } = render(
			<SearchPage mockClient={client} />,
		);

		const searchInput = getByTestId("search-input");
		await user.type(searchInput, "*");
		await user.type(searchInput, "{enter}");

		await waitFor(() => expect(getByText("One blog post")).toBeInTheDocument());
		await waitFor(() => expect(getByText("Two blog post")).toBeInTheDocument());

		const container = getByTestId("tag-filter-section-sidebar");

		const tag = await findByTextFrom(container, "Angular");
		await user.click(tag);
		await waitFor(() => expect(getByText("One blog post")).toBeInTheDocument());
		expect(queryByTestId("Two blog post")).not.toBeInTheDocument();
	});

	test("Shows the highest-scoring selected-tag snitip", async () => {
		window.history.replaceState(
			{},
			"",
			`?${buildSearchQuery({
				searchQuery: "framework",
				filterTags: ["angular", "typescript"],
			})}`,
		);

		const angularSnitip: SearchSnitipInfo = {
			id: "typescript",
			title: "Angular snitip",
			content: "<p>Angular description</p>",
			links: [],
			tags: ["angular"],
			locale: "en",
			locales: ["en"],
		};
		const typescriptSnitip: SearchSnitipInfo = {
			id: "angular",
			title: "TypeScript snitip",
			content: "<p>TypeScript description</p>",
			links: [],
			tags: ["typescript"],
			locale: "en",
			locales: ["en"],
		};

		mockPeopleIndex([], [angularSnitip, typescriptSnitip]);
		const client = mockClient(() => ({
			posts: [MockPost],
			totalPosts: 1,
			collections: [],
			totalCollections: 0,
			// More than five high-count facets causes the filter UI to hide both
			// selected low-count tags. Snitip scoring must still use raw facets.
			tags: {
				angular: 1,
				typescript: 2,
				react: 10,
				vue: 10,
				svelte: 10,
				solid: 10,
				qwik: 10,
				astro: 10,
			},
		}));

		const { getByText, queryByText } = render(
			<SearchPage mockClient={client} />,
		);

		await waitFor(() =>
			expect(getByText("TypeScript snitip")).toBeInTheDocument(),
		);
		expect(queryByText("Angular snitip")).not.toBeInTheDocument();
	});

	test("Does not show a selected-tag snitip after page one", async () => {
		window.history.replaceState(
			{},
			"",
			`?${buildSearchQuery({
				searchQuery: "framework",
				filterTags: ["typescript"],
				page: 2,
			})}`,
		);

		const snitip: SearchSnitipInfo = {
			id: "typescript",
			title: "TypeScript snitip",
			content: "<p>TypeScript description</p>",
			links: [],
			tags: ["typescript"],
			locale: "en",
			locales: ["en"],
		};

		mockPeopleIndex([], [snitip]);
		const client = mockClient(() => ({
			posts: [MockPost],
			totalPosts: 1,
			collections: [],
			totalCollections: 0,
			tags: { typescript: 5 },
		}));

		const { getByText, queryByText } = render(
			<SearchPage mockClient={client} />,
		);

		await waitFor(() => expect(getByText(MockPost.title)).toBeInTheDocument());
		expect(queryByText("TypeScript snitip")).not.toBeInTheDocument();
	});

	test("Filter by author works on desktop sidebar", async () => {
		page.viewport(2000, 1000);
		mockPeopleIndex([MockPerson, MockPersonTwo]);
		const client = mockClient(() => ({
			posts: [
				{
					...MockPost,
					authors: [MockPerson.id],
					authorsMeta: [MockPerson],
					title: "One blog post",
				},
				{
					...MockCanonicalPost,
					authors: [MockPersonTwo.id],
					authorsMeta: [MockPersonTwo],
					title: "Two blog post",
				},
			],
			totalPosts: 2,
			totalCollections: 0,
			collections: [],
		}));

		const { getByTestId, getByText, queryByTestId } = render(
			<SearchPage mockClient={client} />,
		);

		const searchInput = getByTestId("search-input");
		await user.type(searchInput, "*");
		await user.type(searchInput, "{enter}");

		await waitFor(() => expect(getByText("One blog post")).toBeInTheDocument());
		await waitFor(() => expect(getByText("Two blog post")).toBeInTheDocument());

		const container = getByTestId("author-filter-section-sidebar");

		const author = await findByTextFrom(container, MockPerson.name);

		await user.click(author);
		await waitFor(() => expect(getByText("One blog post")).toBeInTheDocument());
		expect(queryByTestId("Two blog post")).not.toBeInTheDocument();
	});

	test("Filter by content type work on radio group buttons", async () => {
		mockPeopleIndex([]);
		const client = mockClient(() => ({
			posts: [{ ...MockPost, title: "One blog post" }],
			totalPosts: 1,
			totalCollections: 1,
			collections: [{ ...MockCollection, title: "One collection" }],
		}));

		const { getByTestId, getByText, queryByText } = render(
			<SearchPage mockClient={client} />,
		);

		const searchInput = getByTestId("search-input");
		await user.type(searchInput, "*");
		await user.type(searchInput, "{enter}");

		await waitFor(() => expect(getByText("One blog post")).toBeInTheDocument());
		expect(queryByText("One collection")).not.toBeInTheDocument();

		const container = getByTestId("content-to-display-group-topbar");

		const articles = await findByTextFrom(container, "Articles");

		await user.click(articles);
		await waitFor(() => expect(getByText("One blog post")).toBeInTheDocument());

		expect(queryByText("One collection")).not.toBeInTheDocument();

		const collections = await findByTextFrom(container, "Collections");

		await user.click(collections);

		await waitFor(() =>
			expect(getByText("One collection")).toBeInTheDocument(),
		);
		expect(queryByText("One blog post")).not.toBeInTheDocument();
	});

	test("Sort by date works on desktop radio group buttons", async () => {
		page.viewport(2000, 1000);

		mockPeopleIndex([]);
		const client = mockClient(() => ({
			posts: [
				{
					...MockPost,
					published: "2022-01-01T00:00:00.000Z",
					publishedMeta: "January 1, 2022",
					title: "One blog post",
				},
				{
					...MockCanonicalPost,
					published: "2021-01-01T00:00:00.000Z",
					publishedMeta: "January 1, 2021",
					title: "Two blog post",
				},
			],
			totalPosts: 2,
			totalCollections: 0,
			collections: [],
		}));

		const { getByTestId } = render(<SearchPage mockClient={client} />);

		const searchInput = getByTestId("search-input");
		await user.type(searchInput, "*");
		await user.type(searchInput, "{enter}");

		await waitFor(() =>
			expect(client.getDocumentSpy(postSchema.name)).toHaveBeenCalledTimes(1),
		);

		const container = getByTestId("sort-order-group-sidebar");

		const select =
			container instanceof HTMLSelectElement
				? container
				: container.querySelector("select")!;

		await user.selectOptions(select, "newest");

		await waitFor(() =>
			expect(client.getDocumentSpy(postSchema.name)).toHaveBeenCalledTimes(2),
		);
		expect(client.getDocumentSpy(postSchema.name)).toHaveBeenLastCalledWith(
			postSchema.name,
			expect.objectContaining({
				q: "*",
				limit: MAX_POSTS_PER_PAGE,
				offset: 0,
				sort_by: "publishedTimestamp:desc",
				filter_by: undefined,
			}),
			expect.anything(),
		);

		await user.selectOptions(select, "oldest");

		await waitFor(() =>
			expect(client.getDocumentSpy(postSchema.name)).toHaveBeenCalledTimes(3),
		);
		expect(client.getDocumentSpy(postSchema.name)).toHaveBeenLastCalledWith(
			postSchema.name,
			expect.objectContaining({
				q: "*",
				limit: MAX_POSTS_PER_PAGE,
				offset: 0,
				sort_by: "publishedTimestamp:asc",
				filter_by: undefined,
			}),
			expect.anything(),
		);
	});

	test("Sort by date works on mobile radio group buttons", async () => {
		page.viewport(500, 1000);

		mockPeopleIndex([]);
		const client = mockClient(() => ({
			posts: [
				{
					...MockPost,
					published: "2022-01-01T00:00:00.000Z",
					publishedMeta: "January 1, 2022",
					title: "One blog post",
				},
				{
					...MockCanonicalPost,
					published: "2021-01-01T00:00:00.000Z",
					publishedMeta: "January 1, 2021",
					title: "Two blog post",
				},
			],
			totalPosts: 2,
			totalCollections: 0,
			collections: [],
		}));

		const { getByTestId } = render(<SearchPage mockClient={client} />);

		const searchInput = getByTestId("search-input");
		await user.type(searchInput, "*");
		await user.type(searchInput, "{enter}");

		await waitFor(() =>
			expect(client.getDocumentSpy(postSchema.name)).toHaveBeenCalledTimes(1),
		);

		const container = getByTestId("sort-order-group-topbar");

		const select =
			container instanceof HTMLSelectElement
				? container
				: container.querySelector("select")!;

		user.selectOptions(select, "newest");

		await waitFor(() =>
			expect(client.getDocumentSpy(postSchema.name)).toHaveBeenCalledTimes(2),
		);
		expect(client.getDocumentSpy(postSchema.name)).toHaveBeenLastCalledWith(
			postSchema.name,
			expect.objectContaining({
				q: "*",
				limit: MAX_POSTS_PER_PAGE,
				offset: 0,
				sort_by: "publishedTimestamp:desc",
				filter_by: undefined,
			}),
			expect.anything(),
		);

		user.selectOptions(select, "oldest");

		await waitFor(() =>
			expect(client.getDocumentSpy(postSchema.name)).toHaveBeenCalledTimes(3),
		);
		expect(client.getDocumentSpy(postSchema.name)).toHaveBeenLastCalledWith(
			postSchema.name,
			expect.objectContaining({
				q: "*",
				limit: MAX_POSTS_PER_PAGE,
				offset: 0,
				sort_by: "publishedTimestamp:asc",
				filter_by: undefined,
			}),
			expect.anything(),
		);
	});

	test("Pagination - Changing pages to page 2 shows second page of results", async () => {
		// 6 posts per page
		mockPeopleIndex([]);
		const client = mockClient(() => ({
			posts: [
				{ ...MockPost, slug: `blog-post-1`, title: "One blog post" },
				{ ...MockPost, slug: `blog-post-2`, title: "Two blog post" },
				{ ...MockPost, slug: `blog-post-3`, title: "Three blog post" },
				{ ...MockPost, slug: `blog-post-4`, title: "Four blog post" },
				{ ...MockPost, slug: `blog-post-5`, title: "Five blog post" },
				{ ...MockPost, slug: `blog-post-6`, title: "Six blog post" },
				{ ...MockPost, slug: `blog-post-7`, title: "Seven blog post" },
				{ ...MockPost, slug: `blog-post-8`, title: "Eight blog post" },
				{ ...MockPost, slug: `blog-post-9`, title: "Nine blog post" },
				{ ...MockPost, slug: `blog-post-10`, title: "Ten blog post" },
				{ ...MockPost, slug: `blog-post-11`, title: "Eleven blog post" },
				{ ...MockPost, slug: `blog-post-12`, title: "Twelve blog post" },
			],
			totalPosts: 12,
			totalCollections: 0,
			collections: [],
		}));

		const { findByTestId, findByText, getByTestId } = render(
			<SearchPage mockClient={client} />,
		);

		const searchInput = getByTestId("search-input");
		await user.type(searchInput, "*");
		await user.type(searchInput, "{enter}");

		await waitFor(() =>
			expect(client.getDocumentSpy(postSchema.name)).toHaveBeenCalledOnce(),
		);
		expect(client.getDocumentSpy(postSchema.name)).toHaveBeenLastCalledWith(
			postSchema.name,
			expect.objectContaining({
				q: "*",
				limit: MAX_POSTS_PER_PAGE,
				offset: 0,
				sort_by: "publishedTimestamp:desc",
				filter_by: undefined,
			}),
			expect.anything(),
		);

		await findByText("One blog post");
		await findByText("Six blog post");

		const container = await findByTestId("pagination");

		const page2 = await findByTextFrom(container, "2");

		await user.click(page2);

		await waitFor(() =>
			expect(client.getDocumentSpy(postSchema.name)).toHaveBeenCalledTimes(2),
		);
		expect(client.getDocumentSpy(postSchema.name)).toHaveBeenLastCalledWith(
			postSchema.name,
			expect.objectContaining({
				q: "*",
				limit: MAX_POSTS_PER_PAGE,
				offset: MAX_POSTS_PER_PAGE * (2 - 1),
				sort_by: "publishedTimestamp:desc",
				filter_by: undefined,
			}),
			expect.anything(),
		);
		await findByText("Eleven blog post");
		await findByText("Twelve blog post");
	});

	test("Pagination - Filters impact pagination", async () => {
		page.viewport(2000, 1000);
		// 6 posts per page
		mockPeopleIndex([MockPerson, MockPersonTwo]);
		const client = mockClient(() => ({
			posts: [
				{
					...MockPost,
					authorsMeta: [MockPerson],
					authors: [MockPerson.id],
					slug: `blog-post-1`,
					title: "One blog post",
				},
				{
					...MockPost,
					authorsMeta: [MockPerson],
					authors: [MockPerson.id],
					slug: `blog-post-2`,
					title: "Two blog post",
				},
				{
					...MockPost,
					authorsMeta: [MockPerson],
					authors: [MockPerson.id],
					slug: `blog-post-3`,
					title: "Three blog post",
				},
				{
					...MockPost,
					authorsMeta: [MockPerson],
					authors: [MockPerson.id],
					slug: `blog-post-4`,
					title: "Four blog post",
				},
				{
					...MockPost,
					authorsMeta: [MockPersonTwo],
					authors: [MockPersonTwo.id],
					slug: `blog-post-5`,
					title: "Five blog post",
				},
				{
					...MockPost,
					authorsMeta: [MockPersonTwo],
					authors: [MockPersonTwo.id],
					slug: `blog-post-6`,
					title: "Six blog post",
				},
				{
					...MockPost,
					authorsMeta: [MockPersonTwo],
					authors: [MockPersonTwo.id],
					slug: `blog-post-7`,
					title: "Seven blog post",
				},
				{
					...MockPost,
					authorsMeta: [MockPersonTwo],
					authors: [MockPersonTwo.id],
					slug: `blog-post-8`,
					title: "Eight blog post",
				},
				{
					...MockPost,
					authorsMeta: [MockPersonTwo],
					authors: [MockPersonTwo.id],
					slug: `blog-post-9`,
					title: "Nine blog post",
				},
				{
					...MockPost,
					authorsMeta: [MockPersonTwo],
					authors: [MockPersonTwo.id],
					slug: `blog-post-10`,
					title: "Ten blog post",
				},
				{
					...MockPost,
					authorsMeta: [MockPersonTwo],
					authors: [MockPersonTwo.id],
					slug: `blog-post-11`,
					title: "Eleven blog post",
				},
				{
					...MockPost,
					authorsMeta: [MockPersonTwo],
					authors: [MockPersonTwo.id],
					slug: `blog-post-12`,
					title: "Twelve blog post",
				},
			],
			totalPosts: 12,
			totalCollections: 0,
			collections: [],
		}));

		const { findByTestId, findByText, getByTestId } = render(
			<SearchPage mockClient={client} />,
		);

		const searchInput = getByTestId("search-input");
		await user.type(searchInput, "*");
		await user.type(searchInput, "{enter}");

		await waitFor(() => {
			expect(client.getDocumentSpy(postSchema.name)).toHaveBeenLastCalledWith(
				postSchema.name,
				expect.objectContaining({
					q: "*",
					limit: MAX_POSTS_PER_PAGE,
					offset: 0,
					filter_by: undefined,
				}),
				expect.anything(),
			);
		});

		const authorContainer = await findByTestId("author-filter-section-sidebar");
		const author = await findByTextFrom(authorContainer, MockPerson.name);

		// Apply author filter
		await user.click(author);

		await waitFor(() => {
			// Verify search call with filter and reset offset
			expect(client.getDocumentSpy(postSchema.name)).toHaveBeenLastCalledWith(
				postSchema.name,
				expect.objectContaining({
					q: "*",
					limit: MAX_POSTS_PER_PAGE,
					offset: 0, // Should reset to first page
					filter_by: `authors:[${MockPerson.id}]`,
				}),
				expect.anything(),
			);
		});

		// Verify filtered results
		await findByText("One blog post");
		await findByText("Four blog post");
	});

	// Search page, sort order, etc
	test("Make sure that initial search props are not thrown away", async () => {
		mockPeopleIndex([]);
		const client = mockClient(() => ({
			posts: [
				{
					...MockPost,
					tags: ["angular"],
					authorsMeta: [MockPerson],
					authors: [MockPerson.id],
					slug: `blog-post-1`,
					title: "One blog post",
					published: "2019-01-01T00:00:00.000Z",
					publishedMeta: "January 1, 2019",
				},
				{
					...MockPost,
					tags: ["angular"],
					authorsMeta: [MockPerson],
					authors: [MockPerson.id],
					slug: `blog-post-2`,
					title: "Two blog post",
					published: "2019-01-01T00:00:00.000Z",
					publishedMeta: "January 1, 2019",
				},
				{
					...MockPost,
					tags: ["angular"],
					authorsMeta: [MockPerson],
					authors: [MockPerson.id],
					slug: `blog-post-3`,
					title: "Three blog post",
					published: "2019-01-01T00:00:00.000Z",
					publishedMeta: "January 1, 2019",
				},
				{
					...MockPost,
					tags: ["angular"],
					authorsMeta: [MockPerson],
					authors: [MockPerson.id],
					slug: `blog-post-4`,
					title: "Four blog post",
					published: "2019-01-01T00:00:00.000Z",
					publishedMeta: "January 1, 2019",
				},
				{
					...MockPost,
					tags: ["angular"],
					authorsMeta: [MockPerson],
					authors: [MockPerson.id],
					slug: `blog-post-5`,
					title: "Five blog post",
					published: "2019-01-01T00:00:00.000Z",
					publishedMeta: "January 1, 2019",
				},
				{
					...MockPost,
					tags: ["angular"],
					authorsMeta: [MockPerson],
					authors: [MockPerson.id],
					slug: `blog-post-6`,
					title: "Six blog post",
					published: "2019-01-01T00:00:00.000Z",
					publishedMeta: "January 1, 2019",
				},
				{
					...MockPost,
					tags: ["angular"],
					authorsMeta: [MockPerson],
					authors: [MockPerson.id],
					slug: `blog-post-7`,
					title: "Seven blog post",
					published: "2090-01-01T00:00:00.000Z",
					publishedMeta: "January 1, 2090",
				},
				{
					...MockPost,
					tags: ["react"],
					authorsMeta: [MockPerson],
					authors: [MockPerson.id],
					slug: `blog-post-8`,
					title: "Eight blog post",
					published: "2019-01-01T00:00:00.000Z",
					publishedMeta: "January 1, 2019",
				},
				{
					...MockPost,
					tags: ["angular"],
					authorsMeta: [MockPersonTwo],
					authors: [MockPersonTwo.id],
					slug: `blog-post-9`,
					title: "Nine blog post",
					published: "2019-01-01T00:00:00.000Z",
					publishedMeta: "January 1, 2019",
				},
				{
					...MockPost,
					tags: ["angular"],
					authorsMeta: [MockPerson],
					authors: [MockPerson.id],
					slug: `blog-post-10`,
					title: "Ten blog post",
					published: "2020-01-01T00:00:00.000Z",
					publishedMeta: "January 1, 2020",
				},
			],
			totalPosts: 10,
			totalCollections: 0,
			collections: [
				{
					...MockCollection,
					title: "One collection",
				},
			],
		}));

		const searchQuery = buildSearchQuery({
			searchQuery: "blog",
			page: 2,
			display: "articles",
			filterTags: ["angular"],
			filterAuthors: [MockPerson.id],
			sort: "oldest",
		});

		window.history.replaceState({}, "", `?${searchQuery}`);

		const { getByTestId } = render(<SearchPage mockClient={client} />);

		// Persists search query
		const searchInput = getByTestId("search-input");
		expect(searchInput).toHaveValue("blog");

		// Invokes the expected post query
		expect(client.getDocumentSpy(postSchema.name)).toHaveBeenCalledOnce();
		expect(client.getDocumentSpy(postSchema.name)).toHaveBeenCalledWith(
			postSchema.name,
			expect.objectContaining({
				q: "blog",
				limit: MAX_POSTS_PER_PAGE,
				offset: MAX_POSTS_PER_PAGE,
				sort_by: "publishedTimestamp:asc",
				filter_by: `tags:[angular]&&authors:[${MockPerson.id}]`,
			}),
			expect.anything(),
		);

		// Invokes the expected collections query
		expect(client.getDocumentSpy(collectionSchema.name)).toHaveBeenCalledOnce();
		expect(client.getDocumentSpy(collectionSchema.name)).toHaveBeenCalledWith(
			collectionSchema.name,
			expect.objectContaining({
				q: "blog",
				limit: MAX_COLLECTIONS_PER_PAGE,
				offset: MAX_COLLECTIONS_PER_PAGE,
				sort_by: "publishedTimestamp:asc",
				filter_by: `tags:[angular]&&authors:[${MockPerson.id}]`,
			}),
			expect.anything(),
		);
	});

	test("Make sure that complete re-renders preserve tags, authors, etc", async () => {
		page.viewport(2000, 1000);

		mockPeopleIndex([MockPerson, MockPersonTwo]);
		const client = mockClient(() => ({
			people: [MockPerson, MockPersonTwo],
			posts: [
				{
					...MockPost,
					tags: ["Angular"],
					authors: [MockPerson.id],
					title: "One blog post",
				},
				{
					...MockCanonicalPost,
					tags: [],
					authors: [MockPersonTwo.id],
					title: "Two blog post",
				},
			],
			totalPosts: 2,
			totalCollections: 0,
			collections: [],
			tags: { angular: 1 },
			authors: { [MockPerson.id]: 1 },
		}));

		{
			const { getByTestId, getByText } = render(
				<SearchPage mockClient={client} />,
			);

			const searchInput = getByTestId("search-input");
			await user.type(searchInput, "*");
			await user.type(searchInput, "{enter}");

			await waitFor(() =>
				expect(getByText("One blog post")).toBeInTheDocument(),
			);
			await waitFor(() =>
				expect(getByText("Two blog post")).toBeInTheDocument(),
			);

			const tagContainer = getByTestId("tag-filter-section-sidebar");

			const tag = await findByTextFrom(tagContainer, "Angular");

			await user.click(tag);

			const authorContainer = getByTestId("author-filter-section-sidebar");

			const author = await findByTextFrom(authorContainer, MockPerson.name);

			await user.click(author);

			await waitFor(() =>
				expect(getByText("One blog post")).toBeInTheDocument(),
			);

			cleanup();
		}

		// Re-render
		{
			const { getByTestId } = render(<SearchPage mockClient={client} />);

			const searchInput = getByTestId("search-input");
			await user.type(searchInput, "*");
			await user.type(searchInput, "{enter}");

			const tagContainer = getByTestId("tag-filter-section-sidebar");
			const authorContainer = getByTestId("author-filter-section-sidebar");

			expect(await findByTextFrom(tagContainer, "Angular")).toBeInTheDocument();
			expect(
				await findByTextFrom(authorContainer, MockPerson.name),
			).toBeInTheDocument();
		}
	});

	test("Make sure that re-searches reset page to 1 and preserve tags, authors, etc", async () => {
		mockPeopleIndex([]);
		const client = mockClient(() => ({
			posts: [
				{
					...MockPost,
					slug: `blog-post-1`,
					title: "One blog post",
					tags: ["angular"],
					authors: [MockPerson.id],
					authorsMeta: [MockPerson],
					published: "2019-01-01T00:00:00.000Z",
					publishedMeta: "January 1, 2019",
				},
				{
					...MockPost,
					slug: `blog-post-2`,
					title: "Two blog post",
					tags: ["angular"],
					authors: [MockPerson.id],
					authorsMeta: [MockPerson],
					published: "2020-01-01T00:00:00.000Z",
					publishedMeta: "January 1, 2020",
				},
				{
					...MockPost,
					slug: `blog-post-3`,
					title: "Three blog post",
					tags: ["angular"],
					authors: [MockPerson.id],
					authorsMeta: [MockPerson],

					published: "2021-01-01T00:00:00.000Z",
					publishedMeta: "January 1, 2021",
				},
				{
					...MockPost,
					slug: `blog-post-4`,
					title: "Four blog post",
					tags: ["angular"],
					authors: [MockPerson.id],
					authorsMeta: [MockPerson],

					published: "2022-01-01T00:00:00.000Z",
					publishedMeta: "January 1, 2022",
				},
				{
					...MockPost,
					slug: `blog-post-5`,
					title: "Five blog post",
					tags: ["angular"],
					authors: [MockPerson.id],
					authorsMeta: [MockPerson],

					published: "2023-01-01T00:00:00.000Z",
					publishedMeta: "January 1, 2023",
				},
				{
					...MockPost,
					slug: `blog-post-6`,
					title: "Six blog post",
					tags: ["angular"],
					authors: [MockPerson.id],
					authorsMeta: [MockPerson],

					published: "2024-01-01T00:00:00.000Z",
					publishedMeta: "January 1, 2024",
				},
				{
					...MockPost,
					slug: `blog-post-7`,
					title: "Seven blog post",
					tags: ["angular"],
					authors: [MockPerson.id],
					authorsMeta: [MockPerson],

					published: "2025-01-01T00:00:00.000Z",
					publishedMeta: "January 1, 2025",
				},
				{
					...MockPost,
					slug: `blog-post-8`,
					title: "Eight blog post",
					tags: ["angular"],
					authors: [MockPerson.id],
					authorsMeta: [MockPerson],

					published: "2026-01-01T00:00:00.000Z",
					publishedMeta: "January 1, 2026",
				},
				{
					...MockPost,
					slug: `blog-post-9`,
					title: "Nine blog post",
					tags: ["angular"],
					authors: [MockPerson.id],
					authorsMeta: [MockPerson],

					published: "2027-01-01T00:00:00.000Z",
					publishedMeta: "January 1, 2027",
				},
				{
					...MockPost,
					slug: `blog-post-10`,
					title: "Ten blog post",
					tags: ["angular"],
					authors: [MockPerson.id],
					authorsMeta: [MockPerson],

					published: "2028-01-01T00:00:00.000Z",
					publishedMeta: "January 1, 2028",
				},
			],
			totalPosts: 10,
			totalCollections: 0,
			collections: [
				{
					...MockCollection,
					title: "One collection",
				},
			],
		}));

		const searchQuery = buildSearchQuery({
			searchQuery: "blog",
			page: 2,
			display: "articles",
			filterTags: ["angular"],
			filterAuthors: [MockPerson.id],
			sort: "oldest",
		});

		window.history.replaceState({}, "", `?${searchQuery}`);

		const { getByTestId, getByText } = render(
			<SearchPage mockClient={client} />,
		);

		await waitFor(() =>
			expect(client.getDocumentSpy(postSchema.name)).toHaveBeenCalledOnce(),
		);

		await waitFor(() => expect(getByText("Ten blog post")).toBeInTheDocument());

		const searchInput = getByTestId("search-input");
		expect(searchInput).toHaveValue("blog");

		await user.type(searchInput, "other");
		await user.type(searchInput, "{enter}");

		await waitFor(() =>
			expect(client.getDocumentSpy(postSchema.name)).toHaveBeenCalledTimes(2),
		);

		expect(client.getDocumentSpy(postSchema.name)).toHaveBeenLastCalledWith(
			postSchema.name,
			expect.objectContaining({
				q: "blogother",
				limit: MAX_POSTS_PER_PAGE,
				offset: 0,
				sort_by: "publishedTimestamp:asc",
				filter_by: `tags:[angular]&&authors:[joe]`,
			}),
			expect.anything(),
		);

		await waitFor(() => expect(getByText("One blog post")).toBeInTheDocument());

		// Since the search URL is debounced, it might update a while after the search results are visible
		await waitFor(() => {
			expect(window.location.search).toEqual(
				"?q=blogother&filterTags=angular&filterAuthors=joe&sort=oldest",
			);
		});
	});

	test("Make sure that re-searches to empty string reset page, tags, authors, etc", async () => {
		mockPeopleIndex([]);
		const client = mockClient(() => ({
			posts: [
				{
					...MockPost,
					slug: `blog-post-1`,
					title: "One blog post",
					tags: ["angular"],
					authors: [MockPerson.id],
					authorsMeta: [MockPerson],
					published: "2019-01-01T00:00:00.000Z",
					publishedMeta: "January 1, 2019",
				},
				{
					...MockPost,
					slug: `blog-post-2`,
					title: "Two blog post",
					tags: ["angular"],
					authors: [MockPerson.id],
					authorsMeta: [MockPerson],
					published: "2020-01-01T00:00:00.000Z",
					publishedMeta: "January 1, 2020",
				},
				{
					...MockPost,
					slug: `blog-post-3`,
					title: "Three blog post",
					tags: ["angular"],
					authors: [MockPerson.id],
					authorsMeta: [MockPerson],

					published: "2021-01-01T00:00:00.000Z",
					publishedMeta: "January 1, 2021",
				},
				{
					...MockPost,
					slug: `blog-post-4`,
					title: "Four blog post",
					tags: ["angular"],
					authors: [MockPerson.id],
					authorsMeta: [MockPerson],

					published: "2022-01-01T00:00:00.000Z",
					publishedMeta: "January 1, 2022",
				},
				{
					...MockPost,
					slug: `blog-post-5`,
					title: "Five blog post",
					tags: ["angular"],
					authors: [MockPerson.id],
					authorsMeta: [MockPerson],

					published: "2023-01-01T00:00:00.000Z",
					publishedMeta: "January 1, 2023",
				},
				{
					...MockPost,
					slug: `blog-post-6`,
					title: "Six blog post",
					tags: ["angular"],
					authors: [MockPerson.id],
					authorsMeta: [MockPerson],

					published: "2024-01-01T00:00:00.000Z",
					publishedMeta: "January 1, 2024",
				},
				{
					...MockPost,
					slug: `blog-post-7`,
					title: "Seven blog post",
					tags: ["angular"],
					authors: [MockPerson.id],
					authorsMeta: [MockPerson],

					published: "2025-01-01T00:00:00.000Z",
					publishedMeta: "January 1, 2025",
				},
				{
					...MockPost,
					slug: `blog-post-8`,
					title: "Eight blog post",
					tags: ["angular"],
					authors: [MockPerson.id],
					authorsMeta: [MockPerson],

					published: "2026-01-01T00:00:00.000Z",
					publishedMeta: "January 1, 2026",
				},
				{
					...MockPost,
					slug: `blog-post-9`,
					title: "Nine blog post",
					tags: ["angular"],
					authors: [MockPerson.id],
					authorsMeta: [MockPerson],

					published: "2027-01-01T00:00:00.000Z",
					publishedMeta: "January 1, 2027",
				},
				{
					...MockPost,
					slug: `blog-post-10`,
					title: "Ten blog post",
					tags: ["angular"],
					authors: [MockPerson.id],
					authorsMeta: [MockPerson],

					published: "2028-01-01T00:00:00.000Z",
					publishedMeta: "January 1, 2028",
				},
			],
			totalPosts: 10,
			totalCollections: 4,
			collections: [
				{
					...MockCollection,
					title: "One collection",
				},
			],
		}));

		const searchQuery = buildSearchQuery({
			searchQuery: "blog",
			page: 2,
			display: "articles",
			filterTags: ["angular"],
			filterAuthors: [MockPerson.id],
			sort: "oldest",
		});

		window.history.replaceState({}, "", `?${searchQuery}`);

		const { getByTestId, getByText } = render(
			<SearchPage mockClient={client} />,
		);

		await waitFor(() => expect(getByText("Ten blog post")).toBeInTheDocument());

		const searchInput = getByTestId("search-input");
		expect(searchInput).toHaveValue("blog");

		await user.clear(searchInput);

		await waitFor(() =>
			expect(getByText("What would you like to find?")).toBeInTheDocument(),
		);

		// Since the search URL is debounced, it might update a while after the search results are visible
		await waitFor(() => {
			expect(window.location.search).toEqual("?sort=oldest");
		});
	});

	test("Back button should show last query", async () => {
		mockPeopleIndex([]);
		const client = mockClient(() => ({
			posts: [],
			totalPosts: 0,
			totalCollections: 0,
			collections: [],
			tags: {},
			authors: {},
		}));

		const { getByTestId, getByText } = render(
			<SearchPage mockClient={client} />,
		);

		const searchInput = getByTestId("search-input");
		await user.type(searchInput, "blog");

		await waitFor(
			() => {
				expect(window.location.search).toBe("?q=blog");
				expect(getByText("No results found...")).toBeInTheDocument();
			},
			{ timeout: 1500 },
		);

		await user.type(searchInput, "other");

		await waitFor(() => expect(window.location.search).toBe("?q=blogother"), {
			timeout: 1500,
		});

		history.back();
		await waitFor(() => expect(window.location.search).toBe("?q=blog"));
	});
	test("Collection Pagination - Changing pages shows correct collection results", async () => {
		// Mock 10 collections to ensure we have multiple pages (4 per page)
		mockPeopleIndex([]);
		const client = mockClient(() => ({
			posts: [],
			totalPosts: 0,
			collections: [
				{ ...MockCollection, slug: `collection-1`, title: "Collection One" },
				{ ...MockCollection, slug: `collection-2`, title: "Collection Two" },
				{ ...MockCollection, slug: `collection-3`, title: "Collection Three" },
				{ ...MockCollection, slug: `collection-4`, title: "Collection Four" },
				{ ...MockCollection, slug: `collection-5`, title: "Collection Five" },
				{ ...MockCollection, slug: `collection-6`, title: "Collection Six" },
				{ ...MockCollection, slug: `collection-7`, title: "Collection Seven" },
				{ ...MockCollection, slug: `collection-8`, title: "Collection Eight" },
				{ ...MockCollection, slug: `collection-9`, title: "Collection Nine" },
				{ ...MockCollection, slug: `collection-10`, title: "Collection Ten" },
				{
					...MockCollection,
					slug: `collection-11`,
					title: "Collection Eleven",
				},
			],
			totalCollections: 11,
		}));

		const { findByTestId, getByText, getByTestId } = render(
			<SearchPage mockClient={client} />,
		);

		const searchInput = getByTestId("search-input");
		await user.type(searchInput, "*");
		await user.type(searchInput, "{enter}");

		const showGroupInput = getByTestId("show-group-sidebar");
		const showGroupInputCollections = await findByTextFrom(
			showGroupInput,
			"Collections",
		);
		await user.click(showGroupInputCollections);

		// Verify initial collection client call
		await waitFor(() =>
			expect(client.getDocumentSpy(collectionSchema.name)).toHaveBeenCalledWith(
				collectionSchema.name,
				expect.objectContaining({
					q: "*",
					limit: MAX_COLLECTIONS_PER_PAGE,
					offset: 0,
					sort_by: "publishedTimestamp:desc",
					filter_by: undefined,
				}),
				expect.anything(),
			),
		);

		// Verify first page collections are visible
		await waitFor(() => {
			expect(getByText("Collection One")).toBeInTheDocument();
			expect(getByText("Collection Four")).toBeInTheDocument();
		});

		const container = await findByTestId("pagination");
		const page2 = await findByTextFrom(container, "2");

		// Click to second page
		await user.click(page2);

		// Verify collection client called with correct offset for page 2
		await waitFor(() =>
			expect(client.getDocumentSpy(collectionSchema.name)).toHaveBeenCalledWith(
				collectionSchema.name,
				expect.objectContaining({
					q: "*",
					limit: MAX_COLLECTIONS_PER_PAGE,
					offset: MAX_COLLECTIONS_PER_PAGE,
					sort_by: "publishedTimestamp:desc",
					filter_by: undefined,
				}),
				expect.anything(),
			),
		);

		// Verify URL updated with correct collection page
		await waitFor(() => {
			expect(window.location.search).toContain("page=2");
		});

		// Verify second page collections are visible
		expect(getByText("Collection Eleven")).toBeInTheDocument();
	});
});
