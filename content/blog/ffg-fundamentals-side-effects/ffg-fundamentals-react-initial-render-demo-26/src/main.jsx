import { createRoot } from "react-dom/client";
import { useState } from "react";

const Child = () => {
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
