import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";

const Alert = ({ alert }) => {
	useEffect(() => {
		setTimeout(() => {
			alert();
		}, 1000);
	});

	return <p>Showing alert...</p>;
};
const App = () => {
	const [show, setShow] = useState(false);
	const alertUser = () => alert("I am an alert!");

	return (
		<>
			<button onClick={() => setShow(!show)}>Toggle</button>
			{show && <Alert alert={alertUser} />}
		</>
	);
};

createRoot(document.getElementById("root")).render(<App />);
