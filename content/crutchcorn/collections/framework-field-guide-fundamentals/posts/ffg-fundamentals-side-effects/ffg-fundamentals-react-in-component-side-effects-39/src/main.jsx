import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";

const App = () => {
	const [title, setTitle] = useState("Movies");

	useEffect(() => {
		document.title = title;

		// Adding an alert so that it's easier to see when the effect runs
		alert(`The title is now ${document.title}`);

		// Ask React to only run this `useEffect` if `title` has changed
	}, [title]);

	return (
		<div>
			<button onClick={() => setTitle("Movies")}>Movies</button>
			<button onClick={() => setTitle("Music")}>Music</button>
			<button onClick={() => setTitle("Documents")}>Documents</button>
			<p>{title}</p>
		</div>
	);
};

createRoot(document.getElementById("root")).render(<App />);
