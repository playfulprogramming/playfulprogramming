import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";

function App() {
	const [count, setCount] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			console.log("Count is: " + count);
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div>
			{count}
			<button onClick={() => setCount(count + 1)}>Add</button>
		</div>
	);
}

createRoot(document.getElementById("root")).render(<App />);
