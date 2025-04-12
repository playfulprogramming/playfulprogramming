const fetchOurUserFromTheDatabase = () => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				name: "John Doe",
				age: 34,
			});
		}, 1000);
	});
};

async function UserDetails() {
	const user = await fetchOurUserFromTheDatabase();
	return <p>{user.name}</p>;
}

export default function Home() {
	return <UserDetails />;
}
