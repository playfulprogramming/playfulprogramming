---
{
	title: "Week 6 - Tier 2 Homework",
	published: '2026-02-11T21:12:03.284Z',
	order: 1,
	noindex: true
}
---

This week, we showed an example of a "christmas tree" program, where we used a series of nested callbacks to write asynchronous logic.

For example:

```javascript
let count = 3;

buttonEl.innerText = count;

setTimeout(function () {
	count = count - 1;
	buttonEl.innerText = count;

	setTimeout(function () {
		count = count - 1;
		buttonEl.innerText = count;

		setTimeout(function () {
			count = count - 1;
			buttonEl.innerText = count;
		}, 1000)
	}, 1000)
}, 1000)
```

Using the "await" keyword, we can change the above code to use promises - and it's a lot easier to read!

```javascript
const buttonEl = document.querySelector("counter");

// Without `async`, the `await` keyword won't work
async function countdown() {
	let count = 3;

	buttonEl.innerText = count;

	await sleep(1000);

	count = count - 1;
	buttonEl.innerText = count;

	await sleep(1000);

	count = count - 1;
	buttonEl.innerText = count;

	await sleep(1000);

	count = count - 1;
	buttonEl.innerText = count;
}

buttonEl.onclick = countdown;

// Don't worry about this yet
function sleep(time) {
	return new Promise(function (resolve) {
		setTimeout(function() {
			resolve();
		}, time)
	})
}
```

## Writing a loading animation

For this assignment, let's use the `setTimeout()` function above to animate some "Loading..." text in the DOM. Given the following template:

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Typing Animation</title>
	</head>
	<body>
		<p id="loader">Loading...</p>

		<script>
			const loaderEl = document.querySelector("#loader");

			// Create a loading animation...
		</script>
	</body>
</html>
```

We want the `#loader` element to rotate between the text "Loading", "Loading.", "Loading..", and "Loading..." to show a visual indicator that the page is loading. Use a 500ms delay between each change.

Using the `.innerText` property, try to write this using the `setTimeout` function!

<details>
<summary>Solution</summary>

The animation can be achieved by nesting a few `setTimeout` calls as follows:

```js
setTimeout(() => {
	loaderEl.innerText = "Loading";
	setTimeout(() => {
		loaderEl.innerText = "Loading.";
		setTimeout(() => {
			loaderEl.innerText = "Loading..";
			setTimeout(() => {
				loaderEl.innerText = "Loading...";
			}, 500);
		}, 500);
	}, 500);
}, 500);
```

To make your animation loop, you'll need to place it in a function. You can invoke it at the end of the loop to repeat the process (this is called a "recursive function").

```js
const loaderEl = document.querySelector("#loader");

function runLoadingAnimation() {
	setTimeout(() => {
		loaderEl.innerText = "Loading";
		setTimeout(() => {
			loaderEl.innerText = "Loading.";
			setTimeout(() => {
				loaderEl.innerText = "Loading..";
				setTimeout(() => {
					loaderEl.innerText = "Loading...";
					runLoadingAnimation();
				}, 500);
			}, 500);
		}, 500);
	}, 500);
}

runLoadingAnimation();
```

If you open the page, you should see the text switch between the different strings to show the "Loading" animation.

</details>

## Improving it with `async`

Now, let's change our function into an `async function` and use the "sleep" function that we wrote in our lesson. This way, we can remove the christmas tree of `setTimeout` callbacks.

Remember to copy this function into your code:

```js
function sleep(time) {
	return new Promise(function (resolve) {
		setTimeout(function() {
			resolve();
		}, time)
	})
}
```

<details>
<summary>Solution</summary>

We can rewrite our `setTimeout` tree into the following function:

```js
async function runLoadingAnimation() {
	await sleep(500);
	loaderEl.innerText = "Loading";
	await sleep(500);
	loaderEl.innerText = "Loading.";
	await sleep(500);
	loaderEl.innerText = "Loading..";
	await sleep(500);
	loaderEl.innerText = "Loading...";
	runLoadingAnimation();
}
```

It's so much easier to read!

Also, now that we're using `await`, we don't need to call `runLoadingAnimation()` recursively anymore. Instead, we can rewrite it using a `while` loop:

```js
async function runLoadingAnimation() {
	while (true) {
		await sleep(500);
		loaderEl.innerText = "Loading";
		await sleep(500);
		loaderEl.innerText = "Loading.";
		await sleep(500);
		loaderEl.innerText = "Loading..";
		await sleep(500);
		loaderEl.innerText = "Loading...";
	}
}
```

</details>


<details>
<summary>Full Code</summary>

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Typing Animation</title>
	</head>
	<body>
		<p id="loader">Loading...</p>

		<script>
			const loaderEl = document.querySelector("#loader");

			function sleep(time) {
				return new Promise(function (resolve) {
					setTimeout(function() {
						resolve();
					}, time)
				})
			}

			async function runLoadingAnimation() {
				while (true) {
					await sleep(500);
					loaderEl.innerText = "Loading";
					await sleep(500);
					loaderEl.innerText = "Loading.";
					await sleep(500);
					loaderEl.innerText = "Loading..";
					await sleep(500);
					loaderEl.innerText = "Loading...";
				}
			}

			runLoadingAnimation();
		</script>
	</body>
</html>
```

</details>


