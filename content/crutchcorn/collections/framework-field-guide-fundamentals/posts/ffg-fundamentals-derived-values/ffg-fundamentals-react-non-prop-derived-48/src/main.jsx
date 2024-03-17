import { createRoot } from "react-dom/client";
import { useState, useMemo } from "react";

const CountAndDoubleComp = () => {
	const [number, setNumber] = useState(0);
	const doubleNum = useMemo(() => number * 2, [number]);

	return (
		<div>
			<p>{number}</p>
			<p>{doubleNum}</p>
			<button onClick={() => setNumber(number + 2)}>Add one</button>
		</div>
	);
};

createRoot(document.getElementById("root")).render(<CountAndDoubleComp />);
