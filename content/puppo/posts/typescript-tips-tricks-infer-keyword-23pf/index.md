---
{
title: "Typescript - Tips & Tricks - infer keyword",
published: "2021-03-26T06:50:57Z",
edited: "2021-09-09T07:06:17Z",
tags: ["typescript", "webdev"],
description: "Today I talk about the infer keyword. Sometimes, we need to get the value type of an array or get the...",
originalLink: "https://dev.to/this-is-learning/typescript-tips-tricks-infer-keyword-23pf",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "Typescript - Tips & Tricks",
order: 18
}
---

Today I talk about the infer keyword.
Sometimes, we need to get the value type of an array or get the return type of a function. To do this I need to introduce the infer keyword.
To explain this feature I show you an example

```ts
type UnboxingArray<T> = T extends Array<infer Member> ? Member : T;

type UnboxingArrayString = UnboxingArray<string[]>; // string
type UnboxingArrayNumber = UnboxingArray<number[]>; // number
type UnboxingString = UnboxingArray<string>; // string
```

As you can see, in the UnboxingArray type, we can detect if the T type extends an array and if so we can infer the element type or else we return the T type.
As a demonstration, if you see the type of the UnboxingArrayString and the UnboxingArrayNumber you can note how the UnboxingArray infers the string and the number type. In contrast, in the UnboxingString, the UnboxingArray can't infer the type of the elements because the type doesn't extend an array so it returns the string type.
Now I show you the infer keyword applied to the function result.

```ts
type ReturnType<T> = T extends (...args: unknown[]) => infer R ? R : never;
function getPerson() {
  return {
    name: "name",
    surname: "surnmae",
  };
}
type Person = ReturnType<typeof getPerson>;
/**
type Person = {
  name: string;
  surname: string;
}
*/
type StringResult = ReturnType<string>; // never
```

In this example, you can note that if the T type extends a function, the ReturnType infers the type of the function result otherwise it returns the never type.
To demonstrate it, you can see how the Person type is composed of a name and a surname fields on the contrary the StringResult is of the never type.

Great news for us, the [ReturnType](https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype) is already included inside of the Typescript types.

It's all guys.
Bye bye
