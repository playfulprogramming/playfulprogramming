---
{
title: "const assertions in Typescript",
published: "2022-02-25T11:35:40Z",
edited: "2022-02-27T12:15:19Z",
tags: ["typescript", "javascript", "webdev", "node"],
description: "In Typescript 4.3, typescript introduced the const assertions. const assertions are used to tell the...",
originalLink: "https://mainawycliffe.dev/blog/const-assertion-in-typescript",
socialImage: "social-image.png",
collection: "a-byte-of-typescript",
order: 8
}
---

In Typescript 4.3, typescript introduced the `const` assertions. `const` assertions are used to tell the Typescript compiler one of the following:

## Object properties are Readonly

When you cast an object as const, the properties are marked as read-only and cannot be modified. Let's take the following variable `person` with name and age in it.

```typescript
const person = {
    name: "John Doe",
    age: 25,
};
```

Its types are inferred as `string` and `number` as expected:

![](https://cms.mainawycliffe.dev/content/images/2022/02/image-5.png)

But if we assert it as `const`, the inferred types for the person object are marked as read-only and cannot be modified.

```typescript
const person = {
    name: "John Doe",
    age: 25,
} as const;
```

![](https://cms.mainawycliffe.dev/content/images/2022/02/image-6.png)

If we tried to update the `age` field, we would get the following error: `Cannot assign to 'age' because it is a read-only property`

![](https://cms.mainawycliffe.dev/content/images/2022/02/image-7.png)

## Arrays become Readonly Tuples

In my last [article](https://mainawycliffe.dev/blog/tuple-type-in-typescript/), we looked into tuples, which you can learn more about [here](https://mainawycliffe.dev/blog/tuple-type-in-typescript/). `const` assertions on an array allow us to mark an array as read-only Tuple i.e. content of the array in each position becomes a literal type that cannot be modified.

Let's take the following variable `personNameAge`, a normal array with the name at the first position and age at the second position:

```typescript
const personNameAge = ["john doe", 25]
```

Typescript will infer this as an array of strings or numbers i.e. `(string | number)[]`:

![](https://cms.mainawycliffe.dev/content/images/2022/02/image-8.png)

But, if we used `as const` assertions, this becomes restricted to a readonly Tuple, with "john doe" in the first position and "25" in the second position:

![](https://cms.mainawycliffe.dev/content/images/2022/02/image-9.png)

And its values cannot be modified:

![](https://cms.mainawycliffe.dev/content/images/2022/02/image-11.png)

## A variable value should be treated as Literal Type

Literal types allow us to define types that are more specific, instead of something that is generalized like string or number. For example:

```typescript
type Switch: "On" | "Off";
```

`const` assertions allows us to mark a variable value as a literal type. For instance, if we had a variable `onSwitch` and assigned the value `on`, normally typescript will infer the type of the variable as a string:

![](https://cms.mainawycliffe.dev/content/images/2022/02/image-12.png)

But, if we used `const` assertions, it will be inferred as a literal type of `On`:

![](https://cms.mainawycliffe.dev/content/images/2022/02/image-13.png)

And cannot accept any other variable apart from `On`:

![](https://cms.mainawycliffe.dev/content/images/2022/02/image-14.png)

One thing to keep in mind is that `const` assertions can only be applied to simple expressions. So you can not do something like this:

```typescript
function switchValue(input: boolean) {
    let onSwitch =  (input ? "On" : "Off") as const; // Won't work
    return onSwitch;
}
```

The above will throw an error: `A 'const' assertions can only be applied to references to enum members, or string, number, boolean, array, or object literals.`

![](https://cms.mainawycliffe.dev/content/images/2022/02/image-16.png)

To solve the above issue, we need to apply `const` assertions on each output value of our ternary operator:

```typescript
function switchValue(input: boolean) {
    let onSwitch =  input ? "On" as const : "Off" as ;
    return onSwitch;
}
```

And the type of `onSwitch` variable get inferred to a literal type union `On` | `Off`:

![](https://cms.mainawycliffe.dev/content/images/2022/02/image-15.png)

## Conclusion

In this article, we looked at `const` assertions and how we can use it within our code. We learned that we can use it to mark an object field as read-only, create a read-only Tuple, and mark a variable's value as a Literal type instead of widening it to its based type i.e. string, number, etc.

Thank you for reading this article, if you are interested in more typescript content, check out my previous articles [here](https://mainawycliffe.dev/blog/tags/a-byte-of-typescript/), follow me on [Twitter](https://twitter.com/mwycliffe_dev) and [LinkedIn](https://www.linkedin.com/in/mainawycliffe). And you can also join my new [community](https://twitter.com/i/communities/1491713662867984387) on Twitter for all Typescript developers, where we can learn, share and connect with each other.
