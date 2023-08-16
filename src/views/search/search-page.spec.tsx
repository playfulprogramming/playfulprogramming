/* eslint-disable no-var */
import {
	fireEvent,
	findByText as findByTextFrom,
	render,
	waitFor,
	cleanup,
} from "@testing-library/preact";
import SearchPage, { ServerReturnType } from "./search-page";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { MockCanonicalPost, MockPost } from "../../../__mocks__/data/mock-post";
import userEvent from "@testing-library/user-event";
import { MockCollection } from "../../../__mocks__/data/mock-collection";
import {
	MockUnicorn,
	MockUnicornTwo,
} from "../../../__mocks__/data/mock-unicorn";

const user = userEvent.setup();

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

afterEach(() => server.resetHandlers());

beforeEach(() => {
	cleanup();
	// Reset URL after each test
	window.history.replaceState({}, "", window.location.pathname);
});

afterAll(() => server.close());

function mockFetch(fn: (searchStr: string) => ServerReturnType) {
	server.use(
		rest.get<ServerReturnType>(`/api/search`, async (req, res, ctx) => {
			const searchString = req.url.searchParams.get("query");
			return res(ctx.json(fn(searchString)));
		}),
	);
}

function mockFetchWithStatus(
	status: number,
	fn: (searchStr: string) => unknown,
) {
	server.use(
		rest.get<never>(`/api/search`, async (req, res, ctx) => {
			const searchString = req.url.searchParams.get("query");
			return res(ctx.status(status), ctx.json(fn(searchString)));
		}),
	);
}

