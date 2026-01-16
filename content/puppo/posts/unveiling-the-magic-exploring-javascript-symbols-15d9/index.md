---
{
title: "Unveiling the Magic: Exploring JavaScript Symbols",
published: "2023-09-20T06:09:44Z",
edited: "2023-09-20T06:15:35Z",
tags: ["javascript", "es6", "symbols"],
description: "Introduction to JavaScript Symbols   JavaScript Symbols are a new primitive data type...",
originalLink: "https://blog.delpuppo.net/unveiling-the-magic-exploring-javascript-symbols",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "The JavaScript you don't know",
order: 1
}
---

## Introduction to JavaScript Symbols

JavaScript Symbols are a new primitive data type introduced in ECMAScript 6 (ES6). They are used as unique, non-string identifiers for object properties, useful in avoiding naming collisions and enabling more advanced programming techniques.

<iframe src="https://www.youtube.com/watch?v=o8YDHAS-fo0"></iframe>

## Creating and Understanding Symbols

Symbols are created using the `Symbol()` function, which can take an optional description as an argument. Each symbol is unique; even if two symbols have the same description, they are considered distinct.

```js
const propSymbol = Symbol("propName");
const propSymbol2 = Symbol("propName");

propSymbol === propSymbol2 // false
```

## Unique Identifiers and Property Keys

Symbols are often used as property keys in objects to ensure uniqueness and prevent naming collisions. They can be used alongside string keys without conflict, and their uniqueness makes them ideal for use as metadata or private properties in objects.

```js
const propSymbol = Symbol("propName");
const propSymbol2 = Symbol("propName");

const obj = {
  [propSymbol]: "propSymbol",
  [propSymbol2]: "propSymbol2"
}
```

## The Global Symbol Registry

The global Symbol registry allows you to create and share symbols across different scopes and realms. To create a global symbol, use `Symbol.for(key)`, which takes a string as its argument. This method checks if a symbol with the same key exists in the registry; if not, it creates a new one.

```js
// my-module-1.js
export const propSymbol = Symbol("propName");
export const propSymbolShare = Symbol.for("propName");

// my-module-2.js
export const propSymbol = Symbol("propName");
export const propSymbolShare = Symbol.for("propName");

// index.js
import { propSymbol as propSymbolM1, propSymbolShare as propSymbolShareM1 } from './my-module.js'
import { propSymbol as propSymbolM2, propSymbolShare as propSymbolShareM2 } from './my-module-2.js'

console.log(propSymbolM1 === propSymbolM2); // false

console.log(propSymbolM1 === propSymbolShareM1); // false
console.log(propSymbolM2 === propSymbolShareM2); // false

console.log(propSymbolShareM1 === propSymbolShareM2); // true
```

It's also possible to retrieve the key of a Symbol using `Symbol.keyFor(key)` but only for shared keys.

```js
export const propSymbol = Symbol("propName");
export const propSymbolShare = Symbol.for("propName");

console.log(Symbol.keyFor(propSymbol)); // undefined
console.log(Symbol.keyFor(propSymbolShare)); // propName
```

## Symbols and Iteration

Symbols are not enumerable, which means they are not included in standard iteration methods like `for...in` loops or `Object.keys()`. To access an object's symbol properties, use `Object.getOwnPropertySymbols()`.

```js
const propSymbol = Symbol("propName");
const propSymbol2 = Symbol("propName");

const obj = {
  [propSymbol]: "propSymbol",
  [propSymbol2]: "propSymbol2"
}
console.log(JSON.stringify(obj)); // {}
console.log(Object.keys(obj)); // []
console.log(Object.getOwnPropertyNames(obj)); // []
for (const key in obj) {
  console.log(key); // nothing
}

console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(propName), Symbol(propName)]
```

## Well-Known Symbols in JavaScript

Well-known symbols are predefined global symbols that represent common behaviours in JavaScript, such as `Symbol.iterator`, `Symbol.asyncIterator`, `Symbol.toStringTag`, and `Symbol.species`. These symbols can be used to customize the behaviour of built-in JavaScript objects and classes.

## Use Cases and Practical Applications

Symbols can be used to implement private properties, metadata, or methods, avoiding naming collisions in libraries and frameworks. They are also used to customize the behaviour of well-known JavaScript objects and classes, such as iterators and string conversion.

## Limitations and Considerations

Symbols are not supported in older JavaScript environments, and their unique nature may require additional care when working with serialization or proxy objects. Additionally, they are not directly accessible during iteration, which may require extra steps to access their properties.

## Conclusion

JavaScript Symbols provide a powerful, unique identifier for object properties, helping to avoid naming collisions and enabling advanced programming techniques. Understanding their use cases and limitations is essential for modern JavaScript developers.

*You can find the source code* [*here*](https://github.com/Puppo/javascript-you-dont-know/tree/01-symbols)

<!-- ::user id="puppo" -->
