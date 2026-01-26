import {
	test,
	beforeEach,
	describe,
	expect,
	vi,
	worker,
	type Mock,
} from "ui-test-utils";
import {
	findByText as findByTextFrom,
	render,
	waitFor,
	cleanup,
} from "@testing-library/preact";
import { SearchPageBase } from "./search-page";
import { http, HttpResponse } from "msw";
import { MockCanonicalPost, MockPost } from "../../../__mocks__/data/mock-post";
import userEvent from "@testing-library/user-event";
import { MockCollection } from "../../../__mocks__/data/mock-collection";
import { MockPerson, MockPersonTwo } from "../../../__mocks__/data/mock-person";
import { buildSearchQuery } from "src/views/search/search";
import { PersonInfo } from "types/PersonInfo";
import { PostInfo } from "types/PostInfo";
import { CollectionInfo } from "types/CollectionInfo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SearchClient, SearchContext } from "./services";
import {
	MAX_COLLECTIONS_PER_PAGE,
	MAX_POSTS_PER_PAGE,
	PUBLIC_SEARCH_ENDPOINT_HOST,
	PUBLIC_SEARCH_ENDPOINT_PORT,
	PUBLIC_SEARCH_ENDPOINT_PROTOCOL,
	PUBLIC_SEARCH_KEY,
} from "./constants";
import Typesense from "typesense";
import Collection from "typesense/lib/Typesense/Collection";
import Documents from "typesense/lib/Typesense/Documents";
import { collectionSchema, postSchema } from "utils/search";

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
type DocumentSearchReturn = ReturnType<DocumentSearchMethod>;
type DocumentSearchParams = Parameters<DocumentSearchMethod>[0];
type DocumentSearchOptions = Parameters<DocumentSearchMethod>[1];

type ApiCall = ConstructorParameters<typeof Documents>[1];
type Configuration = ConstructorParameters<typeof Documents>[2];
type MockSearchFn = (
	collectionName: string,
	searchParameters: DocumentSearchParams,
	searchOptions: DocumentSearchOptions,
) => DocumentSearchReturn;

function getClientCollectionDocumentMock(
	client: InstanceType<typeof Typesense.Client>,
	collectionName: string,
) {
	const documents = client.collections(collectionName).documents();
	return (
		documents as unknown as {
			__spy: Mock;
		}
	).__spy;
}

function mockTypeSenseClient(searchFn: MockSearchFn): typeof Typesense.Client {
	const spyRecord = new Map<string, MockSearchFn>();

	class MockDocuments extends Documents {
		__collectionName: string;
		__spy: MockSearchFn;

		constructor(
			collectionName: string,
			apiCall: ApiCall,
			configuration: Configuration,
		) {
			super(collectionName, apiCall, configuration);
			this.__collectionName = collectionName;
			if (spyRecord.has(collectionName)) {
				this.__spy = spyRecord.get(collectionName)!;
			} else {
				const mockSearchFn = vi.fn().mockImplementation(searchFn);
				spyRecord.set(collectionName, mockSearchFn);
				this.__spy = mockSearchFn;
			}
		}

		async search(
			searchParameters: DocumentSearchParams,
			searchOptions: DocumentSearchOptions,
		): DocumentSearchReturn {
			return this.__spy(this.__collectionName, searchParameters, searchOptions);
		}
	}

	class MockCollection extends Collection {
		__name: string;
		__apiCall: ApiCall;
		__configuration: Configuration;

		constructor(name: string, apiCall: ApiCall, configuration: Configuration) {
			super(name, apiCall, configuration);
			this.__name = name;
			this.__apiCall = apiCall;
			this.__configuration = configuration;
		}

		documents(): never;
		documents(documentId?: string) {
			if (!documentId) {
				return new MockDocuments(
					this.__name,
					this.__apiCall,
					this.__configuration,
				);
			}

			return super.documents(documentId);
		}
	}

	class MockClient extends Typesense.Client {
		collections(): never;
		collections(collectionName?: string) {
			if (collectionName === undefined) {
				return super.collections();
			}

			return new MockCollection(
				collectionName,
				this.apiCall,
				this.configuration,
			);
		}
	}

	return MockClient;
}

function mockClient(fn: (searchStr: string) => FnReply): SearchContext {
	const clientClass = mockTypeSenseClient(
		async (collectionName, searchParameters) => {
			const isPostSearch = collectionName === postSchema.name;
			const searchString = searchParameters.q!;
			const res = fn(searchString);
			const found_docs = isPostSearch
				? res.posts.length
				: res.collections.length;
			const out_of = isPostSearch ? res.totalPosts : res.totalCollections;
			let id = 1;
			const hits = isPostSearch
				? res.posts.map((post) => {
						return {
							id: ++id,
							document: post,
							highlight: null as never,
							text_match: 0,
						};
					}) || []
				: res.collections.map((collection) => {
						return {
							id: ++id,
							document: collection,
							highlight: null as never,
							text_match: 0,
						};
					}) || [];

			return {
				hits,
				found: found_docs,
				found_docs,
				out_of,
				page: 1,
				request_params: searchParameters as never,
				search_time_ms: 0,
				facet_counts: [
					{
						field_name: "tags" as never,
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
						field_name: "authors" as never,
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
			} as const;
		},
	);

	const client = new clientClass({
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

	return { client };
}

function mockPeopleIndex(people: PersonInfo[]) {
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
			});
		}),
	);
}

