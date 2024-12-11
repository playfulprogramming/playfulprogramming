import { createRoot } from "react-dom/client";
import { forwardRef } from "react";

const Component = forwardRef((props, ref) => {
	return <div ref={ref} style={props.style} />;
});

const App = () => {
	return (
		<Component
			ref={(el) => alert(el)}
			style={{ height: 100, width: 100, backgroundColor: "red" }}
		/>
	);
};

createRoot(document.getElementById("root")).render(<App />);
