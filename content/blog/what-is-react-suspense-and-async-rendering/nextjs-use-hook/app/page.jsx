import { use, cache } from "react";

// Still using cache... For now...
const fetchOurUserFromTheDatabase = cache(() => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				name: "John Doe",
				age: 34,
			});
		}, 1000);
	});
});

function UserDetails() {
	/* This also works, but is still not the best way
      of doing things in server components */
	const user = use(fetchOurUserFromTheDatabase());
	return <p>{user.name}</p>;
}

export default function Home() {
	return <UserDetails />;
}
