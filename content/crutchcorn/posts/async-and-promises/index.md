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

<video src="./blocked_main_thread.mp4" title="A user trying to interact with the UU homepage, leading to none of the mouse interactions working out"></video>

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

This isn't inherently unique to I/O operations, however; you can block the main thread with any sufficiently expensive syncronous code.

## Async Operations

Now assume we have the following implementation of `sleep`, which forces our codebase to wait a certain number of seconds:

```javascript
function sleep(seconds) {
  setTimeout(() => {
		// How do we know when this timer is done?
  }, seconds * 1000);
}
```

Were this `setTimout` function syncronous, it would prevent the user from interacting with your homepage for however long you asked to wait.

But instead, if we run `sleep` in our code, you'll notice that other code is able to execute before the `setTimeout` finished:

```javascript
sleep(1000)
console.log("I am running before the setTimeout is done");
```

So then how can we tell our code that `sleep` is done and it should execute the next line of code?

There's two ways to do this:

- Callbacks
- Promises

## Callbacks

If we piggy-back off of [the idea that you can pass a function to another function](/posts/javascript-functions-are-values), we can make it so that you pass a function that's called when the `setTimeout` is done executing:

```javascript
function sleep(callback, seconds) {
  setTimeout(() => {
    callback();
  }, seconds * 1000);
}

sleep(() => {
  console.log("The sleep is finished");
}, 1)
```

This is how older JavaScript APIs functioned due to its intuitive nature, but comes with some flaws; Namely when you want to compose multiple `sleep`s one-by-one:

````javascript
sleep(() => {
    sleep(() => {
        sleep(() => {
            sleep(() => {
                sleep(() => {
                    sleep(() => {
                        sleep(() => {
                            sleep(() => {
                                sleep(() => {
                                    sleep(() => {
                                        console.log("10 seconds have passed")
                                    }, 1)
                                }, 1)
                            }, 1)
                        }, 1)
                    }, 1)
                }, 1)
            }, 1)
        }, 1)
    }, 1)
}, 1)
````

This is the biggest problem with callbacks; it leads to multiple chained items leading to a nested structure colloquially called a "Christmas Tree".

To solve this, we can reach for promises to handle the async nature of `sleep`.

## Async Promises

