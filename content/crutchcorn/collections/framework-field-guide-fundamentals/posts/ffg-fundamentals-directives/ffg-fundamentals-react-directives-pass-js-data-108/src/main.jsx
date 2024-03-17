import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";

class Color {
	constructor(r, g, b) {
		this.r = r;
		this.g = g;
		this.b = b;
	}
}

const colorInstance = new Color(255, 174, 174);

const useStyleBackground = (color) => {
	const ref = (el) => {
		el.style.background = `rgb(${color.r}, ${color.g}, ${color.b})`;
	};
	return { ref };
};

const App = () => {
	const { ref } = useStyleBackground(colorInstance);
	return <button ref={ref}>Hello, world</button>;
};

createRoot(document.getElementById("root")).render(<App />);
