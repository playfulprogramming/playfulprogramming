---
{
	title: "Week 3 - Tier 1 Homework",
	published: '2026-01-21T21:12:03.284Z',
	order: 1,
	noindex: true
}
---

# 1\. Open VS Code

Launch **Visual Studio Code** on your computer.

# 2\. Write the JavaScript code

We’ll write the code first, then run it in the browser.

First, ask the user for a guess:

```javascript
const guess = prompt("Guess a number between 1 and 10");
```

Then, convert the guess into a number:

```javascript
const guessNumber = Number(guess);
```

Set the secret number by adding:

```javascript
const secretNumber = 5;
```

Now compare the guess to the secret number:

```javascript
if (guessNumber === secretNumber) {
	console.log("Correct! You guessed the number 🎉");
} else if (guessNumber < secretNumber) {
	console.log("Too low! Try again.");
} else {
	console.log("Too high! Try again.");
}
```

# 3\. Copy the JavaScript code

Select all of the code and copy it.

# 4\. Open your browser

Open any web browser.

# 5\. Open the browser console

Right-click anywhere on the page

- Click **Inspect**
- Go to the **Console** tab


# 6\. Paste the code into the console

Paste the code into the console and press <kbd>Enter</kbd>.

# 7\. Play the game

Enter a number when prompted and read the result in the console.

# 8\. Play again

Paste the code into the console again to make another guess.
