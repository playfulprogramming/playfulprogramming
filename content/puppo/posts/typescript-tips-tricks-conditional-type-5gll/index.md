---
{
title: "Typescript - Tips & Tricks - Conditional Type",
published: "2021-03-24T07:10:26Z",
edited: "2021-09-09T07:05:55Z",
tags: ["typescript", "webdev"],
description: "In some cases, we need to detect if an object/type has specific properties or characteristics. Let me...",
originalLink: "https://dev.to/this-is-learning/typescript-tips-tricks-conditional-type-5gll",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "Typescript - Tips & Tricks",
order: 17
}
---

In some cases, we need to detect if an object/type has specific properties or characteristics.
Let me show you a simple case

```ts
type TypeName<T> =
    T extends string ? "string" :
    T extends number ? "number" :
    T extends bigint ? "bigint" :
    T extends boolean ? "boolean" :
    T extends undefined ? "undefined" :
    T extends symbol ? "symbol" :
    T extends Function ? "function" :
    T extends null ? "null" :
    "object";

const typeName = <T>(obj: T): TypeName<T> => {
  if (obj === null) return "null" as TypeName<T>;
  return typeof obj as TypeName<T>;
};

const stringType = typeName('string'); // "string"
const numberType = typeName(10); // "number"
const bigIntType = typeName(10n); // "bigint"
const booleanType = typeName(true); // "boolean"
const undefinedType = typeName(undefined); // "undefined"
const symbolType = typeName(Symbol()); // "symbol"
const functionType = typeName(() => 'result'); // "function"
const nullType = typeName(null); // "null"
const objectType = typeName({ name: 'name'}); // "object"
```

In this example, we return the type of the parameter as a string, but I want to focus on the TypeName type. This type as you can see, returns the values based on some conditions. In this case, the conditions are based on the parameter's type, but my goal is to show you that you could check if a type respects some conditions or not and act accordingly.
This feature is called Conditional Types.
To show you the power of this feature here a funny example found in the net :)

```ts
type SnackBars = {
  name: "Short Chocolate Bars";
  amount: 4;
  candy: true;
};

type Gumballs = {
  name: "Gooey Gumballs";
  color: "green" | "purples";
  candy: true;
};

type Apples = {
  name: "Apples";
  candy: true;
};

type Cookies = {
  name: "Cookies";
  candy: true;
  peanuts: true;
};

type SnickersBar = {
  name: "Snickers Bar";
  candy: true;
  peanuts: true;
};

type Toothpaste = {
  name: "Toothpaste";
  minty: true;
  trick: true;
};

type Pencil = {
  name: "Pencil";
  trick: true;
};

type HalloweenTricksAndSweets =
  | SnackBars
  | Gumballs
  | Apples
  | SnickersBar
  | Cookies
  | Toothpaste
  | Pencil;

type AllCandies<T> = T extends { candy: true } ? T : never;
type AllTricks<T> = T extends { trick: true } ? T : never;
type AllCandiesWithoutPeanuts<T> = T extends { candy: true } ? (T extends { peanuts: true } ? never : T) : never;

type Candies = AllCandies<HalloweenTricksAndSweets>; // SnackBars | Gumballs | Apples | SnickersBar | Cookies
type Tricks = AllTricks<HalloweenTricksAndSweets>; // Toothpaste | Pencil
type CandiesWithoutPeanuts = AllCandiesWithoutPeanuts<HalloweenTricksAndSweets>; // SnackBars | Gumballs | Apples
```

In this example, you can see how the AllCandies type creates a new type (Candies) composed of all the HalloweenTricksAndSweets that contain the candy property with the true value. The AllTricks type creates a new type (Tricks) composed of all the HalloweenTricksAndSweets that contain the trick property with the true value. The last case AllCandiesWithoutPeanuts is interesting: we get all the candies that don't contain the peanuts property with the true value.
I think this funny example can express best the potential of the Conditional Type, and it can help you to understand better all the benefits it can lead to.

It's all for today.
I hope this feature will help you in the future as it helped me in some cases.

See you soon Guys!
