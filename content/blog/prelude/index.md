---
{
    title: "Prelude",
    description: "Learning web development is a vital skill in a software engineer's toolbox. Let's talk about why you should learn it and what this book will cover.",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 1,
    series: "The Framework Field Guide"
}
---

Welcome to the Web Framework Field Guide. This resource is the culmination of 7+ years of professional software development as well as over a year of writing, editing, and polishing.

This resource will teach you how to build applications, the concepts under-the-hood of modern web frameworks, and the advanced coding patterns to help you level up your engineering.

While there exists other resources that can help you learn these concepts for one framework at a time, **this collection will help you learn 3 different frameworks at once; for React, Angular, and Vue alike.**

Namely, we'll be taking a look at the most modern iterations of these frameworks: React 18, Angular 14, and Vue 3.

> It's worth mentioning that React and Angular iterate their major versions much more frequently than Vue. If you're reading this in the future and see "Angular 18" or "React 22", it's likely that it's using similar concepts under-the-hood.

We're able to do this because, despite being different in many ways, these frameworks share the same foundational ideas that run the show in any modern application. That's not to say they are the same, however, and because of this I will take the time to take asides for each framework in order to explain where they differ and how they work under-the-hood individually.

By the end of this series, you should be able to confidently navigate any codebase utilizing these frameworks.

But I'm getting ahead of myself, first, let's answer some fundamental questions.

# Why should I learn web development today?

Learning web development is a vital skill in software engineering. Even if you don't end up working on web tech yourself, the likelyhood of a project eventually utilizing webtech is extremely high. Knowing and understanding the limitations of a web's frontend can make communicating with those teams simpler, makes structuring effective backend APIs easier, and allows you to transfer that knolwedge to other UI development.

