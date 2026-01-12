---
{
title: "Looking Up React Components Props Types",
published: "2023-06-14T11:43:55Z",
tags: ["typescript", "javascript", "react", "reactnative"],
description: "In an earlier post, in my All Things Typescript newsletter, we covered how we can look up types for...",
originalLink: "https://mainawycliffe.dev/blog/looking-up-react-components-props-types"
}
---

In an earlier post, in my [All Things Typescript](https://www.allthingstypescript.dev/?ref=content.mainawycliffe.dev) newsletter, we covered how we can look up types for functions in Typescript using the [Parameters and ReturnType](https://www.allthingstypescript.dev/p/looking-up-the-types-of-a-functions?ref=content.mainawycliffe.dev) utility types.

In this short post, I wanted to go a little bit further and look at doing the same for react components. It's a common need for React developers to occasionally create wrappers for third-party components, to customize behavior that's re-usable within their applications.

But from time to time, you will come across third-party libraries that do not export types for their own component props, despite their existence.

What do you do in this case? You could manually annotate the types, but you run the risk of your types getting out of sync with the library's types if the library authors introduce breaking changes.

Fortunately for us, we have a better solution on our hands - the `React.ComponentProps` utility type. Let's see it in action.

Let's take the following component:

```ts
function HelloWorld({ name }: { name: string}) {
  // content of the component here, doesn't matter for the purpose of this article
}
```

As you can see, the types of props are inlined. Since this is in our control, we can refactor the props types to a reusable Typescript Type, but let's assume we can't and we wanted to re-use the prop types.

This is where React.CompoentProps comes in, and we can use it in combination with the `typeof` operator to  get the props type, as shown below:

```typescript
type HelloWorldProps = React.ComponentProps<typeof HelloWorld>;
```

And in return, we get the following type back:

![](https://content.mainawycliffe.dev/content/images/2023/06/image.png)

If you are interested, I wrote about the `typeof` operator, a while back in my [All Things Typescript](https://allthingstypescript.dev/?ref=content.mainawycliffe.dev) newsletter, you can find the article [here](https://www.allthingstypescript.dev/p/the-typeof-and-keyof-operators-referencing?ref=content.mainawycliffe.dev).

And that's it. With a single Utility type - `React.ComponentProps`, we are able to fetch types from React Components and re-use them within our code with ease, giving us the flexibility to extend components as we need to.

### Resources

- [Looking up the Input and Output Types of a Function using the Parameters & ReturnType Utility Types](https://www.allthingstypescript.dev/p/looking-up-the-types-of-a-functions?ref=content.mainawycliffe.dev)
- [Indexed Access Types in Typescript](https://www.allthingstypescript.dev/p/indexed-access-types-in-typescript?ref=content.mainawycliffe.dev)
- [Using Zod Schemas as a Source of Truth for Typescript Types](https://www.allthingstypescript.dev/p/using-zod-schemas-as-source-of-truth?ref=content.mainawycliffe.dev)
- [Typescript: How do you provide types for data from external sources?](https://www.allthingstypescript.dev/p/typescript-how-do-you-provide-types?ref=content.mainawycliffe.dev)
