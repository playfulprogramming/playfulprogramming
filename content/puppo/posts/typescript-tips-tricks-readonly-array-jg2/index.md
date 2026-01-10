---
{
title: "Typescript - Tips & Tricks - Readonly Array",
published: "2021-03-10T07:21:31Z",
edited: "2021-09-09T07:04:57Z",
tags: ["typescript", "webdev"],
description: "function sortAndReverse(list: number[]): number[] {   return list.sort().reverse(); }  const list =...",
originalLink: "https://dev.to/this-is-learning/typescript-tips-tricks-readonly-array-jg2",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "11213",
order: 1
}
---

```ts
function sortAndReverse(list: number[]): number[] {
  return list.sort().reverse();
}

const list = [1, 4, 5, 2];
sortAndReverse(list);
console.log(list);
```

What's the result of the final console log?

1. \[ 1, 4, 5, 2 ]
2. \[ 5, 4, 2, 1 ]
3. \[ 2, 5, 4, 1 ]

Unfortunately, the correct answer is the second one.
![Unfortunately](./source.gif)

In this stupid example, you can see how some array methods can have some side effects. The sort and the reverse methods return a new array with the result but also they change the initial array.
Typescript can help us to prevent these side effects using read-only arrays.
The read-only arrays identify the methods that modify the initial array and raise an error when you call these methods.
But now, how can you use the read-only array? It's easy guys, you need to indicate the readonly modifier before the type of your array.
So, the previous example can change in this way

```ts
function sortAndReverse(list: readonly number[]): number[] {
  return list.slice().sort().reverse();
}

const list = [1, 4, 5, 2];
sortAndReverse(list);
console.log(list);
```

In this case, the *sortAndReverse* method returns as result "\[ 5, 4, 2, 1 ]" like in the first example, but more important is that the final console log returns "\[ 1, 4, 5, 2 ]", the initial value of the "list" array.
If in this case, you try to remove the "slice" method, you can see how typescript indicates an error (Property 'sort' does not exist on type 'readonly number\[]'), and it helps you to prevent strange side effects.

It's all for today!
Bye Bye Guys!
