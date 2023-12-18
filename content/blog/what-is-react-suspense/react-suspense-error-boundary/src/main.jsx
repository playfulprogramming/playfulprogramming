import { createRoot } from "react-dom/client";
import { use, Suspense, Component, cache } from "react";

const UserDisplay = () => {
	const result = use(fetchUser());

	return <p>Hello {result.name}</p>;
};

function App() {
	return (
		<ErrorBoundary>
			<Suspense fallback={<p>Loading...</p>}>
				<UserDisplay />
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
const fetchUser = cache(() => {
	// Try toggling the resolve and reject to see the different behaviors
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject("There was an issue fetching the user");
			// resolve({
			// 	name: "John Doe",
			// 	age: 34,
			// });
		}, 1000);
	});
});

createRoot(document.getElementById("root")).render(<App />);
