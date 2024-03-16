import { createRoot } from "react-dom/client";
import { forwardRef, useImperativeHandle, useRef } from "react";

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
	const compRef = useRef();
	return (
		<>
			<button onClick={() => compRef.current.sayHi()}>Say hi</button>
			<Component ref={compRef} />
		</>
	);
};

createRoot(document.getElementById("root")).render(<App />);
