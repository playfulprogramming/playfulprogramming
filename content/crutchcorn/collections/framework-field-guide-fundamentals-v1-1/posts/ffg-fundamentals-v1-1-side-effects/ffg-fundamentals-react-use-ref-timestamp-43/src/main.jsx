import { createRoot } from "react-dom/client";
import { useRef, useEffect } from "react";

const Comp = () => {
	const ref = useRef();

	useEffect(() => {
		ref.current = Date.now();
	});

	// First render won't have `ref.current` set
	return <p>The current timestamp is: {ref.current}</p>;
};

createRoot(document.getElementById("root")).render(<Comp />);
