const el = document.getElementById("root");
const getErrorString = (err) =>
	JSON.stringify(err, Object.getOwnPropertyNames(err));

function getBaseNumber() {
	// Error occurs here, throws it upwards
	throw new Error("There was an error");
	return 10;
}

function getRandomNumber() {
	// Error occurs here, throws it upwards
	return Math.floor(Math.random() * getBaseNumber());
}

function getRandomTodoItem() {
	const items = [
		"Go to the gym",
		"Play video games",
		"Work on book",
		"Program",
	];

	// Error occurs here, throws it upwards
	const randNum = getRandomNumber();

	return items[randNum % items.length];
}

function getDaySchedule() {
	let schedule = [];
	for (let i = 0; i < 3; i++) {
		schedule.push(
			// First execution will throw this error upwards
			getRandomTodoItem(),
		);
	}
	return schedule;
}

function main() {
	try {
		el.innerText += getDaySchedule();
	} catch (e) {
		// Only now will the error be stopped
		el.innerText += "An error occurred: " + getErrorString(e);
	}
}

main();
