import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";
import { Children } from "react";

const ParentList = ({ children }) => {
	const childArr = Children.toArray(children);
	console.log(childArr); // This is an array of ReactNode - more on that in the next sentence
	return (
		<>
			<p>There are {childArr.length} number of items in this array</p>
			<ul>
				{children.map((child) => {
					return <li>{child}</li>;
				})}
			</ul>
		</>
	);
};

const App = () => {
	return (
		<ParentList>
			<span style={{ color: "red" }}>Red</span>
			<span style={{ color: "green" }}>Green</span>
			<span style={{ color: "blue" }}>Blue</span>
		</ParentList>
	);
};

createRoot(document.getElementById("root")).render(<App />);
