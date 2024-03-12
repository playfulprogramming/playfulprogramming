import { createRoot } from "react-dom/client";

const App = () => {
	const items = [
		{ id: 1, name: "Take out the trash", priority: 1 },
		{ id: 2, name: "Cook dinner", priority: 1 },
		{ id: 3, name: "Play video games", priority: 2 },
	];

	const priorityItems = items.filter((item) => item.item.priority === 1);

	return (
		<>
			<h1>To-do items</h1>
			<ul>
				{priorityItems.map((item) => (
					<li key={item.id}>{item.name}</li>
				))}
			</ul>
		</>
	);
};

createRoot(document.getElementById("root")).render(<App />);
