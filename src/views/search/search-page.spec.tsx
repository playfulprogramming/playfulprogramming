import { fireEvent, render, waitFor } from "@testing-library/preact";
import SearchPage, { ServerReturnType } from "./search-page";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { MockPost } from "../../../__mocks__/data/mock-post";
import userEvent from "@testing-library/user-event";
import { MockCollection } from "../../../__mocks__/data/mock-collection";

const user = userEvent.setup();

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

afterEach(() => server.resetHandlers());

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
		await waitFor(() => expect(getByTestId("articles-header")).toBeInTheDocument());
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
		await waitFor(() => expect(getByTestId("collections-header")).toBeInTheDocument());
		expect(queryByTestId("articles-header")).not.toBeInTheDocument();
	});

	test.todo("Filter by tag works");
	test.todo("Filter by content type");
	test.todo("Sort by date works");
	test.todo("Filter by author works");

	// Changing pages to page 2 shows second page of results
	test.todo("Pagination works");

	// Search page, sort order, etc
	test.todo("Make sure that initial search props are not thrown away");
});
