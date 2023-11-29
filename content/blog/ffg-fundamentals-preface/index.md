---
{
  title: "Preface",
  description: "Learning web development is a vital skill in a software engineer's toolbox. Let's talk about why you should learn it and what this book will cover.",
  published: "2023-01-01T22:12:03.284Z",
  authors: ["crutchcorn"],
  tags: ["webdev"],
  attached: [],
  order: 1,
  collection: "The Framework Field Guide - Fundamentals",
}
---

Welcome to the first Framework Field Guide book titled "Fundamentals". This book is the culmination of 8+ years of professional software development as well as over a year of writing, editing, and polishing, and is the first of what will be a trilogy of books teaching frontend web development.

This series will teach you how to build applications, the concepts under the hood of modern web frameworks, and the advanced coding patterns to help you level up your engineering.

While other resources can help you learn these concepts for one framework at a time, **this series will help you learn 3 different frameworks at once; React, Angular, and Vue alike.**

Namely, we'll be looking at the most modern iterations of these frameworks: React 18, Angular 15, and Vue 3.

> It's worth mentioning that React and Angular iterate their major versions much more frequently than Vue. So if you're reading this in the future and see "Angular 18" or "React 22", it's likely that it's using similar concepts under the hood.

We can do this because, despite being different in many ways, these frameworks share the same foundational ideas that run the show in any modern application. That's not to say they are the same, however, and because of this, I will take the time to take asides for each framework to explain where they differ and how they work under the hood individually.

By the end of this series, you should be able to confidently navigate any codebase utilizing these frameworks.

But I'm getting ahead of myself; first, let's answer some fundamental questions.

# Why Should I Learn Web Development Today?

Learning web development is a vital skill in software engineering. Even if you don't end up working on web tech yourself, the likelihood of a project eventually utilizing web tech is exceptionally high. Knowing and understanding the limitations of a web's frontend can make communicating with those teams simpler, make structuring effective backend APIs easier, and allows you to transfer that knowledge to other UI development.

