import { createRoot } from "react-dom/client";
import { useRef, useState, useEffect } from "react";

const Comp = () => {
	// Set initial value for first render
	const ref = useRef(Date.now());

	// We're not using the `_` value, just the `set` method to force a re-render
	const [_, setForceRenderNum] = useState(0);

	useEffect(() => {
		ref.current = Date.now();
	});

	return (
		<div>
			{/* This value will only update when you press "check timestamp" */}
			<p>The current timestamp is: {ref.current}</p>
			<button onClick={() => setForceRenderNum((v) => v + 1)}>
				Check timestamp
			</button>
		</div>
	);
};

createRoot(document.getElementById("root")).render(<Comp />);
