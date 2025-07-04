---
{
    title: "What would Monads in JavaScript look like?",
    description: "",
    published: '2026-01-01T10:12:03.284Z',
    tags: ['javascript', 'computer science'],
    license: 'cc-by-4'
}
---

Recently, [in our Discord's book club](https://discord.gg/FMcvc6T), we read [an awesome article by Ryan Marcus called "No, really, what's a monad?"](https://rmarcus.info/blog/2016/12/14/monads.html)

This article tracked well in my mind, but led to some confusion towards the end. To quote the article:

> Hopefully you have now gained at least a little sympathy for the Haskell purist who laments JavaScript’s lack of 1st class support for monads.

Not having much Haskell experience, this made me wonder "What does first-class support for monads _even look like_?"

# Exploring Haskell and Scala Monad support

Let's start by outlining the concept of a `Maybe` or `Option` monad: They're meant to indicate that a monad _may_ contain data or otherwise contain "nothing".

Say we wanted to do something like:

```javascript
const foo: Maybe<string>;
const bar: Maybe<string>;

if (foo.isEmpty()) {
  return Nothing;
}

if (bar.isEmpty()) {
  return Nothing;
}

return foo + bar;
```

In Haskell, this would look like the following:

```haskell
-- Define the Maybe values
maybeFoo :: Maybe String
maybeFoo = Just "foo"

maybeBar :: Maybe String
maybeBar = Just "bar"

-- Use a 'do' block to combine them
foobar :: Maybe String
foobar = do
  foo <- maybeFoo
  bar <- maybeBar
  return (foo ++ bar)

-- The value of 'foobar' will be: Just "foobar"
```

Meanwhile, the Scala version would look like:

```scala
// Scala example for combining Options
val maybeFoo: Option[String] = Some("foo")
val maybeBar: Option[String] = Some("bar")

val foobar = for {
  foo <- maybeFoo
  bar <- maybeBar
} yield foo + bar
// Result is Some("foobar")
```

In both of these languages, the `<-` syntax indicates that we're unwrapping the value from a `Maybe`/`Option` monad and combining them if neither value is empty.

This is what first-class monad support looks like in a language; it's [syntactic sugar](https://en.m.wikipedia.org/wiki/Syntactic_sugar) that makes the chaining unwrapping operations look like simple, imperative code.

# Proposing a syntax for Monads in JS

Given this, let's take a look at what a potential syntax for Monads in JS might look like:

```javascript
// Psuedocode with do monad for Maybe
function getFoobar() {
  do monad Maybe {
    const foo = unwrap maybeFoo();   // Unwraps maybeFoo or stops if None
    const bar = unwrap maybeBar();   // Unwraps maybeBar or stops if None
    return foo + bar; // Automatically wrapped in Some(foobar)
  }
}

// Usage:
const foobarMaybe = getFoobar(); // Returns Some("foobar") or None

// We can then safely get the value
console.log(foobarMaybe.getOrElse(""));
```

This proposed syntax comes with the following features:

*   **`do` Keyword**: This would initiate a monadic block, telling the JavaScript engine to treat the following code in a special way for handling a specific monad.
    
*   **Monad Type Specification**: You would declare which monad you're working with (e.g., `Promise`, an `Option`/`Maybe` type, etc.).
    
*   **Implicit Chaining**: The language would automatically chain the operations, passing the result of one line as input to the next, while handling the monadic context (like the asynchronous nature of a Promise or the null-checking of a Maybe).
    
*   **Automatic Wrapping of Return Value**: The final `return` value is automatically placed back into the context of the monad you are working with.

This syntax would allow developers to write code that looks more imperative and is easier to read, while still benefiting from the powerful composition and error-handling features of monads. It abstracts away the boilerplate of manually chaining function calls.

## Using the function

>  Let's expand this; how would you use this pseudo-coded \`getUserAndPosts\` elsewhere?

Of course. Since our pseudocoded `getUserAndPosts` function was defined with `do monad Promise`, it returns a `Promise`. You would use it just like any other `Promise`\-returning function in JavaScript.

The key takeaway is that the first-class monad support (`do` notation) simplifies the _implementation_ of the function, but it doesn't change how you consume its result from the outside.

* * *

The cleanest way to use the function is with `async/await`. This allows you to "unwrap" the promised value in a way that looks synchronous and is highly readable.

```javascript
// Define an async function to call our monadic function
async function displayUserData() {
  console.log("Fetching user data...");
  try {
    // We 'await' the result, just like any other Promise.
    const combinedData = await getUserAndPosts();

    // Now 'combinedData' is the resolved object with user, posts, and comments.
    console.log("--- User Details ---");
    console.log(`Name: ${combinedData.name}`);
    console.log(`Posts: ${combinedData.posts.length}`);
    console.log(`Comments on first post: ${combinedData.comments.length}`);

  } catch (error) {
    // If any step inside getUserAndPosts failed, the promise would reject.
    console.error("Failed to fetch user data:", error);
  }
}

// Call our main function
displayUserData();
```

# Other examples

> Got it. What are some other examples of \`do monad\` that would be relevant?

Excellent question! The `do monad` syntax is powerful because it can be applied to any monadic structure, not just `Promise`. Here are a couple of other highly relevant examples where this pseudocode would dramatically simplify common programming tasks.

* * *

## Handling async operations with `Promises`

// TODO: Write this and link back to previous monad article

```javascript
// Pseudocode for first-class monad support
async function getUserAndPosts() {
  // The 'do' keyword would signal the start of a monadic chain.
  // The 'monad' keyword would specify the type of monad (e.g., Promise, Maybe, etc.).
  do monad Promise {
    // Each line 'unwraps' the value from the monad.
    const user = unwrap getUserById(123);
    const posts = unwrap getPostsForUser(user.id);
    const comments = unwrap getCommentsForFirstPost(posts[0].id);

    // The final value is automatically wrapped in the monad type (a Promise in this case).
    return { ...user, posts, comments };
  }
}
```

## Composable List Operations with `Array` (List Monad)

Arrays can be treated as monads where the monadic operation (`flatMap`) allows you to take an element, perform a computation that returns a new array, and then flatten the resulting array of arrays. This is useful for things like generating all possible combinations of items.

---

Let's say you want to find every possible pairing of developers and programming languages from two separate lists. The traditional way involves nested loops.

```javascript
const developers = ["Alice", "Bob"];
const languages = ["Python", "JavaScript", "Rust"];
let pairings = [];

for (const dev of developers) {
  for (const lang of languages) {
    pairings.push(`${dev} codes in ${lang}`);
  }
}
// pairings => ["Alice codes in Python", "Alice codes in JavaScript", ...]
```

----

The `Array` monad sees this as a composition. The `do` notation abstracts away the nested looping, making it look like a simple sequence.

```javascript
// Psuedocode with do monad for Array
function generatePairings() {
  do monad Array {
    const dev = unwrap developers;   // Iterates through 'developers'
    const lang = unwrap languages; // Iterates through 'languages' for each developer
    return `${dev} codes in ${lang}`; // Collects each string into a final flat array
  }
}

const pairings = generatePairings();
console.log(pairings);
```

In this case, the `await` keyword conceptually means "for each item in the array...". The `do monad` block understands that it needs to run the second line for _every_ item produced by the first line, and then collect all the final `return` values into a single, flattened array.

# Building our own monad type

> What might a psuedo-syntax look like to create a type for \`do monad\` to work; like \`Array\`?

To make a type compatible with the `do monad` construct, it needs to follow a specific interface. This interface must define how to **wrap** a value into the monad and how to **chain** operations on it (the `bind` or `flatMap` function).

We can define this interface using a special, well-known `Symbol` in our pseudo-syntax. Let's call it `Symbol.monad`. A type would implement this symbol to tell the `do monad` machinery how to work with it.

----

A type would need to provide an object for `[Symbol.monad]` that contains two key functions:

1.  **`wrap(value)`**: A function that takes a plain value and wraps it into the monadic container. This is also known as `return` or `pure`.
    
2.  **`bind(monadicValue, function)`**: A function that takes an existing monadic value (e.g., an array, a promise) and a function that returns a new monadic value. It's responsible for "unwrapping" the value, passing it to the function, and handling the result. This is the core of chaining.

## Example 1: Defining `Array` as a Monad

Here's how `Array` would implement this interface in our pseudo-syntax.

```javascript
// Add the monad interface implementation to the Array prototype
Array.prototype[Symbol.monad] = {
  /**
   * `wrap` for an Array simply puts the value into a new array.
   * @param {*} value - The value to wrap.
   * @returns {Array} - An array containing just the value.
   */
  wrap: function(value) {
    return [value];
  },

  /**
   * `bind` for an Array is its `flatMap` method. It applies a function
   * to each element and flattens the resulting array of arrays.
   * @param {Array} arr - The array to operate on.
   * @param {Function} func - A function that takes an element and returns a new array.
   * @returns {Array} - The new, flattened array.
   */
  bind: function(arr, func) {
    return arr.flatMap(func);
  }
};
```

With this definition, the `do monad Array` block would know exactly how to handle the `unwrap` keyword; it would use `Array.prototype[Symbol.monad].bind`.

* * *

## Example 2: Defining `Maybe` as a Monad

For another example, here’s how a `Maybe` type (which can be either `Some(value)` or `None`) would be defined.

```javascript
// Base class for Maybe
class Maybe {
  // ... constructor and other methods like getOrElse() ...

  static get [Symbol.monad]() {
    return {
      /**
       * `wrap` for a Maybe puts the value into a `Some` container.
       */
      wrap: function(value) {
        // Wrapping null or undefined could also return a None, but
        // for `do` notation, we assume wrap gets a valid value.
        return new Some(value);
      },

      /**
       * `bind` for a Maybe only applies the function if the instance is a `Some`.
       * If it's a `None`, it short-circuits and returns `None`.
       */
      bind: function(maybeInstance, func) {
        if (maybeInstance instanceof Some) {
          // Unwrap the value and apply the function
          return func(maybeInstance.value);
        } else {
          // If it's a None, the chain stops.
          return maybeInstance;
        }
      }
    };
  }
}

class Some extends Maybe { /* ... */ }
class None extends Maybe { /* ... */ }
```

# How it works

> So when I call \`unwrap\`, what code is that calling?

When you call `unwrap`, you are executing the **`bind`** function from your type's `[Symbol.monad]` implementation.

The `do monad` block is essentially "syntactic sugar" that transforms your linear-looking code into a series of nested `bind` calls.

-----

The `unwrap` keyword tells the system to take the monadic value on its right and use the `bind` function to chain it with the _rest of the code in the block_.

Let's look at what the system does behind the scenes.

-----

Your code is clean and looks sequential.

```javascript
// Psuedocode using 'do monad' and 'unwrap'
function getStreet(user) {
  do monad Maybe {
    const profile = unwrap getProfile(user);
    const address = unwrap getAddress(profile);
    return address.street; // For simplicity, we get the street directly
  }
}
```

-----

The system converts this into a chain of `bind` calls. The rest of the code after each `unwrap` becomes the function passed _to_ `bind`.

```javascript
// The above code desugars into this nested structure:
function getStreet(user) {
  const MaybeMonad = Maybe[Symbol.monad];

  // The first 'unwrap' becomes the outer 'bind' call
  return MaybeMonad.bind(getProfile(user), function (profile) {

    // The second 'unwrap' becomes an inner 'bind' call
    return MaybeMonad.bind(getAddress(profile), function (address) {

      // The final 'return' uses 'wrap' to put the value back in the monad
      return MaybeMonad.wrap(address.street);
    });
  });
}
```

In short, **`unwrap` is a shortcut for a `bind` operation**. It’s what makes it possible to take a deeply nested chain of operations and write it as a flat, readable sequence.
