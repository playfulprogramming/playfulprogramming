---
{
title: "Typescript - Tips & Tricks - Union and Intersection",
published: "2021-02-22T07:08:00Z",
edited: "2021-09-09T07:02:49Z",
tags: ["typescript", "webdev"],
description: "Hi and welcome back! Today I talk about Union and Intersection.  In some cases, we have to combine...",
originalLink: "https://dev.to/this-is-learning/typescript-tips-tricks-union-and-intersection-1a9l",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "11213",
order: 1
}
---

Hi and welcome back!
Today I talk about [Union and Intersection](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html).

In some cases, we have to combine different types to create new types, or sometimes we have parameters that could be of different types.
Typescript helps us with two powerful features: *Union*(|) and *Intersection*(&).

## Union

A union type describes a value that can be one of several types.

```ts
type Padding = number | string
let paddingNumber: Padding = 1
let paddingString: Padding = '----';
let paddingError: Padding = true // Type 'boolean' is not assignable to type 'Padding'.
```

In this case, the padding can be a number or a string, and the compiler detects if you set different types; this feature can be used also with custom types.

```ts
type Fish = {
  name(): string;
  swim(): true;
};
type Cat = {
  name(): string;
  meows(): true;
};
type Pet = Fish | Cat; // { name(): string; }
declare function createPet(): Pet;
let pet = createPet();
pet.name()
pet.swim() // Property 'swim' does not exist on type 'Pet'
pet.meows(); // Property 'meows' does not exist on type 'Pet'
```

In this example we can see how the union type creates the Pet type; the Pet type is composed by a single method "name". This method is the only one present in the two initial types: Fish and Cat.

## Intersection

An intersection type combines multiple types into one.

```ts
type Point2D = {
  x: number;
  y: number;
};
type Point3D = Point2D & {
  z: number;
};
let point2d: Point2D = { x: 0, y: 0 };
let point3d: Point3D = { x: 0, y: 0, z: 0 };
```

We can see that the Point3D type is the union of the Type Point2D and the type { z: number; }.

That's all for today!
See you soon guys!
