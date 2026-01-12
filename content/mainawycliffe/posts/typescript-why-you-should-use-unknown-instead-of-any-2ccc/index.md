---
{
title: "Typescript: why you should use unknown instead of any",
published: "2021-09-02T08:53:53Z",
tags: ["typescript", "javascript", "webdev", "programming"],
description: "From time to time, we come across situations where the type isn't known beforehand, i.e. could be...",
originalLink: "https://mainawycliffe.dev/blog/typescript-use-unknown-instead-of-any",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "a-byte-of-typescript",
order: 2
}
---

From time to time, we come across situations where the type isn't known beforehand, i.e. could be anything. Before TS v3, we would use the `any` type for such types. But this comes with a few tradeoffs, like losing any type safety provided by Typescript.

Take the following example for instance:

```ts
const x: any = {
  a: "a-value",
  b: "b-value"
};
```

You can access the properties of the object above, i.e. `x.a` and `x.b` and everything would work as expected. The problem is that if you tried to access `x.c` value, Typescript would not throw an error, since the object `x` can be anything.

```ts
const c = x.c
console.log(c)
```

As you can see, this can be a source of many bugs, since common errors which Typescript would catch during build time will be allowed through. This is because when you use `any` type, you opt out of type checking.

## Why `unknown`?

The `unknown` type was introduced in version 3 of typescript as an accompanying type to `any`. The `unknown` type, when assigned to a variable, means that a variable type is not known.

And typescript doesn't allow you to use a variable of `unknown` type unless you either cast the variable to a known type or narrow its type. Type narrowing is the process of moving a less precise type to a more precise type. You can learn more about Type narrowing in Typescript [here](https://mainawycliffe.dev/blog/type-guards-and-narrowing-in-typescript).

Take the following example.

```ts
const x: unknown = 1;
```

if we tried to square `x` above without narrowing the type, typescript will throw the following error:

```ts
Object is of type 'unknown'.
```

To fix the above error, we can use type guards to check if it's a number before squaring it.

```ts
if(typeof x === "number") {
  console.log(x * x);
}
```

The same thing with the initial example, if we changed the type to `unknown` and tried to access any of the properties, typescript would throw an error.

[Typescript doesn't allow you to use an unknown type before casting it.](https://cms.mainawycliffe.dev/content/images/2021/08/image.png)

You would need to cast it, in order to typescript to allow you to use it.

```ts
const x: unknown = {
  a: "a-value",
  b: "b-value"
};

console.log((x as {a: string; b: string; }).b)
```

As you can see from the above examples, the `unknown` type forces you to determine what a variable typed as `unknown` is, either through type casting or type narrowing. This in turn leads to a better program, as typescript can then type checking the resulting type, leading to a more type-safe program.

## Conclusion

In this article, we learned about the `unknown` type and why we should use it to write more type-safe typescript programs. We also learned why you should avoid using type `any` unless absolutely necessary.

If you found this article informative and would like to keep learning, visit my new series on Typescript - [A Byte of Typescript](https://mainawycliffe.dev/blog/tags/a-byte-of-typescript). A Byte of Typescript is a new series that I will be publishing on a regular basis to help you demystify Typescript.

- [Type Narrowing in TypeScript](https://mainawycliffe.dev/blog/type-guards-and-narrowing-in-typescript)
- [Types and Mocking - Typescript](https://mainawycliffe.dev/blog/types-and-mocking-typescript)
- [Template Literal Types in TypeScript](https://mainawycliffe.dev/blog/template-literal-types-in-typescript)
- [Transforming Types in TypeScript with Utility Types](https://mainawycliffe.dev/blog/transforming-types-typescript-utility-types)
