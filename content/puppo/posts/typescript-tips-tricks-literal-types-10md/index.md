---
{
title: "Typescript - Tips & Tricks - Literal Types",
published: "2021-02-17T07:16:17Z",
edited: "2021-09-09T07:02:32Z",
tags: ["typescript", "webdev"],
description: "Welcome back! Today I show you the Literal Types.  This feature permits you to create a set of...",
originalLink: "https://dev.to/this-is-learning/typescript-tips-tricks-literal-types-10md",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "11213",
order: 1
}
---

Welcome back!
Today I show you the [Literal Types](https://www.typescriptlang.org/docs/handbook/literal-types.html).

This feature permits you to create a set of relationship values.
```ts
type Direction = "North" | "South" | "East" | "West";
```
Literal types in this case create also a Type Guard of your field, so the compiler can detect your errors or your typos.
```ts
let directionError: Direction = "east" // Type '"east"' is not assignable to type 'Direction'
let direction: Direction = "East" // OK
```
You can create Literal Types from different types such as booleans, numbers, and strings, and you can combine together different types too.
```ts
type Valid = false | 0 | true | 1;
```

That's all for today
See you soon guys!