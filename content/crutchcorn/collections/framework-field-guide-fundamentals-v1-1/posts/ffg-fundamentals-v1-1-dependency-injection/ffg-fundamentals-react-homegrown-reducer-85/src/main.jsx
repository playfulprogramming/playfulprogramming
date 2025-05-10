import { createRoot } from "react-dom/client";

import { createContext, useContext, useState } from "react";

const CounterContext = createContext();

function App() {
	const [count, setCount] = useState(0);

	const increment = () => {
		setCount(count + 1);
	};

	const decrement = () => {
		setCount(count - 1);
	};

	const set = (val) => {
		setCount(val);
	};

	const providedValue = { count, increment, decrement, set };
	return (
		<CounterContext.Provider value={providedValue}>
			<Child />
		</CounterContext.Provider>
	);
}

function Child() {
	const { count, increment, decrement, set } = useContext(CounterContext);
	return (
		<>
			<p>Count is: {count}</p>
			<button onClick={increment}>Increment</button>
			<button onClick={decrement}>Decrement</button>
			<button onClick={() => set(0)}>Set to zero</button>
		</>
	);
}

createRoot(document.getElementById("root")).render(<App />);
