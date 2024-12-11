const el = document.getElementById("root");
const getErrorString = (err) =>
	JSON.stringify(err, Object.getOwnPropertyNames(err));

function getRandomNumber() {
	// Try commenting this line and seeing the different behavior
	throw new Error("There was an error");
	// Anything below the "throw" clause will not run
	el.innerText += "Generating a random number\n";
	// This means that values returned after a thrown error are not utilized
	return Math.floor(Math.random() * 10);
}

try {
	const val = getRandomNumber();
	// This will never execute because the `throw` bypasses it
	el.innerText += "I got the random number of: " + val;
} catch (e) {
	// This will always run instead
	el.innerText += "There was an error: " + getErrorString(e);
}
