import { createRoot } from "react-dom/client";
import { useActionState } from "react";

function App() {
	async function sayHi() {
		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 1000);
		});
		return "Value from the action";
	}

	// State will be updated when `sayHi` returns a value
	const [state, action] = useActionState(sayHi, "Initial value");

	return (
		// Pass the action from `useFormState`
		<form action={action}>
			<p>{state}</p>
			<button>Submit</button>
		</form>
	);
}

createRoot(document.getElementById("root")).render(<App />);