What's more, there's an absolutely gargantuan job market. To quote [the U.S. Bureau of Labor Statistics](https://www.bls.gov/ooh/computer-and-information-technology/home.htm):

> Employment in computer and information technology occupations is projected to grow 13 percent from 2020 to 2030, faster than the average for all occupations. These occupations are projected to add about 667,600 new jobs.
>
> \[...]
>
> **The median annual wage for computer and information technology occupations was $91,250 in May 2020**.

While this number may be specific to the U.S., and other countries and markets may have different rates, programming tends to be a good bet for a sustainable long-term career.

## Why Should I Learn These Tools?

While web development is broadly helpful to learn as a skill for work in engineering, these frameworks, in particular, are a considerable boon to learn.

### Ecosystem Size

For starters, these tools are massively adopted. [React, Angular, and Vue account for 9% of the web in 2021](https://almanac.httparchive.org/en/2021/javascript#libraries-usage) and are consistently growing. While that might not sound like much, remember that [there are over 1.9 billion websites as of 2022](https://www.internetlivestats.com/total-number-of-websites/); Even 1% accounts for nearly 10 million sites.

For example, React accounts for 12 million downloads a week from NPM alone and powers Meta's products (including Facebook, Instagram, and Messenger). In addition, React is utilized by a vast quantity of companies; everyone from Fortune 500s to hot startups is using React in some capacity.

Likewise, while smaller, Angular is alive and well today (unlike its eerily similarly named yet distinct predecessor "AngularJS"). Angular gains over 2 million downloads a week from NPM and powers sites such as Microsoft's [Xbox website](https://www.madewithangular.com/sites/xbox), [Office Web Home](https://www.madewithangular.com/sites/microsoft-office-home) site, Google's [Voice website](https://www.madewithangular.com/sites/google-voice), [Messages site](https://www.madewithangular.com/sites/google-messages), [Firebase's dashboard](https://www.madewithangular.com/sites/google-firebase), and many, many, many more.

Finally, Vue has gained rapid growth in the last few years. From [gaining 50 million downloads in 2019 to over 125 million in 2022 on NPM](https://npm-stat.com/charts.html?package=vue\&from=2019-01-01\&to=2021-12-31), it's seen staggering success in the ecosystem. What's more, Vue sees uniquely high levels of adoption in China. Among the adopters of Vue in China are [Alibaba, a major shopping site](https://madewithvuejs.com/alibaba), and [Bilibili, a video-sharing platform](https://madewithvuejs.com/bilibili).

### Ecosystem Tools

While ecosystem size is great and all, it's nothing without a swath of tools at your disposal to enhance the developer experience and capabilities of said framework.

Luckily, for all three frameworks alike, a myriad of tools build upon their foundation.

For example, want to add [Static Site Generation or Server Side Rendering](https://unicorn-utterances.com/posts/what-is-ssr-and-ssg) to your projects to enhance SEO? No problem: React has [NextJS](https://nextjs.org/) and [Gatsby](https://gatsbyjs.com/), Angular has [Angular Universal](https://angular.io/guide/universal) and [Scully](https://scully.io/), and Vue has [NuxtJS](https://nuxtjs.org/) and [VuePress](https://vuepress.vuejs.org/).

Want to add in a router to add multiple pages to your apps? React has [React Router](https://reactrouter.com/), [Angular has its built-in router](https://angular.io/guide/router), and Vue has the [Vue Router](https://router.vuejs.org/).

Want to add global state management, making it easier to share data across an entire app? React has [Redux](https://redux.js.org/), Angular has [NgRx](https://ngrx.io/), and Vue has [Vuex](https://vuex.vuejs.org/).

The list of lists goes on and on. What's better is that the list I gave for each is non-comprehensive!

In fact, while these frameworks are traditionally associated with the web with the browser, there are even ecosystem tools that allow you to embed Angular, React, or Vue into mobile and native applications.

These tools include [ElectronJS](https://www.electronjs.org/) and [Tauri](https://github.com/tauri-apps/tauri) for desktop applications, alongside [React Native](https://reactnative.dev/) and [NativeScript](https://nativescript.org/) for mobile. While React Native only supports React, the other options mentioned all support the three frameworks we'll be touching on.

While this book in particular will not touch on most of the ecosystem, the second book in our trilogy will be titled "Ecosystem" and teach you how to integrate the foundation of knowledge this book introduces to build out more complex applications with these community tools.

## Who's Building What?

This isn't to say that the only reliance you have that these tools won't disappear is that they're popular; each of these frameworks has at least one prominent backer behind them.

React is built by Meta and powers all of its major applications. Moreover, the core team has started to accept external contributions in the form of feedback on the framework's development via ["working groups" consisting of subject matter experts](https://github.com/reactwg). In recent years, even [groups like Vercel have hired React core members to work on the project from outside of Meta](https://twitter.com/sebmarkbage/status/1470761453091237892).

However, when most mention "React," they tend to talk about the React ecosystem at large. See, the core maintainers of React itself tend to remain focused on a small subsection of tooling. Instead, they rely on external groups, like [Remix](https://reactrouter.com/) and [Vercel](https://nextjs.org/), to provide libraries that are often integral to application development.

On the other hand, Angular is fully funded and supported by Google. They build a substantial portion of their major websites on top of the framework and, as a result, have a vested interest in continuing and upkeeping development. Continuing the differences from React, the Angular core team maintains a slew of helper libraries that provide everything from an [HTTP call layer](https://angular.io/guide/http) to [form validation](https://angular.io/guide/forms-overview).

Vue is often seen as the odd one out when talking about funding. Vue's development is driven by an independent team crowd-funded by a diverse pool of groups and individuals. However, while it's unclear how much money they bring in, it is clear that there are significantly sized contributors involved. Not only do they have a sizable open-source maintenance team, but they have sponsors from major organizations [like Alibaba, Baidu, Xiaomi, and more](https://medium.com/the-vue-point/the-state-of-vue-1655e10a340a).

Like Angular, the Vue core team consists of groups that work on a broad set of tooling. Everything from [the official routing library](https://router.vuejs.org/) to its two different global store libraries ([Vuex](https://vuex.vuejs.org/) and [Pinia](https://pinia.vuejs.org/)) and beyond are considered part of Vue's core.

### Why Learn All Three Frameworks?

While there's the obvious answer of "it broadens the types of work you're able to do," there are more reasons than that to learn more than one framework at a time.

In particular, each framework comes with its own restrictions, rules, and best practices. These rules and restrictions can help you understand a different way of coding that often transfers to the other frameworks.

For example, Angular focuses on object-oriented programming while the React ecosystem favors functional programming. While it's not immediately important what each of these means, they allow you to do many of the same things in different ways and have different pros and cons.

Because of this, once you have a higher mastery skill with each, you can pick and choose which methodology of programming you want to apply within parts of your applications.

Beyond this, it's important to remember that these three frameworks are not the only choices on the table in web development. Svelte is an alternative that's been gaining tremendous traction, for example. While it differs even more from the three options we're learning, Svelte still shares many of the foundations of React, Angular, and Vue.

This knowledge transfer doesn't stop at JavaScript or web development, either. The more you learn about any aspect of programming can be used to utilize the same procedures in other languages or types of programming. Many of the APIs I've used in web development was also valuable when doing engineering work with native languages.

### Will These Tools Stick around?

Honestly? Who's to say. The ecosystem has its fluctuations; many developers definitely seem to feel some level of burnout from, say, the React ecosystem after so long within it.

But here's the thing: these tools are widely backed and utilized by some of the biggest companies.

These types of tools don't disappear overnight, nor do the jobs associated with these tools.

Take ColdFusion, for example. If you ask most frontend developers, they will likely either not know of ColdFusion or assume it is dead. After all, ColdFusion goes back to 1995 and remains a proprietary paid programming language — yes, those exist — to this day.

But ColdFusion isn't dead! (I can hear my friend Mark holler with excitement and agreement from miles away.) [It's still used by as many websites](https://w3techs.com/technologies/details/pl-coldfusion) [as Angular is](https://w3techs.com/technologies/details/js-angularjs) in 2022 and maintains an ecosystem of a respectable size that's big enough to allow Adobe to sustain the development of the language 27 years later.

Additionally, from a cultural standpoint, many developers are also tired of switching back and forth between new frameworks at seemingly breakneck speeds. Many companies may choose to stay with these tools for longer than anticipated simply because they've grown in expertise with these tools.

Just because a tool is new doesn't mean that it's inherently better; even better perceived tools may not be selected for various reasons.

# What Will We Be Learning?

As mentioned earlier, we will be learning React, Angular, and Vue from an introductory place, all the way to understanding the inner workings of these frameworks.

**You do not need any pre-requisite knowledge on these frameworks and very little pre-requisite knowledge on JavaScript, HTML, or CSS.**

In fact, I will do my best to link out to anything that's expected to be known or useful for continuing the learning process. That said, if you're new to these topics, some suggested pre-reading might include:

- ["How Computers Speak" - An introduction to how your computer takes "source code" and converts it to machine code.](https://unicorn-utterances.com/posts/how-computers-speak)
- ["Introduction to HTML, CSS, and JavaScript" - An explanation of the three fundamentals of web development and how they're utilized to build websites.](https://unicorn-utterances.com/posts/intro-to-html-css-and-javascript)
- ["CSS Fundamentals" - An introduction to how CSS works and common rules you should know.](https://unicorn-utterances.com/posts/css-fundamentals)
- ["WebDev 101: How to use NPM and Yarn" - An explanation of what "Node" is, what "NPM" is, and how to use them.](https://unicorn-utterances.com/posts/how-to-use-npm)
- ["Understanding The DOM: How Browsers Show Content On-Screen" - An explanation of what the "DOM" is and how it pertains to HTML.](https://unicorn-utterances.com/posts/understanding-the-dom)

## What Aren't We Learning?

Before taking a look at some specifics of what we'll be learning, **let's talk about what we won't be spending dedicated time learning in this series**:

- Standalone JavaScript APIs
- CSS
- Linting tooling, such as ESLint or Prettier.
- IDE functionality, such as VSCode, WebStorm, or Sublime Text.
- TypeScript - while Angular code samples will include a bit of it, we won't be diving into the specifics.

All of these are broad concepts in their own right and have a plethora of content capable of hosting their own books. After all, resources without a properly defined scope run into challenges of surface-level explanations, jarring transitions, and even delayed publications.

> Remember, knowledge is like a web - these topics intersect in messy and complex ways! It's okay to take your time to learn these or even limit your learning scope to remain focused on a specific subset of knowledge. Nobody knows each and all of these perfectly, and that's okay!

Once again, however, if any of these topics become relevant in the book, we'll link out to resources that will help you explore more and broaden your knowledge base.

## Content Outline

With the understanding of what we won't be looking at out of the way, **let's talk about what we _will_ be learning about**:

<!-- TODO: // Link out to each chapter -->

- [What a "component" is](https://crutchcorn-book.vercel.app/posts/intro-to-components) <!-- Introduction to components -->
  - What "rendering" is
  - How to keep the DOM and JavaScript state in sync
  - How to bind DOM events to JavaScript functions
  - How to pass values from one part of the UI to another

- [How to update the DOM](https://crutchcorn-book.vercel.app/posts/dynamic-html) <!-- Dynamic HTML -->
  - How to conditionally show data on screen
  - How to render lists on-screen

- [What a lifecycle method is](https://crutchcorn-book.vercel.app/posts/lifecycle-methods) <!-- Lifecycle methods -->
  - What a "side effect" is

- [How to base the value of one variable off of another](https://crutchcorn-book.vercel.app/posts/derived-values) <!-- Derived values -->

- [How to handle segments of HTML as a group](https://crutchcorn-book.vercel.app/posts/partial-dom-application) <!-- Partial DOM Application -->

- [How to build relationships between components](https://crutchcorn-book.vercel.app/posts/content-projection) <!-- Content projection -->
  - How to pass children to components

- [How to access a component's children programmatically](https://crutchcorn-book.vercel.app/posts/content-reference) <!-- Content reference -->

- [How to access underlying DOM nodes programmatically](https://crutchcorn-book.vercel.app/posts/element-reference) <!-- Element reference -->

- [How to access a component instance programmatically](https://crutchcorn-book.vercel.app/posts/component-reference) <!-- Component reference -->
  - How to pass data from a component up to its parent
  - How to create complex event handling logic

- [What "dependency injection" is](https://crutchcorn-book.vercel.app/posts/dependency-injection) <!-- Dependency injection -->

- How to share component logic between components <!-- Shared component logic -->

- [What a "directive" is](https://crutchcorn-book.vercel.app/posts/directives) <!-- Directives -->

  - How to associate sharable code logic with DOM nodes

- How to control where parts of your app show up <!-- Portals -->

- How to handle errors in your apps <!-- Error handling -->

- How to make your app accessible to everyone, including assistive technologies <!-- A11Y -->

- How to structure your application <!-- Fundamentals/structure -->
  - What a "pure" function is
  - What "unidirectionality" is

> This can seem overwhelming but remember that this book/course is meant to be a "newcomer" to "expert" resource. You absolutely do not need to tackle this all at once. You can stop at any point, go elsewhere, and come back at your leisure. This book/course isn't going anywhere and **will be free online forever**; it is [open-source to ensure this is the case](https://github.com/unicorn-utterances/unicorn-utterances/).

But wait, there's more! While this is the outline for the first book in the series, there are going to be two more books teaching React, Angular, and Vue: The second book will focus on the ecosystem around these tools, and the third book will focus specifically on internals and advanced usage.

Throughout this all, we will be attempting to build a single application as outlined in the "Introduction to Components" chapter. By the end of this book/course, you will have a fully functional user interface that you have built yourself through code samples and challenges displayed throughout.

We will also have easy-to-reference resources in case you're already a pro with a specific framework and are looking to quickly learn:

- A glossary of various terms relevant to these frameworks
- A lookup table with equivalent APIs between these frameworks

## A Note on Framework Specifics

As a final note, before I send you into the rest of the book/course, I want to touch on a few points about these frameworks:

<!-- tabs:start -->

### React

Here's a few nuances we should keep in mind about this book's teachings of React:

#### We're Using React Hooks

React has two different ways of writing code: Using classes and "Hooks".

While React classes are more similar to Angular or Vue's Option API, **I've decided to write this book/course using React's "Hooks" method as references for the components.**

This is because, while classes are still a part of the most modern versions of React, they've drastically fallen out of favor in comparison to React Hooks. I want to try to make this book representative of real-world codebases you're likely to run into with modern versions of these frameworks, so I thought it only made sense to go with Hooks.

That all said, the core concepts outlined in this book/course apply to both of these methods, so if you want to learn the React class API after the fact, it should be easier with this foundation of learning.

### Angular

Here's a few nuances we should keep in mind about this book's teachings of Angular:

#### Angular Is Not AngularJS

Despite the similarities in their names, these two are entirely distinct entities. More specifically, [AngularJS was originally released in 2010](https://unicorn-utterances.com/posts/web-components-101-history#2010-The-Early-Days-of-MVC-in-JS) and was followed up by the initial release of Angular in 2016. **Despite this shared lineage, the core concepts shifted drastically between these two releases.** For all intents and purposes, you will not know AngularJS at the end of this book: You will know Angular.

#### We're Using Standalone Components

Angular has two ways of defining component imports: modules and standalone components. **We'll be using Standalone components**.

When Angular was first released it launched with [the concept of NgModules](https://angular.io/guide/ngmodules). Very broadly, this was an API that allowed you to namespace a collection of related UI items (called components, more on that in the next chapter) into so called "modules".

While these modules worked, they were mostly dissimilar from alternatives in other related frameworks like React and Vue. Further, a common complaint against them is that they were overly complicated with minimal yeild.

[Starting with an experimental release in Angular 14](https://github.com/angular/angular/discussions/45554) (and [being marked as stable in Angular 15](https://blog.angular.io/angular-v15-is-now-available-df7be7f2f4c8)), Angular introduced the "standalone components" API. This was a more similar method of importing similar UI elements into one-another and is what our book will be using.

> Keep in mind that if you're working with an older Angular codebase, it's likely to still be using modules.

#### We're Using Self-Closing Tags

HTML supports self-closing tags on some elements that don't contain children:

```html
<input />
```

Similarly, Angular 15.1 introduced a method for using self-closing tags with components selectors:

```html
<component />
<!-- vs. <component></component> -->
```

**We will be using these self-closing tags throughout the book**, as they're common practice in applications built with the other two frameworks.

> This will not work with versions of Angular older than 15.1, so be aware of this when working in older codebases.

#### We Won't Be Learning "Signals"

[Early in 2023, the Angular team announced that they will be introducing a new method of programming in Angular called "Signals"](https://angular.io/guide/signals). To pull back the curtains a bit, this book began life in January of 2022, and the by the time the book had launched, Signals were not yet introduced as a stable API within the Angular ecosystem.

While I believe that Signals are the way forward for the Angular community, it simply wasn't suitable to delay the book further to wait for this API to stabilize. As such, **this book will not teach Angular signals** at this time.

However, in the future I will revise this book to be geared towards Angular Signals as opposed to the current method of Zone.js mutations. This will come as a second edition of the book sometime in the future.

### Vue

Here's a few nuances we should keep in mind about this book's teachings of Vue:

#### We're Using the Composition API

Vue has two different ways of writing code: The "Options" API and the "Composition" API.

While the "Options" API has been around for longer and is more similar to Angular's classes, **this book will be using Vue's "Composition API"**. This is for a few reasons:

1. The Composition API is newer and seemingly favored over the Options API for new applications.
2. The Composition API shares a bit of DNA with React's Hooks, which makes explaining some of the cross-framework concepts easier.
3. The Composition API is relatively trivial to learn once you have a strong grasp of the Options API.
4. Their documentation does a good job at providing code samples in both Options API and Composition API - allowing you to learn both even easier.
5. [Evan You, the project's creator and lead maintainer, told me to.](https://twitter.com/youyuxi/status/1545281276856262656?s=20\&t=ZBooorTRi6dYR1h_VVbu1A) 😝

Similarly, this book will not cover [Vue's other upcoming compiler-based syntax choice, the upcoming `$ref` sugar](https://github.com/vuejs/rfcs/discussions/369). However, a the "Internals" book in this book series will walk you through all of these different APIs, why they exist, and how they build on-top of one-another.

#### We're Using SFCs

Vue is a highly flexible framework and, as a result, allows you to define components with various methods; each with their own set of pros and cons.

**This book will specifically be focused on using the ["Single File Component" (or, SFC for short) method](https://vuejs.org/guide/scaling-up/sfc.html) of creating Vue components using `.vue` files.**

While the "Internals" book (the third in the series) will introduce the other methods and how they work under-the-hood, SFCs are commonly used as the de-facto method of creating Vue components for most applications.

<!-- tabs:end -->

Without further ado, let's get started.
