---
{
title: "Typescript - Tips & Tricks - typeof",
published: "2021-02-15T06:59:50Z",
edited: "2021-09-09T07:01:54Z",
tags: ["typescript", "webdev"],
description: "Today I want to start a series of tips and tricks about Typescript. I will try to publish two/three...",
originalLink: "https://dev.to/this-is-learning/typescript-tips-tricks-typeof-nfi",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "11213",
order: 1
}
---

Today I want to start a series of tips and tricks about Typescript.
I will try to publish two/three tips & tricks a week.
Before start, I want to explain why I start this series.
I start this series because every day I see too many *any* types in the typescript files and so I want to help the developers to learn better the typescript language.

# typeof

Today I start with the **typeof** operator.
Typeof is an operator used to detect the type of our variables.
A little preamble, typeof is also a javascript operator, but with typescript, it has superpowers.

Typeof in javascript has these behaviors:

```ts
const valueString = "string";
const valueNumber = 1;
const valueBoolean = true;
const valueBigInt = 1n;
const valueFunction = () => true;
const valueUndefined = undefined;
const valueNull = null;
const object = {
  prop1: "value1",
  prop2: "value2",
};

console.log(typeof valueString); // string
console.log(typeof valueNumber); // number
console.log(typeof valueBoolean); // boolean
console.log(typeof valueBigInt); // bigint
console.log(typeof valueFunction); // function
console.log(typeof valueUndefined); // undefined
console.log(typeof valueNull); // object
console.log(typeof object); // object
```

How we can see some things are strange: e.g. when we get the typeof of a null variable javascript returns an object type.

But here we see the same example in typescript:

```ts
type valueStringType = typeof valueString; // "string"
type valueNumberType = typeof valueNumber; // 1
type valueBooleanType = typeof valueBoolean; // true
type valueBigIntType = typeof valueBigInt; // 1n
type valueFunctionType = typeof valueFunction; // () => boolean
type valueUndefinedType = typeof valueUndefined; // undefined
type valueNullType = typeof valueNull; // null
type objectType = typeof object; // { prop1: string; prop2: string; }
```

The first impact is friendlier for us developers because the typeof operator converts the type exactly as expected. The best advantages can be seen in the types: function, null, object.

But now an advanced example:

```ts
const item = {
  id: '0000',
  name: 'Item',
  unit: {
    id: '1',
    code: 'PZ'
  },
  variants: [{
    id: '1',
    code: '001',
    color: 'FFFFFF'
  }]
};

type Item = typeof item;
type Unit = typeof item["unit"];
type Variant = typeof item.variants[number];
```

In this example, we can see how we can extract simple types from a complex object.

I leave you the [link](https://www.typescriptlang.org/docs/handbook/2/typeof-types.html) of the official documentation of this operator.

For today is all.
See you soon!
