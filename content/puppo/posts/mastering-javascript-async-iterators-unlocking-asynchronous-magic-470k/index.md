---
{
title: "Mastering JavaScript Async Iterators: Unlocking Asynchronous Magic",
published: "2023-09-08T05:16:06Z",
tags: ["javascript", "iterators", "async"],
description: "In the ever-evolving landscape of JavaScript, staying up-to-date with its latest features is crucial...",
originalLink: "https://blog.delpuppo.net/mastering-javascript-async-iterators-unlocking-asynchronous-magic",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "24349",
order: 1
}
---

In the ever-evolving landscape of JavaScript, staying up-to-date with its latest features is crucial for writing efficient and modern code. One such feature that has garnered significant attention is the Async Iterator. While iterators have long been an integral part of JavaScript for sequential data processing, the introduction of asynchronous programming patterns brought about the need for asynchronous iteration.

Imagine effortlessly traversing through data streams that might involve fetching data from APIs, reading from files, or any other asynchronous data source. This is precisely where Async Iterators shine, providing a seamless and elegant solution to handle such scenarios. In this blog post, we'll delve into the world of JavaScript Async Iterators, exploring their fundamentals, understanding their benefits, and uncovering how they can be a game-changer in writing robust asynchronous code. Whether you're a seasoned developer looking to expand your skill set or a newcomer curious about advanced JavaScript techniques, this blog post is for you. We will unravel the power of Async Iterators and take your asynchronous programming skills to new heights.

Before we jump into the code, let's understand what async iterators are. In JavaScript, iterators are objects that allow us to loop over collections. Async iterators take this concept a step further by allowing us to handle asynchronous operations, like fetching data from APIs or reading from streams.

Creating an async iterable is simple. We use the `Symbol.asyncIterator` to define the async iterator method inside an object. This method will return an object with the `next` method that resolves a promise containing the `next` value in the asynchronous sequence.\
Let's take a look at an example.

```ts
const getUsers = (ids: number[]): AsyncIterable<User> => {
  return {
    [Symbol.asyncIterator]() {
      let i = 0;
      return {
        async next() {
          console.log("getUsers next");
          if (i === ids.length) {
            return { done: true, value: null };
          }
          const data = await fetch(
            `https://reqres.in/api/users/${ids[i++]}`
          ).then(res => res.json());
          return { done: false, value: data };
        },
      };
    },
  };
};
```

Imagine you have a list of IDs and want to read the user data only if needed. Using AsyncIterators, you can create a function that handles the API and returns the result of every request on every iteration, making the code more transparent.

To consume the values of an async iterable, we use the `for-await-of` loop. This loop works just like the regular `for-of` loop, but it's designed specifically for asynchronous iterables.

```ts
for await (const user of getUsers([1, 2, 3, 4, 5])) {
  console.log(user);
}
```

Error handling is crucial when dealing with asynchronous operations. Async iterators allow us to handle errors using `try-catch` blocks around the `for-await-of` loop.

```ts
try {
    for await (const user of getUsers([1, 2, 3, 4, 5])) {
      console.log(user);
    }
  } catch (err) {
    console.error(err);
  }
```

AsyncIterator runs code only if needed, so until you don't call the next method, nothing happens, like for Iterators.

The `return` method exists also for AsyncIterators. This method is used in case the code doesn't complete all the iterations. Imagine the loop calls a break or a return; in this case, JavaScript under the hood calls the `return` method for us. In this method, we can handle whatever we need. We may need to reset something or check the current value of the iterator.

```ts
const getUsers = (ids: number[]): AsyncIterable<User> => {
  return {
    [Symbol.asyncIterator]() {
      let i = 0;
      return {
        ...
        async return() {
          console.log("getUsers return");
          return { done: true, value: null };
        },
      };
    },
  };
};
```

Async Iterators are powerful like Iterators, and we can create functions that accept an AsyncIterator and manipulate it to return another Async Iterator. For instance, we can create a map function that accepts an Async Iterator and returns another with a callback specified by the user.

```ts
function map<T, U>(iter: AsyncIterable<T>, fn: (v: T) => U): AsyncIterable<U> {
  return {
    [Symbol.asyncIterator]() {
      const iterator = iter[Symbol.asyncIterator]();
      return {
        async next() {
          console.log("map next");
          const { done, value } = await iterator.next();
          if (done) return { done, value: null };
          return { done, value: fn(value) };
        },
        async return() {
          console.log("map return");
          if (iterator?.return) await iterator?.return();
          return { done: true, value: null };
        },
      };
    },
  };
}
```

These functions have all the benefits said before. Javascript does nothing until the codebase doesn't ask for the next function; the same is true for the `return` method, and now you can compose the `getUsers` with the `map` to build a new Async Iterator.

```ts
const iterator = map(getUsers([1, 2, 3, 4, 5]), user => user.data.id)
for await (const num of iterator) {
  if (num === 3) break;
  console.log(num);
}
```

And there you have it a deep dive into the world of asynchronous iterators in JavaScript. They provide an elegant solution to working with asynchronous data streams, making your code more organized and efficient. Experiment with async iterators in your projects, and you'll be amazed at how they simplify complex asynchronous workflows.

I also created a video on my [Youtube channel](https://www.youtube.com/@Puppo_92/), that you can find below.

{% embed https://youtube.com/watch?v=0\_mzZ9QOebg %}

If you found this content helpful, like and share it. And if you have any questions, feedback, or doubts, let me know in the comments 😀

Thanks for reading! And Happy coding! 👩💻 👨💻

N.B. you can find the code of this post [here](https://github.com/Puppo/javascript-iterators-and-generators/tree/03-async-iterators).

{% embed https://dev.to/puppo %}
