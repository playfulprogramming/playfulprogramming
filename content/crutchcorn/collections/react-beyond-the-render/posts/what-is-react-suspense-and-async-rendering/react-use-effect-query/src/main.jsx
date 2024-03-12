import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";

function App() {
	const [data, setData] = useState({
		loading: true,
		result: null,
		error: null,
	});

	// Please use TanStack Query
	useEffect(() => {
		fetchUser()
			.then((serverData) => {
				setData({ error: null, loading: false, result: serverData });
			})
			.catch((err) => {
				setData({ error: err, loading: false, result: null });
			});
	}, []);

	return (
		<div>
			{data.result && <p>Hello {data.result.name}</p>}
			{data.loading && <p>Loading...</p>}
			{data.error && <p>There was an error: {JSON.stringify(data.error)}</p>}
		</div>
	);
}

// Pretend this is fetching data from the server
function fetchUser() {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				name: "John Doe",
				age: 34,
			});
		}, 1000);
	});
}

createRoot(document.getElementById("root")).render(<App />);
