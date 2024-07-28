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

Let's explore each of these tools, how to use them in our codebase, and what their primary advantages are.

# Formatters

As demonstrated earlier, a formatter allows you to take messy code:

```javascript
function test(
arg
	)
{ return arg}
```

And format it into something more readible:

```javascript
function test(arg) {
  return arg;
}
```

Most all coding languages will either have a community or an official code formatter. In the JavaScript ecosystem, that tool is more often than not "Prettier".

To install Prettier, we can update our `package.json` using our package manager of choice:

```shell
npm i -D prettier
```

Then add a script to execute Prettier against our source code files:

```json
"scripts": {
  "format": "prettier ."
},
```

Prettier supports React, Angular, and Vue all very well out of the box. This means that once the package is installed, you can run `npm run format` on any repository without any additional configuration:



<!-- tabs:start -->

## React

// TODO: Add iframe

## Angular

// TODO: Add iframe

## Vue

// TODO: Add iframe

<!-- tabs:end -->



## Fewer Bike Sheds

There's a humorous story amongst developers that goes something like:

> There's an organizational committee for the construction of a powerplant. The committee has all of the research required for the powerplant and the blueprints laid out in front of them. They talk for a bit about it and, after 15 minutes, come to the agreement that the powerplant can be moved forward with and developed.
>
> But then they get to talking about the employee bike shed. It'll make the lives of the employees better, yes, but _what color should the shed be_? They spend an hour talking about which color the shed should be and finally land on a nice shade of brown.

This story demonstrates how, without proper guidance and prioritization, insignificant issues (like the color of a shed) can triumph over more significant problems; like how to fund and organize the development of a powerplant.

![TODO: Write alt](./bike_shedding_visual.png)

> This story is often attributed with the ["Law of triviality"](https://en.wikipedia.org/wiki/Law_of_triviality), which states "people within an organization commonly give disproportionate weight to trivial issues."

This story has led to the term "bike-shedding" to refer to any argument that follows the law of triviality.

----

As you can imagine, many developers have very strong preferences for coding style. Some prefer semicolons, while others are vehemently against them.

By having a strongly opinionated tool like Prettier to establish the code conventions for you, you're able to sidestep many of these time-wasting arguments in favor of something built-in.

It's for this reason that, while Prettier can be configured fairly modularly, I suggest keeping most if not all of the defaults of Prettier.

## Reducing Merge Conflicts

Code style consistency and avoiding bike-shedding aren't the only benefits of formatters, either.

When using tools like [Git](https://git-scm.com/), it's common to store a difference between two snapshots of your code:

![TODO: Write alt](./rss_diff.png)

This is fundamental to how many code backup and versioning solutions work; they track a before and after of each line of code.

Because it tracks the difference in each line of code, it can sometimes figure out when a change is smaller, like the example above; but other times it's only able to see "enough changed in this line that I don't recognize anything from the previous change":

![TODO: Add alt](./unified_diff.png)

This inability to recognize differences makes it much harder to visually identify what's specifically changed between versions of the codebase.

----

Worse than the difficulties visually seeing code changes; this same problem makes things like [`git merge`](https://www.atlassian.com/git/tutorials/using-branches/git-merge) much more likely to introduce a [Git conflict](https://www.atlassian.com/git/tutorials/using-branches/merge-conflicts). These conflicts make code sharing and collaboration much harder to reconcile when too many variants of the code exist.



# Linters



## Is TypeScript a linter?

So why am I talking about TypeScript in this article?

[According to Wikipedia, the definition of a linter](https://en.wikipedia.org/wiki/Lint_(software)) is:

> [...] a static code analysis tool used to flag programming errors, bugs, stylistic errors and suspicious constructs.



### Using TypeScript with ESLint

Regardless of whether or not TypeScript is truly a linter, its ability to have metadata associated with your code allows more formalized linters like ESLint to add additional capabilities using said metadata.

// TODO: Talk about TypeScript ESLint and rules like "Must await promises"

# Formatting vs Linting


## Don't format and lint with the same tool!

https://www.joshuakgoldberg.com/blog/you-probably-dont-need-eslint-config-prettier-or-eslint-plugin-prettier/

https://www.joshuakgoldberg.com/blog/configuring-eslint-prettier-and-typescript-together/#stop-using-eslint-for-formatting
