---
{
	title: "Week 6 - Tier 2 Homework",
	description: "",
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

For this assignment, let's use the `sleep()` function above to write 
