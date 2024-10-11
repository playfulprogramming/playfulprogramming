---
{
  title: "Web Fundamentals: JavaScript - The Basics",
  description: "The sixth chapter of this series contains the first look into JavaScript and its basic components.",
  published: "2024-10-20T20:08:26.988Z",
  tags: ["css", "html", "design"],
  license: "cc-by-4",
  authors: ["edpratti"],
  order: 6
}

---

**Today, we're learning about the basics of JavaScript.** If you've been to the web, you've been subjected to huge amounts of JavaScript.

JavaScript is a powerful programming language primarily used for creating dynamic and interactive content on websites. It runs in the browser, allowing real-time updates and user interactions without needing to reload the page.

One of its core functions is manipulating the Document Object Model (DOM), which enables developers to change the structure and content of web pages dynamically. ***We're not going to talk about the DOM and how to manipulate it in this chapter of Web Fundamentals, however.***

JavaScript is event-driven, meaning it can respond to user inputs like clicks or keyboard presses, making it essential for building interactive websites. Additionally, it supports asynchronous programming, allowing tasks like fetching data from servers without disrupting the user interface.

# The basics

Before we get started, it's important to have read up on every part of our Web Fundamentals series. We're not going to stop to explain concepts that were previously explored. The goal for this chapter is to learn the essentials so we can move on to cooler, more fun things in the next one!

## Variables & types

### Variables

Variables in JavaScript differ slightly from the CSS variables we've looked at in part two of our series. This is because while CSS can only define one type of variable, JavaScript has three.

| Variable type | Mutability | Scope | Details |
| --- | --- | --- | --- |
| `var` | Mutable | Global | **Mostly deprecated.** This is the equivalent to a CSS variable, being able to be accessed and modified from anywhere within the document. This is unadvised, as it can cause problems due to its careless scope. |
| `let` | Mutable | Block-scoped | **This is the most common type of variable declaration in JavaScript.** Contained within the scope of the block it is declared on, controlling its usage. |
| `const` | Immutable* |  Block-scoped | **Defines a variable with an immutable reference.** Contained within the scope of the block it is declared on, controlling its usage. |

> The `const` declaration functions differently when dealing with Objects as opposed to primitive types. To learn more, visit our article on [**Object Mutability**](/posts/object-mutation).

### Types

Types are categorized into two groups: Primitive types and Object types.

| Type | Details |
| --- | --- |
| Primitive | Number, string, boolean, symbol, null, undefined and BigInt. |
| Object | Object, array, function, Date, RegExp. | 

## Number

The number type can return either an integer or a float.

```js
let age = 27;
let pi = 3.14;
```

If you need to represent a value bigger than allowed by `number`, you can use a `BigInt` value instead.

```js
/* Same as let hugeNumber = 9007199254740991n */
let hugeNumber = BigInt("9007199254740991");
```

## String

The string type is created by encapsulating any content into quotation marks.

```js
let name = "Eduardo";
let gender = "male";
let country = "Brazil";
```

The quotation marks nullify any perceived type of the content, meaning that, as long as it is within quotes, it always considered a string.

```js
/* This is not considered a number.
We cannot manipulate the value as one. */
let age = "27";


/* This will not work, as we're trying
to add an integer to a string value! */
age = age + 1;
```

## Boolean

A `boolean` is a value that can be either `true` or `false`.

```js
let a = 3;
let b = 1;

/* Always returns true. */
let isLarger = a > b;

/* Let's make b larger than a */
b += 5;

/* Now it returns false. */
isLarger = a > b;
```

## Null

Applying `null` to a value simply leaves it empty. Unlike 

---

# Functions

Functions, as the name implies, are used to perform reusable tasks or return values.

> 📝 **[Functions, in and of themselves, are values.](./javascript-functions-are-values)** (Advanced)<br>
> If this chapter of our series leaves a little to be desired, go ahead and read this article instead!

We can declare functions in two different ways.

## Standard functions

A standard function in JavaScript differs very little from one you'd see on any other Object-Oriented Programming language.

```js
function functionName() {
  /* Function body. */
}
```

A function can take as many arguments as necessary. Arguments have no restriction. They are merely "slots" for types that the function may use in its task. Let's look at a simple example.

In the following function, we are `return`ing a value. By comparing the `first` and `second` parameter with a `>` operator, we are returning a Boolean.

```js
function isLarger(first, second) {
  return first > second;
}
```

The function above, `isLarger(first, second)`, takes two arguments. Unlike other statically typed languages like Java, there is no way to specify a type for these arguments. While intuitively, the function expects two numbers, we can't ensure that unless we write our own checks.

```js
function isLarger(first, second) {
  if (typeof first !== 'number' || typeof second !== 'number') {
    throw new TypeError('Both arguments must be numbers!');
  }

  return first > second;
}
```

## Arrow functions

Arrow functions are more succinct version of standard functions. 

<img src="./js_arrow_diff.svg" style="border-radius: var(--corner-radius_l); background-color: var(--surface_primary_emphasis-none);" alt="Two examples of functions; one standard, and the other is an arrow function, showing the differences between them."></img>

```js
/* A function like the following: */
function isLarger(first, second) {
  return first > second;
}

/* Can become the following arrow function: */
const isLarger = (first, second) => first > second;
```

A much shorter syntax is achieved when there is only one `return` statement, as shown above, ignoring the need for the body brackets (`{}`).

<img src="./js_arrow_args.svg" style="border-radius: var(--corner-radius_l); background-color: var(--surface_primary_emphasis-none);" alt="An example showing the more concise syntax of the arrow function with no need for parentheses or a return statement."></img>

In other areas, arrow functions have several key differences.

| Features | Standard functions | Arrow functions
| --- | --- | --- |
| Syntax | Longer | Shorter |
| Constructor | Can be used as a constructor | Cannot be used as a constructor |
| Best used when | Dealing with objects and constructors | Callbacks, concise tasks and returns |

### Calling functions as values

We can encapsulate functions and their returns in variables.

```js
const isLarger = (first, second) => first > second;

if (isLarger()) {
  console.log("The number is larger, indeed!");
}
```

In this case, the `if` statement calls out the function because we add `()` at the end. **Adding the parentheses tells the code to run the function as soon as it is referenced.**

### Referencing, but not running, functions

There are instances where we do want to simply reference a task so that it is triggered when appropriate.

Let's say we have a task that needs to run when a button is clicked. We only want it to trigger when the button is clicked, so we cannot add the `()` at the end, otherwise we will immediately run the function.

```js
/* The task when the button is clicked */
const handleClick = () => alert("Button clicked!");

/* Here, we attach the function reference in the addEventListener,
but it is not run, because it is missing the () at the end. */
document.querySelector("button").addEventListener("click", handleClick);
```

Now our function will only trigger when the button is pressed.

---

# Classes

TO-DO

---

# Meet the DOM

In our next chapter, we're going to build things! We're going to directly interact with the DOM — Document Object Model — and make our HTML elements interactive in the process. I hope to see you there!