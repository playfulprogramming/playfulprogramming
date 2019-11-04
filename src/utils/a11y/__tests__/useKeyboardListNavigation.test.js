import { useKeyboardListNavigation } from "../useKeyboardListNavigation";
import React, { useRef, useState } from "react";
import { fireEvent, render } from "@testing-library/react";

test("useKeyboardListNavigation handles everything", async () => {
	const onSubmit = jest.fn();
	const TestEl = () => {
		const parRef = useRef();

		const valArr = [{ objNum: 1 }, { objNum: 2 }, { objNum: 3 }];

		const [enable, setEnable] = useState(true);

		const { focusedIndex, selectIndex } = useKeyboardListNavigation(
			parRef,
			valArr,
			enable,
			onSubmit
		);

		return (
			<>
				<div ref={parRef} data-testid={"parent"} />
				<input
					data-testid={"selectIndex"}
					onChange={({ target: { value } }) => {
						selectIndex(Number(value));
					}}
				/>
				<p>Focused Index: {focusedIndex}</p>
				<button data-testid={"enableBtn"} onClick={() => setEnable(!enable)} />
			</>
		);
	};

	const { findByText, findByTestId } = render(<TestEl />);

	expect(await findByText("Focused Index: 0")).toBeInTheDocument();

	const selectIndexEl = await findByTestId("selectIndex");
	const parentEl = await findByTestId("parent");
	const enableBtn = await findByTestId("enableBtn");

	// Set the value directly
	fireEvent.change(selectIndexEl, { target: { value: 2 } });
	expect(await findByText("Focused Index: 2")).toBeInTheDocument();

	// OnSubmit is being called properly
	expect(onSubmit.mock.calls.length).toBe(1);
	expect(onSubmit).lastCalledWith(undefined, 0, 2);

	// Should normalize a value that's too low
	fireEvent.change(selectIndexEl, { target: { value: -1 } });
	expect(await findByText("Focused Index: 0")).toBeInTheDocument();

	// Should normalize a value that's too high
	fireEvent.change(selectIndexEl, { target: { value: 3 } });
	expect(await findByText("Focused Index: 2")).toBeInTheDocument();

	// Arrow up works
	fireEvent.keyDown(parentEl, { key: "ArrowUp" });
	expect(await findByText("Focused Index: 1")).toBeInTheDocument();

	// Home should go to zero
	fireEvent.keyDown(parentEl, { key: "Home" });
	expect(await findByText("Focused Index: 0")).toBeInTheDocument();

	// Should normalize a value that's too low
	fireEvent.keyDown(parentEl, { key: "ArrowUp" });
	expect(await findByText("Focused Index: 0")).toBeInTheDocument();

	// End should go to zero
	fireEvent.keyDown(parentEl, { key: "End" });
	expect(await findByText("Focused Index: 2")).toBeInTheDocument();

	// Key down should work
	fireEvent.keyDown(parentEl, { key: "ArrowDown" });
	expect(await findByText("Focused Index: 2")).toBeInTheDocument();

	// Should normalize a value that's too high
	fireEvent.keyDown(parentEl, { key: "ArrowDown" });
	expect(await findByText("Focused Index: 2")).toBeInTheDocument();

	// Disable should work
	fireEvent.click(enableBtn);
	fireEvent.keyDown(parentEl, { key: "ArrowUp" });
	expect(await findByText("Focused Index: 2")).toBeInTheDocument();

	// OnSubmit is being called properly
	expect(onSubmit).lastCalledWith(expect.any(Object), 2, 2);
});
