import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";
import { Children } from "react";

const ParentList = ({ children }) => {
	const childArr = Children.toArray(children);
	console.log(childArr); // This is an array of ReactNode - more on that in the next sentence
	return (
		<>
			<p>There are {childArr.length} number of items in this array</p>
			<ul>{children}</ul>
		</>
	);
};

const App = () => {
	return (
		<ParentList>
			<li>Item 1</li>
			<li>Item 2</li>
			<li>Item 3</li>
		</ParentList>
	);
};

createRoot(document.getElementById("root")).render(<App />);
