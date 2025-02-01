import { createRoot } from "react-dom/client";
import { useState } from "react";
import "./main.module.css";

const App = () => {
	const [activeTab, setActiveTab] = useState("javascript");

	return (
		<div>
			<ul role="tablist">
				<li
					role="tab"
					id="javascript-tab"
					aria-selected={activeTab === "javascript"}
					aria-controls="javascript-panel"
					onClick={() => setActiveTab("javascript")}
				>
					JavaScript
				</li>
				<li
					role="tab"
					id="python-tab"
					aria-selected={activeTab === "python"}
					aria-controls="python-panel"
					onClick={() => setActiveTab("python")}
				>
					Python
				</li>
			</ul>
			<div
				role="tabpanel"
				id="javascript-panel"
				aria-labelledby="javascript-tab"
				hidden={activeTab !== "javascript"}
			>
				<code>console.log("Hello, world!");</code>
			</div>
			<div
				role="tabpanel"
				id="python-panel"
				aria-labelledby="python-tab"
				hidden={activeTab !== "python"}
			>
				<code>print("Hello, world!")</code>
			</div>
		</div>
	);
};

createRoot(document.getElementById("root")).render(<App />);