function SearchPage(props: { mockClient: SearchContext }) {
	const queryClient = new QueryClient();
	return (
		<SearchClient.Provider value={props.mockClient}>
			<QueryClientProvider client={queryClient}>
				<SearchPageBase siteTitle="Site Title" />
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

	test("Should show search results for collections", async () => {
		(window as { innerWidth: number }).innerWidth = 2000;
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
			expect(
				getClientCollectionDocumentMock(client.client, postSchema.name),
			).toHaveBeenCalledTimes(1),
		);

		expect(queryByTestId("articles-header")).not.toBeInTheDocument();
	});

	test("Filter by tag works on desktop sidebar", async () => {
		(window as { innerWidth: number }).innerWidth = 2000;
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

	test("Filter by author works on desktop sidebar", async () => {
		(window as { innerWidth: number }).innerWidth = 2000;
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
		(window as { innerWidth: number }).innerWidth = 2000;

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
			expect(
				getClientCollectionDocumentMock(client.client, postSchema.name),
			).toHaveBeenCalledTimes(1),
		);

		const container = getByTestId("sort-order-group-sidebar");

		const select =
			container instanceof HTMLSelectElement
				? container
				: container.querySelector("select")!;

		await user.selectOptions(select, "newest");

		await waitFor(() =>
			expect(
				getClientCollectionDocumentMock(client.client, postSchema.name),
			).toHaveBeenCalledTimes(2),
		);
		expect(
			getClientCollectionDocumentMock(client.client, postSchema.name),
		).toHaveBeenLastCalledWith(
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
			expect(
				getClientCollectionDocumentMock(client.client, postSchema.name),
			).toHaveBeenCalledTimes(3),
		);
		expect(
			getClientCollectionDocumentMock(client.client, postSchema.name),
		).toHaveBeenLastCalledWith(
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
		(window as { innerWidth: number }).innerWidth = 500;

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
			expect(
				getClientCollectionDocumentMock(client.client, postSchema.name),
			).toHaveBeenCalledTimes(1),
		);

		const container = getByTestId("sort-order-group-topbar");

		const select =
			container instanceof HTMLSelectElement
				? container
				: container.querySelector("select")!;

		user.selectOptions(select, "newest");

		await waitFor(() =>
			expect(
				getClientCollectionDocumentMock(client.client, postSchema.name),
			).toHaveBeenCalledTimes(2),
		);
		expect(
			getClientCollectionDocumentMock(client.client, postSchema.name),
		).toHaveBeenLastCalledWith(
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
			expect(
				getClientCollectionDocumentMock(client.client, postSchema.name),
			).toHaveBeenCalledTimes(3),
		);
		expect(
			getClientCollectionDocumentMock(client.client, postSchema.name),
		).toHaveBeenLastCalledWith(
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
			expect(
				getClientCollectionDocumentMock(client.client, postSchema.name),
			).toHaveBeenCalledOnce(),
		);
		expect(
			getClientCollectionDocumentMock(client.client, postSchema.name),
		).toHaveBeenLastCalledWith(
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
			expect(
				getClientCollectionDocumentMock(client.client, postSchema.name),
			).toHaveBeenCalledTimes(2),
		);
		expect(
			getClientCollectionDocumentMock(client.client, postSchema.name),
		).toHaveBeenLastCalledWith(
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
		(window as { innerWidth: number }).innerWidth = 2000;
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
			expect(
				getClientCollectionDocumentMock(client.client, postSchema.name),
			).toHaveBeenLastCalledWith(
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
			expect(
				getClientCollectionDocumentMock(client.client, postSchema.name),
			).toHaveBeenLastCalledWith(
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
		expect(
			getClientCollectionDocumentMock(client.client, postSchema.name),
		).toHaveBeenCalledOnce();
		expect(
			getClientCollectionDocumentMock(client.client, postSchema.name),
		).toHaveBeenCalledWith(
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
		expect(
			getClientCollectionDocumentMock(client.client, collectionSchema.name),
		).toHaveBeenCalledOnce();
		expect(
			getClientCollectionDocumentMock(client.client, collectionSchema.name),
		).toHaveBeenCalledWith(
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
		(window as { innerWidth: number }).innerWidth = 2000;

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
			const { getByTestId, getByText } = render(
				<SearchPage mockClient={client} />,
			);

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
			expect(
				getClientCollectionDocumentMock(client.client, postSchema.name),
			).toHaveBeenCalledOnce(),
		);

		await waitFor(() => expect(getByText("Ten blog post")).toBeInTheDocument());

		const searchInput = getByTestId("search-input");
		expect(searchInput).toHaveValue("blog");

		await user.type(searchInput, "other");
		await user.type(searchInput, "{enter}");

		await waitFor(() =>
			expect(
				getClientCollectionDocumentMock(client.client, postSchema.name),
			).toHaveBeenCalledTimes(2),
		);

		expect(
			getClientCollectionDocumentMock(client.client, postSchema.name),
		).toHaveBeenLastCalledWith(
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
			expect(
				getClientCollectionDocumentMock(client.client, collectionSchema.name),
			).toHaveBeenCalledWith(
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
			expect(
				getClientCollectionDocumentMock(client.client, collectionSchema.name),
			).toHaveBeenCalledWith(
				{
					q: "*",
					limit: MAX_COLLECTIONS_PER_PAGE,
					mode: "fulltext",
					offset: MAX_COLLECTIONS_PER_PAGE,
					sortBy: {
						property: "publishedTimestamp",
						order: "desc",
					},
					where: {
						authors: undefined,
						tags: undefined,
					},
					facets: expect.anything(),
				},
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
