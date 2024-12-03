import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";

const ReRenderListener = () => {
	const [_, updateState] = useState(0);

	useEffect(() => {
		console.log("Component has re-rendered");
	}); // Notice the lack of an array

	return <button onClick={() => updateState((v) => v + 1)}>Re-render</button>;
};

createRoot(document.getElementById("root")).render(<ReRenderListener />);
