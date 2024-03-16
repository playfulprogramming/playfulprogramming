import { Component, useState } from "react";
import { createRoot } from "react-dom/client";

// Functional component
const FnCounter = (props) => {
	// Setting up state
	const [count, setCount] = useState(0);

	// Function to update state
	const addOne = () => setCount(count + 1);

	// Rendered UI via JSX
	return (
		<div>
			<p>You have pushed the button {count} times</p>
			<button onClick={addOne}>Add one</button>
			{/* Using props to project children */}
			{props.children}
		</div>
	);
};

// Class component
class ClassCounter extends Component {
	// Setting up state
	state = { count: 0 };

	// Function to update state
	addOne() {
		// Notice we use an object and `setState` to update state
		this.setState({ count: this.state.count + 1 });
	}

	// Rendered UI via JSX
	render() {
		return (
			<div>
				<p>You have pushed the button {this.state.count} times</p>
				<button onClick={() => this.addOne()}>Add one</button>
				{/* Using props to project children */}
				{this.props.children}
			</div>
		);
	}
}

const App = () => {
	return (
		<>
			<h1>Function Component</h1>
			<FnCounter />
			<h1>Class Component</h1>
			<ClassCounter />
		</>
	);
};

createRoot(document.getElementById("root")).render(<App />);
