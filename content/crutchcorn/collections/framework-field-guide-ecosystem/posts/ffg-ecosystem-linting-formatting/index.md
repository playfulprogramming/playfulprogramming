---
{
    title: "Linting and Formatting",
    description: "",
    published: '2025-01-01T22:12:03.284Z',
    tags: ["react", "angular", "vue", "webdev"],
    order: 2
}
---

<details>
<summary>What tools are we learning in this chapter?</summary>

While there's a few other options in the linting and formatting space:

- [Biome](https://biomejs.dev/)
- [Oxlint](https://oxc.rs/docs/guide/usage/linter.html)
- [Flow](https://flow.org)

We'll instead be learning about [ESLint](https://eslint.org/), [Prettier](https://prettier.io/), and [TypeScript](https://www.typescriptlang.org/). Let's talk about why:

- ESLint is the de-facto linting solution for JavaScript projects, being downloaded nearly 500 million times a months on NPM.
- [ESLint is working becoming language agnostic.](https://eslint.org/blog/2024/07/whats-coming-next-for-eslint/) I suspect this will lead to growth of ESLint outside of JavaScript projects.
- Prettier is also adopted almost as well as ESLint, just barely shy of ESLint's downloads a month.
- Prettier is a strongly opinionated formatting solution with many edge cases covered. This means that we can spend less time configuring our tooling and allow the defaults to handle highly debated scenarios for us.
- TypeScript is the most widely used tool of the bunch, used far more often than alternative JavaScript superset languages.
- While TypeScript isn't in the _exact same_ category of the other tools listed, it often plays an important role in formatting and linting

> In our article, we'll use Prettier and ESLint separately from one-another. While there _are_ ways to glue them together to run Prettier _from_ ESLint (or even use ESLint as a Prettier replacement) [this practice should be avoided. We'll explore why later on.](// TODO: Link to this part of the chapter)

With this covered - Let's dive in!

</details>

JavaScript is an incredibly flexible language. Both of the following code samples are semantically valid and functionally equal code blocks:

```javascript
// Valid pretty code
for (let i = 0; i < 10; i++) {
    console.log(i);
}
```

```javascript
// Also valid, albiet ugly, code
for(
let i
    = 0
; i
        < 10; i++
    ){
console.log(
    i
);}
```

While supported by any stable JavaScript environment, the first code sample is almost undeniably nicer than the second in terms of readability.

It would be swell if we were able to automatically have code formatted like the first code block, no matter how we wrote it?

------

What's more, this code is **also** semantically valid, but will throw an error at runtime:

```javascript
for (let i = 0; i < 10; i++) {
    // This will throw an error, as `ii` is not defined
    console.log(ii);
}
```

Wouldn't it be nice if we could have some tooling established to catch this kind of "undefined variable" error programmatically?

----

Luckily for us, there are tools that solve both of these problems!

- Formatters: Aimed at solving "What should my code look like?"
- Linters: Aimed at solving "What bugs will my code introduce?"

# Formatters



## Improved Readability



## Reducing Merge Conflicts

// Consistent styles allow fewer lines of code changed between edits, which makes diffs easier to grok



## Fewer Bike Sheds

There's a humorous story amongst developers that goes:

""

![](https://miro.medium.com/v2/resize:fit:1276/format:webp/1*6o0eeC4bRz2HPQ7vJB3p0g.jpeg)

https://en.wikipedia.org/wiki/Law_of_triviality

# Linters



## Is TypeScript a linter?

[According to Wikipedia, the definition of a linter](https://en.wikipedia.org/wiki/Lint_(software)) is:

> [...] a static code analysis tool used to flag programming errors, bugs, stylistic errors and suspicious constructs.



### Using TypeScript with ESLint

# Formatting vs Linting


## Don't format and lint with the same tool!

https://www.joshuakgoldberg.com/blog/you-probably-dont-need-eslint-config-prettier-or-eslint-plugin-prettier/

https://www.joshuakgoldberg.com/blog/configuring-eslint-prettier-and-typescript-together/#stop-using-eslint-for-formatting
