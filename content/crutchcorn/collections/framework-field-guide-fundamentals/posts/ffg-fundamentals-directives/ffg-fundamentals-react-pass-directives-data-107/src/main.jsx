import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";

const useStyleBackground = (color) => {
	const ref = (el) => {
		el.style.background = color;
	};
	return { ref };
};

const App = () => {
	const { ref } = useStyleBackground("#FFAEAE");
	return <button ref={ref}>Hello, world</button>;
};

createRoot(document.getElementById("root")).render(<App />);
