import { createRoot } from "react-dom/client";
import { useState } from "react";

const App = () => {
	const [count, setCount] = useState(0);

	return (
		<div>
			<button onClick={() => setCount(count + 1)}>Add one to: {count}</button>
			<button onClick={() => setCount(count - 1)}>
				Remove one from: {count}
			</button>
			<ul>
				{Array.from({ length: count }).map((_, i) => (
					<li>List item {i}</li>
				))}
			</ul>
		</div>
	);
};

createRoot(document.getElementById("root")).render(<App />);
