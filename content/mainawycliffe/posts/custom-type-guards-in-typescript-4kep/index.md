---
{
title: "Custom Type Guards in Typescript",
published: "2021-09-16T07:53:40Z",
edited: "2021-09-16T14:41:39Z",
tags: ["typescript", "javascript", "webdev", "node"],
description: "Previously, we covered various approaches that you can take to narrowing types in Typescript. Type...",
originalLink: "https://mainawycliffe.dev/blog/custom-type-guards-in-typescript",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "14315",
order: 1
}
---

Previously, we covered various approaches that you can take to narrowing types in Typescript. Type narrowing is the process of moving the type of a variable from a less precise to a more precise type i.e. from a union of string and number to string only. You can learn more about type narrowing [here](https://mainawycliffe.dev/blog/type-guards-and-narrowing-in-typescript).

In this article, we are going to look at how we can create our own custom type guards. Custom type guards will help you to check if a variable is of a certain type before usage, which helps in Type narrowing.

Take for instance the following function, which calculates the area of a shape i.e. Circle or Rectangle.

```ts
function calculateArea(shape: Rectangle | Circle) {
	// calculate area
}
```

In order to calculate the area, we will need to determine whether the shape being passed in is a Rectangle or Circle. We can create a custom type guide that will check if the type of a `Rectangle` and calculate its area, otherwise calculates the area of a circle:

```ts
if(isRectangle(shape)) {
	// calculate area of a rectangle
} else {
	// calculate area of a circle
}
```

## What is a Type Predicate?

A type predicate is a function return type that tells typescript a parameter is of a specific type. A predicate takes the following format: `parameterName is Type`, where `parameterName` must be the name of a parameter in the function parameter signature.

For instance, if we wanted to build the custom type guard `isRectangle` above, our type predicate would be `shape is Rectangle`, where `shape` is the parameter name, as shown below.

```ts
function isRectangle(shape: unknown): shape is Rectangle {
	// function body
}
```

## Custom Type Guard

To define a custom type guard, we create a function that returns a type predicate. The function itself just needs to return true or false. If we take the example above for `isRectangle` type guard, we would check if the `width` and the `height` are present and return `true`, otherwise, return `false`.

```ts
function isRectangle(shape: unknown): shape is Rectangle {
  if ("width" in shape && "height" in shape) {
  	// this is a rectangle
  	return true; 
  }
  // it's not a rectangle
  return false;
}
```

In the above example, we are using Javascripts [in operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/in) to check if the width and height properties are in the shape object.

### Usage

To use the custom type guard, we use it just like any other function that returns a boolean.

```ts
type Rectangle = {
  height: number;
  width: number;
}

type Circle = {
  radius: number;
}

const r: Rectangle = {
  height: 12,
  width: 15
}

const c: Circle = {
  radius: 10,
}

console.log(isReactangle(r)); // true
console.log(isReactangle(c)) // false
```

By using it within a control flow, you can narrow the type of the variable, just like other methods of narrowing types.

```ts
function area(shape: Rectangle | Circle) {
  if(isRectangle(shape)) {
    // Rectangle
    shape.height // no error
    shape.radius // error
  } else {
    // Circle
    shape.radius // no error
    shape.height // error
  }
}
```

## Conclusion

In this brief article, we learned what a Type predicate is and how to build custom type guards. We learned that a type guard is a special function that returns a type predicate so that typescript is able to determine the type of a variable.

We will continue covering similar topics in Typescript in this series - [A Byte of Typescript](https://mainawycliffe.dev/blog/tags/a-byte-of-typescript). A Byte of Typescript is a new series that I will be publishing on a regular basis to help you demystify Typescript.

If you are looking to learn more about Typescript, here are the previous articles I have published. Thank you 😄.

- [Typescript: why you should use unknown instead of any](https://mainawycliffe.dev/blog/typescript-use-unknown-instead-of-any)
- [Type Narrowing in TypeScript](https://mainawycliffe.dev/blog/type-guards-and-narrowing-in-typescript)
- [Types and Mocking - Typescript](https://mainawycliffe.dev/blog/types-and-mocking-typescript)
- [Template Literal Types in TypeScript](https://mainawycliffe.dev/blog/template-literal-types-in-typescript)
- [Transforming Types in TypeScript with Utility Types](https://mainawycliffe.dev/blog/transforming-types-typescript-utility-types)
