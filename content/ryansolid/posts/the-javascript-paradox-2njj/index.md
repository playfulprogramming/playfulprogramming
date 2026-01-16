---
{
title: "The JavaScript Paradox",
published: "2022-08-08T15:27:32Z",
tags: ["javascript", "webdev", "performance"],
description: "I'm not sure if there's ever been a language more loathed, yet so widely used, as JavaScript.  I'm...",
originalLink: "https://dev.to/this-is-learning/the-javascript-paradox-2njj",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

I'm not sure if there's ever been a language more loathed, yet so widely used, as JavaScript.

I'm not of that camp. I quite like JavaScript. Its quirks, its flaws. How it somehow built upon Scheme yet was destined to be the most pervasive programming language.

JavaScript was designed to be a companion. A scripting language to perform menial tasks to assist small pieces of interactivity on the page. The language of the web.

But the web has grown well beyond what it originally was. It encompasses all manner of experiences and devices. From computers, mobile phones, televisions, and watches to all manners of IoT devices. From the simple content site to the immersive virtual reality video game.

And JavaScript has come along with it.

---

## Phenomenal Cosmic Powers, Itty Bitty Living Space

![Image description](./1jroy6ygfeo4rjys8vu3.jpeg)

The one thing the web foundations have repeatedly shown us is how critical the network is as a resource. Most programming is concerned with memory or disk speed, but the web is always concerned with the network. This, along with being a free-for-all of platforms and really the only available option, has led JavaScript to develop most peculiarly.

While JavaScript by any measure is an interpreted dynamically typed scripting language, it now is a transpiler, a melting pot of DSLs, and a whole toolchain. The machine of JavaScript has long replaced the soul. It needs to be everything to everyone, yet be imperceptibly small and resource-light.

The starkest thing I see when looking at how we develop applications in JavaScript is that ultimately no matter how great the potential, catering to the lowest common denominator on device capability and network speed still drives the conversation. It is an inescapable truth. The law of physics we must obey.

---

## The Role of JavaScript Frameworks

![Image description](./3dc87pj95l2267lwgque.png)

It is not uncommon for a language or framework to aid developers in achieving the performance they desire. But what about deleting our own code? The most performance-oriented JavaScript frameworks are obsessed with allowing us to run less JavaScript.

JavaScript is probably more concerned with producing less JavaScript than anyone else. You see this when frameworks like [Svelte](https://svelte.dev) or [Solid](https://solidjs.com) are considerably smaller than [Stimulus](https://stimulus.hotwired.dev/) or even [Alpine](https://alpinejs.dev/). You see this with all the focus from [Marko](https://markojs.com), [Astro](https://astro.build), and [Qwik](https://qwik.builder.io/) on Partial Hydration. Even things like [React Server Components](https://reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html) reflect this concern.

<!-- ::start:link-preview -->
[Is 0kb of JavaScript in Your Future](https://playfulprogramming.com/posts/is-0kb-of-javascript-in-your-future-48og)
<!-- ::end:link-preview -->

We lean heavily into bundlers and compilers to strip out every bit of code we don't need. The goal is to optimize every last bit of execution in our templates. Create specific languages to better capture intent to make that all possible. We analyze our apps to break apart code that can only be run on the server from code that runs in both places. And we use that information to reduce data serialization costs.

We even leverage server-side rendering to inform how to reduce the cost of booting up the application in the browser, through [newer concepts like resumability](https://dev.to/this-is-learning/conquering-javascript-hydration-a9f). Running the application on the server fills in the gaps compilation can't handle ahead of time.

{% embed https://x.com/Madisonkanna/status/1555033936463466496 %}

A new JavaScript Framework every week as the saying goes. A constant struggle to innovate and push boundaries. Background knowledge of never being satisfied with the status quo haunts this space. There is even a term for it. [JavaScript Fatigue](https://hackernoon.com/how-it-feels-to-learn-javascript-in-2016-d3a717dd577f). Buried in the complexity of learning and of choice. And yet they continue to rise like an unending stream of the undead. Each building upon the remains of the past.

This isn't necessarily a bad thing. It is a sign that there is more work to do. If you change your perspective that the status quo is more a 4 out of 10 instead of an 8 out of 10, none of this is surprising. JavaScript fatigue is caused by reality missing expectations. Let's talk more about those expectations.

---

## The JavaScript Paradox

![Image description](./h7ktuigslv6g3be9w466.jpeg)

We created the problems we are solving. Our desire for more interactivity and better user experiences. Not relying as heavily on the network. The wish to use a single toolset to build all manners of site or application for the web.

But it is more than that. We could take a backend language and sprinkle JavaScript over it, and for a time that might be alright. Mechanically that is all we ever wanted. But it is almost impossible to turn back the clock on the developer experience we've seen over the last decade. The ability to author things as a single application, instead of weaving our JavaScript through as a steadily growing, but unwanted, orphan on top of our server application.

If anything we get more and more benefits from reducing those boundaries between the front and the back. To the point that it isn't even that controversial to suggest using JavaScript full-stack is the best way to ship less JavaScript.

Another language runtime might make savings in the 10s of ms but when we talk about the impact we can make for the end-user on the destination device through leveraging using JavaScript on the server can be in the 100s of ms. It's an order of magnitude more impactful to the end user.

But admittedly it might affect your bottom line. JavaScript's sole purpose for existence was the browser and now we have brought it everywhere.

---

## Are we Stuck?

![Image description](./tv8n1ul3s0d8er6ylgc8.png)

Well, where I'm sitting, at least for now. This is a direct extension of JavaScript being the only language of the browser. WASM shows promise in some areas but isn't making a dent on the user interface side of things yet. There are inherent costs that it needs to overcome.

{% embed https://x.com/zack_overflow/status/1552331502590889984 %}

If the end user's device and network are on the critical path, optimizing for it may be the most impactful thing we can do. And if the best way to combat JavaScript is using more JavaScript, that's where we are.

I'm sure someone will point out server-driven architectures like LiveView or HTMX and those contain great approaches to reducing costs. They abstract some of the JavaScript from the developer to maintain a server-centric view. However, when you do want the interactivity in the client (for whatever reason, offline, etc...), when JavaScript is the only choice, well, JavaScript is the only choice.

That being said tooling for JavaScript has seen a move to Rust and Go (and Zig). There is a desire for more performance and ever more creative ways to leverage these to allow for an authoring experience that is all JavaScript.

---

## In Search of a Silver Bullet

![Image description](./9qkialsozstt4ns3v050.png)

Don't get me wrong. You can always just build an HTML site and put some JavaScript on it as needed. This whole motivation comes from a place of wanting to scale the development of a single app mentality. This isn't every project's concern.

But I did find it interesting that in my search I found that there is more than one way the problem is being approached for low-end devices and networks. I think for those used to fast networks with only the intermittent interruption of something like the subway, it's easy to think about how to optimize for some base case without changing the equation.

{% embed https://x.com/addyosmani/status/1222059231483846657 %}

Looking at how big international eCommerce like Amazon or eBay operates or services like Google Search handles things, are confirmations of that. Build small, build light, and smartly leverage the server to get the quickest initial loads and interactions. There are enough studies to show how that impacts revenue.

However, in China and some other regions where the internet isn't so consistent, they've adopted a completely different model. [Mini-Programs](https://seekingalpha.com/article/4389259-in-china-mini-programs-turning-super-apps-app-stores) which are a bit like PWAs that load into existing mobile apps as pluggable sub-apps. A sort of localized app store.

Instead of optimizing for initial page loads, they optimize on background data loading, to ensure the app can run as well as possible regardless of the network or device resources. Often bringing in more JavaScript to save future network requests is seen as extremely beneficial. What we have is a whole ecosystem of web applications in constrained environments not at all interested in leveraging the server.

If there is any takeaway, this isn't always so cut and dry. If there were a way to bridge the gap here it is probably still more use of JavaScript today.

---

## Conclusion

This topic asks a lot of questions of us. Should JavaScript continue to eat into the backend? Are there better ways we can leverage other languages and platforms with JavaScript? Should we even be chasing after that unified vision of the web?

Or maybe the question we should all be asking is how did we let such a monopoly happen?

While you have infinite choices in how you build your websites and applications, JavaScript has a substantial leg up. So much so, that it is probably the best way to actually ship less of it to your customers. And to me, that's kind of crazy.
