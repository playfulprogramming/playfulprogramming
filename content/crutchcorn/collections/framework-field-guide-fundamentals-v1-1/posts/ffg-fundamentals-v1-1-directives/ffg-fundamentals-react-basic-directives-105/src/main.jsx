import { createRoot } from "react-dom/client";

const useStyleBackground = () => {
	const ref = (el) => {
		el.style.background = "red";
	};
	return { ref };
};

const App = () => {
	const { ref } = useStyleBackground();
	return <button ref={ref}>Hello, world</button>;
};

createRoot(document.getElementById("root")).render(<App />);
