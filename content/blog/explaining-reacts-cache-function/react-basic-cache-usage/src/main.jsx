import { createRoot } from "react-dom/client";
import { cache, useReducer, useState } from "react";

const alertCounter = cache((id) => {
	alert(id);
});

function App() {
	const [counter, setCounter] = useState(0);
	const [_, rerender] = useReducer(() => ({}), {});

	alertCounter(counter);

	return (
		<div>
			<button onClick={() => setCounter((v) => v + 1)}>Add to {counter}</button>
			<button onClick={rerender}>Rerender</button>
			<input key={Math.floor(Math.random() * 10)} />
		</div>
	);
}

createRoot(document.getElementById("root")).render(<App />);
