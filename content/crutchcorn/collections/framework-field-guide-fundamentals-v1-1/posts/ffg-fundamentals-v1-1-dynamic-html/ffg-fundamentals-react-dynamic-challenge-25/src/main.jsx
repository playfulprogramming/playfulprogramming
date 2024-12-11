import { createRoot } from "react-dom/client";
import { useState } from "react";

const ExpandableDropdown = ({ name, expanded, onToggle }) => {
	return (
		<div>
			<button onClick={onToggle}>
				{expanded ? "V " : "> "}
				{name}
			</button>
			{expanded && <div>More information here</div>}
		</div>
	);
};

const categories = [
	"Movies",
	"Pictures",
	"Concepts",
	"Articles I'll Never Finish",
	"Website Redesigns v5",
	"Invoices",
];

const Sidebar = () => {
	const [expandedMap, setExpandedMap] = useState(objFromCategories(categories));

	const onToggle = (cat) => {
		const newExpandedMap = { ...expandedMap };
		newExpandedMap[cat] = !newExpandedMap[cat];
		setExpandedMap(newExpandedMap);
	};

	return (
		<div>
			<h1>My Files</h1>
			{categories.map((cat) => (
				<ExpandableDropdown
					key={cat}
					name={cat}
					expanded={expandedMap[cat]}
					onToggle={() => onToggle(cat)}
				/>
			))}
		</div>
	);
};

function objFromCategories(categories) {
	let obj = {};
	for (let cat of categories) {
		obj[cat] = false;
	}
	return obj;
}

createRoot(document.getElementById("root")).render(<Sidebar />);
