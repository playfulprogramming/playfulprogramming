---
{
title: "JavaScript Framework TodoMVC Size Comparison",
published: "2021-10-14T14:13:08Z",
edited: "2021-10-14T15:54:18Z",
tags: ["javascript", "webdev", "react", "vue"],
description: "Size in JavaScript Frameworks is actually a pretty tricky thing to estimate.   Even nailing down the...",
originalLink: "https://dev.to/this-is-learning/javascript-framework-todomvc-size-comparison-504f",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

Size in JavaScript Frameworks is actually a pretty tricky thing to estimate.

Even nailing down the size of runtimes is unclear. You might go to bundlephobia.com but the size there can be misleading. With tree-shaking not all code is included. Bundlephobia also doesn't include sub-modules. Things like `svelte/motion` or `preact/hooks`.

There isn't only the size of the runtime but the size of the component code. Not all components are equal. Templates in each framework compile differently. Evan You, creator of Vue put together a [comparison between Svelte and Vue](https://github.com/yyx990803/vue-svelte-size-analysis) which was pretty illuminating.

I decided to take his process and methodology and apply it in addition to [Preact](https://preactjs.com), [React](https://reactjs.org), and [Solid](https://solidjs.com). So let's begin.

> I'm the author of Solid, so be aware of that in terms of any potential bias I might show. I'm trying to keep things as equal as I can.

---

## The Setup

The test looks at the size of the library(vendor) bundle and the component code for [TodoMVC](https://todomvc.com/). Every framework has a version and the requirements are well laid out so each is relatively the same.

I first looked at using only official demos, but Preact and React still use class components that are larger and not as representative of modern development. This did mean an increase in library size for Preact(3.81kb -> 4.39kb), which doesn't contain hooks as part of its main package but is definitely worthwhile for this test. In the end, I couldn't find a Hooks implementation I was happy with so I rolled my own implementation which I based off Solid's. You can find all the implementations [here](https://gist.github.com/ryansolid/aa5bd12ed4e2f9d592c4b23e58d6fa85).

Vendor chunks are pulled from [Vite](https://vite.dev) which supports all tested frameworks. For component code I used [Vue](https://sfc.vuejs.org/), [Svelte](https://svelte.dev/repl/), [Solid](https://playground.solidjs.com)'s REPLs and Terser REPL to minify. For Preact and React I used rollup to generate the compiled code.

This process is much less rigorous than the benchmarks I typically do. Honestly coding style and available demo code put in a reasonable amount of variance. But I think it is still approximately in line.

---

## Results

First step is to get the size of the component and vendor code for each. TodoMVC is a pretty reasonable example as it involves basic state handling, conditional and loop rendering, forms, and even serialization to local storage. In so we get a much better idea of what the base size of each framework is than Bundlephobia.

|                         | Preact | React   | Solid  | Svelte | Vue     |
| ----------------------- | ------ | ------- | ------ | ------ | ------- |
| component size (brotli) | 1.21kb | 1.23kb  | 1.26kb | 1.88kb | 1.10kb  |
| vendor size (brotli)    | 4.39kb | 36.22kb | 3.86kb | 1.85kb | 16.89kb |

In general, mutable is smaller than immutable state, and VDOM-less libraries generate more JavaScript for their templates. Vue's components generate the least code, edging out the JSX libraries and Svelte

Svelte's runtime really is small at 1.85kb. Preact core might be smaller than Solid, but with hooks in tow, the reactive framework ends up being the tinier one.

From this, it is easy to calculate the size of each framework at N number of TodoMVCs + vendor chunk.

|        | 1       | 5       | 10      | 20      | 40      | 80       |
| ------ | ------- | ------- | ------- | ------- | ------- | -------- |
| Svelte | 3.73kb  | 11.25kb | 20.65kb | 39.45kb | 77.05kb | 152.25kb |
| Solid  | 5.12kb  | 10.16kb | 16.46kb | 29.06kb | 54.26kb | 104.66kb |
| Preact | 5.60kb  | 10.44kb | 16.49kb | 28.59kb | 52.79kb | 101.19kb |
| Vue    | 17.99kb | 22.39kb | 27.89kb | 38.89kb | 60.89kb | 104.89kb |
| React  | 37.45kb | 42.37kb | 48.52kb | 60.82kb | 85.42kb | 134.62kb |

While Svelte starts the charge in the lead, it is quickly overtaken by Solid, who passes the crown on to Preact. Preact is the smallest for a good chunk of the table before ultimately Vue is.

So putting the inflection points in a table:

|        | Svelte | Solid | Preact | Vue   | React  |
| ------ | ------ | ----- | ------ | ----- | ------ |
| Svelte | -      | 3.2   | 3.8    | 19.3  | 52.9   |
| Solid  | -      | -     | 10.6   | 81.4  | 1078.7 |
| Preact | -      | -     | -      | 113.6 | -      |
| Vue    | -      | -     | -      | -     | -      |
| React  | -      | -     | -      | -     | -      |

This is the point each framework gets larger than the next. From 0-3 TodoMVCs, Svelte is the smallest. From 3 to 10 Solid is the smallest. 10-113 TodoMVCs Preact is. And more than 113 TodoMVC's Vue is.

Preact and Vue never intersect with React, and even for Solid that does it is only after about 1080 TodoMVC's. All in all this is pretty consistent with what we see in demo's and benchmarks. Svelte is always smallest for the Hello World's and TodoMVCs, Solid for the "Real World" demos and the types of simple sites people build on streams, and Preact for things on the larger side.

---

## Analysis

TodoMVC as a single component is on the larger side and typical implementations do it in 3-4 components so I wouldn't view these component numbers necessarily to be the number of components. But it is easy to see each framework has its sweet spot.

Size's biggest impact comes during the initial page load. Other code split routes can be lazy-loaded as desired, but initial page load is a cost that every site takes upfront. If you subscribe to the thinking present in Addy Osmani's [The Cost of JavaScript](https://medium.com/dev-channel/the-cost-of-javascript-84009f51e99e) series and Alex Russell's [Can You Afford It?: Real-world Web Performance Budgets](https://infrequently.org/2017/10/can-you-afford-it-real-world-web-performance-budgets/) we really should be aiming to keep initial page load JavaScript under 130kb.

If this is a SPA that budget includes data fetching, state libraries, and router. It's not uncommon for that to be an additional 20 to 25kb JS with most frameworks. Reactive ones like Svelte, Solid, and Vue may have state management built-in but even then when you consider 3rd party utility libraries for formatting I'd say our framework and component code should be less than 100kb.

At that budget, just how many TodoMVCs does each framework allow for?

|       | React | Vue  | Preact | Solid | Svelte |
| ----- | ----- | ---- | ------ | ----- | ------ |
| 10kb  | -     | -    | 4.6    | 4.7   | 4.3    |
| 20kb  | -     | 2.8  | 12.9   | 12.4  | 9.7    |
| 40kb  | 3.1   | 21   | 29.4   | 28.7  | 20.3   |
| 70kb  | 27.5  | 48.3 | 54.2   | 52.5  | 36.3   |
| 100kb | 51.9  | 75.6 | 79.0   | 76.3  | 52.2   |

Well at 100kb React and Svelte are actually almost identical. And Vue, Preact, and Solid are right next to each other with almost 33% more budget available to them. But that's the upper end. At 40kb Preact and Solid can deliver pretty heft sites with a similar advantage over Vue and Svelte, at a range React isn't even really an option.

Alex's goal was 5 seconds TTI on a slower device and network. For some industries like eCommerce that target should be more like 3 seconds. 70kb - 25kb = \~45kb budget here. How can a larger library like React even compete?

React Server components carry about \~8kb more on top of React's current runtime already price them out of this conversation. Multi-Page Meta-Frameworks like [Astro](https://astro.build/) which remove the need for routing, and possibly other 3rd party libraries, are likely just barely enough. But even amazing tools like Astro bring \~9kb with them when there is JavaScript to load.

But for the other's there is more room to play. A simple site might only 5-10 islands on a given page any option is good there. Even full SPAs for smaller libraries like Preact, Svelte, or Solid are well within a happy range.

---

## Closing Thoughts

In the ranges that matter, all frameworks are pretty comparable. Svelte might ultimately load more JavaScript across many pages for a really large app, but the others are close enough that on the larger side it won't be felt.

Looking across the board Preact is the winner on size still. Solid comes close enough that that difference wouldn't be noticed, but Preact deserves the nod. React is priced out of the smaller targets or performance-sensitive ones but once an app gets large enough its size isn't noticeable. Vue sort lands right down the middle in this range, although ultimately it might send the least JavaScript in a really large app.

Keep in mind this comparison is pretty rough and should be only seen as an estimate. I only regret not being able to put the time in to look at more libraries. Unsurprisingly a lot of TodoMVC examples are written MVC style which is unfair for this comparison or use stores like Redux. I wasn't prepared to write a bunch myself (Preact and React were enough). So this will have to stand.

Hopefully, this gives you enough to think about until the next time the conversation of size comes up. Or maybe by then, it will be a completely different conversation given the way [Marko](https://markojs.com) and [Qwik](https://github.com/BuilderIO/qwik) have been completely shattering the way we measure JavaScript Framework code being sent to the browser.

---

Full source for the TodoMVC examples used in this article found [here](https://gist.github.com/ryansolid/aa5bd12ed4e2f9d592c4b23e58d6fa85)