describe("Search page", () => {
	test("Should show initial results", () => {
		const { getByText } = render(<SearchPage unicornProfilePicMap={[]} />);

		expect(getByText("What would you like to find?")).toBeInTheDocument();
	});

	test("Should show search results for posts", async () => {
		mockFetch(() => ({
			posts: [MockPost],
			totalPosts: 1,
			totalCollections: 0,
			collections: [],
		}));

		const { getByText, getByLabelText } = render(
			<SearchPage unicornProfilePicMap={[]} />,
		);
		const searchInput = getByLabelText("Search");
		await user.type(searchInput, MockPost.title);
		await user.type(searchInput, "{enter}");
		await waitFor(() => expect(getByText(MockPost.title)).toBeInTheDocument());
	});

	test("Should show search results for collections", async () => {
		mockFetch(() => ({
			posts: [],
			totalPosts: 0,
			totalCollections: 1,
			collections: [MockCollection],
		}));

		const { getByText, getByLabelText } = render(
			<SearchPage unicornProfilePicMap={[]} />,
		);
		const searchInput = getByLabelText("Search");
		await user.type(searchInput, MockCollection.title);
		await user.type(searchInput, "{enter}");
		await waitFor(() =>
			expect(getByText(MockCollection.title)).toBeInTheDocument(),
		);
	});

	test("Should show error screen when 500", async () => {
		mockFetchWithStatus(500, () => ({
			error: "There was an error fetching your search results.",
		}));
		const { getByText, getByLabelText } = render(
			<SearchPage unicornProfilePicMap={[]} />,
		);
		const searchInput = getByLabelText("Search");
		await user.type(searchInput, MockPost.title);
		await user.type(searchInput, "{enter}");
		await waitFor(() =>
			expect(
				getByText("There was an error fetching your search results."),
			).toBeInTheDocument(),
		);
	});

	test("Should show 'nothing found'", async () => {
		mockFetch(() => ({
			posts: [],
			totalPosts: 0,
			totalCollections: 0,
			collections: [],
		}));

		const { getByText, getByLabelText } = render(
			<SearchPage unicornProfilePicMap={[]} />,
		);
		const searchInput = getByLabelText("Search");
		await user.type(searchInput, "Asdfasdfasdf");
		await user.type(searchInput, "{enter}");
		await waitFor(() =>
			expect(getByText("No results found...")).toBeInTheDocument(),
		);
	});

	test("Remove collections header when none found", async () => {
		mockFetch(() => ({
			posts: [MockPost],
			totalPosts: 1,
			totalCollections: 0,
			collections: [],
		}));

		const { getByTestId, queryByTestId, getByLabelText } = render(
			<SearchPage unicornProfilePicMap={[]} />,
		);
		const searchInput = getByLabelText("Search");
		await user.type(searchInput, MockPost.title);
		await user.type(searchInput, "{enter}");
		await waitFor(() =>
			expect(getByTestId("articles-header")).toBeInTheDocument(),
		);
		expect(queryByTestId("collections-header")).not.toBeInTheDocument();
	});

	test("Remove posts header when none found", async () => {
		mockFetch(() => ({
			posts: [],
			totalPosts: 0,
			totalCollections: 1,
			collections: [MockCollection],
		}));

		const { getByTestId, queryByTestId, getByLabelText } = render(
			<SearchPage unicornProfilePicMap={[]} />,
		);
		const searchInput = getByLabelText("Search");
		await user.type(searchInput, MockCollection.title);
		await user.type(searchInput, "{enter}");
		await waitFor(() =>
			expect(getByTestId("collections-header")).toBeInTheDocument(),
		);
		expect(queryByTestId("articles-header")).not.toBeInTheDocument();
	});

	test("Filter by tag works on desktop sidebar", async () => {
		mockFetch(() => ({
			posts: [
				{ ...MockPost, tags: ["Angular"], title: "One blog post" },
				{ ...MockCanonicalPost, tags: [], title: "Two blog post" },
			],
			totalPosts: 2,
			totalCollections: 0,
			collections: [],
		}));

		const { getByTestId, queryByTestId, getByText, getByLabelText } = render(
			<SearchPage unicornProfilePicMap={[]} />,
		);

		const searchInput = getByLabelText("Search");
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
		mockFetch(() => ({
			posts: [
				{
					...MockPost,
					authors: [MockUnicorn.id],
					authorsMeta: [MockUnicorn],
					title: "One blog post",
				},
				{
					...MockCanonicalPost,
					authors: [MockUnicornTwo.id],
					authorsMeta: [MockUnicornTwo],
					title: "Two blog post",
				},
			],
			totalPosts: 2,
			totalCollections: 0,
			collections: [],
		}));

		const { getByTestId, getByText, getByLabelText, queryByTestId, debug } =
			render(<SearchPage unicornProfilePicMap={[]} />);

		const searchInput = getByLabelText("Search");
		await user.type(searchInput, "*");
		await user.type(searchInput, "{enter}");

		debug();

		await waitFor(() => expect(getByText("One blog post")).toBeInTheDocument());
		await waitFor(() => expect(getByText("Two blog post")).toBeInTheDocument());

		const container = getByTestId("author-filter-section-sidebar");

		const author = await findByTextFrom(container, MockUnicorn.name);

		await user.click(author);
		await waitFor(() => expect(getByText("One blog post")).toBeInTheDocument());
		expect(queryByTestId("Two blog post")).not.toBeInTheDocument();
	});

	test.todo("Filter by content type work on radio group buttons");
	test.todo("Sort by date works on desktop radio group buttons");

	// Changing pages to page 2 shows second page of results
	test.todo("Pagination works");

	// Search page, sort order, etc
	test.todo("Make sure that initial search props are not thrown away");

	test("Make sure that complete re-renders preserve tags, authors, etc", async () => {
		mockFetch(() => ({
			posts: [
				{
					...MockPost,
					tags: ["Angular"],
					authors: [MockUnicorn.id],
					authorsMeta: [MockUnicorn],
					title: "One blog post",
				},
				{
					...MockCanonicalPost,
					tags: [],
					authors: [MockUnicornTwo.id],
					authorsMeta: [MockUnicornTwo],
					title: "Two blog post",
				},
			],
			totalPosts: 2,
			totalCollections: 0,
			collections: [],
		}));

		var { getByTestId, getByText, getByLabelText } = render(
			<SearchPage unicornProfilePicMap={[]} />,
		);

		var searchInput = getByLabelText("Search");
		await user.type(searchInput, "*");
		await user.type(searchInput, "{enter}");

		await waitFor(() => expect(getByText("One blog post")).toBeInTheDocument());
		await waitFor(() => expect(getByText("Two blog post")).toBeInTheDocument());

		var tagContainer = getByTestId("tag-filter-section-sidebar");

		const tag = await findByTextFrom(tagContainer, "Angular");

		await user.click(tag);

		var authorContainer = getByTestId("author-filter-section-sidebar");

		const author = await findByTextFrom(authorContainer, MockUnicorn.name);

		await user.click(author);

		await waitFor(() => expect(getByText("One blog post")).toBeInTheDocument());

		cleanup();

		// Re-render
		var { getByTestId, getByText, getByLabelText } = render(
			<SearchPage unicornProfilePicMap={[]} />,
		);

		var searchInput = getByLabelText("Search");
		await user.type(searchInput, "*");
		await user.type(searchInput, "{enter}");

		var tagContainer = getByTestId("tag-filter-section-sidebar");
		var authorContainer = getByTestId("author-filter-section-sidebar");

		expect(await findByTextFrom(tagContainer, "Angular")).toBeInTheDocument();
		expect(await findByTextFrom(authorContainer, MockUnicorn.name)).toBeInTheDocument();
	});

	test.todo(
		"Make sure that re-searches reset page to 1 and preserve tags, authors, etc",
	);
	test.todo(
		"Make sure that re-searches to empty string reset page, tags, authors, etc",
	);
});
