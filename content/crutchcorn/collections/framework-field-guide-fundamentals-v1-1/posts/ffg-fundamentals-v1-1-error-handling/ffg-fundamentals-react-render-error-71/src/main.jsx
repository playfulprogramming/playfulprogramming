import { createRoot } from "react-dom/client";

const ErrorThrowingComponent = () => {
	throw new Error("Error");

	return <p>Hello, world!</p>;
};

const App = () => {
	return <ErrorThrowingComponent />;
};

createRoot(document.getElementById("root")).render(<App />);
