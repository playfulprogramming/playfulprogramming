import { Component } from "react";
import { createRoot } from "react-dom/client";

// JSON.stringify-ing an Error object provides `{}`.
// This function fixes that
const getErrorString = (err) =>
	JSON.stringify(err, Object.getOwnPropertyNames(err));

class ErrorBoundary extends Component {
	state = { error: null };

	static getDerivedStateFromError(error) {
		return { error: error };
	}

	componentDidCatch(error, errorInfo) {
		console.log(error, errorInfo);
	}

	render() {
		if (this.state.error) {
			return (
				<div>
					<h1>You got an error:</h1>
					<pre style={{ whiteSpace: "pre-wrap" }}>
						<code>{getErrorString(this.state.error)}</code>
					</pre>
				</div>
			);
		}
		return this.props.children;
	}
}

const ErrorThrowingComponent = () => {
	// This is an example of an error being thrown
	throw new Error("Error");
};

const App = () => {
	return (
		<ErrorBoundary>
			<ErrorThrowingComponent />
		</ErrorBoundary>
	);
};

createRoot(document.getElementById("root")).render(<App />);
