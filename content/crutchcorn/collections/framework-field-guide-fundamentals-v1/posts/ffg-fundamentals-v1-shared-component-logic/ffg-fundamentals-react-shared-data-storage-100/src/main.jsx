import { createRoot } from "react-dom/client";
import { useState } from "react";

const useWindowSize = () => {
	const [height, setHeight] = useState(window.innerHeight);
	const [width, setWidth] = useState(window.innerWidth);

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
