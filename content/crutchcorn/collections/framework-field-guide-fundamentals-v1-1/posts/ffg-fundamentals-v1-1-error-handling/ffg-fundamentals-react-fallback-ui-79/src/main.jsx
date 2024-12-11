import { Component } from "react";
import { createRoot } from "react-dom/client";

class ErrorBoundary extends Component {
	state = { hasError: false };

	static getDerivedStateFromError(error) {
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		console.log(error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return <h1>Something went wrong.</h1>;
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
