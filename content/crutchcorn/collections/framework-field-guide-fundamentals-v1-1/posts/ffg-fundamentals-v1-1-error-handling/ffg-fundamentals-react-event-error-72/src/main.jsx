import { createRoot } from "react-dom/client";

const EventErrorThrowingComponent = () => {
	const onClick = () => {
		throw new Error("Error");
	};

	return <button onClick={onClick}>Click me</button>;
};

const App = () => {
	return <EventErrorThrowingComponent />;
};

createRoot(document.getElementById("root")).render(<App />);
