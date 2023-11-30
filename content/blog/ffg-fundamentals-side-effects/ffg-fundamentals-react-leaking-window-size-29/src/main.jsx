import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";

const WindowSize = () => {
	const [height, setHeight] = useState(window.innerHeight);
	const [width, setWidth] = useState(window.innerWidth);

	useEffect(() => {
		function resizeHandler() {
			setHeight(window.innerHeight);
			setWidth(window.innerWidth);
		}

		// This code will cause a memory leak, more on that soon
		window.addEventListener("resize", resizeHandler);
	}, []);

	return (
		<div>
			<p>Height: {height}</p>
			<p>Width: {width}</p>
		</div>
	);
};

createRoot(document.getElementById("root")).render(<WindowSize />);
