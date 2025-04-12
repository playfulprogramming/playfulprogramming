import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";

const useStyleBackground = (r, g, b) => {
	const ref = (el) => {
		el.style.background = `rgb(${r}, ${g}, ${b})`;
	};
	return { ref };
};

const App = () => {
	const { ref } = useStyleBackground(255, 174, 174);
	return <button ref={ref}>Hello, world</button>;
};

createRoot(document.getElementById("root")).render(<App />);
