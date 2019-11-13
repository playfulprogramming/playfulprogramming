import React, { useRef, useState } from "react";
import { useUsedKeyboardLast } from "../useUsedKeyboardLast";
import { fireEvent, render } from "@testing-library/react";

test("useKeyboardListNavigation handles everything", async () => {
	const TestEl = () => {
		const parRef = useRef();

		const [enable, setEnable] = useState(true);

		const { usedKeyboardLast, resetLastUsedKeyboard } = useUsedKeyboardLast(
			parRef,
			true
		);

		return (
			<>
				<div data-testid={"parent"} ref={parRef} />
				<p>Used keyboard last: {String(usedKeyboardLast)}</p>
				<button data-testid={"enableBtn"} onClick={() => setEnable(!enable)} />
				<button
					data-testid={"resetLastUsedKeyboard"}
					onClick={() => resetLastUsedKeyboard()}
				/>
			</>
		);
	};

	const { findByText, findByTestId } = render(<TestEl />);

	expect(await findByText("Used keyboard last: false")).toBeInTheDocument();

	const parentEl = await findByTestId("parent");
	const resetBtnEl = await findByTestId("resetLastUsedKeyboard");

	// Set the value directly
	fireEvent.click(parentEl);
	expect(await findByText("Used keyboard last: false")).toBeInTheDocument();

	// OnSubmit is being called properly
	fireEvent.keyDown(parentEl, { key: "ArrowUp" });
	expect(await findByText("Used keyboard last: true")).toBeInTheDocument();

	// Should normalize a value that's too low
	fireEvent.click(resetBtnEl);
	expect(await findByText("Used keyboard last: false")).toBeInTheDocument();
});
