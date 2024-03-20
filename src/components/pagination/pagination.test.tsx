import { render } from "@testing-library/preact";
import { Pagination } from "./pagination";

test("Pagination renders", () => {
	const { baseElement, getByText } = render(
		<Pagination
			page={{
				currentPage: 3,
				lastPage: 8,
			}}
		/>,
	);

	expect(baseElement).toBeInTheDocument();
	expect(getByText("3")).toBeInTheDocument();
});

test("when there is only one page, nothing is rendered", () => {
	const { container } = render(
		<Pagination
			page={{
				currentPage: 1,
				lastPage: 1,
			}}
		/>,
	);

	expect(container.childNodes).toHaveLength(0);
});

test("when there is more than one page, the pages are rendered", () => {
	const { container, getByText } = render(
		<Pagination
			page={{
				currentPage: 1,
				lastPage: 2,
			}}
		/>,
	);

	expect(container.childNodes).not.toHaveLength(0);
	expect(getByText("1")).toBeInTheDocument();
	expect(getByText("2")).toBeInTheDocument();
});

test("when page 1 is selected, its button has the selected state", () => {
	const { getByText } = render(
		<Pagination
			page={{
				currentPage: 1,
				lastPage: 11,
			}}
		/>,
	);

	const button1 = getByText("1");
	expect(button1).toBeInTheDocument();
	expect(button1).toHaveAttribute("aria-current", "true");
});

test("when the previous button is clicked, softNavigate is called for the previous page", () => {
	const softNavigate = jest.fn();
	const { getByTestId } = render(
		<Pagination
			page={{
				currentPage: 2,
				lastPage: 11,
			}}
			softNavigate={softNavigate}
		/>,
	);

	const previous = getByTestId("pagination-previous");
	previous.click();

	expect(softNavigate).toBeCalledTimes(1);
	expect(softNavigate).toBeCalledWith("http://localhost/1", 1);
});

test("when the next button is clicked, softNavigate is called for the next page", () => {
	const softNavigate = jest.fn();
	const { getByTestId } = render(
		<Pagination
			page={{
				currentPage: 2,
				lastPage: 11,
			}}
			softNavigate={softNavigate}
		/>,
	);

	const next = getByTestId("pagination-next");
	next.click();

	expect(softNavigate).toBeCalledTimes(1);
	expect(softNavigate).toBeCalledWith("http://localhost/3", 3);
});

test("when a page button is clicked, softNavigate is called for its page", () => {
	const softNavigate = jest.fn();
	const { getByText } = render(
		<Pagination
			page={{
				currentPage: 2,
				lastPage: 11,
			}}
			softNavigate={softNavigate}
		/>,
	);

	const button5 = getByText("5");
	button5.click();

	expect(softNavigate).toBeCalledTimes(1);
	expect(softNavigate).toBeCalledWith("http://localhost/5", 5);
});
