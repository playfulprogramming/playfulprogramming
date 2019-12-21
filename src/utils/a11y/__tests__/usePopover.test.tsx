import { usePopover } from "../usePopover";
import React, { useRef } from "react";
import { fireEvent, render } from "@testing-library/react";

test("usePopover handles everything", async () => {
	const onBtnClick = jest.fn();
	const onBtnKeyDown = jest.fn();
	const TestEl = () => {
		const parRef = useRef();
		const popoverAreaRef = useRef();

		const { buttonProps, expanded, setExpanded } = usePopover(
			parRef,
			popoverAreaRef,
			onBtnClick,
			onBtnKeyDown
		);

		return (
			<>
				<div data-testid={"parent"} ref={parRef}>
					<button data-testid={"popover-btn"} {...buttonProps} />
					<div data-testid={"popover-area"} ref={popoverAreaRef} />
				</div>
				<div tabIndex={1} data-testid={"outside-div"} />
				<button
					data-testid={"toggle-expanded"}
					onClick={() => setExpanded(!expanded)}
				/>
				<p>Expanded: {String(expanded)}</p>
			</>
		);
	};

	const { findByText, findByTestId } = render(<TestEl />);

	// Initial state
	expect(await findByText("Expanded: false")).toBeInTheDocument();

	const parentEl = await findByTestId("parent");
	const popoverBtnEl = await findByTestId("popover-btn");
	const popoverAreaEl = await findByTestId("popover-area");
	const toggleExpanded = await findByTestId("toggle-expanded");
	const outsideEl = await findByTestId("outside-div");

	// Clicking works
	fireEvent.click(popoverBtnEl);
	expect(await findByText("Expanded: true")).toBeInTheDocument();

	// On BtnKeydown is called
	expect(onBtnClick.mock.calls.length).toBe(1);
	expect(onBtnClick).lastCalledWith(expect.anything(), true);

	// Outside click sets expanded to false
	fireEvent.mouseDown(outsideEl);
	expect(await findByText("Expanded: false")).toBeInTheDocument();

	// Enter opens popover
	fireEvent.keyDown(popoverBtnEl, { key: "Enter" });
	expect(await findByText("Expanded: true")).toBeInTheDocument();

	// On BtnKeydown is called
	expect(onBtnKeyDown.mock.calls.length).toBe(1);
	expect(onBtnKeyDown).lastCalledWith(expect.anything(), true);

	// Outside focus sets expanded to false
	fireEvent.focusIn(outsideEl);
	expect(await findByText("Expanded: false")).toBeInTheDocument();

	// Space opens popover
	fireEvent.keyDown(popoverBtnEl, { key: " " });
	expect(await findByText("Expanded: true")).toBeInTheDocument();
});
