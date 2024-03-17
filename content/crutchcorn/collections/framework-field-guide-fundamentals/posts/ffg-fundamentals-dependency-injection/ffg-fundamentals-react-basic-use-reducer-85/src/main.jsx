import { createRoot } from "react-dom/client";

import { useReducer } from "react";

const initialState = { count: 0 };

function reducer(state, action) {
	return { count: state.count + 1 };
}

function App() {
	const [state, dispatch] = useReducer(reducer, initialState);
	return (
		<>
			<p>{state.count}</p>
			<button onClick={() => dispatch()}>Add one</button>
		</>
	);
}

createRoot(document.getElementById("root")).render(<App />);
