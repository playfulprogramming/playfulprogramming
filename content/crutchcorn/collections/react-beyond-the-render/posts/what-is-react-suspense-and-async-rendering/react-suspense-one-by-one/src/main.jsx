import { createRoot } from "react-dom/client";
import { use, Suspense, cache } from "react";

const UserDisplay = ({ timeout }) => {
	const result = use(fetchUser({ timeout }));

	return <p>Hello {result.name}</p>;
};

function App() {
	return (
		<>
			<Suspense fallback={<p>Loading...</p>}>
				<UserDisplay timeout={1500} />
			</Suspense>
			<Suspense fallback={<p>Loading...</p>}>
				<UserDisplay timeout={3000} />
			</Suspense>
		</>
	);
}

// Pretend this is fetching data from the server
const fetchUser = cache(({ timeout }) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				name: "John Doe",
				age: 34,
			});
		}, timeout ?? 1000);
	});
});

createRoot(document.getElementById("root")).render(<App />);
