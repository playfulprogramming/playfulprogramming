import { createRoot } from "react-dom/client";
import { cache, Component, useState } from "react";

const getIsEven = cache((number) => {
	alert("I am checking if " + number + " is even or not");
	if (number % 2 === 0) {
		throw "Number is even";
	}
});

function ThrowAnErrorIfEven({ number, instance }) {
	getIsEven(number);

	return <p>I am instance #{instance}</p>;
}

function App() {
	const [counter, setCounter] = useState(0);
	const [howManyInstances, setHowManyInstances] = useState(3);

	return (
		<div>
			<p>You should only see one alert when you push the button below</p>
			<button onClick={() => setCounter((v) => v + 1)}>Add to {counter}</button>
			{Array.from({ length: howManyInstances }).map((_, i) => (
				<div key={i}>
					<ErrorBoundary key={counter}>
						<ThrowAnErrorIfEven number={counter} instance={i} />
					</ErrorBoundary>
				</div>
			))}
			<p>Even if you add a thousand instances of the component</p>
			<button onClick={() => setHowManyInstances((v) => v + 1)}>
				Add instance of {"<ThrowAnErrorIfEven>"}
			</button>
		</div>
	);
}

class ErrorBoundary extends Component {
	state = { error: null };

	static getDerivedStateFromError(error) {
		// Update state so the next render will show the fallback UI.
		return { error };
	}

	render() {
		if (this.state.error) {
			return <p>There was an error: {this.state.error}</p>;
		}

		return this.props.children;
	}
}

createRoot(document.getElementById("root")).render(<App />);
