---
{
title: "Patterns for Building JavaScript Websites in 2022",
published: "2022-06-08T16:11:03Z",
edited: "2023-03-18T08:23:52Z",
tags: ["javascript", "webdev", "patterns", "architecture"],
description: "Deciding on the approaches and tools to use to build on web these days can be a challenging prospect....",
originalLink: "https://dev.to/this-is-learning/patterns-for-building-javascript-websites-in-2022-5a93",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

Deciding on the approaches and tools to use to build on web these days can be a challenging prospect. There are many different options available and they all claim they do it the best, and often in seemingly contradicting ways.

And strangely enough, they aren't wrong. There are many different types of experiences available on the web, from the simple business listing page to running AutoCAD in the browser.

But even knowing that the web is a wide and diverse place there is a desire to not have as many solutions as there are sites. And while it may be unrealistic to have a one size fits all, maybe there is a way we can rein in some of the confusion. By categorizing the techniques being used we have a way of talking about them, and can make meaningful comparisons.

The framework that has worked for me has been to look at this with 3 questions in mind:

1. Where do you navigate?
2. When do you render?
3. How do you hydrate?

There is no single right answer. Different sites have different needs. So how do we make this more concrete?

We could look at UI frameworks, but they are a moving target, constantly updating and improving. By the time you read this article it will be out of date. Instead maybe it is best to talk about this by archetype (taking a page from Jason Miller's [Application Holotypes](https://jasonformat.com/application-holotypes/))

|                                                            | Portfolio     | Content              | Storefront            | Social Network         | Immersive        |
| ---------------------------------------------------------- | ------------- | -------------------- | --------------------- | ---------------------- | ---------------- |
| [Holotype](https://jasonformat.com/application-holotypes/) | Personal Blog | CNN                  | Amazon                | Facebook               | Figma            |
| Interactivity                                              | Minimal       | Linked Articles      | Purchase              | Multi-Point, Real-time | Everything       |
| Session Depth                                              | Shallow       | Shallow              | Shallow - Medium      | Extended               | Deep             |
| Values                                                     | Simplicity    | Discover-ability     | Load Performance      | Dynamicism             | Immersiveness    |
| Routing                                                    | Server        | Server, HTML Swap    | HTML Swap, Hybrid     | Hybrid, Client         | Client           |
| Rendering                                                  | Static        | Static, SSR          | Static, SSR           | SSR                    | CSR              |
| Hydration                                                  | None          | Progressive, Partial | Partial, Resumable    | Any                    | None (CSR)       |
| Example Framework                                          | 11ty          | Astro, Elder         | Marko, Qwik, Hydrogen | Next, Remix            | Create React App |

> I've attempted to refrain from using acronyms but they are more compact in tables. If you come across any you are not familiar with there is a glossary at the end.

> All these frameworks work perfectly well in multiple scenarios but just picked a couple of the options that fit.

This is just a small sampling. It is easy to see there are many options. Honestly, our classification can only go so far to indicate the characteristics of different tools you are choosing. But if nothing else perhaps this can serve as a starting point for conversation based on real needs to find the type of solutions right for your project.

---

## Routing - The Backbone of the Web

![Image description](./jafx5qlekjvm20k2bu42.png)

The web was built on the the idea of being able to describe a location as a path. The URL is the driving force behind how all the web works.

In recent years, we've gotten more liberal with how we handle it but how we do is the most fundamental aspect of how our web sites and applications behave. Whole architectures and paradigms arise over how this routing is handle, as it is the foundation upon what all else is built. So this is why this is where we start.

#### How do you Navigate?

|                                            | Server   | HTML Swap  | Hybrid                  | Client       |
| ------------------------------------------ | -------- | ---------- | ----------------------- | ------------ |
| Code Entries                               | Multiple | Multiple   | Single                  | Single       |
| Full Page Reload                           | Yes      | No         | No                      | No           |
| Preserves Client State Below Change        | No       | No         | Yes                     | Yes          |
| Client-side Transitions                    | No       | Yes        | Yes                     | Yes          |
| Renders on the Server (after first render) | Yes      | Yes        | Yes                     | No           |
| JavaScript in the Browser                  | None     | Low        | Medium                  | High         |
| Example                                    | Express  | TurboLinks | React Server Components | React Router |

Multi Page App (Server Routing) vs Single Page App (Client Routing) is usually our first distinction. As old as Web Site vs Web App. But the nuance is that all sites are first served from a server. A server rendered SPA becomes an MPA simply by removing the `<script>` tag.

As we look at the newer approaches in the center we are seeing this distinction be harder and harder to make. The key thing to note is these hybrids all are about leveraging the server more while maintaining client side navigation without reloads. Where they differ most is their ability to maintain client state below the change.

If there is any take away about routing it is that every time we've made a significant advance here, the whole paradigm of how we build apps changes. From initial server routing to client routing saw the dawn of SPAs. Push-state and History APIs enabled the isomorphic SSR SPAs we see today. And we are on the precipice of another one of these shifts today.

### Resources:

[Introducing TurboLinks for Rails 4.0](https://geekmonkey.org/introducing-turbolinks-for-rails-4-0/) - Fabian Becker, 2012
[Have Single-Page Apps Ruined the Web?](https://www.youtube.com/watch?v=860d8usGC0o) - Rich Harris, Oct 2021
[The Return of Server Side Routing](https://dev.to/this-is-learning/the-return-of-server-side-routing-b05) - Ryan Carniato, Jan 2022
[Remixing React Router](https://remix.run/blog/remixing-react-router) - Ryan Florence, Mar 2022
[Routing I'm not Smart Enough for a SPA](https://dev.to/tigt/routing-im-not-smart-enough-for-a-spa-5hki) - Taylor Hunt, Apr 2022

---

## Rendering - Bringing HTML into View

![Image description](./vr4fuj5wlm3gcwkkd1uo.jpeg)

For rendering, regardless of technology, the end results are the same. For consumers of your site to be able to see anything, it is rendered into HTML that can be interpreted by the browser and displayed.

So the whole question comes down to when. And this has many tertiary considerations, like availability of data, and ability to cache. High latency data due to infrastructure constraints or how effective caches are can drastically change the performance characteristics, but we can still make meaningful associations through this classification.

#### When do you Render?

|                                   | Static (or Cached)          | SSR (Streaming)        | SSR (Async)                | SSR (Shell)         | Client           |
| --------------------------------- | --------------------------- | ---------------------- | -------------------------- | ------------------- | ---------------- |
| When Render?                      | Ahead of Time               | Server                 | Server after fetching data | Server And Browser  | Browser          |
| When Data Fetched?                | Ahead of Time               | Server Request         | Server Request             | In the Browser      | In the Browser   |
| TTFB                              | Low                         | Low                    | High                       | Low                 | Low              |
| FCP                               | Low                         | Low                    | Medium                     | Low                 | Medium           |
| LCP                               | Low                         | Medium                 | Medium                     | High                | High             |
| LCP : FCP                         | LCP = FCP                   | LCP > FCP              | LCP = FCP                  | LCP > FCP           | LCP > FCP        |
| Hydrates for Client Interactivity | Yes                         | Yes                    | Yes                        | Yes                 | No               |
| Examples                          | HTML in an FTP server, 11ty | Marko, React 18, Solid | Next, Nuxt, SvelteKit      | App Shell, Jamstack | Create React App |

A lot of the rendering story is about data availability, when we fetch has a huge effect on when we render. It isn't uncommon to split the work, rendering static parts on the server and rendering the rest in the browser after fetching data there.

Also important, since all web sites begin on the server, any server rendered site can also be cached if sufficiently static, and gain those advantages. At some point you are taking the hit, and so much of this comes down to how tolerable latency at different points.

There are a lot terms for different on-demand and stale-while-revalidating cache strategies like Incremental Static Re-generation (ISR, DPR) as these features have mostly been platform specific to this point. Expect to see a lot more interesting caching strategies appear as we explore rendering at the Edge.

We have compute so near to the end user, but it doesn't necessarily change the data latency story. Streaming mitigates part of the problem by putting content in front of the user as soon as possible but expect more aggressive caching strategies as we continue to try to get the best of both worlds.

### Resources:

[Async Fragments: Rediscovering Progressive HTML Rendering with Marko](https://tech.ebayinc.com/engineering/async-fragments-rediscovering-progressive-html-rendering-with-marko/) - Patrick Steele-Idem, Dec 2014
[The New Frontend Stack: JavaScript, APIs, Markup](https://vimeo.com/163522126) - Mathias Biilmann, Apr 2016
[Next 9.4: Incremental Static Regeneration Beta](https://nextjs.org/blog/next-9-4#incremental-static-regeneration-beta) - Tim Neutkens, May 2020
[Server Rendering in JavaScript: Optimizing Performance](https://dev.to/ryansolid/server-rendering-in-javascript-optimizing-performance-1jnk) - Ryan Carniato, Feb 2021
[Distributed Persistent Rendering: A New Jamstack Approach for Faster Builds](https://www.netlify.com/blog/2021/04/14/distributed-persistent-rendering-a-new-jamstack-approach-for-faster-builds/) - Mathias Biilmann, Apr 2021

---

## Hydration - JavaScript Frameworks' Greatest Challenge

![Image description](./xu3lmqnfrth25bwgde0l.jpg)

> *Hydration is the work done in the browser to get a server rendered app/page into the same state as if it had been client rendered* - Michael Rawlings

Hydration has [proven a challenge to do efficiently](https://dev.to/this-is-learning/why-efficient-hydration-in-javascript-frameworks-is-so-challenging-1ca3). And it is important as slow hydration gives the illusion of a fully interactive site when it isn't. We talk about things like Time to Interactive looking at page load metrics. But different techniques often defer work rather than address it, and measuring these things is still a work in progress.

It doesn't help that it isn't easy to talk about Hydration. We often talk about qualities of the solution rather than having a name for the approach. The reason is Hydration operates along 3 dimensions:

#### When do you Load?

|           | Eager (Load)                     | Progressive (Idle)   | Progressive (Visible) | Progressive (Interaction) |
| --------- | -------------------------------- | -------------------- | --------------------- | ------------------------- |
| When Load | On Page Load                     | Idle Callback        | Intersection Observer | On Event                  |
| Priority  | High                             | Medium               | Low                   | Low                       |
| Need      | Visible and Hydrated Immediately | Visible Non-Critical | Offscreen, Expensive  | Non-Critical, Expensive   |
| Impacts   | Time to Interactive              | Load Complete        | Scroll Lag            | Input Delay               |

#### What do you Bundle/Serialize?

|                        | None       | Partial             | Full |
| ---------------------- | ---------- | ------------------- | ---- |
| What is Bundled        | Nothing    | Interactive Islands | All  |
| What is Serialized     | Nothing    | Nothing - Minimal   | All  |
| Knows Server Only Code | Yes        | Yes                 | No   |
| Routing                | Not Client | Not Client          | Any  |

#### What do Execute on Load?

|                       | Replayable | Resumable |
| --------------------- | ---------- | --------- |
| Execute Components    | Yes        | No        |
| Restore State         | Yes        | No        |
| Run Client Effects    | Yes        | Yes       |
| Attach Event Handlers | Yes        | Yes       |
| Execution Cost        | High       | Low       |
| Serialization Cost    | Low        | High      |

What makes this more challenging is that only when putting them together in combination can we infer what impact these have on Time to Interactive(TTI) or First Input Delay(FID). Resumability has a low execution cost but high serialization cost, but that can be offset by being Partial. Similarly, being Progressive is more costly when execution cost is higher.

Most JavaScript Frameworks today are Eager, Full, and Replayable. This includes every SPA framework and meta-framework built on top of them to create SPAs. Finding ways to mitigate this ever growing cost is requiring a lot of creativity and new exploration. As with everything else we are seeing a shift back to the server, but not a return to what was.

### Resources:

[Maybe you Don't Need that Spa](https://medium.com/@mlrawlings/maybe-you-dont-need-that-spa-f2c659bc7fec) - Michael Rawlings, May 2020
[Islands Architecture](https://jasonformat.com/islands-architecture/) - Jason Miller, Aug 2020
[Introducing Zero-Bundle-Size React Server Components](https://reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html) - Dan Abramov & co, Dec 2020
[Is Okb of JavaScript in your Future?](https://dev.to/this-is-learning/is-0kb-of-javascript-in-your-future-48og) - Ryan Carniato, May 2021
[What is Partial Hydration and Why is Everyone Talking about It?](https://ajcwebdev.com/what-is-partial-hydration-and-why-is-everyone-talking-about-it) - Anthony Campolo, Nov 2021
[Why Efficient Hydration in JavaScript Frameworks is so Challenging](https://dev.to/this-is-learning/why-efficient-hydration-in-javascript-frameworks-is-so-challenging-1ca3) - Ryan Carniato, Feb 2022
[Conquering JavaScript Hydration](https://dev.to/this-is-learning/conquering-javascript-hydration-a9f) - Ryan Carniato, Mar 2022
[Hydration is Pure Overhead](https://www.builder.io/blog/hydration-is-pure-overhead) - Misko Hevery, Apr 2022

---

## Conclusion

Well, more like this is just the beginning. Classifications can only serve as a guideline rather than the rule. If 2022 has shown anything so far there is a lot of innovation going on.

Tried and true solutions are expanding the range of their offerings. Static generators offering on-demand server rendering. Streaming is becoming a mainstream rendering technique.

Newer solutions are taking on all new territory especially in the area of hydration. Routing will likely be the battleground for the rest of the year as we learn how to better get the server involved.

This means a lot more options are becoming available to us. But that's not a bad thing. Not bad at all.

---

Special thanks to Dan Jutan and Michael Rawlings for reviewing, and Addy Osmani for the [original inspiration](https://www.patterns.dev/posts/rendering-patterns/) and directing me back to Jason's [Application Holotypes](https://jasonformat.com/application-holotypes/).

---

#### Glossary

|      | Name                             | Description                                                                                     |
| ---- | -------------------------------- | ----------------------------------------------------------------------------------------------- |
| SPA  | Single Page App                  | Client-routed single-code entry application experience                                          |
| MPA  | Multi Page App                   | Server-routed multi-code entry site experience                                                  |
| SSR  | Server Side Rendering            | Rendering HTML on the server on demand                                                          |
| SSG  | Static Site Generation           | Rendering HTML ahead of time                                                                    |
| ISR  | Incremental Static Re-Generation | Serve from a cache, while re-rendering in background as needed                                  |
| DPR  | Distributed Persistent Rendering | Cache resource on first request, and serve from cache until invalidated                         |
| TTFB | Time to First Byte               | The time from sending the request until receiving the first byte of the response in the browser |
| FP   | First Paint                      | The time until the first browser paint event                                                    |
| FCP  | First Contentful Paint           | The time until the first browser paint event that shows meaningful content                      |
| LCP  | Largest Contentful Paint         | The time until the majority of visible content has has been painted                             |
| TTI  | Time to Interactive              | The time until all blocking resources and JavaScript have executed                              |
| FID  | First Input Delay                | The time from the first interaction is triggered to when the result is processed                |
