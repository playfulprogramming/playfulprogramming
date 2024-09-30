import { createRoot } from "react-dom/client";
import { useState, useRef, useEffect } from "react";

const CountButton = () => {
	const [count, setCount] = useState(0);
	const buttonRef = useRef();

	useEffect(() => {
		const clickFn = () => {
			setCount((v) => v + 1);
		};

		buttonRef.current.addEventListener("click", clickFn);

		return () => {
			buttonRef.current.removeEventListener("click", clickFn);
		};
		// Do not use a useRef inside of a useEffect like this, it will likely cause bugs
	}, [buttonRef.current]);

	return (
		<>
			<button ref={buttonRef}>Add one</button>
			<p>Count is {count}</p>
		</>
	);
};

createRoot(document.getElementById("root")).render(<CountButton />);
