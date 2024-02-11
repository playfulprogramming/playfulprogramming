import { createRoot } from "react-dom/client";

import { createContext, useContext } from "react";

const NameContext = createContext("");

function App() {
	return (
		<NameContext.Provider value="Corbin">
			<Child />
		</NameContext.Provider>
	);
}

function Child() {
	const name = useContext(NameContext);
	return (
		<>
			<p>Name: {name}</p>
			<GrandChild />
		</>
	);
}

// Notice the new provider here, it will supplement the `App` injected value
// for all child components of `GrandChild`
function GrandChild() {
	return (
		<NameContext.Provider value="Kevin">
			<GreatGrandChild />
		</NameContext.Provider>
	);
}

function GreatGrandChild() {
	const name = useContext(NameContext);
	return <p>Name: {name}</p>;
}

createRoot(document.getElementById("root")).render(<App />);
