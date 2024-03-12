import { createRoot } from "react-dom/client";
import { useState, useMemo, useEffect, useLayoutEffect } from "react";

const App = () => {
	// This will prevent rendering
	const stateVal = useState(() => {
		throw new Error("Error in state initialization function");
	});

	// This will also prevent rendering
	const memoVal = useMemo(() => {
		throw new Error("Error in memo");
	}, []);

	// Will this prevent rendering? You bet!
	useEffect(() => {
		throw new Error("Error in useEffect");
	});

	// Oh, and this will too.
	useLayoutEffect(() => {
		throw new Error("Error in useEffect");
	});

	return <p>Hello, world!</p>;
};

createRoot(document.getElementById("root")).render(<App />);
