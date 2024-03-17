import { createRoot } from "react-dom/client";

const useLogElement = () => {
	const ref = (el) => console.log(el);
	return { ref };
};

const App = () => {
	const { ref } = useLogElement();
	return <p ref={ref}>Hello, world</p>;
};

createRoot(document.getElementById("root")).render(<App />);
