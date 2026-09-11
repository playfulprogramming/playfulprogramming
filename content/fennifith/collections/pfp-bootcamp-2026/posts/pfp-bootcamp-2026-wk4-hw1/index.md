---
{
  title: "Week 4 - Tier 1 Homework",
  description: "Add a while loop to your JavaScript number guessing game so players can keep guessing until they find the correct number.",
  published: "2026-01-28T21:12:03.284Z",
  order: 1,
  noindex: true,
}
---

Remember the number guessing game from last week?

```javascript
const secretNumber = 5;
const guess = prompt("Guess a number between 1 and 10");
const guessNumber = Number(guess);

if (guessNumber < 1 || guessNumber > 10) {
	console.log("Invalid guess. Pick a number between 1 and 10.");
} else if (guessNumber === secretNumber) {
	console.log("Correct! You guessed the number 🎉");
} else {
	console.log("Wrong guess. Try again.");
}
```

**Now let’s rewrite it using a `while` loop**

# What’s the goal?

Instead of letting the user guess once, we want to:

- Keep asking them to guess until they get the correct number

That’s exactly what a `while` loop is for.

# Step 1: Set the secret number

This stays the same.

```javascript
const secretNumber = 5;
```

# Step 2: Create a variable for the guess

We start with no guess yet.

```javascript
let guessNumber;
```

# Step 3: Start a `while` loop

This loop will run **as long as the guess is NOT correct**.

```javascript
while (guessNumber !== secretNumber) {}
```

# Step 4: Inside the loop ask the user for a guess

```javascript
while (guessNumber !== secretNumber) {
	const guess = prompt("Guess a number between 1 and 10");

	guessNumber = Number(guess);
}
```

# Step 5: Handle invalid input using OR (`||`)

If the number is outside the valid range:

```javascript
while (guessNumber !== secretNumber) {
	const guess = prompt("Guess a number between 1 and 10");

	guessNumber = Number(guess);

	if (guessNumber < 1 || guessNumber > 10) {
		console.log("Invalid guess");
	}
}
```

# Step 6: Handle the correct guess

This will **end the loop** because the condition becomes false.

```javascript
while (guessNumber !== secretNumber) {
	const guess = prompt("Guess a number between 1 and 10");

	guessNumber = Number(guess);

	if (guessNumber < 1 || guessNumber > 10) {
		console.log("Invalid guess");
	} else if (guessNumber === secretNumber) {
		console.log("Correct! You guessed the number 🎉");
	}
}
```

# **Step 7: Handle wrong but valid guesses**

```javascript
while (guessNumber !== secretNumber) {
	const guess = prompt("Guess a number between 1 and 10");

	guessNumber = Number(guess);

	if (guessNumber < 1 || guessNumber > 10) {
		console.log("Invalid guess");
	} else if (guessNumber === secretNumber) {
		console.log("Correct! You guessed the number 🎉");
	} else {
		console.log("Wrong guess. Try again.");
	}
}
```

## Final Code (with `while` loop)

```javascript
const secretNumber = 5;

let guessNumber;

while (guessNumber !== secretNumber) {
	const guess = prompt("Guess a number between 1 and 10");

	guessNumber = Number(guess);

	if (guessNumber < 1 || guessNumber > 10) {
		console.log("Invalid guess. Pick a number between 1 and 10.");
	} else if (guessNumber === secretNumber) {
		console.log("Correct! You guessed the number 🎉");
	} else {
		console.log("Wrong guess. Try again.");
	}
}
```

**Done 🎉**
