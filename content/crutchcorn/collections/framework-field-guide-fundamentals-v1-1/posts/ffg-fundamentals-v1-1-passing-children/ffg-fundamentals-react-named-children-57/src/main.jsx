import { createRoot } from "react-dom/client";
import { useState } from "react";

const Dropdown = ({ children, header, expanded, toggle }) => {
	return (
		<>
			<button
				onClick={toggle}
				aria-expanded={expanded}
				aria-controls="dropdown-contents"
			>
				{expanded ? "V" : ">"} {header}
			</button>
			<div id="dropdown-contents" role="region" hidden={!expanded}>
				{children}
			</div>
		</>
	);
};

function App() {
	const [expanded, setExpanded] = useState(false);
	return (
		<Dropdown
			expanded={expanded}
			toggle={() => setExpanded(!expanded)}
			header={<>Let's build this dropdown component</>}
		>
			These tend to be useful for FAQ pages, hidden contents, and more!
		</Dropdown>
	);
}

createRoot(document.getElementById("root")).render(<App />);
