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

function ToggleButtonList() {
	const friends = ["Kevin,", "Evelyn,", "and James"];
	return (
		<>
			<ToggleButton>
				Hello{" "}
				{friends.map((friend) => (
					<span>{friend} </span>
				))}
				!
			</ToggleButton>
			<ToggleButton>
				Hello other friends
				<RainbowExclamationMark />
			</ToggleButton>
		</>
	);
}

function RainbowExclamationMark() {
	const rainbowGradient = `
    linear-gradient(
      180deg,
      #fe0000 16.66%,
      #fd8c00 16.66%,
      33.32%,
      #ffe500 33.32%,
      49.98%,
      #119f0b 49.98%,
      66.64%,
      #0644b3 66.64%,
      83.3%,
      #c22edc 83.3%
    )
  `;

	return (
		<span
			style={{
				fontSize: "3rem",
				background: rainbowGradient,
				backgroundSize: "100%",
				WebkitBackgroundClip: "text",
				WebkitTextFillColor: "transparent",
				MozBackgroundClip: "text",
			}}
		>
			!
		</span>
	);
}

createRoot(document.getElementById("root")).render(<ToggleButtonList />);
