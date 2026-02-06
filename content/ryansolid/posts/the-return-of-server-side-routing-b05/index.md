---
{
title: "The Return of Server Side Routing",
published: "2022-01-26T00:33:23Z",
edited: "2022-02-01T20:16:51Z",
tags: ["javascript", "webdev", "webperf", "programming"],
description: "Return? It never went away. Or at least that is what some smug \"told you so\" is going to say. But for...",
originalLink: "https://dev.to/this-is-learning/the-return-of-server-side-routing-b05",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

Return? It never went away. Or at least that is what some smug "told you so" is going to say. But for those who haven't been living under a rock for the past decade, for better or for worse much of the web has been moving to client-side navigation on their sites.

This movement has been fueled by the adoption of tools that support this sort of architecture. The "modern" JavaScript framework is designed to build applications. Single Page Applications. A name originated from the fact that it does not go back to a backend server to navigate between pages. All routing happens in the browser.

It started with web applications but React, Angular, Vue, and co.. have permeated every industry and every type of web experience imaginable from the grandiose scale of the most successful technology companies to the "Hello, I'm Jane" page made by a high school student creating a portfolio for her college acceptance. Local business to eCommerce giant, government agencies, news sites, and everything in between we've seen a steady migration.

But like all things, there is potential for too much of a good thing. JavaScript has blown open the ceiling of what can achieve in a web experience, but it comes with a cost. A cost paid most dearly by those without the best devices or the fastest networks but also felt by anyone when things don't go according to plan.

And it is something that those who see themselves as stewards of the web are very concerned with. On both sides of the discussion. By this point, it should be clear that it may be difficult to achieve a one size fits all solution, but there are definite improvements to be made.

The common thread is to send less JavaScript to the browser seen most recently championed by [0kb of JS frameworks](https://dev.to/this-is-learning/is-0kb-of-javascript-in-your-future-48og). But I want to expand on this as the repercussions are about more than progressive enhancement or lazy hydration. Everything is converging on architectural change that we have not seen the likes of since when SPAs came on the scenes over a decade ago.

We're putting routing back on the server.

---

# Multi-Page Apps (MPA)

![Image description](./7ghks1yqteok6bvj3oov.jpeg)

So we're back to PHP and Rails? No. I hope that doesn't disappoint anyone. Every time around we aren't the same as we were the last time. But it isn't a terrible starting point. The majority of the web never needed to be more than just a site that renders some HTML. And most JavaScript frameworks let you generate a static site, or maybe at least some static pages within your Single Page App to keep low interaction pages quick and light.

But we've been there and we know that for all the [AlpineJS](https://alpinejs.dev/)', [Stimulus](https://stimulus.hotwired.dev/)', and [Petite Vue](https://github.com/vuejs/petite-vue)'s, we've become accustomed to the Developer Experience perks of our favorite frameworks, and authoring a second app on top of the first is far from desirable. But for most solutions, it is all or nothing. Include the `<script>` tag or not. Beyond the simplest of requirements, this is a parlor trick rather than an experience.

Instead, we've seen a huge growth in the space of what we used to call widgets back in the early 2010s but now refer to as Islands. These independent islands are a bit more capable though as they can be server-rendered and hydrated with the latest tooling such as [Astro](https://astro.build/), [Slinkity](https://slinkity.dev/), and [Iles](https://iles-docs.netlify.app/). This is a coarser-grained approach that does well for many sites but we've seen more sophisticated tools in this space designed from the ground up with this in mind like [Marko](https://markojs.com/) or [Qwik](https://github.com/BuilderIO/qwik) employed on the largest of eCommerce solutions.

But regardless of how it's done when you navigate on the server, you can know certain parts of your page never will be rendered in the client. You can reduce the JavaScript sent and executed dramatically. Mileage will vary but even things like [eBay's landing page have been reported to show an 80-90% reduction](https://medium.com/@mlrawlings/maybe-you-dont-need-that-spa-f2c659bc7fec) in code size from this technique.

Still, this isn't the end of the story because while full server reloads work well for many sites, we've become accustomed to the benefits of being able to preserve client state in SPAs and to do smoother transitions.

---

# HTML Frames

I haven't found a name for this but it is used by a few tools, most notably [Turbo](https://github.com/hotwired/turbo-rails) as part of the Hotwire framework for Rails. But the approach is applicable elsewhere. Essentially intercept all link clicks or form submissions and disable the default behavior, then request the new location of the screen and replace the contents of the `<body>` when it completes.

We can have our MPA, have the server handle the route but navigate in the browser preserving our JavaScript app state. As each panel loads in we hydrate it and since we know it can only be rendered on the server all the same optimizations above apply.

However, now we need JavaScript to orchestrate this sort of transition. Not a lot of JavaScript. Many MPA frameworks load a small boot-loader anyway if they support lazy hydration but in the pure MPA, it is possible to not need any runtime.

While less heavy this approach still isn't SPA smooth. Loading HTML from the server and replacing what was there might persist app state but nothing in the DOM. No focus, animations, player position on a video tag, etc... This brings us to the next thing.

---

# Server Components

![Image description](./75lw1sjfgp9mvtg842va.png)

Is the answer coming from [React](https://reactjs.org/) of all places? [React Server Components](https://reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html) are very restrictive in a way that is almost identical to how islands work. You can't nest Server Components(the "static part") in Client Components(the "islands") except through passing as children.

In practice, this means Server Components are like MPAs, except you can go back to the server to "re-render" the static part of the page as a VDOM and have the browser receive that and diff the changes. Even though client components are preserved and parts of the static HTML that never change are not replaced, we are essentially talking about a routing paradigm.

When you click a link it is intercepted and the server component endpoint handles the request, returning the new VDOM to be diffed. When you perform a mutation that would update data on the page, the full page is re-rendered on the server and the new VDOM representation is sent back. It is a lot like a classic form post you'd do with an MPA.

The tradeoff. Well, that's a lot of data to send along the wire every server re-render but in comparison to an MPA, it isn't really. This also needs much more orchestration than the other methods. You need a framework in the browser. So this approach won't necessarily get you the fastest page loads. But it has the same capacity to eliminate huge percentages of component code sent to the browser unnecessarily.

---

# Analysis

These are 3 distinct solutions. It isn't just like one supplants the other. A pure MPA has the potential for the best page load performance. HTML frames are the most optimal of the 3 for navigating to new locations. Only Server Components have the potential to be indistinguishable from the Single Page App experience we have today. But all 3 approaches share the same model for how navigation should work. It is full-page and it is from the server.

It isn't just this pushing us this way. Consider frameworks like [Remix](https://remix.run/) or Sveltekit that promote Progressive Enhancement. This naturally has you fallback to doing form post-backs and full-page navigations.

Next, consider things like [React Query](https://react-query.tanstack.com/). It has become more and more common to refetch all the related resources than perform direct cache updates on mutation. [Remix](https://remix.run/)'s optimistic updating forms are another example of this. They use the route structure to refresh all the data on mutation.

In essence, instead of trying to bring a bunch of expensive caching logic to the browser, you take a refetch first mentality. And compared to reloading the whole page for rendering it isn't that bad. The benefit is ensuring consistency of page data without a bunch of extra client code. Have you seen the size of the leading GraphQL clients? [About 40kb gzipped](https://bundlephobia.com/package/@apollo/client@3.5.8). Simply putting that and React on the same page gets you over the size budget of any performance-critical site before you write a line of code.

This progression all points to the same thing. We're heading back to routing on the server.

---

# Conclusion

Given this, I have some thoughts for the future. The way I think this plays out is that MPAs as a technology stay as they are and continue to improve their ability to do better partial hydration, smarter lazy loading, more dynamic delivery (streaming).

I think pure HTML Frames are an intermediate step. As new approaches come out for Server Components, especially non-VDOM ones, we will see them get absorbed. The ideal approach is to have Server Components be able to both provide the ability for fine-grained updates and be able to send HTML for newly rendered things. HTML rendering is going to be faster for initial page load or any large navigation. Supporting hybrid/partial formats may be a thing.

Where this gets interesting though is when we can apply tricks that we've learned from SPAs to this. Nested routing especially comes to mind as each section is a logical top-level entry point that can update independently in many cases. Routing is the backbone of everything on the web.

Honestly, when we blur these lines a whole lot is possible still without building in a way that pushes everything into the browser. We can scale from simple full-page reloaded MPA to the most sophisticated apps. Maybe these are the #transitionalapps Rich Harris predicted. But as far as I'm concerned there is only one way to find out.

Let's get building.
