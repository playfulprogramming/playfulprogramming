import { vi, expect, test } from "ui-test-utils";
import { render } from "@testing-library/preact";
import { userEvent } from "@testing-library/user-event";
import { Pagination } from "./pagination";

const user = userEvent.setup();

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
	const softNavigate = vi.fn();
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

	expect(softNavigate).toHaveBeenCalledTimes(1);
	expect(softNavigate).toHaveBeenCalledWith(
		new URL("/1", window.location.href).toString(),
		1,
	);
});

test("when the next button is clicked, softNavigate is called for the next page", () => {
	const softNavigate = vi.fn();
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

	expect(softNavigate).toHaveBeenCalledTimes(1);
	expect(softNavigate).toHaveBeenCalledWith(
		new URL("/3", window.location.href).toString(),
		3,
	);
});

test("when a page button is clicked, softNavigate is called for its page", async () => {
	const softNavigate = vi.fn();
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
	await user.click(button5);

	expect(softNavigate).toHaveBeenCalledTimes(1);
	expect(softNavigate).toHaveBeenCalledWith(
		new URL("/5", window.location.href).toString(),
		5,
	);
});
