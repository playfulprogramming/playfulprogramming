---
{
title: "Typescript - Tips & Tricks - Never type",
published: "2021-03-17T07:07:35Z",
edited: "2021-09-09T07:05:35Z",
tags: ["typescript", "webdev"],
description: "Today I want to talk about the never type. As you can understand, this type identifies a piece of...",
originalLink: "https://dev.to/this-is-learning/typescript-tips-tricks-never-type-5f0p",
coverImg: "cover-image.png",
socialImg: "social-image.png",
collection: "Typescript - Tips & Tricks",
order: 14
}
---

Today I want to talk about the [never type](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-never-type).
As you can understand, this type identifies a piece of code that will never be executed or represents a state that shouldn’t exist.
Here an example

```ts
const throwException: () => never = () => {
    throw new Error();
};
throwException()
console.log('never called');
```

In this simple example, you can see how the "throwException" method never permits the code execution of the console.log. In this case, the "throwException" method returns the *never* type because the method doesn't return any value but throws an error.
To better understand the never type I show you another simple example

```ts
type Square = {
    kind: "square";
    size: number;
};

type Rectangle = {
    kind: "rectangle";
    with: number;
    height: number;
};

type Circle = {
    kind: "circle";
    radius: number;
};

type Shape = Square | Rectangle | Circle;

const area = (shape: Shape): number => {
    if (shape.kind === "square") return shape.size * shape.size;
    if (shape.kind === "rectangle") return shape.with * shape.height;
    // if (shape.kind === "circle") return shape.radius * 2 * Math.PI;

    const _exhaustiveCheck: never = shape; // Type 'Circle' is not assignable to type 'never'.
    return _exhaustiveCheck;
};
```

In this example, you can see how the "area" method detects the kind of the shape and it calculates the relative area.
I leave the circle type comment voluntarily, so I can show you the power of the never type.
At the end of the area method, you can see how the code assigns the shape to the field "\_exhaustiveCheck" of type *never*. In this case, the typescript language detects that if you pass a circle shape at the area method, the line "const \_exhaustiveCheck: never = shape;" will be executed, so it notifies you raising an error. The typescript language detects that the never type could be executed at runtime so it tries to prevent this problem.
To fix this problem the previous method can be reviewed in this way

```ts
type Square = {
    kind: "square";
    size: number;
};

type Rectangle = {
    kind: "rectangle";
    with: number;
    height: number;
};

type Circle = {
    kind: "circle";
    radius: number;
};

type Shape = Square | Rectangle | Circle;

const area = (shape: Shape): number => {
    if (shape.kind === "square") return shape.size * shape.size;
    if (shape.kind === "rectangle") return shape.with * shape.height;
    if (shape.kind === "circle") return shape.radius * 2 * Math.PI;

    const _exhaustiveCheck: never = shape;
    return _exhaustiveCheck;
};
```

Now the code is compiled successfully and the never type is assigned correctly.

From the never type it's all.
See you soon guys
