import { createRoot } from "react-dom/client";
import { useMemo, use, Suspense, Component } from "react";

const UserDisplay = ({ promise }) => {
	const result = use(promise);

	return <p>Hello {result.name}</p>;
};

function App() {
	// Placed in a memo to avoid re-fetching on every render
	const promise = useMemo(() => fetchUser(), []);

	return (
		<ErrorBoundary>
			<Suspense fallback={<p>Loading...</p>}>
				<UserDisplay promise={promise} />
			</Suspense>
		</ErrorBoundary>
	);
}

class ErrorBoundary extends Component {
	state = { error: null };

	static getDerivedStateFromError(error) {
		return { error };
	}

	render() {
		if (this.state.error) {
			return <p>There was an error: {JSON.stringify(this.state.error)}</p>;
		}

		return this.props.children;
	}
}

// Pretend this is fetching data from the server
function fetchUser() {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				name: "John Doe",
				age: 34,
			});
		}, 1000);
	});
}

createRoot(document.getElementById("root")).render(<App />);
