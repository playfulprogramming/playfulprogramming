// Pretend this is a real database
let id = 0;
const todos = [];

function getRandomTimePromise() {
	return new Promise((resolve) => {
		setTimeout(
			() => {
				resolve();
			},
			Math.floor(Math.random() * 3000),
		);
	});
}

export async function addTodoToDatabase(todo) {
	await getRandomTimePromise();
	todos.push({ value: todo, id: ++id });
}

export async function getTodos() {
	await getRandomTimePromise();
	return [...todos];
}
