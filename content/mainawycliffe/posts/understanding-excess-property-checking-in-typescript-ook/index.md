---
{
title: "Understanding Excess Property Checking in Typescript",
published: "2022-08-17T09:06:00Z",
tags: ["typescript", "webdev", "javascript", "node"],
description: "This post was first posted in my newsletter All Things Typescript focused on teaching developers how...",
originalLink: "https://www.allthingstypescript.dev/p/mid-week-scoop-understanding-excess/comments"
}
---

***This post was first posted in my newsletter [All Things Typescript](https://www.allthingstypescript.dev/) focused on teaching developers how to build better mental models around Typescript and its typing system. Please subscribe to start learning and mastering Typescript***

Excess property checking is when Typescript checks your object to ensure that it doesn’t contain any extra properties on top of what is defined in the type annotation for the object.

Typescript doesn’t always check for excess properties in an object. Understanding when Typescript will check for excess properties is crucial as it helps you know what to expect from Typescript under different conditions.

Let’s start with the following type:

```ts
type Person {
  firstName: string;
  lastName: string;
}
```

If we created a new variable and typed it as Person, any excess properties in the object will be checked, and Typescript will throw an error.

```ts
const x: Person = {
  firstName: "John",
  lastName: "Doe",
  age: 13,`
}
```

In this case, you are going to get the following error:

![](./89577ee2-25bf-4b9d-9307-c78ab759fe58_915x272.png)

Type '{ firstName: string; lastName: string; age: number; }' is not assignable to type 'Person'. Object literal may only specify known properties, and 'age' does not exist in type 'Person'

And this makes sense and is expected because our type `Person` doesn’t contain the `age` property.

But, there are some situations where Typescript will remain silent when excess properties are available in an object.

Let’s explore which situations are those.

The first situation is when you introduce an object with the excess fields and assign it to a variable typed as `Person`.

```ts
const x = {
  firstName: "John",
  lastName: "Doe",
  age: 13,`
}

const y: Person = x;
```

In this case, Typescript won’t check for excess properties as type `Person` is a subset of the type inferred for variable `x`, which is inferred to include all properties in `Person` plus `age`. This is known as **duck-typing or structural typing**, which I will look at later.

> "If it walks like a duck and it quacks like a duck, then it must be a duck"

And in the second situation, when you use an assertion, this doesn’t trigger excess property checking in Typescript.

```ts
const x = {
 firstName: "John",
 lastName: "Doe",
 age: 13,
} as Person;
```

#### Conclusion

To recap, excess property checking is only triggered when we define object literals with a type annotation and not in other cases. So, why do we have it? It can be very useful for catching wrong typos and wrong property names. This means it’s very limited in scope and understanding when Typescript will check for excess properties and when it will not is essential for building a better mental model for understanding and using Typescript.
