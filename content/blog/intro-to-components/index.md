---
{
    title: "Introduction to Components",
    description: "",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 1,
    series: "The Framework Field Guide"
}
---

> Before we can dive into how many front-end frameworks that you may have heard of work, we need to set a baseline of information. If you're already familiar with how the DOM represents a tree and how the browser takes that information and utilizes it, great! You're ready to read ahead! Otherwise, it's strongly suggested that you take a look at [our post introducing the concepts](https://unicorn-utterances.com/posts/understanding-the-dom/) required to understanding some of the baseline to this post

You may have heard about various frameworks and libraries that modern front-end developers utilize to build large-scale applications. Some of these frameworks you may have heard of are Angular, React, and Vue. While each of these libraries bring their own strengths and weaknesses, many of the core concepts are shared between them.

With this series of articles, we're going to be outlining core concepts that are shared between them and how you can implement them in code in all three of the frameworks. This should provide a good reference when trying to learn one of these frameworks without a pre-requisite knowledge or even trying to learn another framework with some pre-requisite of a different one.

# Components

Let's first explain why frameworks like Angular, React, or Vue differ from other libraries that may have come before it, like jQuery.

It all comes down to a single core concept at the heart of each of them: **Componentization**.

The idea of a component is that you have a modular system of HTML, JS, and CSS comprised of individual "components" that you them compose to make up a larger UI. For example, instead of one HTML file that contains:

- Header
- Sidenav
- Form logic
- Footer

You might have a component for each of them and end up with a component to roll them all into a single page like this:

```html
<div>
  <header></header>
  <sidenav></sidenav>
  <form-logic></form-logic>
  <footer></footer>
</div>
```

As you'll notice, the layout of these "components" is very similar to [the way we structure a DOM tree](https://unicorn-utterances.com/posts/understanding-the-dom/) 

