import { createRoot } from "react-dom/client";
import { useState } from "react";

const ToggleButton = ({ text }) => {
	const [pressed, setPressed] = useState(false);
	return (
		<button
			onClick={() => setPressed(!pressed)}
			style={{
				backgroundColor: pressed ? "black" : "white",
				color: pressed ? "white" : "black",
			}}
			type="button"
			aria-pressed={pressed}
		>
			{text}
		</button>
	);
};

const ToggleButtonList = () => {
	return (
		<>
			<ToggleButton text="Hello world!" />
			<ToggleButton text="Hello other friends!" />
		</>
	);
};

createRoot(document.getElementById("root")).render(<ToggleButtonList />);
