import { createRoot } from "react-dom/client";

const Component = ({ divRef, style }) => {
	return <div ref={divRef} style={style} />;
};

const App = () => {
	return (
		<Component
			divRef={(el) => alert(el)}
			style={{ height: 100, width: 100, backgroundColor: "red" }}
		/>
	);
};

createRoot(document.getElementById("root")).render(<App />);
