import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";

const Clock = () => {
	const [time, setTime] = useState(formatDate(new Date()));

	useEffect(() => {
		setInterval(() => {
			console.log("I am updating the time");
			setTime(formatDate(new Date()));
		}, 1000);
	}, []);

	return <p role="timer">Time is: {time}</p>;
};

function formatDate(date) {
	return (
		prefixZero(date.getHours()) +
		":" +
		prefixZero(date.getMinutes()) +
		":" +
		prefixZero(date.getSeconds())
	);
}

function prefixZero(number) {
	if (number < 10) {
		return "0" + number.toString();
	}

	return number.toString();
}

function App() {
	const [showClock, setShowClock] = useState(true);

	return (
		<div>
			<button onClick={() => setShowClock(!showClock)}>Toggle clock</button>
			{showClock && <Clock />}
		</div>
	);
}

createRoot(document.getElementById("root")).render(<App />);
