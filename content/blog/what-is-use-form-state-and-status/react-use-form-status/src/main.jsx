import { createRoot } from "react-dom/client";
import { useFormStatus } from "react-dom";

function Submit() {
	const status = useFormStatus();
	return (
		<button disabled={status.pending}>
			{status.pending ? "Sending..." : "Send"}
		</button>
	);
}

function App() {
	async function waitASecond() {
		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 1000);
		});
	}

	return (
		<form action={waitASecond}>
			<Submit />
		</form>
	);
}

createRoot(document.getElementById("root")).render(<App />);
