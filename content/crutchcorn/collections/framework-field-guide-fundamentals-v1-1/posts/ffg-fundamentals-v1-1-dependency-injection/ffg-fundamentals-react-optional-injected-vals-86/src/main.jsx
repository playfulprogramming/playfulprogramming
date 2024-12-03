import { createRoot } from "react-dom/client";

import { createContext, useContext } from "react";

const HelloMessageContext = createContext();

function Parent() {
	// Notice no provider was set
	return <Child />;
}

function Child() {
	// `messageData` is `undefined` if nothing is injected
	const messageData = useContext(HelloMessageContext);

	// If no value is passed, we can simply
	// not render anything in this component
	// if (!messageData) return null
	// But for now let's show a message
	if (!messageData) return <p>There was no data</p>;

	return <p>{messageData}</p>;
}

createRoot(document.getElementById("root")).render(<Parent />);
