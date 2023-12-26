import { createRoot } from "react-dom/client";
import { useState } from "react";

// "children" is a preserved property name by React. It reflects passed child nodes
const ToggleButton = ({ children }) => {
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
			{/* We then utilize this special property name as any */}
			{/* other JSX variable to display its contents */}
			{children}
		</button>
	);
};

const ToggleButtonList = () => {
	return (
		<>
			<ToggleButton>
				Hello <span style={{ fontWeight: "bold" }}>world</span>!
			</ToggleButton>
			<ToggleButton>Hello other friends!</ToggleButton>
		</>
	);
};

createRoot(document.getElementById("root")).render(<ToggleButtonList />);
