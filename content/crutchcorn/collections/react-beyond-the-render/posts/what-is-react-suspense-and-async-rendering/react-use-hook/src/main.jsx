import { createRoot } from "react-dom/client";
import { use, cache } from "react";

const UserDisplay = () => {
	const result = use(fetchUser());

	return <p>Hello {result.name}</p>;
};

function App() {
	return <UserDisplay />;
}

// Pretend this is fetching data from the server
const fetchUser = cache(() => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				name: "John Doe",
				age: 34,
			});
		}, 1000);
	});
});

createRoot(document.getElementById("root")).render(<App />);
