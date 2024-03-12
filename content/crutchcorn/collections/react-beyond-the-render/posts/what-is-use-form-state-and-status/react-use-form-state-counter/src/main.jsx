import { createRoot } from "react-dom/client";
import { useFormState } from "react-dom";

async function increment(previousState, formData) {
	return previousState + 1;
}

function App() {
	const [state, action] = useFormState(increment, 0);
	return (
		<form action={action}>
			<p>{state}</p>
			<button>Increment</button>
		</form>
	);
}

createRoot(document.getElementById("root")).render(<App />);
