---
{
title: "Typescript - Tips & Tricks - Overloaded Functions",
published: "2021-02-24T07:14:55Z",
edited: "2021-09-09T07:03:30Z",
tags: ["typescript", "webdev"],
description: "Welcome back, guys! The topic of today is Overloaded Functions.  All self-respecting programming...",
originalLink: "https://dev.to/this-is-learning/typescript-tips-tricks-overloaded-functions-f75",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "Typescript - Tips & Tricks",
order: 5
}
---

Welcome back, guys!
The topic of today is [Overloaded Functions](https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html#overloaded-functions).

All self-respecting programming languages ​​have overloaded functions, so typescript has this feature too.
To use this feature in typescript, we have to declare all the signatures of this function, and at the end, we have to write a single function that includes all these signatures. The last function is the only one with the implementation. The peculiarity of this function is that it must include all the possible implementations of the previous signatures.
Here's a simple example that is more exhaustive than all these words.

```ts
function reverse(value: string): string;
function reverse(value: string[]): string[];
function reverse(value: string | string[]): string | string[] {
  if (typeof value === "string") return value.split("").reverse().join("");

  return value.slice().reverse();
}

console.log(reverse("Tips")); // 'spiT'
console.log(reverse(["T", "i", "p", "s"])); // [ 's', 'p', 'i', 'T' ]
```

As we can see, there are 2 signatures of the "reverse" function, one gets a string and returns a string as result, the second one gets a string array and returns a string array as result. The third function is the real implementation of this function. As we can see the parameter type is a literal-type that includes a string or a string array (the combination of the type in the signatures' parameters), we can make the same considerations for the result's type.
In the function implementations, we detect the parameter's type at runtime and manipulate the parameter to return the correct type according to the function we are overloading.

An important thing to remember is that the implementation function is not exposed.

That's all for today!
See you soon guys!
