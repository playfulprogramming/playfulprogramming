---
{
title: "Typescript - Tips & Tricks - Mapped Types",
published: "2021-03-29T06:03:18Z",
edited: "2021-09-09T07:06:05Z",
tags: ["typescript", "webdev"],
description: "In some cases, we need to manipulate some types to create new types. In these cases, we have to use...",
originalLink: "https://dev.to/this-is-learning/typescript-tips-tricks-mapped-types-5bkn",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "Typescript - Tips & Tricks",
order: 19
}
---

In some cases, we need to manipulate some types to create new types. In these cases, we have to use the Mapped Types.
Let's start explaining the structure of the mapped types.

```ts
type MappedTypeExample = {
    [Key in "x" | "y" | "z"]: number;
};
```

As you can see, a mapped type is a type composed of defined keys and their values, but the power of the mapped types goes out when we want to joke with a generic type.

```ts
type Point = {
    readonly x: number;
    y: number;
    z?: number;
};

type MappedType<T> = {
    [K in keyof T]: T[K];
};

type mappedPoint = MappedType<Point>;
/**
 type mappedPoint = {
    readonly x: number;
    y: number;
    z?: number | undefined;
}
*/
```

In this simple example, I show you how to replicate the same object using the mapped type.
Now let's add two simple bits to transform our type into new "different" types. The mapped type permits you to add(+) or remove(-) the read-only modifier from your type but also to add(+) or remove(-) the optional modifier.
I leave you two simple examples to show these cases.

```ts
type MappedPointPlusModifier<T> = {
    +readonly [K in keyof T]: T[K];
};

type mappedPointPlusModifier = MappedPointPlusModifier<Point>;
/**
type mappedPointPlusModifier = {
    readonly x: number;
    readonly y: number;
    readonly z?: number | undefined;
}
*/

type MappedPointMinusModifier<T> = {
    [K in keyof T]-?: T[K];
};
type mappedPointMinusModifier = MappedPointMinusModifier<Point>;
/**
type mappedPointMinusModifier = {
    readonly x: number;
    y: number;
    z: number;
}
*/
```

*N.B. The add(+) modifier isn't indicated in common cases because it is implied*

The mapped types are a powerful feature to manipulate our types and they are used by the typescript team to expose to us some advanced types, but this is a topic of a future post.
Before ending I leave you another example to show what you can do with the mapped type.
In this example, I transform the Point type to another Point type where the fields aren't exposed directly but they are wrapped by a "get" and "set" method.

```ts
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};
type Setters<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};
type WithGetterAndSetter<T> = Getters<T> & Setters<T>;

type Point = {
  x: number;
  y: number;
};

type WithGetterAndSetterPoint = WithGetterAndSetter<Point>;
/**
type WithGetterAndSetterPoint = {
  getX(): number;
  setX(value: number): void;
  getY(): number;
  setY(value: number): void;
}
*/
```

It's all for today!
See you soon guy!
