---
{
title: "Typescript - Tips & Tricks - this parameter",
published: "2021-02-26T07:04:34Z",
edited: "2021-09-09T07:03:47Z",
tags: ["typescript", "webdev"],
description: "Hello everybody and welcome back, today I'll talk about this parameter.  Sometimes we need to create...",
originalLink: "https://dev.to/this-is-learning/typescript-tips-tricks-this-parameter-7n6",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "11213",
order: 1
}
---

Hello everybody and welcome back, today I'll talk about [this parameter](https://www.typescriptlang.org/docs/handbook/functions.html#this-parameters).

Sometimes we need to create functions that have to know the context to run correctly.
A simple example, the mathematical power must know the base and the exponent number to run correctly.
So we could create a simple method like this:

```ts
function pow(exponent: number) {
  return Math.pow(this.number, exponent);
}

const basePow = {
  base: 2,
  pow,
};

console.log(basePow.pow(2));
```

If we build and run this code, the console log's result will be "NaN", because in the pow method the value of the field "this.number" is undefined.
*N.B. if you build this code with the strict mode on true, the compiler detects the problem at build time and so the build fails*

But now I explain the solution.
In this case, the problem is the "number" field that doesn't exist in this context.
Typescript helps us to prevent this error, it allows us to indicate the "this" type as a parameter.
To do this, we need to declare the "this" context as the first parameter of the function, so typescript detects the "this" type and it helps us to prevent errors and bugs.
So the code in the previous example should be rewritten like this:

```ts
function pow(this: { base: number }, exponent: number) {
  return Math.pow(this.base, exponent);
}

const basePow = {
  base: 2,
  pow,
};

console.log(basePow.pow(2));
```

In this case, the result at runtime is "4" as expected.
If by chance we write the "basePow" object like this:

```ts
const basePow = {
  value: 2,
  pow,
};
```

when we try to call the method "basePow.pow(2)", the typescript language detects the error, and in this case, when we try to build the code the build fails.

That's all!
See you soon guys!
