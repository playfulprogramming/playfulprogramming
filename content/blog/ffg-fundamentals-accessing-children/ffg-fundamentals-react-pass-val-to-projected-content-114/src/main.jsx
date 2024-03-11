import { createRoot } from "react-dom/client";
import { useState, Fragment } from "react";

const ParentList = ({ children, list }) => {
	return (
		<>
			<ul>
				{list.map((item, i) => {
					return (
						<Fragment key={item}>
							{children({
								backgroundColor: i % 2 ? "grey" : "",
								item,
								i,
							})}
						</Fragment>
					);
				})}
			</ul>
		</>
	);
};

const App = () => {
	const [list, setList] = useState([1, 42, 13]);

	const addOne = () => {
		const randomNum = Math.floor(Math.random() * 100);
		setList([...list, randomNum]);
	};

	return (
		<>
			<ParentList list={list}>
				{({ backgroundColor, i, item }) => (
					<li style={{ backgroundColor: backgroundColor }}>
						{i} {item}
					</li>
				)}
			</ParentList>
			<button onClick={addOne}>Add</button>
		</>
	);
};

createRoot(document.getElementById("root")).render(<App />);
