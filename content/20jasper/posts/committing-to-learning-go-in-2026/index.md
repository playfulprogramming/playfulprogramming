---
{
title: 'Committing to learning Go in 2026',
published: '2026-01-16',
description: 'Time to learn Golanguage',
tags: ["go"],
originalLink: 'https://jacobasper.com/blog/committing-to-learning-go-in-2026/',
}
---

Every year, I like to learn a new language to force myself to think differently. It's easy to get stuck in your ways. When I only knew JavaScript, I would exclusively use indexed for loops. Python and Rust showed me the magic of a good `for in` loop (or `for of` in JavaScript land 😵)

## My coding background

So far, I've learned the following as a "language of the year":

1. JavaScript
2. TypeScript
3. Rust
4. Haskell

I've used more languages like Python and Java professionally, but I didn't feel I gained a big mindset shift from them. Go seems different enough without the large investment of a Rust or Haskell

I've spent a week or so looking at Go By Example but never built anything meaningful

In my experience, I find most devs are either ambivalent if they haven't used Go much or Go haters if they have. Maybe I won't like it, but only one way to find out! If I'm going to be a hater, I may as well be qualified

## Pros

- Simplicity will help push me to improve my fundamentals
- Goroutines are a middling abstraction to asynchrony for me. Rust is very explicit, JavaScript is very abstracted, and Go is in the middle
- The Go Gopher is very cute (a legitimately big reason I'm learning Go)
- Go compiles really fast

I've had the Go Gopher in my LinkedIn banner for too long to not have used Go. Before anyone asks, no this is not an AI image. I commissioned [an artist](https://mutiestwinbro.tumblr.com/) to draw it

![A LinkedIn banner with a Goldendoodle typing on a laptop. The Go Gopher, Ferris the Crab, Lucy from Gleam, and Tux from Linux are all around the area](./dog-computer.webp)

## Cons

- Uninitialized struct fields are implicitly zeroed and exported structs can't be private. I figure most times this won't be abused, but I like feeling confident about the invariants of my data
- I'm going to get confused since Rust and Go don't agree what workspaces and packages are
- _accidentally types semicolon at end of line_

I don't really care about variable naming. I've already seen so many that I will mix them up no matter what language I'm using 🤷‍♂️

## How will I learn Go?

I won't spend the whole year learning it, likely only a month or two. I'd like to split time between Go and other topics like CPU architecture

I plan on building a baby version of Redis since it'll force me to hit the edges of Go. I'll have to learn

- Networking/TCP
- Concurrency (_the_ Go thing)
- Error handling

I read through Tokio's tutorial, which happens to also be Redis! I'll be building mine from scratch with Go, so it'll make sure I understand the concepts rather than just doing a tutorial. There are infinite ways to follow up a naive implementation—error handling could take a year on its own!

---

Thank you for reading, and see you in a month or 2 for my thoughts on Go!
