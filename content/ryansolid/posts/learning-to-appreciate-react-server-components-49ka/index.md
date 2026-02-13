---
{
title: "Learning to Appreciate React Server Components",
published: "2021-03-31T17:46:07Z",
edited: "2021-06-02T19:13:03Z",
tags: ["react", "javascript", "webdev", "marko"],
description: "This is my personal journey, so if you are here hoping for the general \"How To\" guide you won't find...",
originalLink: "https://https://dev.to/playfulprogramming/learning-to-appreciate-react-server-components-49ka",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

This is my personal journey, so if you are here hoping for the general "How To" guide you won't find it here. Instead, if you are interested in how I, a JavaScript Framework author, struggled to see obvious things right in front of me, you're in the right place. I literally had both pieces in front of me and was just not connecting the dots.

It isn't lost on me I'm talking about a yet-to-be-released feature like it is some long journey, but for me it is. If you aren't familiar with [React Server Components](https://reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html) this article will make no sense. You see we are on the cusp of a very exciting time in JavaScript frameworks that have been in the making for years and we are so close you can almost taste it.

# In the beginning there was Marko

Now you're probably thinking isn't this an article about React Server components. Shhh... patience. We're getting there.

You see I work 12 hours a day. 8 hours of that is my professional job where I am a developer on the [Marko](https://markojs.com/) core team at eBay. Then after some much-needed time with my family, my second job starts where I am core maintainer of the under-the-radar hot new reactive framework [Solid](https://github.com/ryansolid/solid).

Marko is arguably the best on-demand JavaScript server rendering framework solution to date from a technical perspective. I'd argue not even close but maybe that's a bit biased. But the benchmarks so declare and the technology is something that every library envies(yes even React, but we will get to that).

If you aren't familiar with Marko it's a compiled JavaScript framework like Svelte that started development in 2012 and reached 1.0 in 2014. And what a 1.0 that was, considering it shipped with progressive(streaming) server rendering and only shipping JavaScript to the client needed for interactivity(evolved into Partial Hydration). Two of the most coveted features for a JavaScript framework in 2021.

But it makes sense. Marko was made as a real solution for eBay at scale from the start. It was aggressively pursued and within a couple of years had taken over the majority of the website. It replaced the Java that was there as a full-stack solution from the start. React's path to adoption at Facebook was much more incremental.

Now Marko had come up with quite an interesting system for Progressive Rendering in 2014. While really just an example of using the platform, it was oddly missing from modern frameworks. As Patrick, the author of Marko describes in [Async Fragments: Rediscovering Progressive HTML Rendering with Marko](https://tech.ebayinc.com/engineering/async-fragments-rediscovering-progressive-html-rendering-with-marko/)

> Instead of waiting for an async fragment to finish, a placeholder HTML element with an assigned id is written to the output stream. Out-of-order async fragments are rendered before the ending `<body>` tag in the order that they complete. Each out-of-order async fragment is rendered into a hidden `<div>` element. Immediately after the out-of-order fragment, a `<script>` block is rendered to replace the placeholder DOM node with the DOM nodes of the corresponding out-of-order fragment. When all of the out-of-order async fragments complete, the remaining HTML (e.g. `</body></html>`) will be flushed and the response ended.

Automatic placeholders and insertions all part of the streamed markup (outside of the library code) is super powerful. When combined with Marko's Partial Hydration it meant in some cases there was no additional hydration after this point as the only dynamic part of the page was the data loading. This all delivered in a high-performance non-blocking way.

# Render-as-you-Fetch

I had never heard of it referred to this before reading React's [Suspense for Data Fetching](https://reactjs.org/docs/concurrent-mode-suspense.html#approach-3-render-as-you-fetch-using-suspense) docs but you better believe I'd hit this scenario before.

You don't need Suspense to do this. You just have the fetch set the state and render what you can which is usually some loading state. Generally, the parent would own the data-loading and the loading state and coordinate the view of the page.

GraphQL took things further with the ability to co-locate fragments with your components. In a sense, you are still giving control of data fetching higher up the tree to allow for orchestration, but the components and pages could still set the data requirements. However, we have a problem here still when code-splitting enters the picture. You end up waiting for the code to fetch before making data requests when navigating.

Facebook had solved this with [Relay](https://relay.dev/) which with strict structure and tooling could properly parallelize the code and data fetching. But you can't expect everyone to use that solution.

The problem is by simple JavaScript means you can't split a module. You can treeshake unused code. You can lazy import a whole module. But you can't only include the code you want at different times. Some bundlers are looking into the possibility of doing this automatically, but this isn't something we have today. (Although it is possible to use virtual modules and some bundler sorcery to achieve this)

So the simple solution was to do the split yourself. The easiest answer is not lazy load the routes but to make a HOC wrapper for each. Assuming there is a Suspense boundary about the router you might do this.

```jsx
import { lazy } from "react";
const HomePage = lazy(() => import("./homepage"));

function HomePageData(props) {
  const [data, setData] = useState()
  useEffect(() => /* ... load the data and set the state */)
  return <HomePage data={data}  />
}
```

I used this approach relentlessly in my Solid demos to have the quickest loading times. At some point last summer I decided that this was mostly boilerplate. If I was going to make a file-based routing system for our new starter similar to Next.js I wanted this solved. The solution was to build a data component route into the router.

One simply writes their components in pairs. `homepage.js` and `homepage.data.js` and if the second is present the library will automatically wire this up and handle all the code splitting and parallel fetching for you even on nested routes. Instead of wrapping the child, the data component would return the data.

From server vs client perspective the library providing a constant `isServer` variable would allow any bundler to dead code eliminate the server only code from the client. I could make data components use SQL queries on the server, and API calls for the client seamlessly.

# React Server Components

On December 21st 2020, [React Server Components](https://reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html) were previewed. And I just didn't see them coming. I was blindsided in that the main things they were trying to solve already had a solution. Suspense on the server was completely doable and so was parallelized data fetching around code splitting.

Being able to identify which components didn't need to be in the client bundle was nice but manual. It was something Marko had been able to auto-detect with its compiler for years, and if we are talking interactive SPA I just wasn't seeing it. Especially if it increased React's code size by more than 2 Preacts(standard unit of JS framework size measurement). Anything being done here could easily be done with an API. And if you were going to be designing a modern system that supports web and mobile why wouldn't you have an API?

# Something Unexpected

Adam Rackis was lamenting React's handling of communication around Concurrent Mode and it spawned a discussion around seeing React's vision.

<iframe src="https://x.com/AdamRackis/status/1375558675675418630"></iframe>

Eventually, Dan Abramov, the gentleman he is, decided to respond (on the weekend no less) in a less volatile forum in a [Github issue](https://github.com/facebook/react/issues/13206#issuecomment-808902135) addressing where things are at.

This stood out to me:

> For example, we didn't plan Suspense at all in the beginning. Suspense came out of a streaming server renderer exploration.

Suspense was the first of the modern features announced back in early 2018, as the technique for lazy loading components. What?! This wasn't even its original intention.

Suspense for Streaming SSR makes a ton of sense if you think about it. Server-side Suspense sounds a whole lot like Patrick's take on Out-of-Order progressive rendering in Marko.

As consumers of a product we tend to take in each new piece of information in the context of the order we receive it. But have we been deceived? Has React actually been working on the features backwards?

I can tell you as a framework author establishing stateful primitives seems like it should be the first step, but Hooks didn't show up until late 2018. It seems Hooks were not the starting point but the result of starting at the goal and walking back to the possible solution.

It is pretty clear when you put this all in the context of the Facebook rewrite, the team had decided that the future was hybrid and that something like Server Components was the end game way back as far 2017 or possibly earlier.

# New Eyes

Understanding that all the other pieces started falling into place. What I had seen as a progression was actually like watching segments of a movie playing in reverse.

Admittedly I had suspected as much but it suggested that they had worked through a lot of these render-as-you-fetch on the server scenarios much earlier. One has to assume they had gotten to a similar place to my data components at some point.

I also happened to be playing with Svelte Kit this week and noticed their [Endpoints](https://kit.svelte.dev/docs#routing-endpoints) feature. These give an easy single file way to create APIs that mirror the file path by making `.js` files. I looked at them and realized the basic example with `get` was basically the same as my `.data.js` components.

So what does it take for the file-system-based routing to notice `.server.js` files and preserve them as data components on the server as well as convert them into API endpoints, and auto-generate a call to that API endpoint as the data component for the client? With [Vite](https://vitejs.dev/guide/features.html#glob-import) less than you might think.

The result: you have code that always executing on the server. Even after the initial render. Yet is just part of your component hierarchy. A virtual return of "the monolith" in a single isomorphic experience.

It really doesn't take much more to put together what would happen if the data was encoded JSX(or HTML) instead of JSON data. The client receiving this data is already wrapped in a Suspense boundary. If you could stream the view into those Suspense boundaries the same way as on the initial render it would close the loop.

# Closing Thoughts

So the evolution of the idea is actually a pretty natural one. The fact that many platforms are API-based and don't need "the monolith" is beside the point. Server Components are really the extension of the ideas around parallelized data loading and code splitting we've already seen in Facebook's Relay.

Am going out now looking at how to implement them everywhere? Probably not. Marko has shown there are other paths to Partial Hydration and aggressive code elimination. I'm going to continue to explore data components before looking at the rendering aspect. But at least I feel I better understand how we got here.
