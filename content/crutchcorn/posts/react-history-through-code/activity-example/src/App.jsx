import { unstable_Activity as Activity, useState } from "react";

function Counter() {
	const [count, setCount] = useState(0);
	return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}

export default function App() {
	const [hideCount, setHideCount] = useState(false);
	return (
		<>
			<button onClick={() => setHideCount((v) => !v)}>Toggle Count</button>
			<br />
			<Activity mode={hideCount ? "hidden" : "visible"}>
				<Counter />
			</Activity>
		</>
	);
}
