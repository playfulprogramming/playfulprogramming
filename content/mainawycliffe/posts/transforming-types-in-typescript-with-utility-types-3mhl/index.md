---
{
title: "Transforming Types in TypeScript with Utility Types",
published: "2021-05-05T17:44:10Z",
edited: "2021-05-05T17:44:56Z",
tags: ["typescript", "webdev", "javascript"],
description: "Every once in a while, you end up in a situation where you need some variation of a type. For instanc...",
originalLink: "https://mainawycliffe.dev/blog/transforming-types-typescript-utility-types",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

Every once in a while, you end up in a situation where you need some variation of a type. For instance, you might want to omit some keys, retain some keys only, or even mark all keys as undefined or required on a type, among other use cases.

Typescript offers Utility Types, which are intended to solve this particular problem. In this article, we are going to have a look at these built-in utility types and a third-party library (with examples) that offers more utilities you might find helpful in achieving the above goal.

## Built-in Utility Types

This section focuses on TypeScript built-in utility types, they are numerous and I won't be able to cover all of them, I will just look at a few key ones, with examples, in my own opinions.

### Partial

This utility type constructs a new type from an existing one, with the keys at the top level being marked as optional `(?)`.

```
interface Type {
    field: string;
}

type Type2 = Partial<Type>;
```

<figure class="kg-card kg-image-card">![](https://cms.mainawycliffe.dev/content/images/2021/05/partial_type.png)</figure>

> **NB:** This only runs one level, meaning keys below one level will not be affected. If you want to mark all keys as optional, regardless the level they are in, check out PartialDeep below. 

### Required

This utility type does the opposite of the above, constructing a new type with all keys from the old type that are optional being marked as required.

```
interface Type {
    field?: string;
    optional?: string;
}

type Type2 = Required<Type>;
```

<figure class="kg-card kg-image-card">![](https://cms.mainawycliffe.dev/content/images/2021/05/required_utility_type.png)</figure>

### Omit

This utility type constructs a new type from an existing type while omitting specified keys from the new type.

```
interface Type {
    field1?: string;
    field2: string;
    field3: string;
}

type Type2 = Omit<Type, "field3" | "field1">;
```

<figure class="kg-card kg-image-card">![](https://cms.mainawycliffe.dev/content/images/2021/05/omit_utility_type.png)</figure>

### Pick

This utility type constructs a new type by picking keys specified from the old type. It does the opposite of Omit, as described above.

```
interface Type {
    field1?: string;
    field2: string;
    field3?: string;
    field4: string;
    field5?: string;
}

type Type2 = Pick<Type, "field2" | "field3">;
```

<figure class="kg-card kg-image-card">![](https://cms.mainawycliffe.dev/content/images/2021/05/pick_utility_type.png)</figure>

### Readonly

This utility type constructs a new type from an existing one and marks all keys as read-only i.e. they cannot be re-assigned. This is useful for types of a frozen object - i.e. [`Object.freeze()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze).

```
interface Type {
    field1?: string;
    field2: string;
    field3: string;
}

type Type2 = Readonly<Type>;
```

<figure class="kg-card kg-image-card">![](https://cms.mainawycliffe.dev/content/images/2021/05/readonly_utility_types.png)</figure>

### Record

This utility type constructs a new type with union members as keys and the type as the type of the keys.

```
interface Name {
    firstName: string;
    lastName: string;
}

type Names = "user1" | "user2";

type Type2 = Record<Names, Name>;
```

<figure class="kg-card kg-image-card">![Record Utility Type](https://cms.mainawycliffe.dev/content/images/2021/05/record_utility_type.png)</figure>

Above are a few built-in utility types that I find very useful, you can find out more about built-in utility types in the official documentation [here](https://www.typescriptlang.org/docs/handbook/utility-types.html).

## Extending Built-in Utility Types

While the above built-in utility types are amazing, they don't cover all use cases, and this is where libraries that provide more utilities fill in the gap. A good example of such a library is [type-fest](https://github.com/sindresorhus/type-fest), which provides even more utilities. 

While I won't look in to all utilities provided by type-fest, I will highlight a few that are quite help and build on the built-in types utilities.

### Except

This is a variation of the Omit utility type described above, but stricter. It constructs a new type by omitting specified keys from a Type, but unlike Omit, the keys being emitted must strictly exist in the Type.

```
// import { Except } from "type-fest"

interface X {
  a: string;
  b: string;
  c: string;
}

// Omit Example
type Y = Omit<X, "d">

// Except Example
type Z = Except<X, "d" >
```

As you can see in the image below, Except throws an error if you provide a Key that doesn't exist.

<figure class="kg-card kg-image-card">![](https://cms.mainawycliffe.dev/content/images/2021/05/typefest-except-example.png)</figure>

### Merge

Constructs a new type by merging two Types, with keys of the second type overriding the keys of the first type.

```
// import { Merge } from "type-fest"

interface X {
  a: string;
  b: string;
  c: string;
}

interface Y {
  c: number;
  d: number;
  e: number;
}

type Z = Merge<X, Y>

const x : Z = {
  a: "is string",
  b: "is string",
  c: 1,
  d: 2,
  e: 3,
}
```

<figure class="kg-card kg-image-card">![](https://cms.mainawycliffe.dev/content/images/2021/05/typefest-merge-type.png)</figure>

### PartialDeep

This utility type constructs a new type where all keys in all levels are optional. This is quite similar to the `Partial` built-in utility type, with one significant difference, it runs deeply to all levels, while the former does it at the first level.

```
// import { PartialDeep } from "type-fest";

interface X {
  a: string;
  b: string;
  c: string;
}

interface Y {
  c: number;
  d: number;
  e: number;
  f: X;
}

type Z = PartialDeep<Y>;

const x: Z = {};
```

<figure class="kg-card kg-image-card">![](https://cms.mainawycliffe.dev/content/images/2021/05/typefest-partial_deep.png)</figure>

### ReadonlyDeep

This utility type constructs a new type with all keys on all levels marked as required. This is also similar to the built-in `Readonly` utility type, but unlike the built-in utility type, this one goes down to all keys in all levels, making them immutable.

<figure class="kg-card kg-embed-card">
    <iframe width="1000" height="500" src="https://codesandbox.io/embed/keen-grass-75wy9?fontsize=14&theme=dark&view=editor" style="width:1000px; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
</figure>

<figure class="kg-card kg-image-card">![](https://cms.mainawycliffe.dev/content/images/2021/05/typefest-readonlydeep.png)</figure>

### Mutable

This utility type constructs a type that strips out `readonly` from a keys in a type, essentially the opposite of what the built-in utility type `Readonly` does.

```
// import { Mutable } from "type-fest";

interface X {
  readonly a: string;
  readonly d: string;
}

type Y = Mutable<X>;
```

<figure class="kg-card kg-image-card">![](https://cms.mainawycliffe.dev/content/images/2021/05/typefest-mutable.png)</figure>

## Conclusion

In this article, I looked into typescript utility types and how they can help you automatically create types from existing ones without resulting to duplicating eliminating the need to keep related types in sync. 

I highlighted a few built-in utility types that I find particularly useful on my day to day job as a developer. On top of that, we looked into type-fest, a library with a lot of utility types that extends the built-in types, and highlighted just a few.

### Resources

* [Utility Types - Typescript Docs](https://www.typescriptlang.org/docs/handbook/utility-types.html)
* [type-fest](https://github.com/sindresorhus/type-fest)