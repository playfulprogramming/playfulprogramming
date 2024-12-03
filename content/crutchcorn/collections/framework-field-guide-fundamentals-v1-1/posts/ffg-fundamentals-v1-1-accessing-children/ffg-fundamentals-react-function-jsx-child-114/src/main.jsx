import { createRoot } from "react-dom/client";

const ShowMessage = ({ children }) => {
	return children();
};

const App = () => {
	return <ShowMessage>{() => <p>Hello, world!</p>}</ShowMessage>;
};

createRoot(document.getElementById("root")).render(<App />);
