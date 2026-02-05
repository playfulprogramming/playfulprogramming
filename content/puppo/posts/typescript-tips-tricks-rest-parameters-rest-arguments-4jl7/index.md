---
{
title: "Typescript - Tips & Tricks - Rest Parameters & Rest Arguments",
published: "2021-04-02T06:11:02Z",
edited: "2021-09-09T07:06:42Z",
tags: ["typescript", "webdev"],
description: "Hi guy and welcome back :) Today I'll talk about the Rest Parameters and the Rest...",
originalLink: "https://dev.to/this-is-learning/typescript-tips-tricks-rest-parameters-rest-arguments-4jl7",
coverImg: "cover-image.png",
socialImg: "social-image.png",
collection: "Typescript - Tips & Tricks",
order: 21
}
---

Hi guy and welcome back :)
Today I'll talk about the Rest Parameters and the Rest Arguments.
Sometimes we need to write a simple code like this:

```ts
function multiply(a: number, b: number): number {
  return a * b;
}

const result1 = multiply(2, 2); // 4
const result2 = multiply(2, 3); // 3
```

but after a while the customer asks us to multiply for unbounded numbers, so we need to change our code.
In these cases, typescript helps us with a feature called Rest Parameters.
This feature permits us to identify this list of parameters as an array type so we can leave our consumer to call the method with the correct number of items he needs, and we can manipulate these parameters more easily.
Therefore the previous example can be transformed in this way

```ts
function multiply(a: number, ...args: number[]): number {
  return args.reduce((acc, curr) => acc * curr, a);
}

const result1 = multiply(2, 2, 2); // 8
const result2 = multiply(2, 3, 2, 2); // 24
```

As you can see, now the consumer can call the "multiply" method as he prefers and our code responds correctly in all cases.
In this example, we have called the "multiply" method with a fixed number of elements, 3 in the first case and 4 in the second one. But in some cases, we don't know the correct number of elements and maybe they are in an array.
To resolve these cases, typescript has another important feature tied to the Rest Parameters, the Rest Arguments.
This feature helps us to convert the array elements to a list of parameters.
Thus, we can call the "multiply" method in this way too.

```ts
const result1 = multiply(2, ...[2, 2]); // 8
const result2 = multiply(2, ...[3, 2, 2]); // 24
```

I think that these two features are really powerful, and can help you to manipulate large numbers of parameters and take your code simple and flexible.

And now a special greeting.
This is the last post of this series [Typescript - Tips & Tricks](https://dev.to/puppo/series/11213), I hope you enjoyed the series and it will help you in your daily work.

Many Thanks to have read the series.
It's not a goodbye, I'll get back soon with other topics.

Bye, Bye Guys!
