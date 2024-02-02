import { Component } from "react";
import { createRoot } from "react-dom/client";

const getErrorString = (err) =>
	JSON.stringify(err, Object.getOwnPropertyNames(err));

class ErrorBoundary extends Component {
	componentDidCatch(error, errorInfo) {
		// Do something with the error
		alert(
			`
You had an error:
${getErrorString(error)}
${JSON.stringify(errorInfo)}
		`.trim(),
		);
	}

	render() {
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
