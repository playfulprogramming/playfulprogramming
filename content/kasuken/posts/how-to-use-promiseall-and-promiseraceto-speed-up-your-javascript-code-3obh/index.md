---
{
title: "How to Use Promise.all and Promise.race to Speed Up Your JavaScript Code",
published: "2023-05-09T12:35:00Z",
edited: "2023-05-08T06:04:14Z",
tags: ["javascript", "webdev"],
description: "In my previous article I described how to use Async and Await in Vanilla JavaScript.                 ...",
originalLink: "https://dev.to/this-is-learning/how-to-use-promiseall-and-promiseraceto-speed-up-your-javascript-code-3obh",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

In my previous article I described how to use Async and Await in Vanilla JavaScript.

<!-- ::start:link-preview -->
[Async and Await in Vanilla JavaScript](/posts/async-and-await-in-vanilla-javascript-2mep)
<!-- ::end:link-preview -->

In this article, I would like to work with parallel tasks in vanilla JavaScript.
Let's start!

## What are promise.all and promise.race?

Promise.all and promise.race are two methods that belong to the Promise object. They allow you to create a single promise that depends on the outcome of multiple promises. The difference between them is how they handle the results of the promises.

- **Promise.all** takes an iterable (such as an array) of promises as an argument and returns a promise that resolves with an array of the results of all the promises. If any of the promises rejects, the promise rejects with the reason of the first rejected promise.
- **Promise.race** takes an iterable (such as an array) of promises as an argument and returns a promise that resolves or rejects with the result or reason of the first promise that settles. It doesn't matter if the other promises are still pending or not.

## How to use promise.all and promise.race?

To use promise.all and promise.race, you don't need to install any library. They are part of the native JavaScript language. You can create promises using the new Promise constructor or using async functions or a mix of both ways:

```javascript
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => resolve('Promise 1'), 1000);
});

const promise2 = new Promise((resolve, reject) => {
  setTimeout(() => reject('Error Promise 2'), 2000);
});

const promise3 = async () => {
  const response = await fetch('https://example.com/api/data');
  return response.json();
};
```

To run these promises together, you can use promise.all:

```javascript
promise.all([promise1, promise2, promise3()])
  .then(results => {
    // results is an array of values from the resolved promises
    console.log(results);
  })
  .catch(error => {
    // error is the reason of the first rejected promise
    console.error(error);
  });
```

To run these promises in a race, you can use promise.race:

```javascript
promise.race([promise1, promise2, promise3()])
  .then(result => {
    // result is the value of the first settled promise
    console.log(result);
  })
  .catch(error => {
    // error is the reason of the first settled promise if it rejected
    console.error(error);
  });
```

## Why use promise.all and promise.race?

Using promise.all and promise.race can have several benefits for your code:

- They can improve the performance of your code by running multiple promises concurrently instead of sequentially.
- They can simplify your code by avoiding nested promises or async/await syntax.
- They can make your code more readable and expressive by using descriptive names for your promises.

## Conclusion

In this article, I showed you how to use promise.all and promise.race to handle multiple promises in a simple and elegant way. These methods can help you master asynchronous JavaScript and make your code faster and cleaner.

⚠️⚠️⚠️
Even though people commonly refer to the practice of running multiple promises at the same time as "running promises in parallel," it is not actual parallel processing. JavaScript, being a single-threaded language, cannot execute tasks in parallel by itself, except through the use of web workers or worker threads. Parallel processing needs running multiple tasks at the same time, usually on different threads, and JavaScript lacks the ability to do so.

> “Note that JavaScript is single-threaded by nature, so at a given instant, only one task will be executing, although control can shift between different promises, making execution of the promises appear concurrent. Parallel execution in JavaScript can only be achieved through worker threads.” - MDN Documentation

⚠️⚠️⚠️

If you have any questions or feedback, feel free to leave a comment below.

---

Are you interested in learning GitHub but don't know where to start? Try my course on LinkedIn Learning: [Learning GitHub](https://bit.ly/learninggithub).

![LinkedIn Learning](./sdc2bpiftpadibi4h51c.gif)

---

Thanks for reading this post, I hope you found it interesting!

Feel free to follow me to get notified when new articles are out 🙂

<!-- ::user id="kasuken" -->
