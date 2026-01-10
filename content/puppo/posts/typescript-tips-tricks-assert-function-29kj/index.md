---
{
title: "Typescript - Tips & Tricks - Assert Function",
published: "2021-03-19T07:13:10Z",
edited: "2021-09-09T07:05:42Z",
tags: ["typescript", "webdev"],
description: "There are times that we need to create some assertions to be sure an object respects some rules. A...",
originalLink: "https://dev.to/this-is-learning/typescript-tips-tricks-assert-function-29kj",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "11213",
order: 1
}
---

There are times that we need to create some assertions to be sure an object respects some rules.
A common case is to check if an object is defined; to do this you can create a simple assertion function like this
```ts
function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
```
To leave you a simple case of use, I write this simple example
```ts
type Person = {
  name: string;
  email?: string;
};

function loadPerson(): Person | null {
  return null;
}

let person = loadPerson();

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(person, "Person is not defined"); // Error: Person is not defined
console.log(person.name);
```
As you can see, in this example, the assert function detects if the person is defined and if the person isn't defined the assert function throws an error with the message that you pass in the parameters.
To level up, and explain better the power of the assert function, here another example
```ts
type Square = {
  kind: "square";
  size: number;
};

function ensureSquare(obj: unknown): asserts obj is Square {
  if (
    typeof obj === "object" &&
    !!obj &&
    "kind" in obj &&
    (obj as Square).kind === "square"
  )
    return;

  throw new Error("Object isn't a Square type");
}

const square = { kind: "square", size: 10 };
ensureSquare(square);
// const square: Square
console.log("shape", square.kind);
console.log("size", square.size);

const rectangle = { kind: "rectangle", width: 10, height: 15 };
ensureSquare(rectangle); // throw new Error("Object isn't a Square type");
console.log("shape", rectangle.kind);
console.log("size", rectangle.size);
```
In this case, you can see how the "ensureSquare" function creates an assertion to detect if the object passed as parameter is of type Square or not.
If you see the part of the example where I created the square field, you can note that the type of the square field is `{ kind: string; size: number; }`. If you observe the type of the square field after the "ensureSquare(square);" you can see how typescript converts the type of the field from `{ kind: string; size: number; }` to Square.
This conversion is done because if the code passes the "ensureSquare" function you are sure that the "square" field is of type Square. On the contrary, in the second part of the example, the "rectangle" field, on runtime, throws an error, and the code after the "ensureSquare" function will never be executed.
I think you have understood the power of the assertion functions, and I hope they will help you to prevent some future mistakes.

It's all guys, Bye Bye!