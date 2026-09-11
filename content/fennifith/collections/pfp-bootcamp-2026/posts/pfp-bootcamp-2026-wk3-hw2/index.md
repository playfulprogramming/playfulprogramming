---
{
	title: "Week 3 - Tier 2 Homework",
	published: '2026-01-21T21:12:03.284Z',
	order: 1,
	noindex: true
}
---

# 1\. Start from your Tier 1 code

Use the code you wrote for the number guessing game in [Tier 1](/posts/pfp-bootcamp-2026-wk3-hw1).

# 2\. Ask the user for a guess

Get the user’s input using `prompt`.

```javascript
const guess = prompt("Guess a number between 1 and 10");
```

# 3\. Convert the guess into a number

This lets JavaScript compare numbers correctly.

```javascript
const guessNumber = Number(guess);
```

# 4\. Set the secret number

This is the number the user is trying to guess.

```javascript
const secretNumber = 5;
```

# 5\. Use AND (`&&`) to check multiple conditions

The guess must be correct **and** within the valid range.

```javascript
if (guessNumber === secretNumber && guessNumber >= 1 && guessNumber <= 10) {
	console.log("Correct! You guessed the number 🎉");
}
```

# 6\. Use OR (`||`) to detect invalid input

This checks if the guess is too small **or** too large.

```javascript
else if (guessNumber < 1 || guessNumber > 10) {
    console.log("Invalid guess. Pick a number between 1 and 10.");
}
```

# 7\. Handle all other cases

This runs when the guess is valid but incorrect.

```javascript
else {
    console.log("Wrong guess. Try again.");
}
```

# 8\. Copy the JavaScript code

Select all of the code and copy it.

# 9\. Open the browser console

Right-click anywhere on the page  
Click **Inspect**  
Go to the **Console** tab

# 10\. Paste the code into the console

Paste the code into the console and press <kbd>Enter</kbd>.

# 11\. Goal of Tier 2

By completing this, you should understand:

- `&&` means **all conditions must be true**

- `||` means **at least one condition must be true**

- How boolean logic controls program flow
