---
{
title: "Type Assertions in TypeScript - why not?",
published: "2021-12-30T12:43:44Z",
edited: "2021-12-30T21:57:03Z",
tags: ["javascript", "webdev", "typescript", "node"],
description: "A while back, I had a look at why you should avoid using the any type and instead use the unknown...",
originalLink: "https://mainawycliffe.dev/blog/type-assertions-in-typescript/",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "14315",
order: 1
}
---

A while back, I had a look at why you should avoid using the `any` type and instead use the `unknown` type, which you can read [here](https://mainawycliffe.dev/blog/typescript-use-unknown-instead-of-any/). In this article, I want to focus on Type assertion and why you should avoid them.

So, what are Type Assertions? Types assertion is a way of telling Typescript what the type of a variable is. This can be done either of two ways: using the `as` syntax or the angle bracket `<Type>` syntax, as shown below:

```typescript
type Person = {
    firstname: string;
    lastname: string;
}

// using as syntax
const x : unknown = {};

// asserting it as Person using as syntax
const firstname = (x as Person).firstname;

// asserting it as Person using the angle brackets
const firstname = (<Person>x).firstname;

```

When we use type assertion we are basically telling the Typescript compiler that we know what the type is and it should trust us, i.e. we know what we are doing. The problem with this is that we prevent Typescript from helping us where it should and take on that responsibility ourselves.

In the above example, Typescript does not type check whether the variable `x` has the property `firstname` we are accessing because we are asserting the type, which will definitely introduce a bug into our system.

### Non-null Assertions

Another common type of assertion is a non-null assertion. In this assertion, we use the `!` operator after variable to tell the Typescript compiler that a variable isn't null.

```typescript
function square(x: number) {
	return x * x;
}

const x : number | undefined;

const answer = square(x!);
```

This assertion should be used sparingly, especially if the null suggestion is coming from external API typing like environment variables, which are always typed as `string | undefined`. I have come across not-so-obvious bugs that were thrown in a completely different section of the code with a different error message because I allowed an undefined variable to be passed on. This happened because instead of handling the possibility of the environment variable being undefined, I decided non-null assertion was the way to go.

## So, what are the Alternatives?

### Narrowing of Types

Type narrowing is the process of moving a less precise type to a more precise type. For instance, taking a variable of type `any` and moving it to string. There are various ways of achieving this, which I have covered previously [here](https://mainawycliffe.dev/blog/type-guards-and-narrowing-in-typescript/), but I will take a look at a few notable ones.

**Type Guards:** You can use Type Guards to narrow the types of a `union`, `unknown`, `any`, etc. to a specific type:

```typescript
function doSomething(x: string | number) {
    if(typeof x === "string") {
    	// do somethign with the string
    } else {
    	// do something with the number
    }
}
```

**Truthiness Narrowing:** You can check if a variable is truthy i.e. not undefined or null before using it:

```typescript
function doSomething(x?: string) {
	if(x) {
		// type of x is now string
	}
}
```

**Building Custom Type Guards:** And finally, you can create type guards that do an exhaustive type checking on an object before asserting its type:

```typescript
function isRectangle(shape: unknown): shape is Rectangle {
  if ("width" in shape && "height" in shape) {
  	// this is a rectangle
  	return true; 
  }
  // it's not a rectangle
  return false;
}
```

You can learn more about custom-type guards [here](https://mainawycliffe.dev/blog/custom-type-guards-in-typescript/).

You can learn more about the narrowing of types in Typescript in my previous article [here](https://mainawycliffe.dev/blog/typescript-use-unknown-instead-of-any/).

### Providing Default Values

This mostly works with null and undefined values, but instead of asserting to a string to remove the possibility of it being undefined, you can provide a default value that automatically becomes a string. You can achieve this by using either null coalescing operator (`??`) or the or ( `||`) operator.

```typescript
// using the nullish coalescing operator
const API_URL = process.ENV.API_URL ?? "DEFAULT URL";

// using the OR (||) logical operator
const API_URL = process.ENV.API_URL || "DEFAULT URL";
```

We can also use Javascripts Logical Assignment Operator to provide a default value:

```typescript
let x : string | number;

// provide a default value if null or undefined
x ??= "Hello World"

// provide a default value if falsy
x ||= "Hello World"
```

## Conclusion

In this article, we learned that by using type assertions, we are removing the ability of the Typescript compiler to do Type checking for us. We also covered a few techniques we can use to avoid type assertions in Typescript.

If you liked this article and would like to keep learning, visit my new series on Typescript - [A Byte of Typescript](https://mainawycliffe.dev/blog/tags/a-byte-of-typescript). A Byte of Typescript is a new series that I will be publishing on a regular basis to help you demystify Typescript.
