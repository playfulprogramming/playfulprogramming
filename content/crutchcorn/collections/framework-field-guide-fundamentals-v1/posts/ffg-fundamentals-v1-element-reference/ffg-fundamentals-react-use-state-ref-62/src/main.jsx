import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";

const CountButton = () => {
	const [count, setCount] = useState(0);
	const [buttonEl, setButtonEl] = useState();

	const storeButton = (el) => {
		setButtonEl(el);
	};

	useEffect(() => {
		// Initial render will not have `buttonEl` defined, subsequent renders will
		if (!buttonEl) return;
		const clickFn = () => {
			/**
			 * We need to use `v => v + 1` instead of `count + 1`, otherwise `count` will
			 * be stale and not update further than `1`. More details in the next paragraph.
			 */
			setCount((v) => v + 1);
		};

		buttonEl.addEventListener("click", clickFn);

		return () => {
			buttonEl.removeEventListener("click", clickFn);
		};
	}, [buttonEl]);

	return (
		<>
			<button ref={storeButton}>Add one</button>
			<p>Count is {count}</p>
		</>
	);
};

createRoot(document.getElementById("root")).render(<CountButton />);
