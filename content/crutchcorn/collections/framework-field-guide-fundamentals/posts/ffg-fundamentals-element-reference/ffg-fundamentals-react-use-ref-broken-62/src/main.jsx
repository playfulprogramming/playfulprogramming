import { createRoot } from "react-dom/client";
import { useState, useRef, useEffect } from "react";

// This code intentionally doesn't work to demonstrate how `useRef`
//  might not work with `useEffect` as you might think
const CountButton = () => {
	const [count, setCount] = useState(0);
	const buttonRef = useRef();

	const [showButton, setShowButton] = useState(false);

	useEffect(() => {
		const interval = setInterval(() => {
			setShowButton(true);
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const clickFn = () => {
			setCount((v) => v + 1);
		};

		if (!buttonRef.current) return;
		buttonRef.current.addEventListener("click", clickFn);

		return () => {
			buttonRef.current.removeEventListener("click", clickFn);
		};
	}, [buttonRef.current]);

	return (
		<>
			{showButton && <button ref={buttonRef}>Add one</button>}
			<p>Count is {count}</p>
		</>
	);
};

createRoot(document.getElementById("root")).render(<CountButton />);
