import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";

const useWindowSize = () => {
	const [height, setHeight] = useState(window.innerHeight);
	const [width, setWidth] = useState(window.innerWidth);

	useEffect(() => {
		function onResize() {
			setHeight(window.innerHeight);
			setWidth(window.innerWidth);
		}

		window.addEventListener("resize", onResize);

		// Don't forget to cleanup the listener
		return () => window.removeEventListener("resize", onResize);
	}, []);

	return { height, width };
};

const App = () => {
	const { height, width } = useWindowSize();

	return (
		<p>
			The window is {height}px high and {width}px wide
		</p>
	);
};

createRoot(document.getElementById("root")).render(<App />);
