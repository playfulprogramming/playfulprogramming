---
{
title: "3 Lessons from React that can make you a better Svelte Developer",
published: "2021-07-22T18:01:14Z",
edited: "2021-07-23T18:02:24Z",
tags: ["javascript", "webdev", "svelte", "react"],
description: "Svelte is an amazing JavaScript framework that has been getting a lot of attention the last year....",
originalLink: "https://dev.to/this-is-learning/3-lessons-from-react-that-can-make-you-a-better-svelte-developer-23c4",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

[Svelte](https://svelte.dev) is an amazing JavaScript framework that has been getting a lot of attention the last year. While it has been around since late 2016 it has recently passed the tipping point where there are a critical mass of developers enthusiastic about incorporating Svelte in their projects.

What this means is we are seeing a lot of new developers trying [Svelte](https://svelte.dev) for the first time as their first framework, and even more coming from having used other frameworks in the past.

At a time like this there is a lot to be excited about. [Svelte](https://svelte.dev) offers a shiny coat of paint on the tried and true patterns of frontend. However, we shouldn't be looking at this as an opportunity to throw out the baby with the bath water. There are learnt best practices and patterns from other frameworks that are incredibly important that may have not reached into Svelte vernacular but are every bit as relevant.

## 1. Keys on {#each}

I've seen some talk about how keys are suddenly not needed on loops when moving to Svelte. This is of course completely unfounded. Svelte might not nag on you like React but not including them has exactly the same impact as it does in [React](https://reactjs.org). Svelte's implementation is equivalent to just muting those warnings.

Why is [React](https://reactjs.org) so insistent?
[Keyed vs Non-Keyed](https://www.stefankrause.net/wp/?p=342)
[Index as a Key is an Anti-Pattern](https://robinpokorny.medium.com/index-as-a-key-is-an-anti-pattern-e0349aece318#.qgzvk154k)
[Maintaining State](https://vuejs.org/v2/guide/list.html#Maintaining-State)

Honestly, the list goes on. The problem boils down to any scenario where the DOM can hold nested state like forms, animations, 3rd party widgets, webcomponents, etc.. there is potential for inconsistent state and state corruption. Luckily adding a key to Svelte is so easy:

```svelte
{#each things as thing (thing.id)}
  <Thing name={thing.name}/>
{/each}
```

Now, keys aren't needed in every scenario but if you are writing general purpose libraries and components you should definitely as least support keyed iteration. The reason is that once you opt out of keying you've opted out all descendants. Any future changes or potential hiccups might be related to something further up in the hierarchy that you aren't even accounting for.

Every framework author knows this but it is sometimes underplayed in docs for ease of onboarding. But this is an important idea that is omni-present in React and understanding it will help you be a better Svelte developer.

## 2. Single Value Stores don't Scale

That is probably pretty obvious and Svelte's Store mechanism is very simple and powerful. In fact you can do pretty much anything with it. You can store a single value, jam a reducer in it, or even a state machine.

But a single store is based off a single set of subscriptions. Every component that listens to that store triggers an update on any and every change to that store. This does not scale.

But breaking into multiple stores also eventually can lead complicated synchronization. There are relationships and things that work together in tandem. Updating a value in one store means updating multiple.

Early days of exploring Flux architecture with React (2013-14) saw the progression away from the multi-store to the single store to remove the need for excessive synchronization overhead. While not everything needs to be in a single store, it's important to recognize that certain data does update together and nesting can be natural.

It is the motivation for things like selectors and normalized forms in [Redux](https://redux.js.org/), and complicated boilerplate around the Connect wrapper. Or why [Vue](https://vuejs.org/) and [MobX](https://mobx.js.org/) use proxies to track individual updates. Svelte Stores do not solve this problem alone and re-introducing this when the time is right will bring along a lot of the familiar boilerplate.

It is really convenient that there is such a simple out of the box solution already present. Most Reactive frameworks actually do come with a reactive atom solution built in, like [Vue's `ref`](https://v3.vuejs.org/api/refs-api.html), but interestingly enough it is not usually their recommended path for stores, based on how quickly it is outscaled.

Svelte isn't immune to this:
https://github.com/sveltejs/svelte/issues/4079
https://github.com/sveltejs/svelte/issues/3584

So this is a good thing to keep in mind as you grow your Svelte apps and are looking for data architecture wins on performance. Be prepared to look into techniques beyond simple stores to ensure your application scales with your data.

## 3. Immutable Interfaces

React is known for its explicit setter `setState`, unidirectional flow, and immutable data. But Svelte just lets you assign values.

So no, I don't mean make everything immutable. But we can be aware that the challenge of mutable data structures is once they leave the scope in which they are defined it is hard to know what to expect. The classic:

```js
const someData = { value: 5 };
someFunction(someData);
// do we know this is even true
someData.value === 5;
```

For all we know `value` isn't even defined object anymore. You see this time and time again in system architecture the importance of providing read only interface with explicit setters. Using things like events or commands with a dispatch function. Even mutable reactive data stores like MobX recommend using Actions and have a strict mode to prevent writes except for where they are intended. In a reactive system this is doubly important as a change to some value can have cascading effects elsewhere in your app.

Luckily Svelte compiler has some built-in protection. Other than using an explicit bind syntax it is actually difficult to pass writable reactive values out of your template. Svelte's `let` variables are basically keyed to the component and can't escape the template, and Svelte's Stores are built using explicit syntax.

So most of this comes down to understanding the repercussions of when to bind and not and how to design your stores as your application grows. Often explicit setters or using events increases code clarity at an application level and improves modularity. It's even a good model for explaining the need to assign arrays to update them. So a useful pattern to have in the toolbelt even in Svelte.

## Conclusion

[Svelte](https://svelte.dev) has done an amazing job of making learning a new Framework fun and easy. It also has all the tools needed to implement the best practices to create applications that scale. Just remember similar to moving to live in a new country, while the culture and traditions might be a bit different, the same physical laws of nature apply.

The same tools and patterns you learned in other frameworks are just as important now as ever. And while we might sometimes not like the boilerplate these things exist for good reason. Accepting this is the first step in becoming a next-level [Svelte](https://svelte.dev) developer.
