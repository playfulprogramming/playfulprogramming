import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";

const WindowSize = () => {
	const [height, setHeight] = useState(window.innerHeight);
	const [width, setWidth] = useState(window.innerWidth);

	function resizeHandler() {
		setHeight(window.innerHeight);
		setWidth(window.innerWidth);
	}

	// This code doesn't work, we'll explain why soon
	return (
		<div onResize={resizeHandler}>
			<p>Height: {height}</p>
			<p>Width: {width}</p>
		</div>
	);
};

createRoot(document.getElementById("root")).render(<WindowSize />);
