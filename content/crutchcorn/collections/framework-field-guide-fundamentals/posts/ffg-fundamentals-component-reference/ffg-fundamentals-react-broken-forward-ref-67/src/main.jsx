import { createRoot } from "react-dom/client";

const Component = ({ ref, style }) => {
	return <div ref={ref} style={style} />;
};

const App = () => {
	return (
		<Component
			ref={(el) => alert(el)}
			style={{ height: 100, width: 100, backgroundColor: "red" }}
		/>
	);
};

createRoot(document.getElementById("root")).render(<App />);
