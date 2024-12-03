import { createRoot } from "react-dom/client";
import { useState, useLayoutEffect } from "react";

function App() {
	const [num, setNum] = useState(10);

	const [bounding, setBounding] = useState({
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		height: 0,
	});

	// This runs before the DOM paints
	useLayoutEffect(() => {
		// This should be using a `ref`. More on that in a future chapter
		const el = document.querySelector("#number");
		const b = el?.getBoundingClientRect();
		setBounding(b);
	}, [num]);

	return (
		<div>
			<input
				type="number"
				value={num}
				onChange={(e) => setNum(e.target.valueAsNumber || "0")}
			/>
			<div style={{ display: "flex", justifyContent: "flex-end" }}>
				<h1 id="number" style={{ display: "inline-block" }}>
					{num}
				</h1>
			</div>
			<h1
				style={{
					position: "absolute",
					left: bounding.left,
					top: bounding.top + bounding.height,
				}}
			>
				^
			</h1>
		</div>
	);
}

createRoot(document.getElementById("root")).render(<App />);
