---
{
title: "The Tuple Type in Typescript",
published: "2022-02-22T07:49:25Z",
tags: ["typescript", "javascript", "webdev", "node"],
description: "A tuple type is an array with a predefined length and predefined types in each index position in the...",
originalLink: "https://mainawycliffe.dev/blog/tuple-type-in-typescript/",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "a-byte-of-typescript",
order: 7
}
---

A tuple type is an array with a predefined length and predefined types in each index position in the array. The types inside this array do not have to be the same, could be a mixture of different types. In a normal array, it can contain anywhere from zero to an unknown number of elements and order is not important.

This is where a Tuple differentiates itself from an array. In a tuple, the type of each element, the length of the array, and the order in which the elements are ordered in the array are important. I.e. it should always return an array of length 2, with the first element being a string and the second element being a number.

To define a Tuple type, we use syntax similar to Javascript array syntax but instead of specifying the values, we specify the type in each index location, as shown below.

```typescript
type PersonNameAge = [string, number];
```

In the example above, we are defining a Tuple type `PersonaNameAge`, as an array of length two, with the first element being a string for persons' name, and the next element being a number for persons' Age.

We can then go ahead and use the above tuple as follows:

```typescript
const personNameAge: PersonNameAge = ["John Doe", 25] // this doesn't throw an error
```

If we don't provide enough elements matching the length of fields defined in the `PersonNameAge` tupple, then Typescript will throw the following error:

```typescript
const personNameAge: PersonNameAge = []

// Error:
Type '[]' is not assignable to type 'PersonNameAge'.
  Source has 0 element(s) but target requires 2.

// the same thing happens if provide more elements
const personNameAge: PersonNameAge = ["John Doe",25, true]

// ERROR:
Type '[string, number, number]' is not assignable to type 'PersonNameAge'. 
  Source has 3 element(s) but target allows only 2.
```

And if we specified the types not matching the types specified in their index location, Typescript will throw the following error:

```typescript
const personaNameAge: PersonNameAge = [25,"John Doe"]
                                            ~~ ERROR: Type 'string' is not assignable to type 'number'.(2322)
```

![The Tuple Type in Typescript](https://cms.mainawycliffe.dev/content/images/2022/02/image-4.png)

![The Tuple Type in Typescript](https://cms.mainawycliffe.dev/content/images/2022/02/image-2.png)

## Why Tuple

Tuples have several benefits, the first one being able to return more than one value from a function. Take for instance the following function:

```typescript
function doSomething(): [string, number] {
    // do something
}
```

It can return two values, a string and a number, which the caller can assign to variables. This leads to the second benefit, being able to destructure them easily to a variable name of choice i.e. being able to assign the return values of the tuple directly to their variables as shown below.

```typescript
const [str, nmb] = doSomething();
```

If you returned an object instead of a tuple, destructing takes an extra step of needing to rename the field, especially if there is a variable name collision. You can also ignore the return type of Tuple by using an underscore `(_)` character if you wanted to access the value of a variable that is in a much higher index position.

```typescript
const [_, nmb] = doSomething();
```

## Examples of Tuples in Action

In this section, I thought it was prudent to highlight a few places where tuples are in use out in the wild:

### Promise.all()

> The `Promise.all()` method takes an iterable of promises as an input, and returns a single [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that resolves to an array of the results of the input promises. - [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

This is a perfect use case of Tuples return type as each promise resolved is returned at the index position it was in inside the input. So, an input of promise a,b,c returns results of the promises of a,b,c in their respective index position in which they were in the input.

```typescript
async function apiCall1() {
    return "";
}

async function apiCall2() {
    return 1;
}

async function apiCall3() {
    return false;
}

async function main() {
    const x = await Promise.all([apiCall1(), apiCall2(), apiCall3()])
}
```

The type of valuable `x` will be a Tuple: `[string, number, boolea]`:

![The Tuple Type in Typescript - Promise.all example](https://cms.mainawycliffe.dev/content/images/2022/02/image-1.png)

We can destructure the above `Promise.all()` as follows, with each variable getting assigned the correct types.

```typescript
const [str, num, bool] = await Promise.all([apiCall1(), apiCall2(), apiCall3()])
```

### React - useState

Another use case can be found in React hooks - `useState`. `useState` is used to declare a state variable in react functional components and returns a tuple of value and a dispatch function to update the state variable.

```typescript
const [count, setCount] = useState(0);
```

In the above example, the `count` variable is a number and the `setCount` variable is a dispatch function whose input parameter accepts a number. This allows you to have multiple state variables which are easily assigned unique variable names using array destructuring, as shown below:

```typescript
const [count, setCount] = useState(0);
const [name, setName] = useState("John Doe")
```

There are other use cases but these are the most common ones I could come up with.

## Conclusion

In this article, we covered the Tuple type in typescript, how and why we should use them. Tuples are special arrays that have their length predefined and the types at each index position of the array being predetermined and may vary from one index position to another. On top of that, we covered two particularly common use cases for Tuples and saw how we benefit from this Tuples usage in the real world.

Thank you for reading this article, if you are interested in more typescript content, check out my previous articles [here](https://mainawycliffe.dev/blog/tags/a-byte-of-typescript/), follow me on [Twitter](https://twitter.com/mwycliffe_dev) and [LinkedIn](https://www.linkedin.com/in/mainawycliffe). And you can also join my new [community](https://twitter.com/i/communities/1491713662867984387) on Twitter for all Typescript developers, where we can learn, share and connect with each other.