What's more, there's an absolutely gargantuan job market. To quote [the U.S. Buero of Labor Statistics](https://www.bls.gov/ooh/computer-and-information-technology/home.htm):

> Employment in computer and information technology occupations is  projected to grow 13 percent from 2020 to 2030, faster than the average for all occupations. These occupations are projected to add about 667,600 new jobs. 
>
> [...]
>
> **The median annual wage for computer and information technology occupations was $91,250 in May 2020**.

## Why should I learn these tools?

While web development is broadly useful to learn as a skill for work in engineering, these frameworks in particular are a huge boon to learn.

### Ecosystem size

For starters, these tools are massively adopted. [React, Angular, and Vue account for 9% of the web in 2021](https://almanac.httparchive.org/en/2021/javascript#libraries-usage) and are consistently growing. While that might not sound like much, remember that [there are over 1.9 billion websites as of 2022](https://www.internetlivestats.com/total-number-of-websites/); Even 1% of that accounts for nearly 10 million sites.

For example, React accounts for 12 million downloads a week from NPM alone and powers Meta's products (including Facebook, Instagram, and Messenger). React is utilized by a huge quantity of companies; everyone from Fortune 500s to hot startups are using React in some capactiy.

Likewise, while smaller, Angular is alive and well today (unlike its eerily similarly named yet distinct predecessor "AngularJS"). Angular gains over 2 million downloads a week from NPM, and powers sites such as Microsoft's [Xbox website](https://www.madewithangular.com/sites/xbox), their [Office Web Home](https://www.madewithangular.com/sites/microsoft-office-home) site, Google's [Voice website](https://www.madewithangular.com/sites/google-voice), their [Messages site](https://www.madewithangular.com/sites/google-messages), [Firebase's dashboard](https://www.madewithangular.com/sites/google-firebase), and many many more.

Finally, Vue has gained rapid growth in the last few years. From [gaining 50 million downloads in 2019 to over 125 million in 2022 on NPM](https://npm-stat.com/charts.html?package=vue&from=2019-01-01&to=2021-12-31) , it's seen staggering success in the ecosystem. What's more, Vue sees unqiuely high levels of adoption in China. Among the adopters of Vue in China are [Alibaba, a major shopping site](https://madewithvuejs.com/alibaba) and [Bilibili, a video sharing platform](https://madewithvuejs.com/bilibili).

### Ecosystem Tools

While ecosystem size is great and all, it's nothing without a swath of tools at your disposal to enhance the developer experience and capabilities of said framework.

Luckily, for all three frameworks alike, there's a myriad of tools that build upon their foundation.

For example, want to add [Static Site Generation or Server Side Rendering](https://unicorn-utterances.com/posts/what-is-ssr-and-ssg) to your projects to enhanse SEO? No problem: React has [NextJS](https://nextjs.org/) and [Gatsby](https://gatsbyjs.com/), Angular has [Angular Universal](https://angular.io/guide/universal) and [Scully](https://scully.io/), and Vue has [NuxtJS](https://nuxtjs.org/) and [VuePress](https://vuepress.vuejs.org/).

Want to add in a router to add multiple pages to your apps? React has [React Router](https://reactrouter.com/), [Angular has their built-in router](https://angular.io/guide/router), and Vue has the [Vue Router](https://router.vuejs.org/).

Want to add global state management, making it easier to share data across an entire app? React has [Redux](https://redux.js.org/), Angular has [NgRx](https://ngrx.io/), and Vue has [Vuex](https://vuex.vuejs.org/).

The list of lists goes on and on. What's better is that the list I gave for each are non-comprehensive! There's many more tools and libraries that add to each list!

In fact, while these frameworks are traditionally associated with the web with the browser, there's even ecosystem tools that allow you to embed Angular, React, or Vue into mobile and native applications.

These tools include [ElectronJS](https://www.electronjs.org/) and [Tauri](https://github.com/tauri-apps/tauri) for desktop applications, alongside [React Native](https://reactnative.dev/) and [NativeScript](https://nativescript.org/) for mobile. While React Native only supports React, the other options mentioned all support the three frameworks we'll be touching on.

## Who's building what?

This isn't to say that the only reliance you have that these tools won't disappear is that they're popular, though. Each of these frameworks have at least one large backer behind them.

React is built by Meta, and powers all of their major applications. What's more, the core team has started to accept external contribution to feedback of the framework's development via ["working groups" consisting of subject matter experts](https://github.com/reactwg). In recent years, even [groups like Vercel have hired React core members to work on the project from outside of Meta](https://twitter.com/sebmarkbage/status/1470761453091237892).

However, when most mention "React", they tend to talk about the React ecosystem at large. See, the core maintainers of React itself tend to remain focused on a small subsection of tooling. Instead, they rely on external groups, like [Remix](https://reactrouter.com/) and [Vercel](https://nextjs.org/) to provide libraries that are often integral to application development.   

Angular, on the other hand, is fully funded and supported by Google. They build a substancial portion of their major websites on top of the framework, and as a result, have a vested interest in continuing and upkeeping development. Continuing the differences from React, the Angular core team maintains a slew of helper libraries that provide everything from an [HTTP call layer](https://angular.io/guide/http) to [form validation](https://angular.io/guide/forms-overview).

When talking about funding, Vue is often seen as the odd one out. Vue's development is driven by an independant team that's crowd-funded from a diverse pool of groups and individuals. However, while it's unclear how much money they bring in, it is clear that there are major contributors involved. Not only do they have a large open-source maintainance team, but they have sponsors from major organizations [like Aliababa, Baidu, Xioami, and more](https://medium.com/the-vue-point/the-state-of-vue-1655e10a340a).

Similar to Angular, the Vue core team consists of groups that work on a broad set of tooling. Everything from [the official routing library](https://router.vuejs.org/) to its two different global store libraries ([Vuex](https://vuex.vuejs.org/) and [Pinia](https://pinia.vuejs.org/)) and beyond are considered part of Vue's core.

### Why learn all three frameworks?

While there's the obvious answer of "it broadens the types of work you're able to do", there are more reasons than that to learn more than one framework at a time.

In particular, each framework comes with their own restrictions, rules, and best practices. These rules and restrictions can help you understand a different way of coding that often transfers to the other frameworks as well. 

For example, Angular focuses on object-oriented programming while the React ecosystem tends to favor functional programming. While it's not immediately important what each of these means, they allow you to do many of the same things in different ways and have different pros and cons.

Because of this, once you have a higher mastery skill with each, you can pick-and-choose which methodology of programming you want to apply within parts of your applications.

Beyond this, it's important to remember that these three frameworks are not the only choices on the table in web development. Svelte is an alternative that's been gaining great traction, for example. Svelte, while it differs even more from the three options we're learning, still shares many of the foundations of React, Angular, and Vue.

This transfer of knolwedge doesn't stop at JavaScript or web development, either. The more you learn about any aspect of programming allows you to utilize the same proceedures in other languages or types of programming. Many of the APIs I've utilized in web development were also useful when doing engineering work with native languages.


### Will these tools stick around?

Honestly? Who's to say. While the ecosystem has its fluctuations and there are many developers who definately seem to feel some level of burnout from, say, the React ecosystem after so long within it.

But here's the thing: these tools are widely backed and utilized by some of the biggest companies there are.

These types of tools don't disappear overnight, nor do the jobs associated with these tools.

Take ColdFusion for example. If you ask most front-end developers, they may likely either not know of ColdFusion, or assume it dead. After all, ColdFusion goes back to 1995 and remains a proprietary paid programming language — yes, those exist — to this day.

But ColdFusion isn't dead! (I can hear my friend Mark holler with excitement and agreement from miles away.) [It's still used by as many websites](https://w3techs.com/technologies/details/pl-coldfusion) [as Angular is](https://w3techs.com/technologies/details/js-angularjs) in 2022, and maintains an ecosystem of a respectible size that's big enough to allow Adobe to maintain development of the language, 27 years later.

What's more, from the cultural standpoint, many developers are also tired of switching back and forth between new frameworks at seemingly breakneck speeds. Many companies may choose to stay with these tools for longer than anticipated simply because they've grown in expertice with these tools.

Just because a tool is new, doesn't mean that it's inherently better; and even tools that are percieved better may not be selected for various reasons.


# What will we be learning?









-------


- Outline contents
- Angular !== AngularJS
- React has two methods of display: We'll focus on hooks
- Vue has two methods of display: We'll focus on options API



