---
{
title: "Types and Mocking - Typescript",
published: "2021-06-09T06:53:47Z",
tags: ["typescript", "webdev", "javascript"],
description: "In this article, we are going to learn how to create functions which are easy to test and mock using...",
originalLink: "https://mainawycliffe.dev/blog/types-and-mocking-typescript",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

In this article, we are going to learn how to create functions which are easy to test and mock using TypeScript utility types.

Let's take the following function, how do you mock it's inputs i.e. `person`:

```ts
interface Person {
    name: {
        firstName: string;
        lastName: string;
    }
    id: string;
    age: number;
    height: number;
    weight: number;
}

function getPersonsFullName(person: Person) {
    return `${person.name.firstName} ${person.name.lastName}`;
}
```

One common way, is to create an object of type `Person` with only the fields being used by function and then cast the object as any, as shown below:

```
const person = {
    name: {
        firstName: "Wycliffe",
        lastName: "Maina"
    }
}

console.log(getPersonsFullName(person as any));
```

This works, but you are losing the benefits of typescript typing system by casting as any, since the compiler won't type check the object `person` being passed to the function.

A good reason as to why this is not a good idea, is that if the function changes and starts using other properties or the shape of the input object changes, TypeScript will not help you. I am guilty of casting as `any`, especially when writing mocks for tests.

But, is there a better way? Yes, we can improve the function above, so that it is easier to mock the input without resulting to the above technique. One approach, which I really recommend, is to create a new type which only has the fields the function needs to run successfully, in this case the `name` property. This can easily be achieved in Typescript using Utility Types, which you can learn more about [here](https://mainawycliffe.dev/blog/transforming-types-typescript-utility-types).

We can use the `Pick<T>` utility type, to create a new type from Person, with only the name field i.e. picking the `name` field from the `Person` type.

```ts
function getPersonsFullName(person: Pick<Person, "name">) {
    return `${person.name.firstName} ${person.name.lastName}`;
}
```

This way, our mock example still works, but without resulting to casting as any:

```ts
const person = {
    name: {
        firstName: "Wycliffe",
        lastName: "Maina"
    }
}

console.log(getPersonsFullName(person));
```

The advantage of this is that you can still pass a person object with more properties as long as name property is present, as shown below:

```ts
const person = {
    name: {
        firstName: "Wycliffe",
        lastName: "Maina"
    },
    id: 21
}

// this still works
console.log(getPersonsFullName(person));
```

Utility types such as `Omit`, `Pick`, `Partial`, `Required`, etc. can help you create new types easily that define the shape of an input object for a function. This makes it possible to define with precision what a function input type is, with just a little extra work on your part. You can learn more about TypeScript utility types in my previous article [here](https://mainawycliffe.dev/blog/transforming-types-typescript-utility-types/).

This makes your functions and methods more friendly since they are taking in only what they need, making it easy to mock as seen above. Another advantage is that your functions are more re-usable as they don't place an unnecessary burden on the consumer of the function by requiring larger input than they are using.
