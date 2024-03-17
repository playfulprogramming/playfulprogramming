import { createRoot } from "react-dom/client";

import { createContext, useContext } from "react";

const NameContext = createContext("");
const FavFoodContext = createContext("");

function App() {
	return (
		<NameContext.Provider value="Corbin">
			<Child />
		</NameContext.Provider>
	);
}

function Child() {
	return <GrandChild />;
}

function GrandChild() {
	return (
		<FavFoodContext.Provider value={"Ice Cream"}>
			<GreatGrandChild />
		</FavFoodContext.Provider>
	);
}

function GreatGrandChild() {
	// Despite the `AgeContext` being closer, this is
	// specifically looking for the `NameContext` and will
	// go further up in the tree to find that data from `App`
	const name = useContext(NameContext);
	// Meanwhile, this will search for the context that pertains to its name
	const favFood = useContext(FavFoodContext);
	return (
		<>
			<p>Name: {name}</p>
			<p>Favorite food: {favFood}</p>
		</>
	);
}

createRoot(document.getElementById("root")).render(<App />);
