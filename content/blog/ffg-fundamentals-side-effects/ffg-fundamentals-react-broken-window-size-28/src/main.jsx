import { createRoot } from "react-dom/client";
import { useState } from "react";

const WindowSize = () => {
	const [height, setHeight] = useState(window.innerHeight);
	const [width, setWidth] = useState(window.innerWidth);

	return (
		<div>
			<p>Height: {height}</p>
			<p>Width: {width}</p>
		</div>
	);
};

createRoot(document.getElementById("root")).render(<WindowSize />);
