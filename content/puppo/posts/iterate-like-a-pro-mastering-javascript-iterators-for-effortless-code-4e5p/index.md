---
{
title: "Iterate Like a Pro: Mastering JavaScript Iterators for Effortless Code",
published: "2023-08-25T06:10:55Z",
tags: ["javascript", "iterators"],
description: "Welcome to this blog post, where we're about to unravel the power and versatility of JavaScript...",
originalLink: "https://blog.delpuppo.net/iterate-like-a-pro-mastering-javascript-iterators-for-effortless-code",
coverImg: "cover-image.png",
socialImg: "social-image.png",
collection: "Javascript Iterators & Generators",
order: 1
}
---

Welcome to this blog post, where we're about to unravel the power and versatility of JavaScript iterators. If you've ever found yourself working with data collections and wondered if there's a more efficient and elegant way to navigate them, you're in the right place.

In the realm of modern web development, efficiently managing and manipulating data is a crucial skill. This is where JavaScript iterators come into play, offering a systematic approach to traversing various data structures such as arrays, maps, and sets. Whether you're a beginner eager to understand the basics or an experienced developer looking to fine-tune your code, grasping the concept of iterators can significantly enhance your programming journey.

In this blog post, we'll embark on a comprehensive exploration of JavaScript iterators. We'll break down their fundamental principles, explore practical examples of their usage, and demonstrate how they can simplify complex data operations. By the time you finish reading, you'll not only understand iterators inside and out but also be equipped to leverage their potential to write more concise, readable, and efficient code.

So, whether you're striving to make your codebase more elegant or seeking to optimize your data manipulation techniques, join us as we delve into the world of JavaScript iterators. From novice to expert, there's something here for everyone. Let's dive in!

Built-in in Javascript exists many structures that implement the Iterators pattern, for instance: Array, Set and Map. In Javascript, an object to be iterable must implement the Iterable interface.

But what is the Iterable interface? First, to be iterable, an object must have a `next` method. This method must return two properties: `done` and `value`. Done is used to detect if the iteration is completed; instead, the value contains the current value. Last but not least, if you want your object to become an iterator, you must expose the iterable interface in the `Symbol.iterator` of your object, like in this example.

```ts
const array = [1, 2, 3, 4, 5];
const iterator = array[Symbol.iterator]();
for (let result = iterator.next(); !result.done; result = iterator.next()) {
  console.log(result.value);
}
```

For example, here is a range function implemented as an iterator.

```ts
const range = (start: number, end: number): Iterable<number> => {
  return {
    [Symbol.iterator]() {
      let n = start;
      return {
        next() {
          console.log("range next");
          if (n > end) {
            return { done: true, value: null };
          }
          return { done: false, value: n++ };
        },
      };
    },
  };
};
```

As you can notice, this function accepts two numbers, start and end and returns a new object with a single property, in this case, the iterator property. Then, inside this function, there is the next function that, on every call, checks if the current value is greater than the end and, if true, returns a new object with done as true and value as null; else returns an object with done false and value with the current value. The beautiful thing about iterator is that javascript only does something once you ask for the next value.

Every iterator can be iterated using the for-of loop

```ts
for (const num of range(1, 10)) {
  console.log(num);
}
```

or using its native method, so calling the `Symbol.iterator` function and then using the next method and checking the done property if it is true or not.

```ts
const rangeIterator = range(1, 10)[Symbol.iterator]();
for (let result = rangeIterator.next(); !result.done; result = rangeIterator.next()) {
  console.log(result.value);
}
```

It's possible to copy all the iterator values in an Array using the spread operator too.

```ts
for (const num of [...range(1, 10)]) {
  console.log(num);
}
```

Iterator also has another method, the `return` method. This method is used in case the code doesn't complete the iteration. Imagine the loop call a break or a return; in this case, JavaScript under the hood calls the `return` method for us. In this method, we can handle whatever we need. We may need to reset something or check the current value of the iterator.

```ts
const range = (start: number, end: number): Iterable<number> => {
  return {
    [Symbol.iterator]() {
      let n = start;
      return {
        next() {
          console.log("range next");
          if (n > end) {
            return { done: true, value: null };
          }
          return { done: false, value: n++ };
        },
        return() {
          console.log("range return");
          return { done: true, value: null };
        },
      };
    },
  };
};

for (const num of range(1, 10)) {
  if (num > 5) break;
  console.log(num);
}
```

Iterators are powerful, and we can also create functions that accept an iterator and manipulate it to return another iterator. For instance, we can create a map function that accepts an iterator and returns another with a callback specified by the user.

```ts
function mapIterable<T, U>(
  iterable: Iterable<T>,
  callback: (value: T) => U
): Iterable<U> {
  return {
    [Symbol.iterator]() {
      const iterator = iterable[Symbol.iterator]();
      return {
        next() {
          console.log("mapIterable next");
          const { done, value } = iterator.next();
          if (done) {
            return { done: true, value: null };
          }
          return { done, value: callback(value) };
        },
        return() {
          console.log("mapIterable return");
          if (iterator.return) {
            iterator.return();
          }
          return { done: true, value: null };
        },
      };
    },
  };
}
```

All the info said before is true also for this new iterator. JavaScript does nothing until the codebase doesn't ask for the next value; the same is true for the return method, and now you can compose the range iterators with the map iterator to build a new one.

```ts
const mapRange = mapIterable(range(1, 10), value => value * 10);

for (const num of mapRange) {
  if (num > 50) break;
  console.log(num);
}
```

Ok folks, that's all!\
If you want to dive deep with Iterators, don't waste my video on my [Youtube Channel](https://www.youtube.com/@Puppo_92/).

<iframe src="https://www.youtube.com/watch?v=BSctSkMGtiM"></iframe>

In conclusion, understanding and utilizing JavaScript iterators can greatly enhance your ability to work with collections of data in a more elegant and efficient manner. With iterators, you can streamline your code, improve its readability, and reduce memory consumption by processing data one element at a time. This powerful concept empowers developers to implement custom iteration behaviour, making their code more adaptable to different scenarios.

By grasping the fundamentals of iterators, such as the `next()` method and the concept of iterable objects, you open the door to more sophisticated programming techniques and design patterns. Whether you're working with arrays, maps, sets, or other data structures, iterators provide a standardized way to traverse through data and perform operations without unnecessary complexity.

As the JavaScript language continues to evolve, iterators remain a foundational concept that plays a crucial role in modern programming paradigms. Incorporating iterators into your coding arsenal equips you with a versatile tool for managing data, ultimately leading to cleaner, more maintainable, and more robust code.

So, as you embark on your journey to master JavaScript iterators, remember that they are more than just technical features; they represent a shift in how you approach and solve problems in your code. With practice and exploration, you'll be able to wield iterators effectively, making your codebase more efficient and your development experience more enjoyable.

Thanks for reading and Happy coding! 😃 👩💻 👨💻

N.B. you can find the code of this article [here](https://github.com/Puppo/javascript-iterators-and-generators/tree/01-iterators)!

<!-- ::user id="puppo" -->
