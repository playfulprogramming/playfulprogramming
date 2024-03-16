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











Now assume we have the following implementation of `sleep`, which forces our codebase to wait a certain number of seconds:

```javascript
function sleep(seconds) {
  setTimeout(() => {
		// How do we know when this timer is done?
  }, seconds * 1000);
}
```

