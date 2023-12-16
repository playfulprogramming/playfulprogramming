import { createRoot } from "react-dom/client";
import { cache, useReducer, useState } from "react";

const getIsEvenOrOdd = cache(
	(number) =>
		new Promise((resolve) => {
			setTimeout(() => {
				resolve(number % 2 === 0 ? "Even" : "Odd");
			}, 2000);
		}),
);

function App() {
	const [counter, setCounter] = useState(0);

	const isEvenOrOdd = getIsEvenOrOdd(counter);

	return (
		<div>
			<button onClick={() => setCounter((v) => v + 1)}>Add to {counter}</button>
			<p>
				{counter} is {isEvenOrOdd}
			</p>
		</div>
	);
}

createRoot(document.getElementById("root")).render(<App />);
