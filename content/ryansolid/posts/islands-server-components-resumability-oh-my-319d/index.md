---
{
title: "Islands & Server Components & Resumability, Oh My!",
published: "2023-09-14T07:01:00Z",
edited: "2023-09-14T06:56:08Z",
tags: ["javascript", "webdev", "performance", "frameworks"],
description: "It is no secret that the past 2 years have seen the beginnings of a fairly dramatic change in...",
originalLink: "https://dev.to/this-is-learning/islands-server-components-resumability-oh-my-319d",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

It is no secret that the past 2 years have seen the beginnings of a fairly dramatic change in frontend web technology. I write about these topics regularly. But as they enter the more mainstream vernacular I've found it has become more and more difficult to understand what these technologies are and differentiate when they are useful.

At the heart of the discussion is the topic of Hydration. The process in which a server-rendered website becomes interactive to the user in the browser. But even that is something that holds a somewhat vague understanding. What is it for an application to become interactive?

And Hydration is more significant than the amount of JavaScript we ship or execute. It impacts what data we need to serialize and send to the browser. This is an area that is not simple to build solutions for, and it is little surprise explaining them is equally challenging.

{% link https://dev.to/this-is-learning/why-efficient-hydration-in-javascript-frameworks-is-so-challenging-1ca3 %}

Now that more solutions have shipped I think it is time to revisit the 3 most promising approaches to this space.

----------------

## When does a Site become Interactive?

![INP Graphic](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/oru6oigox10kssmlf4d4.jpeg)

But first I think we need to start here. For such a seemingly simple question the answer isn't so straightforward. There is a reason performance experts in the browser, like the Chrome team, have gone through several iterations on how to best capture this. TTI (Time to Interactive), FID (First Input Delay), and now INP (Input to Next Paint) can also serve as a way to understand how responsive our websites are.

Looking at framework space there has been a lot of talk about Progressive Enhancement. I.e... having elements work if the JavaScript is not available (or available yet). Is a site considered interactive if clicking a button works in the sense it does a slower full-page navigation(server round trip) where it otherwise would have done stuff in the browser only?

How about if events are captured and then replayed during hydration or even used to prioritize what gets hydrated first as in the case of React 18's Selective Hydration? If the browser doesn't miss any end-user events but just doesn't respond right away because it is loading code, is that considered interactive?

The fact that these sorts of techniques are everywhere at this point is why at least to me being interactive can't only include the ability to catch the cause, but also the time it takes to witness the expected effect. How to measure that reasonably I will leave it to the browser teams, but that should give us goalposts for our exploration.

----------------

## Islands

![Islands](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4lteo95ma15ugimwn9pj.jpg)

The thing to love about Islands is they start so simple. If you have too much JavaScript, divide and conquer. The earliest days of client-side rendering involved embedding interactive widgets in server-rendered applications. Even things like Web Components have made this pretty easy to do over the years. 

Well, except for one problem. These widgets were client-rendered so they came from the server blank. This could cause layout shifts and a delay in primary content showing. Islands in the basic form is just server rendering these pieces as well.

Simple, but it meant JavaScript on the server to render which is why outside of Marko(2014), we did not see much exploration here until the more common SPA (Single Page App) server rendered had proven JavaScript full-stack was viable. Not until 2021 with frameworks like Astro, and Fresh did we see a return to this.

There are some significant differences between Islands and its SPA counterparts (like Next, Nuxt, SvelteKit, and Remix). These Islands frameworks skip sending JavaScript for the root of the application. It isn't until you hit an interactive component that JavaScript is needed. This can drastically shrink bundle sizes.


| Page | Full Page | Islands | Reduction |
|---|---|---|---|
| Home | 439kb | 72kb | 84% |
| Search | 504kb | 110kb | 72% |
| View Item | 532kb | 211kb | 60% |

> Comparison done by Marko team on eBay.com

Islands can also shrink HTML document size as they only need to serialize the data passed as Island props instead of all the data. That blob of JSON in a script tag we are accustomed to seeing at the bottom of the server-rendered HTML can disappear when we use Islands! On data-heavy pages, I've seen it cut the page size in half.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/zyjkr8xcdh3fdelh9c1b.png)

> Hackernews story page done in SolidStart with SPA SSR and Islands

How is that possible? Server-rendered children can be passed through the Islands without being hydrated themselves.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/wa0407e1o39f85jbpabf.png)

In the case above, where no state is passed to our ToggleVisibleIsland, those comments never need to be sent to the client.

It does mean though that any content passed through will be rendered eagerly even if it isn't shown ultimately at the opportunity that Island logic could display it later. So we only solve the "double data" problem if this content is only rendered once whether it be in the DOM or as a serialized prop/slot. Not both.

The most important difference is Island architected applications are MPAs(Multi-Page Apps). The optimization is based on knowing that the code for non-interactive parts is never needed in the browser. Never rendered in the client. This is something a SPA router could never guarantee.

------------------

## Server Components

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ydl3k8yveg99avf1n06j.png)

