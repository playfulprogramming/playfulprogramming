---
{
title: "Typescript - Tips & Tricks - Type Guard",
published: "2021-03-22T07:13:17Z",
edited: "2021-09-09T07:06:33Z",
tags: ["typescript", "webdev"],
description: "There are some cases, where we need to detect the type of the object to get the correct...",
originalLink: "https://dev.to/this-is-learning/typescript-tips-tricks-type-guard-50e5",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "11213",
order: 1
}
---

There are some cases, where we need to detect the type of the object to get the correct implementation of our method.
Let me show you a case
```ts
type Square = {
  size: number;
};

type Rectangle = {
  with: number;
  height: number;
};

type Circle = {
  radius: number;
};

type Shape = Square | Rectangle | Circle;

const area = (shape: Shape) => {
  if ("size" in shape) return shape.size * shape.size;
  if ("with" in shape) return shape.with * shape.height;
  if ("radius" in shape) return shape.radius * 2 * Math.PI;
};
```
In this case, in the area method, we need to detect the type of the shape to return the correct result.
Here we detect the type of the shape in the if condition but typescript permits us to create a special function that identifies if a type is of a specific type or not.
These functions are created to have Type Guards that help the compiler, the intellisense, and us to understand the correct type of the object.
To show you this function in action, the previous example can be rewritten in this way.
```ts
Square = {
  size: number;
};

type Rectangle = {
  with: number;
  height: number;
};

type Circle = {
  radius: number;
};

type Shape = Square | Rectangle | Circle;

function isSquare(shape: Shape): shape is Square {
  return "size" in shape;
}

function isRectangle(shape: Shape): shape is Rectangle {
  return "with" in shape;
}

function isCircle(shape: Shape): shape is Circle {
  return "radius" in shape;
}

const area = (shape: Shape) => {
  if (isSquare(shape)) return shape.size * shape.size;
  if (isRectangle(shape)) return shape.with * shape.height;
  if (isCircle(shape)) return shape.radius * 2 * Math.PI;
};
```
As you can see, the methods: isSquare, isRectangle, and isCircle get a shape as parameter and return a boolean value. If the result is true the shape parameter corresponds to the type indicated to the right of the is keyword, otherwise, it corresponds to another type.

I hope this feature will help you in the future and improve the reading of your code.

It's all Guy!
See you soon!