import { createRoot } from "react-dom/client";

import { useReducer } from "react";

const initialState = { count: 0 };

function reducer(state, action) {
	switch (action.type) {
		case "increment":
			return { count: state.count + 1 };
		case "decrement":
			return { count: state.count - 1 };
		default:
			return state;
	}
}

function App() {
	const [state, dispatch] = useReducer(reducer, initialState);
	return (
		<>
			<p>{state.count}</p>
			<button onClick={() => dispatch({ type: "increment" })}>Add one</button>
			<button onClick={() => dispatch({ type: "decrement" })}>
				Remove one
			</button>
		</>
	);
}

createRoot(document.getElementById("root")).render(<App />);