But what if we do want client routing? How much does that change the picture?

Adding client routing with server-rendered HTML doesn't change much on the surface. Solutions like Turbo or Flamethrower have been adding that for a bit of smoothness to MPAs. We've recently seen combining these sorts of techniques with the View Transition API to great effect.

But an MPA with client-side routing doesn't suddenly give you all the benefits of a SPA. Most notably in element and state persistence. On the surface, this might also seem straightforward but it is not.

The first thing you might do is mark elements as being persistent. And then when you swap your new markup replace the existing elements back in where an ID matches. But since the elements are temporarily removed this can lose DOM state like input focus when persisting. You could diff it and in so only replace what has changed and that might be sufficient.

Another consideration is global state in the client. Pretend you have a global counter that impacts how certain Islands render. If you load one page and increment it to 10. Then on navigation render the next page on the server, it will not know that the counter is 10 and render it as if it were 0. This could lead to hydration mismatches and break the application.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/io9fucz2at6eivue0149.png)

Unless you desire to send back all the global state back and forth between requests(and you really really don't), we can't ever render Islands on the server after the first-page load if we want to ensure things won't break when global state is involved.

This detail isn't important just for navigation. But any lazily inserted content prop/slot can no longer ensure hydration will work if global state has changed since it was originally server-rendered. This adds complexity to the logic for absorbing rendered templates that ensure double data doesn't happen as the Islands and static templates need to be separated at runtime.

Instead of wrestling with that, React Server Components invented their own serialization format and didn't bother solving the "double data" problem. Although it is the only non-experimental solution I know today that properly handles state persistence.

So Server Component architecture can be seen as Islands + Client Routing, but it involves more than tagging a client router or even View Transitions on an MPA. And in so deserves its own category when looking at how we build partially hydrated solutions.

--------------

## Resumability

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/n5e5rfc9dgrmti8h9yhg.gif)

I love resumability because it does come out of left field compared to a lot of the other research that has been going on over the past decade. Instead of looking at how to reduce the amount of code/hydration, it looks at changing what code executes.

Partially Hydrated solutions above in some cases can reduce code footprints up to 80-90% but it still treats that last bit very similar to everything we've seen before. What if we didn't execute any code on the client until we needed to? What if hydration returned to just attaching event handlers?

To do that we'd need to serialize not just the application state, but the internal state of the framework so that when any part is executed it could continue where it left off. When an event handler updates some state we just propagate that change without ever running the components the first time in the browser to initialize it. Afterall we already initialized it when we rendered on the server.

This is not easy to accomplish given the way we close over state when we write components, but it is solvable:
{% link https://dev.to/this-is-learning/resumability-wtf-2gcm %}

It also opens up more interesting patterns for lazy code loading since it doesn't need to be immediately present for hydration. However, if interactivity is as defined above, you don't want to be lazy loading anything critical because we still have to wait for it. Maybe just expensive things or things offscreen. In the basic case, a pretty similar heuristic to how you would choose to lazy load for any client-side architecture.

Of course, serializing everything could be pretty costly, not unlike the "double data" problem. So we would need a way to determine what can never change in the client. To do that resumable solutions tend to use Signals-based reactivity, often augmented by compilation. By tying updates to the data rather than the view hierarchy components no longer become the unit of code that is needed to run. And more so dead code can be tree-shaken along the reactive graph of data-dependencies.

Done well that seems pretty good. Once you enter this zone, it is easier to automate the split between client and server. But that alone doesn't solve problems like client-side routing.

Resumability's knowledge is still based on knowing what will always be on the server from an MPA standpoint. Unlike Islands that are explicit, with an automatic system any descendant of stateful conditional in the rendering has the potential to end up in the browser.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ocs5l99pizu0ontfct4v.png)

If one added client-side routing (a stateful decision high in the tree) a resumable solution on its own would load the same code on navigation as an SPA and require all the serialized data client side to render it.

-----------

## Conclusion

![All of the Above Minion](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/papk4dk0h5cr0p3x51av.png)

So I guess high level:

* Islands are an architecture that aims to reduce JavaScript footprint by up to ~90% by explicitly denoting what goes to the client.
* Server Components architecture extends Islands with client-side routing and proper state preservation.
* Resumability instead of focusing on how to reduce the amount that is hydrated, looks to instead remove the execution cost of hydration itself.

So while seen as competitive these are actually complementary. They don't all solve the same issue completely but focus on a certain part of the problem.

Islands have gotten incredibly optimal at solving for code and data serialization size. Server Component solutions today are the only Island-like solutions that properly account for state while client navigating. Resumability is the only approach that reduces the execution cost of the hydration that remains.

Whether these all converge is another question. Do Islands want the added complexity of Server Components? Will Server Components care about the last stage optimizations that come from Resumability? Will Resumable Solutions ever embrace explicitly calling out which parts of the view render in different locations?

I'm not sure. There is still a lot of room to explore. And honestly, it is still unclear to what extent these concerns impact final site performance or ideal developer experience. But it is an exciting time to be in web development as the future unfolds.