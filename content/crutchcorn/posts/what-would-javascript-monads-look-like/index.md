---
{
    title: "What would Monads in JavaScript look like?",
    description: "Some languages support monads with first-class syntax support. But what does that even mean? How would we support monads, in, say, JavaScript?",
    published: '2025-08-18T10:12:03.284Z',
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
  // The 'do' keyword would signal the start of a monadic chain.
  // The 'monad' keyword would specify the type of monad (e.g., Promise, Maybe, etc.).
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

This syntax should allow us to explore monads further in a language and syntax we're more familiar with.

> **Standards, standards, standards:**
>
> I'm not _literally_ proposing we add this to JavaScript itself with this exact syntax. I can already see a number of downsides myself, like the ability to interop between different monad types.
>
> Instead, in the next section, we'll explore other options the JavaScript ecosystem has used to add the benefits of Monads into our apps and what those benefits even are.

# Handling async operations with `Promises`

Because the `Maybe` type isn't built-in to JavaScript, it can be hard to picture its usage intuitively. Let's explore another option we could use with the proposed `do monad` syntax.

In [our last article about monads](/posts/monads-explained-in-js), we predominantly used promises as an example of a monad.

As a result, promises would make a natural alternative to `await` when using promises:

```javascript
function getUserAndPosts() {
  do monad Promise {
    const user = unwrap getUserById(123);
    const posts = unwrap getPostsForUser(user.id);
    const comments = unwrap getCommentsForFirstPost(posts[0].id);

    return { user, posts, comments };
  }
}

// Usage
async function displayUserData() {
  // We 'await' the result, just like any other Promise.
  const { user, posts, comments } = await getUserAndPosts();
  // ...
}
```

# Building our own monad type

> How would we build out a monad to handle the new `unwrap` type?

To make a type compatible with the `do monad` construct, it needs to follow a specific interface. This interface must define how to **wrap** a value into the monad and how to **chain**, or **bind**, operations on it.

This is explained more in-depth [in the article we referenced at the start](https://rmarcus.info/blog/2016/12/14/monads.html), but this kind of `wrap` and `chain` combination is how you might define a monad more formally:

```typescript
type Monad<T> = { value: T };

declare function bind<A, B>(m: Monad<A>, fn: (value: A) => Monad<B>): Monad<B>;
declare function wrap<A>(value: A): Monad<A>;

declare const aValue: unknown;
declare const aMonad: Monad<unknown>;
declare function aTransform(value: unknown): Monad<unknown>;
declare function otherTransform(value: unknown): Monad<unknown>;

const left = bind(wrap(aValue), aTransform) === aTransform(aValue);
const right = bind(aMonad, wrap) === aMonad;
const associativity =
	bind(bind(aMonad, aTransform), otherTransform) ===
	bind(aMonad, (x) => bind(aTransform(x), otherTransform));
```

> It's more than okay if the above was confusing to you. Finish up the article, read some other resources, and come back to it; it may make more sense then.

We can define this interface using a special, well-known [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) in our pseudo-syntax. [This is how iterators are defined in JavaScript, after all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator). Let's call it `Symbol.monad`. A type would implement this symbol to tell the `do monad` machinery how to work with it.

----

Now let's look at the two functions that we'll need to implement on `[Symbol.monad]`:

1.  **`wrap(value)`**: A function that takes a plain value and wraps it into the monadic container.
    
2.  **`bind(monadicValue, function)`**: A function that takes an existing monadic value and a function that returns a new monadic value. It's responsible for "unwrapping" the value, passing it to the function, and handling the result. This is the core of chaining.

## Example 1: Defining `Promise` as a Monad

Here's how `Promise` would implement this interface in our pseudo-syntax.

```javascript
// Psuedo-code showing how the Promise object could be extended
// to support the `do monad` syntax.
Promise[Symbol.monad] = {
  /**
   * `wrap` for a Promise takes a value and returns a promise
   * that is already resolved with that value.
   * This is identical to `Promise.resolve()`.
   */
  wrap: function(value) {
    return Promise.resolve(value);
  },

  /**
   * `bind` for a Promise is its `then()` method. It takes an
   * existing promise, waits for it to resolve, and then
   * passes the unwrapped value to the next function.
   */
  bind: function(promiseInstance, func) {
    // The .then() method naturally handles the chaining.
    return promiseInstance.then(func);
  }
};
```

With this definition, the `do monad Promise` block would know exactly how to handle the `unwrap` keyword; it would use `Promise.prototype[Symbol.monad].bind`.

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

> So when I call `unwrap`, what code is that calling?

When you call `unwrap`, you are executing the **`bind`** function from your type's `[Symbol.monad]` implementation.

The `do monad` block is essentially "syntactic sugar" that transforms your linear-looking code into a series of nested `bind` calls.

Let's look at what the system does behind the scenes.

-----

The following psuedocode:

```javascript
// Psuedocode using 'do monad' for Promises
function getUserAndPosts() {
  do monad Promise {
    const user = unwrap getUserById(123);
    const posts = unwrap getPostsForUser(user.id);
    return posts; // Simplified for this example
  }
}
```

-----

Is then transformed to the following:

```javascript
// The above code desugars into this nested promise chain:
function getUserAndPosts() {
  const PromiseMonad = Promise[Symbol.monad];

  // The first 'unwrap' becomes the outer 'then()' call
  return PromiseMonad.bind(getUserById(123), function (user) {

    // The second 'unwrap' becomes an inner 'then()' call
    return PromiseMonad.bind(getPostsForUser(user.id), function (posts) {

      // The final 'return' uses 'wrap' to put the value back in a Promise
      return PromiseMonad.wrap(posts);
    });
  });
}
```

In short, **`unwrap` is a shortcut for a `bind` operation**. It’s what makes it possible to take a deeply nested chain of operations and write it as a flat, readable sequence.

# Conclusion

Hopefully this has been a helpful look at what first-class support for Monads *could* look like in JavaScript.

Admittedly, there's a number of flaws in this API around composition with other JavaScript features, but it demonstrates what I set out to teach well enough.

What are your favorite languages that have first-class monad support? [Let us know in our Discord server](https://discord.gg/FMcvc6T).

Until next time!
