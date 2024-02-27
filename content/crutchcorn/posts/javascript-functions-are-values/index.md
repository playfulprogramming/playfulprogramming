---
{
    title: "JavaScript Fundamentals: Functions Are Values",
    description: "JavaScript functions are widely used in web development... but do you KNOW them? Let's explore the fundamentals and how they can be used in unorthodox ways",
    published: '2022-07-28T22:12:03.284Z',
    tags: ['webdev', 'javascript'],
    license: 'coderpad',
    originalLink: 'https://coderpad.io/blog/development/what-you-never-learned-about-javascript-functions/',
    collection: "JavaScript Fundamentals",
    order: 1
}
---

**Functions are weird**. Consider the following code:

```javascript
function sayHello() {
  console.log("Hello");
}

sayHello();
```

Seems straightforward enough, right? We're creating a function `sayHello`, then immediately calling it.

Now, what about the following code:

```javascript
function sayHello() {
  console.log("Hello");
}
const greeting = sayHello;
greeting();
```

This “intuitive” code comes loaded with assumptions and processes that we regularly take for granted:

- Why are we able to assign a function to a variable?
- What is this doing under the hood?
- Are we able to utilize functions in potentially unexpected ways?

While you *could* get away with never knowing the answers to these questions, being a great developer often involves understanding how the tools we use actually work – and JavaScript functions are no exception.

For example, do you know what “function currying” is and why it’s useful? Or do you know how `[].map()` and `[].filter` are implemented?

Fret not, dear reader, as we will now take a look at all these questions.

# Why are we able to assign a function to a variable?

To understand why we're able to assign a function to a variable, let's analyze what happens when *anything* is assigned to a variable.

## How memory works

Inside of your computer, there's something called "memory," AKA RAM,[which allows your computer to store short-term memory that it can quickly reference later.](/posts/how-computers-speak#ram)

When we create a variable, what we're doing is storing values inside of this memory.

For example, take the following code:

```javascript
const helloMessage = "HELLO";
const byeMessage = "SEEYA";
```

This will create two sections of memory that your compiler will keep around for reference when you use those variables. Each of these sections of memory will be just big enough to store 5 characters of the string.

This might be visually represented like so:

![A big block called "memory" with two items in it. One of them has a name of "helloMessage" and is address `0x7de35306` and the other is "byeMessage" with an address of `0x7de35306`.](./memory_block.png)

It's important to remember that the memory address itself doesn't store the name, your compiler does. When you create blocks of memory via variables, the compiler gets back a number that it can use to look up the variable's value inside of a "stack" of memory.

You can *loosely* think of this memory stack as an array that the compiler looks through in order to get the data based on an index. This number can be huge because your computer likely has multiple gigabytes of RAM. Even 16GB is equivalent to 1.28e+11 bytes. Because of this, memory addresses are often colloquially shortened to [hexadecimal representations](/posts/non-decimal-numbers-in-tech).

This means that our *0x7de35306* memory address is associated with bit number 2112049926, or just over the 0.2GB mark.

