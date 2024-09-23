import { createRoot } from "react-dom/client";

const AddTwo = ({ children }) => {
	return 2 + children;
};
// This will display "7"
const App = () => {
	return <AddTwo children={5} />;
};

createRoot(document.getElementById("root")).render(<App />);
