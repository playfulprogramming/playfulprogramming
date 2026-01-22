---
{
title: "Rust's `'static` doesn't imply memory leaks",
published: '2026-01-11',
description: "Leaking memory is one way to get a value living for `'static`, but it's not the only way",
tags: ['rust', 'computer-science'],
originalLink: 'https://jacobasper.com/blog/rusts-static-doesnt-imply-memory-leaks/',
}
---

This is one of those blogs I am writing for future me. Thanks me from the past!

Every so often, I get asked the following about Rust's `'static` lifetime:

> if `'static` means `T` needs to live for the life of the program, doesn't that mean we're leaking memory?

I know instinctively this isn't the case, but _why_? Intentionally leaking memory is one way to get a `'static` value, but it's not the only way!

`'static` is used for for [reference lifetimes](#reference-lifetimes) (`&'static T`) and [trait bounds](#static-as-a-trait-bound) (`T: 'static`), which encompass [owned values](#owned-values-are-static). Both of these manifest themselves in various ways that don't require leaking memory. Beyond that, `T: 'static` means the [`T` is safe to hold for the rest of the program](#safe-to-hold), but you aren't required to

## Reference lifetimes

The first introduction to `'static` is often with string literals and reference lifetimes

```rs
let rust: &'static str = "is a must";
```

The `'static` reference lifetime means the reference to the string slice is valid for the rest of the program. This is because the string literal is stored directly in the binary. While the reference is always valid, the data is not necessarily in physical memory to be considered a leak[^mmap]

[^mmap]: Memory leaks usually refer to heap allocations that can no longer be freed. Most modern operating systems will memory map the readonly part of the executable. That means data won't be read into physical memory until needed

## So a `'static` value needs to live in the binary, right?

Nope. `'static` means the value is valid for _the rest of the program_, not the entire program. This can manifest as [owned values](#owned-values-are-static) or leaked values

For example, `leak`ing will return a static reference even though this value is created at runtime. If you drop the reference, then it is indeed a memory leak, but just like how `'static` does not imply a value lives in the binary, `'static` does not imply a memory leak

```rs
let mut s: String = "rust".to_string();
s += " is a must";

// leak consumes `s` and returns a static reference
let leaked: &'static mut str = s.leak();
```

## `'static` as a trait bound

Another common case of `'static` is via a trait bound when spawning threads.

For example, the closure passed to `std::thread::spawn` must be `'static` because the spawned thread can outlive the spawning function (in this case `function_that_spawns_a_thread`).

```rs
fn function_that_spawns_a_thread() {
  let wooper = "wooper".to_string();
  std::thread::spawn(move || println!("{wooper}"));
}
```

The signature of `spawn` uses `'static` as a trait bound. `'static` means the type can safely be held until the end of the program, including owned data like this closure

```rs
std::thread
pub fn spawn<F, T>(f: F) -> JoinHandle<T>
where
    F: FnOnce() -> T,
    F: Send + 'static,
    T: Send + 'static,
```

### Owned values are `'static`

More specifically, `'static` as a trait bound means the type doesn't have any non-static references, meaning all owned data is `'static`

```rs
fn static_only<T: 'static>(x: T) {}

let s = String::from("garlic bread");
static_only(s.clone()); // owned data is 'static—all good!
static_only("hi"); // string literals are 'static—all good!
static_only(&s); // uh oh, this reference is not valid for 'static
```

## Safe to hold

If `T: 'static`, it's safe to hold until the end of the program, but you aren't required to

```rs
fn family_deallocator<T>(_member: T) {
  // `_member` is dropped at the end of this scope and its value is dropped
}

let s = String::from("please don't deallocate me—I have 3 kids 😭");
family_deallocator(s);
// the string `s` is now deallocated
```

## Further reading

If you'd like to dig deeper, check out [Static - Rust By Example](https://doc.rust-lang.org/rust-by-example/scope/lifetime/static_lifetime.html) and [Common Rust Lifetime Misconceptions](https://github.com/pretzelhammer/rust-blog/blob/master/posts/common-rust-lifetime-misconceptions.md). They are amazing resources!

---

I've always enjoyed authors that preface a chapter with a quick summary and link to relevant headings—I am very satisfied with how it turned out!
