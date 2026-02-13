---
{
title: "Async and Await in Vanilla JavaScript",
published: "2023-05-04T18:47:01Z",
tags: ["javascript", "webdev", "webassembly"],
description: "In the last couple of years I work a lot with Blazor WebAssembly for my personal projects and, first...",
originalLink: "https://https://dev.to/playfulprogramming/async-and-await-in-vanilla-javascript-2mep",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

In the last couple of years I work a lot with Blazor WebAssembly for my personal projects and, first of all, for my main job.
Time to time I need to invoke some JavaScript code to perform some specific operations.
In this case I never use a specific JavaScript framework, so many functions I have to do in vanilla JavaScript.

If you have ever worked with asynchronous code in JavaScript, you probably know how challenging it can be to handle callbacks, promises, and errors. Fortunately, there is a syntactic feature that can make your life easier: async and await.

Async and await are keywords that allow you to write asynchronous code in a more readable and concise way. They are based on promises, but they let you avoid the nesting and chaining of then() and catch() methods. Instead, you can use the await keyword to pause the execution of an async function until a promise is resolved or rejected. This way, you can write asynchronous code as if it was synchronous.

## How to use async and await

To use async and await, you need to do two things:

- Declare an async function with the async keyword before the function name or the arrow function.
- Use the await keyword inside the async function to wait for a promise to resolve or reject.

Here is a simple example of an async function that fetches some data from an API and logs the result in the console:

```javascript
async function fetchData() {
  let response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
  let data = await response.json();
  console.log(data);
}

// Call the async function
fetchData();
```

Notice how the code looks like synchronous code, even though it is performing asynchronous operations. The await keyword makes the JavaScript engine pause the execution of the async function until the promise is settled. Then, it resumes the execution with the resolved value of the promise.

You can also use try...catch blocks to handle errors in async functions, just like in synchronous code. For example:

```javascript
async function fetchData() {
  try {
    let response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    let data = await response.json();
    console.log(data);
  } catch (error) {
    // Handle the error
    console.error(error);
  }
}
```

## Pros of async and await

Using async and await can have several benefits for your code quality and readability:

- It reduces the boilerplate code and indentation that comes with using promises and callbacks.
- It makes the code more linear and intuitive, as it follows the natural flow of execution.
- It improves the error handling, as you can use standard try...catch blocks instead of catch() methods or rejection callbacks.
- It makes it easier to debug the code, as you can use breakpoints and step through the code as if it was synchronous.

## Cons of async and await

While async and await are very useful and powerful features, they also have some caveats that you should be aware of:

- You can only use await inside an async function. If you try to use it outside an async function, you will get a syntax error.
- An async function always returns a promise, even if you don't explicitly return one. This means that you need to use then() or await to get the value returned by an async function.
- Using await will block the execution of the current async function, but not the whole program. Other functions or events that are not dependent on the awaited promise will still run in the background.
- You should avoid using await in loops or parallel tasks, as it will make your code run sequentially instead of concurrently. Instead, you should use Promise.all() or Promise.race() to wait for multiple promises at once.

You can find more information about Promise.all() and Promise.race() [here](https://blog.devgenius.io/javascript-promise-all-vs-promise-race-b23a38605fd0).

## Conclusion

Async and await can improve your code quality and readability, as well as your error handling and debugging experience. However, they also have some caveats that you should be aware of, such as using them only inside async functions, handling their return values properly, and avoiding them in loops or parallel tasks.

If you want to learn more about async and await, you can check out the following link: [MDN Web Docs: Async functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

---

Are you interested in learning GitHub but don't know where to start? Try my course on LinkedIn Learning: [Learning GitHub](https://bit.ly/learninggithub).

![LinkedIn Learning](./sdc2bpiftpadibi4h51c.gif)

---

Thanks for reading this post, I hope you found it interesting!

Feel free to follow me to get notified when new articles are out 🙂

<!-- ::user id="kasuken" -->
