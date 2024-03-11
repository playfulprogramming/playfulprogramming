import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";

function AlarmScreen({ snooze, disable }) {
	useEffect(() => {
		setTimeout(() => {
			// Automatically snooze the alarm
			// after 10 seconds of inactivity
			// In production, this would be 10 minutes
			snooze();
		}, 10 * 1000);
	}, []);

	return (
		<div>
			<p>Time to wake up!</p>
			<button onClick={snooze}>Snooze for 5 seconds</button>
			<button onClick={disable}>Turn off alarm</button>
		</div>
	);
}

function App() {
	const [secondsLeft, setSecondsLeft] = useState(5);
	const [timerEnabled, setTimerEnabled] = useState(true);

	useEffect(() => {
		setInterval(() => {
			setSecondsLeft((v) => {
				if (v === 0) return v;
				return v - 1;
			});
		}, 1000);
	}, []);

	const snooze = () => {
		// In production, this would add 5 minutes, not 5 seconds
		setSecondsLeft((v) => v + 5);
	};

	const disable = () => {
		setTimerEnabled(false);
	};

	if (!timerEnabled) {
		return <p>There is no timer</p>;
	}

	if (secondsLeft === 0) {
		return <AlarmScreen snooze={snooze} disable={disable} />;
	}

	return <p>{secondsLeft} seconds left in timer</p>;
}

createRoot(document.getElementById("root")).render(<App />);
