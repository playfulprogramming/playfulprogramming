import { createRoot } from "react-dom/client";
import { useState } from "react";

const fakeNames = [
	"Gulgowski",
	"Johnston",
	"Nader",
	"Flatley",
	"Lemke",
	"Stokes",
	"Simonis",
	"Little",
	"Baumbach",
	"Spinka",
];

let id = 0;

function createPerson() {
	return {
		id: ++id,
		name: fakeNames[Math.floor(Math.random() * fakeNames.length)],
	};
}

export default function App() {
	const [list, setList] = useState([
		createPerson(),
		createPerson(),
		createPerson(),
	]);

	function addPersonToList() {
		const newList = [...list];
		// Insert new friend at random location
		newList.splice(
			Math.floor(Math.random() * newList.length),
			0,
			createPerson(),
		);
		setList(newList);
	}

	return (
		<div>
			<h1>My friends</h1>
			<button onClick={addPersonToList}>Add friend</button>
			<ul>
				{list.map((person) => (
					<li>
						<label>
							<div>{person.name} notes</div>
							<input />
						</label>
					</li>
				))}
			</ul>
		</div>
	);
}

createRoot(document.getElementById("root")).render(<App />);
