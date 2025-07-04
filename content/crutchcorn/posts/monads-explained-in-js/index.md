---
{
    title: "Monads explained in JavaScript",
    description: 'You may have heard of a "monad" in programming spheres, especially in regards to functional programming terminology. So what on earth even IS a monad?',
    published: '2026-01-01T10:12:03.284Z',
    tags: ['javascript', 'computer science'],
    license: 'cc-by-4'
}
---

I dunno about you, but I'm sick of hearing people obsessed with functional programming talking about "monads".

Like, I've been an engineer for **years** and never understood them.

And I've seen monads explained in a bunch of different ways:

- [Visually](https://www.adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html)
- [In a 15 minute YouTube video](https://www.youtube.com/watch?v=C2w45qRc3aU)
- [Explored in 4 different programming languages](https://rmarcus.info/blog/2016/12/14/monads.html) 
- [Compared to burritos](https://blog.plover.com/prog/burritos.html)
- [Visually compared to burritos](https://chrisdone.com/posts/monads-are-burritos/)
- [As the memable quote: "a monad is a monoid in the category of endofunctors, what's the problem?"](https://james-iry.blogspot.com/2009/05/brief-incomplete-and-mostly-wrong.html)

But none of them quite stuck for me as a predominantly JavaScript-focused engineer.

If I may, allow me to try my hand at this.

> **Pre-requisite knowledge:**
>
> I generally assume that you're familiar with JavaScript and Promises. If you're not, I might suggest the following resources:
>
> - [Our "Web Fundamentals" series introducing HTML, CSS, and JavaScript](https://playfulprogramming.com/collections/web-fundamentals).
> - [My article on `async`, `await`, and Promises in general](https://playfulprogramming.com/posts/async-and-promises).

# Introducing Monads in JavaScript

**A monad wraps data, adds context & allows for chaining through immutable operations.**

In JavaScript, there's one primary built-in API that fits the bill of a Monad perfectly: Promises.

----

A promise takes some data:

```typescript
// In JS terms:
Promise.resolve(someData);

// In TS terms:
Promise<SomeDataType>;
```

And adds some additional context, in this case "time"; a promise may resolve immediately or take some time to resolve the data.

This additional context is stored in a promise as a sort of `status` determining the status of the time:

```javascript
status: "pending" | "fulfilled" | "rejected"
```

That said, we don't directly interface with `status`; We instead interface with this `status` through the promise API:

```javascript
Promise.resolve(12)
  // Fulfilled
  .then(x => x * 2) // 24
	// Rejected
	.catch(console.error)
```

------

The promise API isn't a one-and-done, either. You can chain `then` calls together to process one behavior then another:

```javascript
Promise.resolve(12)
	.then(x => x * 2) // 24
	.then(y => y + 2); // 26
```

---

Each `.then` block we create introduces a new `Promise` from the previous `Promise` in the chain:

```javascript
const promise1 = Promise.resolve();
const promise2 = promise1.then(x => x);

console.log(promise1 === promise2); // false
```

This means that the immutable operation of chaining is the `.then`, since each new usage introduces a fresh Promise without changing the previous one.

> **A note on chained immutability:**
>
> Astute readers may note that you're still able to mutate the inner value of a monad, like so:
>
> ```javascript
> Promise.resolve({current: 12})
>  .then(x => {
>      setTimeout(() => console.log({x}), 100)
>      return x;
>  })
>  .then(y => {
>      y.current++;
>      console.log({y})
>  })
> ```
>
> However, this doesn't break the definition of a monad, since the definition applies to the data container not the value being tracked.

----

> **Another ecosystem's example:**
>
> [In Rust, they have the `Option` API](https://playfulprogramming.com/posts/rust-enums-matching-options-api). This API also describes a monad, since it wraps data and adds an "existance" context.
>
> It's either `Some` or `None`:
>
> ```rust
> fn main() {
>     println!("{:?}", Some(1));
>     println!("{:?}", None::<i32>);
> }
> ```
>
> Which can be [chained together](https://playfulprogramming.com/posts/rust-enums-matching-options-api) and implements other monad laws.

----

Now that we have the basics out of the way, its important to note that monads have three rules they must conform to: The associative law, the left identity law, and the right identity law.

# The Associative Law

---

The "Associative Law" says that monads can chain through nesting:

```javascript
a().then(x => b(x).then(c))
```

Or called sequentially:

```javascript
a().then(b).then(c)
```

> **Clarifying associative behavior:**
>
> When I was first learning about the associative law, I was confusing it with the order of process execution.
>
> Take the following code:
>
> ```javascript
> Promise.resolve("123")
>   .then(x => x.split(""))
>   .then(x => x.reverse());
> ```
>
> If we re-arrange this to the following:
>
> ```javascript
> Promise.resolve("123")
>   .then(x => x.reverse())
>   .then(x => x.split(""));
> ```
>
> We'd instead get the error:
>
> ```
> TypeError: x.reverse is not a function
> ```
>
> But this is an important distinction: _The associativity rule doesn't mean the functions inside the chain are swappable; it means the **structure of the chain itself** is._

# The Left and Right Identity Laws

The "**Left Identity**" law states that wrapping & immediately unwrapping a monad has no effect:

```javascript
const f = (x) => Promise.resolve(x);
const result1 = Promise.resolve(10).then(f);
const result2 = f(10);
result1.then(console.log); // 20
result2.then(console.log); // 20
```

Put another way: if you take a plain value, wrap it, and then chain it, the result is the same as just applying the function to the plain value directly.

---

Likewise, the "**Right Identity**" law states that two nested promises don't double-nest a value:

```javascript
const promise = Promise.resolve(Promise.resolve(1))

// Unwrap it to prove one level of depth
promise.then(v => v === 1) // true
```

Once again, outlined differently: if you have a monadic value and you chain it with the wrapping function, you get the same monadic value back. It's like adding zero in arithmetic—it doesn't change the result.

# Conclusion

Hopefully this has been a helpful introduction to monads in JavaScript. I plan on doing more with monads, including the "why" behind them and where you might gain benefits from using them in your own projects.

Until next time!

\- Corbin C.
