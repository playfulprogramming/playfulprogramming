import { createRoot } from "react-dom/client";

const EventBubbler = () => {
	const logMessage = () => alert("Clicked!");

	return (
		<div onClick={() => logMessage()}>
			<p>
				<span style={{ color: "red" }}>Click me</span> or even
				<span style={{ background: "green", color: "white" }}>me</span>!
			</p>
		</div>
	);
};

createRoot(document.getElementById("root")).render(<EventBubbler />);
