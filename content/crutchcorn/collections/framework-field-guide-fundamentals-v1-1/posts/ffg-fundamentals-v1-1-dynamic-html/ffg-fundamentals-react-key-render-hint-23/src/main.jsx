import { createRoot } from "react-dom/client";
import { useState } from "react";

function KeyExample() {
	const [num, setNum] = useState(0);
	const increase = () => setNum(num + 1);
	return (
		<div>
			<input key={num} />
			<button onClick={increase}>Increase</button>
			<p>{num}</p>
		</div>
	);
}

createRoot(document.getElementById("root")).render(<KeyExample />);
