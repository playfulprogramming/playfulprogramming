import { createRoot } from "react-dom/client";
import { useMemo } from "react";
import { createPortal } from "react-dom";

function ChildComponent() {
	const bodyEl = useMemo(() => {
		return document.querySelector("body");
	}, []);
	return createPortal(<div>Hello, world!</div>, bodyEl);
}

function App() {
	return (
		<>
			{/* Even though it's rendered first, it shows up last because it's being appended to `<body>` */}
			<ChildComponent />
			<div
				style={{ height: "100px", width: "100px", border: "2px solid black" }}
			/>
		</>
	);
}

createRoot(document.getElementById("root")).render(<App />);
