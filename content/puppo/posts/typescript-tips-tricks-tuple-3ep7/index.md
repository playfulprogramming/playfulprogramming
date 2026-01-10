---
{
title: "Typescript - Tips & Tricks - Tuple",
published: "2021-03-12T07:10:33Z",
edited: "2021-09-09T07:05:04Z",
tags: ["typescript", "webdev"],
description: "Tuple types allow you to express an array with a fixed number of elements whose types are known, but...",
originalLink: "https://dev.to/this-is-learning/typescript-tips-tricks-tuple-3ep7",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "11213",
order: 1
}
---

Tuple types allow you to express an array with a fixed number of elements whose types are known, but need not be the same.
This definition is picking from the typescript documentation.
The tuple type is a powerful type that helps you to identify the types of elements in an array, you can create special types where the elements of the array can have different types.
A simple example
```ts
type Point = [number, number];

const point1: Point = [10, 10];
const point2: Point = [10, "10"]; // Type 'string' is not assignable to type 'number'
const point3: Point = [10, 10, 20]; // Type '[number, number, number]' is not assignable to type 'Point'. Source has 3 element(s) but target allows only 2.
```
In this case, you can see how the point type is composed by a fixed array of two elements of type number. You can see how typescript detects this constraint and it raises an error when you try to create a point with the second element of type string or you try to create a point with 3 elements.
To show you the power of this type, here's another example
```ts
type QueryStringItem = [string, number | string | boolean];
const queryStringItem1: QueryStringItem = ["key1", 10];
const queryStringItem2: QueryStringItem = ["key2", "value2"];
const queryStringItem3: QueryStringItem = ["key3", false];
const queryStringItem4: QueryStringItem = ["key3", { value: "value" }]; // Type '{ value: string; }' is not assignable to type 'string | number | boolean'.
```
In this case, you can see how the second element of the Tuple can be a [union type](https://dev.to/puppo/typescript-tips-tricks-union-and-intersection-1a9l) of the types: number, string, or boolean; so typescript let you set the second element of the Tuple with one of these last three types. If you try to set the second element with a different type from number, string or boolean the typescript compiler raises an error.

That's all from the Tuple type.
See you soon guys!
 