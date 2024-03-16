import { createRoot } from "react-dom/client";

import { createContext, useContext } from "react";

const HelloMessageContext = createContext();

function Parent() {
	// Notice no provider was set
	return <Child />;
}

function Child() {
	const injectedMessageData = useContext(HelloMessageContext);

	const messageData = injectedMessageData || "Hello, world!";

	return <p>{messageData}</p>;
}

createRoot(document.getElementById("root")).render(<Parent />);
