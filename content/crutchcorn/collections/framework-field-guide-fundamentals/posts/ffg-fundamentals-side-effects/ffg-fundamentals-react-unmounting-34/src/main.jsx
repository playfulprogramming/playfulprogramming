import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";

const Cleanup = () => {
	useEffect(() => {
		return () => {
			alert("I am cleaning up");
		};
	}, []);

	return <p>Unmount me to see an alert</p>;
};

const App = () => {
	const [show, setShow] = useState(true);

	return (
		<div>
			<button onClick={() => setShow(!show)}>Toggle</button>
			{show && <Cleanup />}
		</div>
	);
};

createRoot(document.getElementById("root")).render(<App />);
