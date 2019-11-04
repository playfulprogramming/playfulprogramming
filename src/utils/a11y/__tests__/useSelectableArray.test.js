import React, {
	createRef,
	forwardRef,
	useImperativeHandle,
	useMemo
} from "react";
import { render } from "@testing-library/react";
import { useSelectableArray } from "../useSelectableArray";
import { act } from "react-dom/test-utils";

test("useSelectableArray handles everything", async () => {
	const runAfterSelectChange = jest.fn();
	const TestEl = forwardRef(() => {
		const valArr = useMemo(
			() => [{ objNum: 1 }, { objNum: 2 }, { objNum: 3 }],
			[]
		);

		const { selectAll, markAsSelected, internalArr } = useSelectableArray(
			valArr,
			runAfterSelectChange
		);

		// Because this logic does not rely on the DOM, we'll end up utilizing
		// the ref forward helper to allow us to utilize testing helpers for arrays
		useImperativeHandle(ref, () => ({
			internalArr,
			selectAll,
			markAsSelected
		}));

		return <div ref={ref} />;
	});

	const ref = createRef();

	const initialExpectedVal = [
		{ id: 1, val: { objNum: 1 }, index: 0, selected: false },
		{ id: 2, val: { objNum: 2 }, index: 1, selected: false },
		{ id: 3, val: { objNum: 3 }, index: 2, selected: false }
	];

	render(<TestEl ref={ref} />);

	const { internalArr, selectAll, markAsSelected } = ref.current;

	// Initial value works as expected
	expect(internalArr).toStrictEqual(initialExpectedVal);

	// Mark as selected is called proper
	markAsSelected(1, 2);
	initialExpectedVal[1].selected = true;
	initialExpectedVal[2].selected = true;
	expect(internalArr).toStrictEqual(initialExpectedVal);

	// Make sure this function works
	expect(runAfterSelectChange.mock.calls.length).toBe(1);
	expect(runAfterSelectChange).lastCalledWith();

	// Doing so again will not mark as false
	markAsSelected(1, 2);
	expect(internalArr).toStrictEqual(initialExpectedVal);

	// Selecting single items works and sets to false
	markAsSelected(1, 1);
	markAsSelected(2, 2);
	initialExpectedVal[1].selected = false;
	initialExpectedVal[2].selected = false;
	expect(internalArr).toStrictEqual(initialExpectedVal);

	// Can handle being called in the wrong order
	markAsSelected(2, 1);
	initialExpectedVal[1].selected = true;
	initialExpectedVal[2].selected = true;
	expect(internalArr).toStrictEqual(initialExpectedVal);

	// Select all works
	act(() => selectAll(internalArr));
	initialExpectedVal[0].selected = true;
	// Make sure this function works
	expect(runAfterSelectChange.mock.calls.length).toBe(6);
	expect(internalArr).toStrictEqual(initialExpectedVal);
});
