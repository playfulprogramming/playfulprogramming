---
{
title: "Typescript - Tips & Tricks - Advanced Types",
published: "2021-03-31T06:06:58Z",
edited: "2021-09-09T07:06:25Z",
tags: ["typescript", "webdev"],
description: "Hi Guys, Today I'll show you some advanced utilities exposed by the typescript language. Let's...",
originalLink: "https://https://dev.to/playfulprogramming/typescript-tips-tricks-advanced-types-3pp8",
coverImg: "cover-image.png",
socialImg: "social-image.png",
collection: "Typescript - Tips & Tricks",
order: 20
}
---

Hi Guys,
Today I'll show you some advanced utilities exposed by the typescript language.
Let's start!

### Utilities for Types

- [Partial](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)

This utility allows you to add the optional modifier to all the properties of your type.

```ts
type PartialPoint = Partial<{ x: number; y: number }>; // { x?: number | undefined; y?: number | undefined; }
```

- [Required](https://www.typescriptlang.org/docs/handbook/utility-types.html#requiredtype)

This utility allows you to remove the optional modifier to all the properties of your type.

```ts
type RequiredPoint = Required<{ x?: number; y?: number }>; // { x: number; y: number; }
```

- [ReadOnly](https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype)

This utility allows you to add the read-only modifier to all the properties of your type.

```ts
type ReadOnlyPoint = ReadOnly<{ x: number; y: number }>; // { readonly x: number; readonly y: number; }
```

- [Pick](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys)

This utility allows you to get a subset of properties from another type.

```ts
type PickPoint = Pick<{ x: number; y: number }, "x">; // { x: number; }
```

- [Omit](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)

This utility allows you to exclude some properties from another type.

```ts
type OmitPoint = Omit<{ x: number; y: number }, "x">; // { y: number; }
```

- [Record](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeystype)

This utility allows you to map the properties of a type to another type.

```ts
type Point = {
  x: number;
  y: number;
};
type PointRecord = Record<keyof Point, number | null>; // { x: number | null; y: number | null; }
```

- [Exclude](https://www.typescriptlang.org/docs/handbook/utility-types.html#excludetype-excludedunion)

This utility allows you to remove some types from a [union type](https://dev.to/puppo/typescript-tips-tricks-union-and-intersection-1a9l).

```ts
type ExcludeType = Exclude<"x" | "y", "x">; // "y"
```

- [Extract](https://www.typescriptlang.org/docs/handbook/utility-types.html#extracttype-union)

This utility allows you to get some types from a [union type](https://dev.to/puppo/typescript-tips-tricks-union-and-intersection-1a9l).

```ts
type ExtractType = Extract<"x" | "y", "x">; // "x"
```

- [NonNullable](https://www.typescriptlang.org/docs/handbook/utility-types.html#nonnullabletype)

This utility allows you to remove the *undefined* and *null* types from a [union type](https://dev.to/puppo/typescript-tips-tricks-union-and-intersection-1a9l).

```ts
type NonNullableType = NonNullable<string | number | undefined | null>; // string | number
```

### Utilities for Function and Class

- [Parameters](https://www.typescriptlang.org/docs/handbook/utility-types.html#parameterstype)

This utility allows you to extract from a function its parameters.

```ts
function createPoint(x: number, y: number) {
  return { x, y };
}
type ParametersType = Parameters<typeof createPoint>; // [x: number, y: number]
```

- [ConstructorParameters](https://www.typescriptlang.org/docs/handbook/utility-types.html#constructorparameterstype)

This utility allows you to extract from a class its constructor parameters.

```ts
class Point {
  constructor(x: number, y: number) {}
}
type ConstructorParametersType = ConstructorParameters<typeof Point>; // [x: number, y: number]
```

- [ReturnType](https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype)

This utility allows you to get the return type from a function.

```ts
function createPoint(x: number, y: number) {
  return { x, y };
}
type CreatePointReturnType = ReturnType<typeof createPoint>; // { x: number; y: number; }
```

- [InstanceType](https://www.typescriptlang.org/docs/handbook/utility-types.html#instancetypetype)

This utility allows you to construct a type consisting of the instance type of a construction function type.

```ts
class Point {
  constructor(x: number, y: number) {}
}
type InstanceTypePoint = InstanceType<typeof Point>; // Point
type InstanceTypeString = InstanceType<string>; // Error: Type 'string' does not satisfy the constraint 'new (...args: any) => any'
```

- [ThisParameterType](https://www.typescriptlang.org/docs/handbook/utility-types.html#thisparametertypetype)

This utility allows you to extract the [this parameter](https://dev.to/puppo/typescript-tips-tricks-this-parameter-7n6) from a function type, or unknown if the function type has no this parameter.

```ts
function toHex(this: Number) {
  return this.toString(16);
}
function numberToString(n: ThisParameterType<typeof toHex>) {
  return toHex.apply(n);
}
numberToString(12)
```

- [OmitThisParameter](https://www.typescriptlang.org/docs/handbook/utility-types.html#omitthisparametertype)

This utility allows you to remove the [this parameter](https://dev.to/puppo/typescript-tips-tricks-this-parameter-7n6) from a function type.

```ts
function toHex(this: Number) {
  return this.toString(16);
}
const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(5);
fiveToHex()
```

### Utilities to Manipulation String Types

- Uppercase

This utility allows converting your types to uppercase format.

```ts
type StringUppercase = Uppercase<"getX" | "getY" | "setX" | "setY">; // "GETX" | "GETY" | "SETX" | "SETY"
```

- Lowercase

This utility allows you to convert your types to lowercase format.

```ts
type StringLowercase = Lowercase<"getX" | "getY" | "setX" | "setY">; // "getx" | "gety" | "setx" | "sety"
```

- Capitalize

This utility allows you to convert your types to capitalize format.

```ts
type StringCapitalize = Capitalize<"getX" | "getY" | "setX" | "setY">; // "GetX" | "GetY" | "SetX" | "SetY"
```

- Uncapitalize

This utility allows you to convert your types to uncapitalize format.

```ts
type StringUncapitalize = Uncapitalize<"GetX" | "GetY" | "SetX" | "SetY">; // "getX" | "getY" | "setX" | "setY"
```

I hope these utilities will help you in the future.
That's all for today.
See you soon Guys!
