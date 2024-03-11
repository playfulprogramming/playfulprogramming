import { createRoot } from "react-dom/client";
import { useState } from "react";

const ExpandableDropdown = ({ name, expanded, onToggle }) => {
	return (
		<div>
			<button onClick={onToggle}>
				{expanded ? "V " : "> "}
				{name}
			</button>
			<div hidden={!expanded}>More information here</div>
		</div>
	);
};

const Sidebar = () => {
	// Just to show that the value is displaying properly
	const [moviesExpanded, setMoviesExpanded] = useState(true);
	const [picturesExpanded, setPicturesExpanded] = useState(false);
	const [conceptsExpanded, setConceptsExpanded] = useState(false);
	const [articlesExpanded, setArticlesExpanded] = useState(false);
	const [redesignExpanded, setRedesignExpanded] = useState(false);
	const [invoicesExpanded, setInvoicesExpanded] = useState(false);

	return (
		<div>
			<h1>My Files</h1>
			<ExpandableDropdown
				name="Movies"
				expanded={moviesExpanded}
				onToggle={() => setMoviesExpanded(!moviesExpanded)}
			/>
			<ExpandableDropdown
				name="Pictures"
				expanded={picturesExpanded}
				onToggle={() => setPicturesExpanded(!picturesExpanded)}
			/>
			<ExpandableDropdown
				name="Concepts"
				expanded={conceptsExpanded}
				onToggle={() => setConceptsExpanded(!conceptsExpanded)}
			/>
			<ExpandableDropdown
				name="Articles I'll Never Finish"
				expanded={articlesExpanded}
				onToggle={() => setArticlesExpanded(!articlesExpanded)}
			/>
			<ExpandableDropdown
				name="Website Redesigns v5"
				expanded={redesignExpanded}
				onToggle={() => setRedesignExpanded(!redesignExpanded)}
			/>
			<ExpandableDropdown
				name="Invoices"
				expanded={invoicesExpanded}
				onToggle={() => setInvoicesExpanded(!invoicesExpanded)}
			/>
		</div>
	);
};

createRoot(document.getElementById("root")).render(<Sidebar />);
