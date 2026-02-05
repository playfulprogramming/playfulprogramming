---
{
title: "Is 0kb of JavaScript in your Future?",
published: "2021-05-03T14:27:12Z",
edited: "2022-06-11T04:19:26Z",
tags: ["javascript", "webdev", "react", "svelte"],
description: "Zero JavaScript has been the new buzz phrase around JavaScript libraries for the last little while....",
originalLink: "https://dev.to/this-is-learning/is-0kb-of-javascript-in-your-future-48og",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

Zero JavaScript has been the new buzz phrase around JavaScript libraries for the last little while. And I think it's time to address the elephant (or lack of elephant) in the room. Every library is talking about subtly different things which makes it hard at times to discern what is going on. So let's see if we can bring some clarity.

First, to answer the question. Probably not. Not really. We haven't fundamentally changed how things work. JavaScript didn't get to where it is today purely out of reckless abandonment as some critics might state.

The reasons for having JavaScript on your web pages are good ones. JavaScript can have a really positive effect on user experience. Smoother transitions, faster loading of dynamic content, better interactivity, and even improved accessibility.

So when people are talking about 0kb JavaScript what are they talking about?

# Progressive Enhancement

In the past week, I've seen not one but two demo's showing how HTML Forms do POST requests without JavaScript on the page. [Remix Run](https://remix.run/) and [SvelteKit](https://kit.svelte.dev/) both have the ability to server render a page and then have forms function perfectly fine without loading the JavaScript bundles.

<iframe src="https://www.youtube.com/watch?v=4dOAFJUOi-s"></iframe>

Unsurprisingly links (`<a>` anchor tags) work as well in this condition. This isn't groundbreaking and every server-rendered library can benefit from this if they design their APIs to handle form posts. But it definitely makes for the jaw-drop demo.

*Spoiler Alert -* I especially enjoyed the Remix Run demo where they didn't tell the audience they were not sending any JavaScript to the browser for the first 30 minutes. We just assumed they were building a client app.

Rich Harris, creator of Svelte, gave a very [similar demo 4 days earlier](https://youtu.be/fnr9XWvjJHw?t=19103). I'm not terribly surprised as this is core web fundamentals, and [less popular frameworks](https://github.com/rill-js/rill) have been doing the exact same thing for years even with React in tow.

For the majority of us, we might not need to cater to no JS. Ryan and Michael remind us repeatedly in their video that while this is really cool, the benefit is that by using the built-in platform mechanisms they can simplify the logic that you, the developer, need to write.

The best part of progressive enhancement is it is available to every framework. It's built into the browser. More meta-frameworks should support this. Ultimately, you are probably still sending that JavaScript. It's cool that you don't have to. But it is a sort of all-or-nothing deal on a per-page basis.

# React Server Components

This announcement definitely was groundbreaking. Components that only render on the Server in React. These are being advertised as zero bundle-size components.

<iframe src="https://www.youtube.com/watch?v=TQQPAU21ZUw"></iframe>

What does zero bundle-size actually mean? Well, it means that you aren't shipping these components with your bundle. Keep in mind, the rendered templates are making it to the browser eventually through a serialized format. You do save sending the React code to render it though.

Server components are stateless. Even so, there are big savings in not bundling for libraries like React whose code scales with template size as it creates each VDOM node one by one regardless. A stateless template in a framework like [Lit](https://lit.dev/) or [Solid](https://github.com/solidui/solid), is just a one-line DOM template clone on top of the template itself which needs to be sent anyway.

A better perspective is to view this as a new type of integrated API. At minimum what you save here is the component-specific data-processing you do after you load some data. React Server components let you naturally create a per-component API that is perfectly tailored for that component's needs. That API just might contain some markup, so to speak.

This means no more Lodash or Moment in the browser. That is a huge win. But the real gain is how much easier it is to avoid performance cliffs. We could have already avoided sending most of this with our APIs, but we'd need to write those APIs.

What we get is a different way to do Code Splitting, and write our APIs. We are definitely shaving some weight, but zero bundle size isn't zero size.

# Islands

A year or so ago Jason Miller, creator of [Preact](https://preactjs.com/), was struggling to put a name on an approach to server rendering that had existed for years but no one was really talking about it. He landed on the [Islands Architecture](https://jasonformat.com/islands-architecture/).

The idea is relatively simple. Instead of having a single application controlling the rendering of the whole page, as you find commonly in JavaScript frameworks, have multiple entry points. The JavaScript for these islands of interactivity could be shipped to the browser and hydrated independently, leaving the rest of the mostly static page sent as pure HTML.

Hardly a new idea, but finally it had a name. This as you can imagine drastically reduces the amount of JavaScript you have on the page.

Astro is a multi-framework meta-framework built on top of this idea.

<iframe src="https://www.youtube.com/watch?v=mgkwZqVkrwo"></iframe>

What's really cool about this is we are actively reducing the JavaScript sent on a page while keeping interactivity if desired. The tradeoff is these are multi-page (server-routed) apps. Yes, you could build a Single Page App but that would be negating the benefits.

To be fair any 0kb JS app would have to function as separate pages. And with Astro 0kb is just a matter of not shipping client components. Progressive enhancement like described above is a natural addition.

So Islands are definitely a way to reduce JavaScript and you might actually end up with 0kb of JavaScript where you want it. Where you don't, you don't have to load unnecessary JavaScript. And with a library like Astro you can use tools you are familiar with.

# Partial Hydration

Partial Hydration is a lot like the Island's architecture. The end result is Islands of interactivity.

The difference is the authoring experience. Instead of authoring a static layer and an Island's layer, you write your code like a single app more like a typical frontend framework. Partial Hydration automatically can create the islands for you to ship the minimal code to the browser.

A lesser known gem (released back in 2014!), [Marko](https://markojs.com/) is a JavaScript library that uses its compiler to automate this Partial Hydration process to remove Server only rendered components from the browser bundle.

Beyond the benefits in terms of DX from maintaining a single application, this opens up potential coordination of components. One such application is progressive(streaming) rendering.

![Alt Text](./918jn6corwytcekfhqv6.gif)

A loading experience like this can be coordinated between the client and server without sending a JavaScript bundle to the browser. Just because your page has data incrementally loading doesn't mean it needs a JavaScript library. Marko's out-of-order streaming with fallback placeholders needs JavaScript on the page that gets inlined as it renders. However, with in-order progressive rendering, no JavaScript still works.

Notice the client loading states of this [Hacker News Demo](https://marko-hackernews.herokuapp.com), and then open the network tab to see the absence of shipped JavaScript.

What's particularly cool about this is the way the browser holds navigation until the page starts loading. A page can load its static content quickly and have that similar client-side style progress indication with no JavaScript bundle.

In general, Partial Hydration extends the benefits of Islands giving the potential to treat your pages as single coordinated apps.

# So 0kb?

Maybe not, but all of these approaches and libraries bring some good benefits. JavaScript brings a lot of value, but we don't need as much of it everywhere. Adding new ways to leverage the server, on top of React or Svelte, can help reduce some much un-needed bloat without fundamentally changing the developer experience.

Islands approaches allow applications that do want to operate in no/low JavaScript mode to do so in an incremental way without the buying in to be all or nothing for each page. We can even accomplish dynamic loading without shipping a JavaScript bundle.

The real winner is the developer. All of these approaches give us the tools to simplify client-server interactions. That has been the real challenge as we attempt to move more to the server. And that is the really exciting part.
