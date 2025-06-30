import { Suspense, use, useMemo } from "react";

function Child({ promise }) {
	const data = use(promise);
	return <p>{data}</p>;
}

export default function App() {
	// useMemo is needed here, otherwise it will generate a new promise
	// for each render and cause an infinite loop
	const promise = useMemo(() => fakeFetch(), []);

	return (
		<Suspense fallback={<p>Loading...</p>}>
			<Child promise={promise} />
		</Suspense>
	);
}

function fakeFetch() {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(1000);
		}, 1000);
	});
}
