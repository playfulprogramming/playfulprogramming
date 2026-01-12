---
{
title: "Better Types using Discriminated Unions in TypeScript",
published: "2021-09-27T08:03:07Z",
tags: ["typescript", "javascript", "webdev", "node"],
description: "How we define our types in Typescript impacts how effective typescript is at warning us when we make...",
originalLink: "https://mainawycliffe.dev/blog/better-types-using-discriminated-types-in-typescript",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "a-byte-of-typescript",
order: 4
}
---

How we define our types in Typescript impacts how effective typescript is at warning us when we make mistakes. If we take a broad approach i.e. to cover many types in a single type, we end up handicapping typescript and it becomes less effective.

The more specific we are, the more effective typescript can be at catching possible errors. In this article, we are going to look at how we can use discriminative unions to write better and more specific types and help typescript to be more helpful to us.

Let's take the simplest example I can think of - **Shapes**. In shapes, we can have Circles, Rectangles, Squares, etc; you get the idea. There is no way you can have a single type alias that can cover all shapes without compromising on something.

If we were to define a `Shape` type alias for just the above 3 shapes, it would need to account for the possibility that all fields are not there for all shapes, i.e. Circle only has a radius, which doesn't exist in either Rectangle or Square, while the circle doesn't have either width or height. As you can imagine, our problem only becomes bigger as you add more shapes.

So, our type alias would look like this.

```ts
type Shape = {
  radius?: Number; // Circle
  length?: Number; // Rectangle
  width?: Number; // Rectangle
  side?: Number; // Square side Length
}
```

> For the purpose of this above example, I am assuming that the Square can't take height and width.

As you can see, the type alias above is not very useful, since if you had a circle, you could easily leave out all fields or add all of them to `Shape` and typescript will not be able to help you at all.

This is especially not a good practice for third-party SDKs, where you have to keep referring to the documentation just to get an idea of the shape of the data you are dealing with. Types help us avoid making silly and avoidable mistakes, which we all make as it's in our nature as human beings.

On top of that, we also lose out on the ability to narrow types. It's not easy to narrow the above type to either Circle, Rectangle, or Square.

> Type narrowing is the process of moving a type from a less precise type to a more precise type. You can learn more about type narrowing [here](https://mainawycliffe.dev/blog/type-guards-and-narrowing-in-typescript).

## Discriminated Unions

> A discriminated type union is where you use code flow analysis to reduce a set of potential objects down to one specific object. - Typescript [Docs](https://www.typescriptlang.org/play#example/discriminate-types)

Now, let me offer a possible solution to the above problem. We will start by defining three different type-aliases. Each type alias will have a literal type member property - `shape` - distinguishing for its corresponding shape i.e. `Rectangle`, `Circle`, and `Square` for each of our shapes.

```ts
type Square = {
  shape: "Square";
  side: number;
}

type Rectangle = {
  shape: "Rectangle",
  length: number;
  width: number;
}

type Circle = {
  shape: "Circle"
  radius: number;
}
```

And then we can use a union of the three to declare a type alias of shape that can only be a single type of the above.

```ts
type Shape = Square | Rectangle | Circle;
```

> The `Shape` type alias can only be Square, Rectangle or Circle.

So, what is the advantage of the above you may ask?

### Strongly Typed Shapes

The first advantage is that our types are now strongly typed for each shape as compared to the previous solution. For instance, if you specify the shape to be **Circle**, then, we only provide radius and if it's missing, Typescript throws an error.

```ts
const x: Shape = {
  shape: "Circle",
  radius: 5,
  width: 5, // Error ---> Object literal may only specify known properties, and 'width' does not exist in type 'Circle'.
}
```

As you can see above, once you specify the shape property to be `Circle`, then you are restricted to only specifying properties available in the `Circle` type alias.

Trying to add fields that do not exist will result in the following error: `// Error ---> Object literal may only specify known properties, and 'width' does not exist in type 'Circle'.`

### Type Narrowing is Now Possible

Type narrowing is now possible using the literal property `shape`.

```ts
if(shape.shape === "Circle") {
  // the type is now a Circle only
}
```

Learn more about Type Narrowing in typescript [here](https://mainawycliffe.dev/blog/type-guards-and-narrowing-in-typescript).

## Conclusion

In this article, we learned how we can use discriminated unions to write more specific types in Typescript, and thus better types overall and have an improved developer experience. This allows us in turn to write more type-safe code, which can help typescript eliminate a lot of bugs from our code that would otherwise slip through.

If you found this article informative and would like to keep learning about typescript, visit my series on Typescript - [A Byte of Typescript](https://mainawycliffe.dev/blog/tags/a-byte-of-typescript). A Byte of Typescript is a new series that I will be publishing on a regular basis to help you demystify Typescript.
