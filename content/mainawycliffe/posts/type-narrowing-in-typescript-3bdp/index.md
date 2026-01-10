---
{
title: "Type Narrowing in TypeScript",
published: "2021-08-26T09:41:32Z",
edited: "2021-08-26T10:04:14Z",
tags: ["typescript", "webdev", "javascript", "programming"],
description: "In the spirit of my last few articles, where we have looked into Template Literal Types and Types and...",
originalLink: "https://mainawycliffe.dev/blog/type-guards-and-narrowing-in-typescript",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "14315",
order: 1
}
---

In the spirit of my last few articles, where we have looked into [Template Literal Types](https://mainawycliffe.dev/blog/template-literal-types-in-typescript) and [Types and Mocking](https://mainawycliffe.dev/blog/types-and-mocking-typescript), we are going to dissect another topic in typescript involving types. In this article, we are going to learn various ways you can narrow types. Type narrowing is the process of moving a type from a less precise type to a more precise type.

Let's start with a simple function:

```ts
function friends(input: string | number) {
	// code here
}
```

The above function can either take a number or a string. Let's say we want to perform different actions based upon whether `input` is a number or a string. In this case, we will use Javascripts type guards to check if it's a string or number, as shown below:

```ts
function someFunc(input: string | number) {
  if(typeof input === "string") {
    // do something with the string
    console.log("input is a string");
  }

  if(typeof input === "number") {
    // do something with number
    console.log("input is a number");
  }
}
```

## Type Guards

In the above example, we used Javascripts type guards to narrow the type of `input` to either number or string. Type guards are used to check if a variable is of a certain type, i.e. `number`, `string`, `object`, etc. When a type guard is used, Typescript expects that variable to be of that type. It will automatically type check its usage based on that information.

Here is a list of Javascripts type guards available: 

### string

```ts
if(typeof param === "string") {
  // do something with string value
}
```

### number

```ts
if(typeof param === "number") {
  // do something with number value
}
```

### bigint

```ts
if(typeof param === "bigint") {
  // do something with bigint value
}
```

### boolean

```ts
if(typeof param === "boolean") {
  // do something with boolean value
}
```

### symbol

```ts
if(typeof param === "symbol") {
  // do something with symbol value
}
```

### undefined

```ts
if(typeof param === "undefined") {
  // do something with undefined value
}
```

### object

```
if(typeof param === "object") {
  // do something with object value
}
```

### function

```ts
if(typeof param === "function") {
  // do something with the function
}
```

## Truthiness Narrowing

In this type of narrowing, we check whether a variable is **truthy** before using it. When a variable is truthy, typescript will automatically remove the possibility of that variable being **falsy** i.e. `undefined` or `null`, etc, within the conditional check. 

Take for instance the following example, where a function **someFunction** below takes an `input`, whose type is either a string or undefined (i.e. optional).

```ts
function someFunction(x?: string) {
  if(x) {
    console.log(typeof x) // "string"
  }
}
```

By checking whether `input` ****is truthy, the type of **x** becomes a string otherwise it's **undefined**.

## Equality Narrowing

If two variables are equal, then the types of both variables must be the same. If one variable is of an imprecise type (i.e. `unknown`, `any` etc.) and is equal to another variable of a precise type, then typescript will use that information to narrow the type of the first variable.

Take the following function, which takes two parameters: **x** and **y**, with **x** being either a **string** or a **number** and **y** being a **number**. When the value of **x** is equal to the value of **y**, then the type of **x** is inferred to be a **number** and otherwise a **string**.

```ts
function someFunction(x: string | number, y: number) {
    if(x === y) {
        // narrowed to number
        console.log(typeof x) // number
    } else {
        // this is not narrowed
        console.log(typeof x) // number or string
    }
}
```

## Discriminated Unions

In this approach, you create an object, with a literal member that can be used to discriminate between two different unions. Let's take an example of a function that calculates the square of different shapes - Rectangle and Circle. We will start by defining the type of Rectangle and Circle.

```ts
type Rectangle = {
    shape: "reactangle",
    width: number;
    height: number;
}

type Circle = {
    shape: "circle"
    radius: number;
}
```

From the above types, the objects will each have the literal field of shape, which can either be a `circle` or `rectangle`. We can use the shape field within our function to calculate area, that would accept a union of `Rectangle` and `Circle`, as shown below:

```ts
function calculateArea(shape: Rectangle | Circle) {
    if(shape.shape === "reactangle") {
        // you can only access the properties of reactangle and not circle
        console.log("Area of reactangle: " + shape.height * shape.width);
    }

    if(shape.shape === "circle") {
        // you can only access the properties of circle and not reactangle
        console.log("Area of circle: " + 3.14 * shape.radius * shape.radius);
    }
}
```

When the `shape` field is a rectangle, you only have access to properties available in the `Rectangle` type, that is `width`, `height` and `shape`. The same applies to when `shape` field is a circle, typescript will only allow you to access `radius` and `circle` and will throw an error otherwise.

{% codesandbox type-narrowing-jswcw view=editor %}

## Using the in Operator for Narrowing

The `in` operator is used to determine if an object has a property with a name in it. It's used in the format of `"property" in object` where `property` is the name of the property you want to check if it exists inside the `object`.

In the example above, we used discriminated unions to distinguish between a Circle and Rectangle. We can also use the `in` operator to achieve the same, but this time we will be checking if a shape contains certain properties i.e. `radius` for `Circle`, `width` and `height` for `Rectangle`, and the results would be the same.

```ts
type Circle = {
  radius: number;
};

type Reactangle = {
  width: number;
  height: number;
};

function calculateArea(shape: Circle | Reactangle) {
  if ("radius" in shape) {
    // now you can access radius from shape
    console.log("Area of circle: " + 3.14 * shape.radius * shape.radius);

    // any attempt to access height or width will result to an error
    shape.width; // Property 'width' does not exist on type 'Circle'.
    shape.height; // Error: Property 'height' does not exist on type 'Circle'
  }
  if ("width" in shape && "height" in shape) {
    // now you can access height and width from the shape object
    console.log("Area of reactangle: " + shape.height * shape.width);

    // any attempt to access raidus would result to an error
    shape.radius; // Error: Property 'radius' does not exist on type 'Reactangle'.ts
  }
}
```

## Using Assignment Narrowing

In this type of narrowing, typescript will narrow the type of a variable once it's assigned a value. Take a variable x of union type of either `number` or `string`, if we assign it a `number`, the type becomes a `number` and if we assign it a `string`, the type changes to a string instead. 

```ts
let x : number | string = 1;

console.log(typeof x) // "number"

x = "something"

console.log(typeof x) // "string"
```

Here is a detailed example at Code Sandbox:

{% codesandbox type-narrowing-jswcw module=assignmentNarrowing.ts view=editor %}

## Using instanceof for Narrowing

Javascripts' `instanceof` operator is used to check if a value is an instance of a certain class. It's used in the format of `value instanceof value2` and returns a boolean. When you check if a value is an `instanceof` a class, Typescript will assign that type to the variable, thereby narrowing the type. 

Take the following example, where a function takes in a date, which can be either a string or a Date. If it's a Date, we want to convert it to a string and if it's a string, we will return it as is. We can use instanceof to check if it's an instance of a Date and convert it to string, as shown below.

```ts
function dateToString(value: string | Date) {
  if(value instanceof Date) {
    // The type now is Date and you can access Date methods
    return value.toISOString();
  }
  return value;
}
```

## Conclusion

In this article, we learned various ways we can narrow types, from type guards to discriminated unions. In our next article, we will learn how we can build our own type guards using type predicates.

If you found this article informative and would like to keep learning, visit my new series on Typescript - [A Byte of Typescript](https://mainawycliffe.dev/blog/tags/a-byte-of-typescript). A Byte of Typescript is a new series that I will be publishing on a regular basis to help you demystify Typescript.

[ Discuss this Article](https://github.com/mainawycliffe/discussion/discussions/15)