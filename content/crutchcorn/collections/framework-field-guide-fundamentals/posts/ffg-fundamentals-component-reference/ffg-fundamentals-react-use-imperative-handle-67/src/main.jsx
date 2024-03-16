import { createRoot } from "react-dom/client";
import { forwardRef, useImperativeHandle } from "react";

const Component = forwardRef((props, ref) => {
	useImperativeHandle(ref, () => {
		// Anything returned here will be assigned to the forwarded `ref`
		return {
			pi: 3.14,
			sayHi() {
				alert("Hello, world");
			},
		};
	});

	return <div style={props.style} />;
});

const App = () => {
	return (
		<Component
			ref={(el) => console.log(el)}
			style={{ height: 100, width: 100, backgroundColor: "red" }}
		/>
	);
};

createRoot(document.getElementById("root")).render(<App />);
