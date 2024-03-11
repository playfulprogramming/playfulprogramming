import { createRoot } from "react-dom/client";

import { createContext, useContext, useState } from "react";

const GreeterContext = createContext({
	greeting: "",
	changeGreeting: (newGreeting) => {},
});

function App() {
	const [greeting, setGreeting] = useState("");
	const value = { greeting, changeGreeting: setGreeting };
	return (
		<GreeterContext.Provider value={value}>
			<Child />
		</GreeterContext.Provider>
	);
}

function Child() {
	return <GrandChild />;
}

function GrandChild() {
	const [greeting, setGreeting] = useState("✨ Welcome 💯");

	// New ✨ sparkly ✨ functionality adds some fun! 💯
	const changeGreeting = (newVal) => {
		if (!newVal.includes("✨")) {
			newVal += "✨";
		}
		if (!newVal.includes("💯")) {
			newVal += "💯";
		}

		setGreeting(newVal);
	};

	const value = { greeting, changeGreeting };
	return (
		<GreeterContext.Provider value={value}>
			<GreatGrandChild />
		</GreeterContext.Provider>
	);
}

function GreatGrandChild() {
	const { greeting, changeGreeting } = useContext(GreeterContext);
	return (
		<div>
			<p>{greeting}, user!</p>
			<label>
				<div>Set a new greeting</div>
				<input
					value={greeting}
					onChange={(e) => changeGreeting(e.target.value)}
				/>
			</label>
		</div>
	);
}

createRoot(document.getElementById("root")).render(<App />);
