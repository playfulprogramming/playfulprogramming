import { render, waitFor } from "@testing-library/preact";
import { PaginationMenuAndPopover } from "./pagination-popover";

test("when the menu button is clicked, the menu popup is opened", async () => {
	const { getByTestId, findAllByTestId } = render(
		<PaginationMenuAndPopover
			page={{
				currentPage: 2,
				lastPage: 11,
			}}
		/>,
	);

	// click the "..." menu
	getByTestId("pagination-menu").click();

	// expect the pagination-popup to be added to the page
	const popup = await findAllByTestId("pagination-popup");
	expect(popup).toHaveLength(1);
	expect(popup[0]).toBeInTheDocument();
});

test("when '+' is clicked, the page number is incremented", async () => {
	const { getByTestId } = render(
		<PaginationMenuAndPopover
			page={{
				currentPage: 2,
				lastPage: 11,
			}}
		/>,
	);

	// click the "..." menu
	getByTestId("pagination-menu").click();
	// wait for the pagination-popup to be added to the page
	await waitFor(() => getByTestId("pagination-popup"));

	// expect the input to contain "2"
	expect(getByTestId("pagination-popup-input")).toHaveValue(2);

	// click the '+' button
	getByTestId("pagination-popup-increment").click();

	await waitFor(() => {
		// expect the input to contain "3"
		expect(getByTestId("pagination-popup-input")).toHaveValue(3);
	});
});

test("when '-' is clicked, the page number is decremented", async () => {
	const { getByTestId } = render(
		<PaginationMenuAndPopover
			page={{
				currentPage: 2,
				lastPage: 11,
			}}
		/>,
	);

	// click the "..." menu
	getByTestId("pagination-menu").click();
	// wait for the pagination-popup to be added to the page
	await waitFor(() => getByTestId("pagination-popup"));

	// expect the input to contain "2"
	expect(getByTestId("pagination-popup-input")).toHaveValue(2);

	// click the '-' button
	getByTestId("pagination-popup-decrement").click();

	await waitFor(() => {
		// expect the input to contain "1"
		expect(getByTestId("pagination-popup-input")).toHaveValue(1);
	});
});

test("when 'Go to page' is clicked, softNavigate is invoked with the input page number", async () => {
	const softNavigate = jest.fn();
	const { getByTestId } = render(
		<PaginationMenuAndPopover
			page={{
				currentPage: 2,
				lastPage: 11,
			}}
			getPageHref={(pageNum: number) => `./${pageNum}`}
			softNavigate={softNavigate}
		/>,
	);

	// click the "..." menu
	getByTestId("pagination-menu").click();
	// wait for the pagination-popup to be added to the page
	await waitFor(() => getByTestId("pagination-popup"));

	// expect the input to contain "2"
	expect(getByTestId("pagination-popup-input")).toHaveValue(2);

	// click the '+' button
	getByTestId("pagination-popup-increment").click();

	await waitFor(() => {
		// expect the input to contain "3"
		expect(getByTestId("pagination-popup-input")).toHaveValue(3);
	});

	// click the 'Go to page' button
	getByTestId("pagination-popup-submit").click();

	await waitFor(() => {
		expect(softNavigate).toBeCalledTimes(1);
		expect(softNavigate).toBeCalledWith("./3", 3);
	});
});
