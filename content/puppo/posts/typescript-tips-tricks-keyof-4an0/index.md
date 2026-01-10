---
{
title: "Typescript - Tips & Tricks - keyof",
published: "2021-02-19T07:15:37Z",
edited: "2021-09-09T07:02:22Z",
tags: ["typescript", "webdev"],
description: "Welcome back! Today I'll talk about the keyof operator.  This operator helps us to extract the...",
originalLink: "https://dev.to/this-is-learning/typescript-tips-tricks-keyof-4an0",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "11213",
order: 1
}
---

Welcome back!
Today I'll talk about the **keyof** operator.

This operator helps us to extract the object's properties such as [Literal-types](https://dev.to/puppo/typescript-tips-tricks-literal-types-10md)

```ts
type Person = {
  firstName: string;
  surName: string;
  age: number;
  location: string;
};

type PersonKeys = keyof Person; // "firstName" | "surName" | "age" | "location"
```

This operator can help us to create new methods that should depend of other types; e.g.

```ts
function get<T, K extends keyof T>(obj: T, prop: K): T[K] {
  return obj[prop];
}

function set<T, K extends keyof T>(obj: T, prop: K, value: T[K]): void {
  obj[prop] = value;
}
```

but also to create new types from other types e.g

```ts
type ReadOnly<T> = {
  readonly [K in keyof T]: T[K];
};

type ReadOnlyPerson = ReadOnly<Person>
/*
type ReadOnlyPerson = {
    readonly firstName: string;
    readonly surName: string;
    readonly age: number;
    readonly location: string;
}
*/
```

How we can see this operator is more powerful and it can help us to create new strict type or new strict methods.

That's all for today.
See you soon guys!
