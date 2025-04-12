import { createRoot } from "react-dom/client";

const ConditionalRender = ({ bool }) => {
	return <div>{bool && <p>Text here</p>}</div>;
};

const App = () => {
	return (
		<div>
			<h1>Shown contents</h1>
			<ConditionalRender bool={true} />
			<h1>Hidden contents</h1>
			<ConditionalRender bool={false} />
		</div>
	);
};

createRoot(document.getElementById("root")).render(<App />);
