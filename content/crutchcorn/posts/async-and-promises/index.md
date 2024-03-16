---
{
	title: "Explaining JavaScript Promises and Async Functions",
	description: "",
	published: '2024-03-16T13:45:00.284Z',
	tags: ['javascript', 'webdev'],
	license: 'cc-by-nc-sa-4'
}
---

When using JavaScript, you'll likely to've run into a function like `fetch` that doesn't pass you a value immediately.

```javascript
const res = fetch("example.com/something");
   // ^? Promise<"resolving">
```

If you try to rely on the value returned from `fetch` without anything else; you'll likely run into something you won't expect:

```javascript
const json = res.json();
// VM303:1 Uncaught TypeError: res.json is not a function
```

This is because `res` is a `Promise`, which does not have a `json` method on it. It isn't unless you do:

```javascript
fetch("example.com/something")
    .then(res => res.json());
```

Or:

```javascript
const res = await fetch("example.com/something");
const json = res.json();
```

That you'll see the JSON returned from this endpoint.

Why is this? What is `.then` or `await` doing? Are they interchangable?

Let's dive in and explain more.

# Sync and Async Values

Let's take a step back for a moment and talk about sync and async functions. 

Look at the following code that's written to add up as many numbers as you pass:

```javascript
function sumNumbers(numbers) {
  let total = 0;
  for (let i = 0; i < numbers.length; i++) {
    total += numbers[i];
  }
  return total;
}

const sum = sumNumbers([1, 2, 3]);
   // ^? 6
```

Here, `sum` is assigned the number of `6` from `sumNumbers`. This type of code is known as `synchronous` code; meaning that it runs each line of code sequentially until the execution of the code is finished.

For example, you don't have to use any kind of special syntax to tell the `for` loop that you want to wait for the next value. It runs each items in the for loop one-by-one:

``` javascript
function logEachItem(items) {
  for (let i = 0; i < items.length; i++) {
    console.log(items[i]);
  }
}

/**
 * This will always log `1`, then `2`, then `3`
 * Because the `for` loop is sequential, 
 * it runs the same order every time
 */
logEachItem([1, 2, 3]);
```

This is often the default for many functions in JavaScript.

But every now and then this type of code becomes a problem when you remember that [JavaScript is single-threaded](https://www.youtube.com/watch?v=8aGhZQkoFbQ), and that expensive synchronous code can block the main thread.

When the main thread is blocked, it means a few things for your users: 

- The user can't select text
- The user can't type into a text area or text input
- Any other interactivity is blocked

We can see this behavior when the main thread is blocked on [the Unicorn Utterances homepage](https://unicorn-utterances.com):

<video src="./blocked_main_thread.mp4" title=""></video>

>  So how can you accidentally block the main thread?

Let's say we take the previous `logEachItem` function and apply it over a massive array with a length of `300,000` items:

```javascript
function logEachItem(items) {
  for (let i = 0; i < items.length; i++) {
    console.log(items[i]);
  }
}

const items = Array.from({length: 300000}, (_, i) => i);
logEachItem(items)
```

While adding these numbers might not block the main thread, any I/O operation is fairly expensive comparatively; which leads to this usage blocking the main thread.



















Now assume we have the following implementation of `sleep`, which forces our codebase to wait a certain number of seconds:

```javascript
function sleep(seconds) {
  setTimeout(() => {
		// How do we know when this timer is done?
  }, seconds * 1000);
}
```

