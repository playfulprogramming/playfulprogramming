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

While there's a few up and coming stars in the linting and formatting space:

- [Biome](https://biomejs.dev/)
- [Oxlint](https://oxc.rs/docs/guide/usage/linter.html)

We'll instead be learning about [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/). Let's talk about why:

- ESLint is the de-facto linting solution for JavaScript projects, being downloaded nearly 500 million times a months on NPM.
- [ESLint is working becoming language agnostic.](https://eslint.org/blog/2024/07/whats-coming-next-for-eslint/) I suspect this will lead to growth of ESLint outside of JavaScript projects.
- Prettier is also adopted almost as well as ESLint, just barely shy of ESLint's downloads a month.
- Prettier is a strongly opinionated formatting solution with many edgecases covered. This means that we can spend less time configuring our tooling and allow the defaults to handle highly debated scenarios for us.

There's also some methods of using ESLint as the formatter on top of its linting duties, we'll be avoiding them in our article. We'll explore why later.

With this covered - Let's dive in!

</details>

**:)**