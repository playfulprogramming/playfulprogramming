---
{
  title: "Week 4 - Tier 2 Homework",
  description: "Write a JavaScript palindrome checker using a function, a while loop, and string comparison to test whether a word reads the same backwards.",
  published: "2026-01-28T21:12:03.284Z",
  order: 1,
  noindex: true,
}
---

A **palindrome** is a word that reads the same **forwards and backwards**.

Examples: `racecar`, `level`, `madam`

There are **many ways** to solve this problem.

This is **one way** to go about it, using:

- a function
- a `while` loop
- string comparison

### \*\*Step 1: Create the function

We start by defining a function that takes in a word.

```javascript
function isPalindrome(word) {}
```

# Step 2: Create variables inside the function

We need:

- a variable to build the reversed word
- a counter to move through the string

```javascript
function isPalindrome(word) {
	let reversedWord = "";

	let i = word.length - 1;
}
```

# Step 3: Add a `while` loop

The loop will run as long as we haven’t reached the start of the word.

```javascript
function isPalindrome(word) {
	let reversedWord = "";

	let i = word.length - 1;

	while (i >= 0) {}
}
```

# Step 4: Build the reversed word inside the loop

Each loop:

- grabs one character
- adds it to `reversedWord`
- moves the counter

```javascript
function isPalindrome(word) {
	let reversedWord = "";

	let i = word.length - 1;

	while (i >= 0) {
		reversedWord = reversedWord + word[i];

		i--;
	}
}
```

# Step 5: Compare the original word and reversed word

If they match, the word is a palindrome.

```javascript
function isPalindrome(word) {
	let reversedWord = "";

	let i = word.length - 1;

	while (i >= 0) {
		reversedWord = reversedWord + word[i];

		i--;
	}

	if (word === reversedWord) {
		return true;
	}
}
```

# Step 6: Handle the non-palindrome case

If the words don’t match, return `false`.

```javascript
function isPalindrome(word) {
	let reversedWord = "";

	let i = word.length - 1;

	while (i >= 0) {
		reversedWord = reversedWord + word[i];

		i--;
	}

	if (word === reversedWord) {
		return true;
	} else {
		return false;
	}
}
```

# Step 7: Ask the user for a word

```javascript
const userWord = prompt("Enter a word");
```

# Step 8: Call the function

Use the function’s return value to decide what to print.

```javascript
if (isPalindrome(userWord)) {
	console.log("This is a palindrome 🎉");
} else {
	console.log("This is NOT a palindrome.");
}
```

# Final Code

```javascript
function isPalindrome(word) {
	let reversedWord = "";

	let i = word.length - 1;

	while (i >= 0) {
		reversedWord = reversedWord + word[i];

		i--;
	}

	if (word === reversedWord) {
		return true;
	} else {
		return false;
	}
}

const userWord = prompt("Enter a word");

if (isPalindrome(userWord)) {
	console.log("This is a palindrome 🎉");
} else {
	console.log("This is NOT a palindrome.");
}
```

**Done 🎉**
