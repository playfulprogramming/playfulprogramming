import { createRoot } from "react-dom/client";

const ShowMessage = ({ children }) => {
	return children("Hello, world!");
};

const App = () => {
	return <ShowMessage>{(message) => <p>{message}</p>}</ShowMessage>;
};

createRoot(document.getElementById("root")).render(<App />);
