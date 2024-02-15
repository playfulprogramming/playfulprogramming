import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";
import { Children, useState } from "react";

const ParentList = ({ children }) => {
	const childArr = Children.toArray(children);
	console.log(childArr);
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
	const [list, setList] = useState([1, 42, 13]);
	const addOne = () => {
		// `Math` is built into the browser
		const randomNum = Math.floor(Math.random() * 100);
		setList([...list, randomNum]);
	};
	return (
		<>
			<ParentList>
				{list.map((item, i) => (
					<span key={i}>
						{i} {item}
					</span>
				))}
			</ParentList>
			<button onClick={addOne}>Add</button>
		</>
	);
};

createRoot(document.getElementById("root")).render(<App />);
