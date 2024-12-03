import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";

const Child = () => {
	// Pass a function that React will run for you
	useEffect(() => {
		console.log("I am rendering");
		// Pass an array of items to track changes of
	}, []);

	return <p>I am the child</p>;
};

const Parent = () => {
	const [showChild, setShowChild] = useState(true);
	return (
		<div>
			<button onClick={() => setShowChild(!showChild)}>Toggle Child</button>
			{showChild && <Child />}
		</div>
	);
};

createRoot(document.getElementById("root")).render(<Parent />);
