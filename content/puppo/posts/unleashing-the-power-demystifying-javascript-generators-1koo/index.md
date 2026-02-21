---
{
title: "Unleashing the Power: Demystifying JavaScript Generators",
published: "2023-09-01T04:38:50Z",
edited: "2023-09-01T06:11:54Z",
tags: ["javascript", "generators", "generator"],
description: "Welcome to this blog post, where we're diving into the fascinating world of JavaScript generators. If...",
originalLink: "https://blog.delpuppo.net/unleashing-the-power-demystifying-javascript-generators",
coverImg: "cover-image.png",
socialImg: "social-image.png",
collection: "Javascript Iterators & Generators",
order: 2
}
---

Welcome to this blog post, where we're diving into the fascinating world of JavaScript generators. If you're looking to take your coding skills to the next level and explore a powerful tool for managing operations, you've come to the right place.

In the fast-paced landscape of web development, managing tasks and handling complex flows of data can be quite challenging. This is where JavaScript generators come into play. These remarkable constructs introduce a new level of control and flexibility, allowing developers to write code that can be paused, resumed, and iterated step by step.

In this blog post, we'll take you on a journey through the core concepts of JavaScript generators. We'll unravel their syntax, explore their capabilities, and showcase examples of how they can simplify your code and make it more manageable. By the end of this read, you'll not only understand the ins and outs of generators but also be equipped with the knowledge to start using them effectively in your own projects.

Buckle up as we embark on this exploration of JavaScript generators, unravelling their potential and discovering how they can revolutionize the way you write code. Whether you're a seasoned developer or just starting with JavaScript, there's something valuable here for you. Let's begin!

A generator in JavaScript is a function that, after the function keyword, has a `*`. It's not possible to create generators in JavaScript using arrow functions. Generators are special functions that implement the Iterable interface very simply; you can learn more about them in this blog post. The particularity of generators is the `yield` keyword. Using the `yield`, we can return a new value to the iteration but without ending the function execution, simply putting it on pause, until the next request for the next value and until it's not completed.

```ts
function* range(start: number, end: number): Iterable<number> {
  let n = start;
  while (n <= end) {
    console.log("range next");
    yield n++;
  }
}
```

As you can notice, the range generator is a simple generator function, and it's understandable from the `*` near-function keyword. Using a simple while, the function checks if the current value is less or equal to the end value and if true, using the `yield` returns the value; else exists from the while and closes the generator. Like iterators, generators only run once someone calls for the `next` value.

It's possible to go through a generator using a simple for-of-loop.

```ts
for (const num of range(1, 10)) {
  console.log(num);
}
```

Using the Iterable interface

```ts
const iterator = range(1, 10)[Symbol.iterator]();
while (true) {
  const { done, value } = iterator.next();
  if (done) break;
  console.log(value);
}
```

Or using the spread operator to save all the values in an Array.

```ts
for (const num of [...range(1, 10)]) {
  console.log(num);
}
```

It's important to remember that if you use the spread operator, you will lose all the generators' benefits because it runs the generator until it's not completed to copy all the values in the array.

Like iterators also, generators can be combined. For instance, we can create a map generator function that accepts an iterator and a transformation function and returns the computation inside the transformation with the value emitted by the generator.

And that's the result.

```ts
function* map<T, U>(
  iterable: Iterable<T>,
  callback: (value: T) => U
): Iterable<U> {
  for (const value of iterable) {
    yield callback(value);
  }
}

const mapRange = map(range(1, 10), value => value * 10);

for (const num of mapRange) {
  console.log(num);
}
```

That's all folks. You can find a video about them on my [Youtube channel](https://www.youtube.com/@Puppo_92/).

<iframe src="https://www.youtube.com/watch?v=mi2JlrXBRIs"></iframe>

In conclusion, JavaScript generators stand as a remarkable tool in the arsenal of every developer striving for more efficient and flexible programming. Through their unique ability to pause and resume execution, generators provide an innovative solution to managing complex flows of data and operations.

Throughout this blog post, we've journeyed through the syntax, use cases, and benefits of JavaScript generators. We've seen how they can simplify code, making it more readable and maintainable.

By harnessing the power of generators, you can transform the way you approach programming challenges. These constructs not only offer a structured approach to handling tasks but also contribute to writing code that is less error-prone and easier to reason about.

As you venture into the realm of generators, remember that practice is key. Experiment with different scenarios, explore their interplay with other techniques and gradually integrate them into your projects. With time, you'll become proficient in leveraging generators to create responsive and efficient applications.

So, whether you're a front-end developer aiming to tame complex UI interactions or a back-end engineer dealing with intricate data processing, generators offer a fresh perspective on tackling programming. Embrace their power, refine your skills, and elevate your coding prowess in the dynamic world of JavaScript.

Thank you for reading and happy generating! 👩💻 👨💻 😜

N.B. you can find the code of this post [here](https://github.com/Puppo/javascript-iterators-and-generators/tree/02-generators).

<!-- ::user id="puppo" -->