> This explanation of memory is a very generalized explanation of how memory allocation works. [You can read more about memory stacks here.](https://en.wikipedia.org/wiki/Stack-based_memory_allocation)

When your browser compiles the following code:

```javascript
const helloMessage = "HELLO";
const byeMessage = "SEEYA";

console.log(helloMessage);
console.log(byeMessage);
```

The browser's compiler will replace the variable names with memory addresses:

```javascript
memoryBlocks[0x7de35306] = "HELLO";
memoryBlocks[0x7de35307] = "SEEYA";

console.log(memoryBlocks[0x7de35306]);
console.log(memoryBlocks[0x7de35307]);
```

> This code is simply pseudocode and will not actually run. Instead, your computer will compile down to ["machine code" or "assembly code"](/posts/how-computers-speak#assembly-code), which will in turn run on "bare metal". What's more, this is a drastic oversimplification of how your browser's JIT compiler and your system's memory management*actually* works under-the-hood.

## How does this relate to function storage?

Remember that functions in JavaScript have two different syntaxes:

```javascript
function sayHello() {
  console.log("Hello");
}

sayHello();
```

Is roughly equivalent to:

```javascript
const sayHello = () => {
  console.log("Hello");
}

sayHello();
```

As you might correctly assume, this means that both of these syntaxes allow a function to be stored in memory. 

Using our pseudocode again, this might look like:

```javascript
memoryBlocks[0x9de12807] = () => {
    console.log("Hello");
}

memoryBlocks[0x9de12807]();
```

## Why does it matter that functions are stored as memory addresses?

The reason I've gone on to show you that functions are stored as memory addresses is to help reinforce the idea that **functions are values** and can be treated like such. For example, you can do the following with numbers in JavaScript:

```javascript
console.log(1 + 2);
```

Without having to assign each number to a variable:

```javascript
const one = 1;
const two = 2;
console.log(one + two);
```

Likewise, you can use functions without assigning them to a variable.

This means the the following `sayHello` function:

```javascript
const sayHello = () => {
    console.log("Hello");
}
sayHello();
```

Can be used without a variable to assign the function:

```javascript
(() => console.log("Hello"))();
```

This is just the start of what's possible with functions. Think of all the interactions you can have with a non-function variable like integers and strings. You can have those same interactions with functions as well.

# Can you pass a function to another function?

One very popular use of functions is passing in values as properties. For example:

```javascript
function sayThis(message) {
    console.log(message);
}

sayThis("Hello");
```

Here, we're passing a string as a property to the `sayThis` function. 

Just like you can pass in integers, strings, or arrays to a function, you might be surprised to know you can also pass in functions into a function:

```javascript
function doThis(callback) {
    callback();
}

function sayHello() {
    console.log("Hello");
}

doThis(sayHello);
```

This will output the same "Hello" as our previous`sayThis` usage.

Not only can you call these functions that are passed as parameters, but you can pass parameters to *those* functions as well.

```javascript
function callThisFn(callback) {
    // Remember, `callback` is a function we're padding
    // `console.log` specifically
    return callback('Hello, world');
}

callThisFn(console.log);
```

To walk through this step-by-step, we:

- Pass `console.log` to `callThisFn` through an argument
- `callThisFn` assigns that property as `callback`, which remains a function
- We then call `callback` with a parameter of it's own: 'Hello, world'

In case this isn't clear, let's do our previous trick of calling a function without assigning it to a variable.

```javascript
(callback => callback('Hello, world!'))(console.log);
```

# What about returning a function from another function?

As a function’s input, parameters are only half of the story of any function's capabilities – just as any function can output a regular variable, they can also output another function: 

```javascript
function getMessage() {
  return "Hello";
}

const message = getMessage();
console.log(message);
// Equivalent to
console.log(getMessage());
```

If you've done much coding in JavaScript, this will look familiar. We're "calling"`getMessage` and storing the return value to `message` variable. We can then do anything else we might expect with this `message` variable - including passing it to other functions as a parameter.

This too, is possible with a function as a return value:

```javascript
function getMessageFn() {
    return () => {
        console.log("Hello");
    }
}

const messageFn = getMessageFn();
messageFn();
// This can be simplified to
getMessageFn()();
```

This code block is an extension on the "returned value" idea. Here, we're returning*another* *function* from `getMessageFn`. This function is then assigned to `messageFn` which we can then in turn call itself.

Meta, right?

Funnily enough, you can even combine this with the ability to return within the inner function.

```javascript
function getMessageFn() {
    return () => {
        return "Hello";
    }
}

const messageFn = getMessageFn();
const message = messageFn();
console.log(message);
// This can be simplified to
console.log(getMessageFn()());
```

# Let's combine concepts by accepting and returning a function from another function

Knowing that we can both accept a function as a property and return a different function as a value, we can combine these both to create the following logic:

```javascript
function passFunctionAndReturnFunction(callback) {
    return () => {
        callback("Hello, world");
    }
}

const sayHello = passFunctionAndReturnFunction(console.log);
sayHello(); // Will log "Hello, world"
```

# How do you pass data from one function to another? A pipe function!

The concepts we've spoken about today are commonly utilized when programming in a style called "functional programming." Functional programming is a style of programming - similar to["Object Oriented Programming" (OOP)](https://www.educative.io/blog/object-oriented-programming) - that utilizes functions as a method to pass, change, and structure data. 

Functional programming relies heavily on the properties of functions that we've looked at today: passing functions to other functions, returning functions from functions, and more.

If you spend much time looking at functional programming libraries, [such as Ramda](https://ramdajs.com/), you might run into [a function called a "Pipe"](https://ramdajs.com/docs/#pipe).

Traditionally, a `pipe` function takes a list of other functions to call them and return a final value.

For example, you might run:

```javascript
const finalVal = pipe([
  () => 1,
  // Pass `1` to `v`
  v => v + 1
]);

console.log(finalVal); // 2
```

This is useful when you need to chain a list of actions together and get the final output.

Luckily, `pipe` is an easy function to implement:

```javascript
function pipe(fns) {
    let val = undefined;
    for (let fn of fns) {
        val = fn(val)
    }
    return val;
}
```

So when is this useful? Let's assume that we want to clamp the values between two numbers.

```javascript
clamp({min: 0, max: 10, val: 5}); // 5
clamp({min: 0, max: 10, val: 15}); // 10
clamp({min: 0, max: 10, val: -10}); // 0
```

Thinking about this problem, we can break up our logic into three different parts:

1. Check if smaller than minimum
2. Check if larger than maximum
3. Return final value

We can implement this using distinct functions and our new `pipe` method:

```javascript
function pipe(fns) {
    let val = undefined;
    for (let fn of fns) {
        val = fn(val)
    }
    return val;
}

const min = (val, min) => val < min ? min : val;
const max = (val, max) => val > max ? max : val;

function clamp(props) {
    return pipe([
        // Step 1: Check if smaller than minimum
        () => min(props.val, props.min),
        // Step 2: Check if larger than maximum
        val => max(val, props.max)
    ])
}

clamp({min: 0, max: 10, val: 5}); // 5
clamp({min: 0, max: 10, val: 15}); // 10
clamp({min: 0, max: 10, val: -10}); // 0
```

While this might seem a bit confusing at first, the benefits are that we now are able to use the `min` and `max` method independently of `clamp`.

```javascript
min(10, 0); // 10
min(0, 10); // 10
max(10, 0); // 0
max(0, 10); // 0
```

# What are built-in functional paradigms in JavaScript?

While we've touched on how to build many of our own functional ideals using JavaScript, many of the core concepts are built into JavaScript itself through usage of Array methods.

For example, want to run a function over each item of an array? [`Array.forEach` to the rescue!](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)

```javascript
[1, 2, 3].forEach(val => console.log(val));

// Will output
1
2
3
```

`Array.forEach` doesn't just pass a single value to the inner mapping function, it also passes the index of the item and the original array:

```javascript
[1,2,3].forEach((val, i, arr) => console.log({val, i, length: arr.length}));

// Will output
{val: 1, i: 0, length: 3}
{val: 2, i: 1, length: 3}
{val: 3, i: 2, length: 3}
```

## Mapping items in an array to a new value

Don't have a use for "`forEach`"? No matter! There's also [`Array.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) that enables you to have a list and want to change each item in the list in some way.

```javascript
const listAddedByOne = [1, 2, 3].map(val => val + 1);
```

`Array.map` accepts a function that, when you return a new value, will update that item of the list.

Just like `Array.forEach`, `Array.map` passes the index of the item and the original array to the inner function as well:

```javascript
const newList = ["Eat", "Sleep", "Play Elden Ring"].map((val, i, arr) => {
    return `${i + 1} / ${arr.length} - ${val}`;
});

// This will return:
"1 / 3 - Eat"
"2 / 3 - Sleep"
"3 / 3 - Play Elden Ring"
```

## Filter a list down based on a function's return value

Say that you have a list of numbers:

```javascript
const numbers = [10, 20, 30, 40, 50, 60, 70, 80, 90];
```

And want to filter down this list to only include "small" numbers - aka when a number is smaller than 50. This is where we can use[`Array.fiter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter):

```javascript
const smallNumbers = numbers.filter(val => val < 50);
```

Once again, you're also given the option to get the index and original array in the filter method.

## Reduce an array down to a single value

While there are other array methods, the last one we'll be taking a look at today enables you to reduce a list down to a single value. Let's take a list of numbers and sum them together to a final output.

```javascript
const numbers = [1, 2, 3];
// This will return "6"
const sum = numbers.reduce((acc, curr) => acc + prev, 0);
```

Reduce is passed two items:

1. The function that provides a reduced value when returned
2. The initial value to set to `acc`

# How can we re-write built-in JavaScript functional programming methods?

While `forEach`, `map`, `filter`, and `reduce` are all built into JavaScript, the foundations of functional programming means that we can implement them ourselves. This doesn't have any practical usecases, but allows us to understand how JavaScript works under the hood a bit better.

For example, a `forEach` can be implemented using a basic `for` loop:

```javascript
const forEach = (arr, callback) {
    for (let i = 0; i < arr.length; i++) {
        callback(arr[i], i, arr);
    }
};

const cars = ["Ford", "Volvo", "BMW"];
forEach(cars, car => console.log(car));
```

Similarly, you can write your own implementation of `map` with an intermediary array alongside a `for` loop.

```javascript
const map = (arr, callback) {
    const returnedVal = [];
    for (let i = 0; i < arr.length; i++) {
        const newVal = callback(arr[i], i, arr);
        returnedVal.push(newVal);
    }

    return returnedVal;
};

const cars = ["Ford", "Volvo", "BMW"];
const carNameLengths = map(cars, car => car.length);
console.log(carNameLengths); // [4, 5, 3]
```

To implement `filter` is as easy as adding a single `if` statement to our `map` implementation.

```javascript
const filter = (arr, callback) {
    const returnedVal = [];
    for (let i = 0; i < arr.length; i++) {
        const exist = callback(arr[i], i, arr);
        if (exist) {
            returnedVal.push(arr[i]);
        }
    }

    return returnedVal;
};
const cars = ["Ford", "Volvo", "BMW"];
const onlyBMW = filter(cars, car => car === "BMW");
console.log(onlyBMW); // ["BMW"]
```

Finally, implementing `reduce` is similar to our `map` implementation, but instead of `pushing` new values to an array, we simply replace the old value between loop iterations.

```javascript
const reduce = (arr, callback, init) => {
    let returnedVal = init;
    for (let i = 0; i < arr.length; i++) {
            returnedVal = callback(returnedVal, arr[i], i, arr);
    }

    return returnedVal;
};

const numbers = [1,2,3];
const sum = reduce(numbers, (acc, curr) => acc + curr, 0);
console.log(sum); // 6
```

# Functional programming methods can be applied everywhere

Now that you've mastered the fundamentals of JavaScript functions, you can build more kinds of APIs for your applications. These APIs can help you make debugging easier, consolidate your application logic, and more.


The functional programming paradigms we've touched on today are immensely popular in ecosystems like React applications and library development. In particular, [React uses these concepts alongside its `useEffect` API.](https://coderpad.io/blog/development/rules-of-reacts-useeffect/)

These concepts aren't unique to JavaScript, either! Python utilizes similar ideas in its ["list comprehension" functionality.](https://coderpad.io/blog/development/python-list-comprehension-guide/)

If you find any of these techniques useful (or even confusing, we know that functional programming can be a world of its own) [let us know on Twitter](http://twitter.com/coderPad/)!
