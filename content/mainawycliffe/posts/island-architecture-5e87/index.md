---
{
title: "Island Architecture",
published: "2022-04-20T19:22:08Z",
edited: "2022-04-21T04:20:41Z",
tags: ["webdev", "javascript", "performance", "typescript"],
description: "There are different ways to build a website. One of them was Multi-Page Applications (MPAs) which...",
originalLink: "https://mainawycliffe.dev/blog/island-architecture/",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

There are different ways to build a website. One of them was Multi-Page Applications (MPAs) which went out of fashion about a decade ago and are having a comeback. MPAs had been replaced by the Single Page Applications (SPAs) approach popularized by Angular and React, among other modern frameworks.

Due to how trends work, it is easy for methods/tools to go out of fashion. This is not because it is less effective but because developers stop using them in favor of something else. This is what happened with Multi-Page Applications (MPAs), as developers started adopting popular web frameworks such as Angular, React, Vue, etc. This led to an uptick in SPA usage as the frameworks became more popular.

Due to how SPAs work, the impact has been that the amount of Javascript we ship to the browser has increased. i.e., you can't have a react web app without React to manage state and rendering. SPAs use Javascript to render the HTML to be displayed in the browser. In many cases, this makes sense, for instance, in web apps such as Facebook or YouTube, where managing the state is paramount. But in other cases, this does not make sense, for example, blogs, personal portfolios, etc.

## Server-Side Rendering

When using a framework such as Angular or React and SPAs in general, the server does very little; all the rendering is done on the Client-Side, in what is known as Client-Side Rendering. To see the content, you first have to download the framework's runtime (JS needed to scaffold your web app) and also need an environment to render the content, i.e., the browser.

This has a few downsides, the notable ones being it's slow to show something on the screen, the impact of this is worse on low-end devices and slower internet connection and Search Engine Optimization - bots and crawlers are usually unable to render these pages and can't parse the content to show results.

We have two standard solutions to solve the above problems: Server-Side Rendering (SSR) and Rendering during build time - SSG. SSG is similar to SSR but at build time, removing the need to render on every request at the server. SSG is common for sites whose content isn't that dynamic. The problem with these two solutions is that they don't solve the problem with SPAs but rather postpone it.

If you want any sort of interactivity, say opening and closing the navbar on your web app, you will need to hydrate your rendered app from either SSG or SSR. This is the process of bootstrapping the framework you are using, transferring the state from the server so that the framework can take over. This usually happens after the first content is painted (after rendering the server-side rendered HTML from the server) but before the interactivity in your web app.

This means the JS needed by your framework has to be downloaded and parsed, and the user has to wait for all that to happen to interact with your web app. This would mean even on pages where you don't need interactivity, i.e., About Us Page, Terms and Conditions, etc., you still need to do all that, which is a bit unnecessary.

## Islands

And this is where Islands Architecture comes in. Imagine this; what if you could create your web app with pure HTML and CSS for all the static content but then add in regions of dynamic content or interactivities - islands - that can use a framework to add interactivity. These regions would use any framework, and the framework runtime would only be downloaded only when on a page that uses it rather than on the initial load of the website.

Web frameworks such as Astro ([My website](https://mainawycliffe.dev/) is built with Astro), Marko, and most recently Qwik, among others, are implementing this architecture method. In the case of Astro, you have Astro components that use some variation of JSX but do not have a client-side state, so there is no runtime.

### Astro

Astro uses the concept of JS opt-in, meaning by default, no Javascript is generated unless you tell Astro to include javascript. You can then either use Vanilla JS to include Javascript - the old fashioned way, as shown below:

```javascript
<script>
   document.getElementById("menuToggle").addEventListener("click", () => {
   const collapsibleMenu = document.getElementById("collapsibleMenu");
        collapsibleMenu.classList.toggle("navbar-menu-show");
        collapsibleMenu.classList.toggle("navbar-menu-hidden");
      });
</script>
```

> Astro components cannot be hydrated as they are HTML only templating components and any Javascript needs to be included as indicated above or via a framework such as React, SolidJS, etc.

The second option is to bring your framework, for example, React, Preact, Lit, Svelte, Vue, etc., to create components that add regions of interactivity (islands) in your web app.

```astro
// index.astro file
---
import ReactComponent from "./ReactComponent"

---

<ReactComponent />
```

You are also in control of when the necessary region is hydrated. This is done via directives that instruct Astro when to perform hydration. For instance, you might want an island to be hydrated on load or only when it becomes visible. There are several directives to help you achieve this, which you can learn more about [here](https://docs.astro.build/en/core-concepts/component-hydration/).

```

// index.astro file
---
import ReactComponent from "./ReactComponent"

---

<ReactComponent client:visible />
```

### Marko and Qwik

While I am not an expert at either Marko.js or Qwik (the new kid in the block), I will link additional resources below if you are interested in learning more. Marko and Qwik take the concept of islands a little further when compared to Astro.

Marko is an MPA framework, and its Island architecture is a bit smarter in that it automatically decides to load JS needed for an Island, delaying it as far as possible, allowing for far more efficient islands. This is unlike the current Astro approach, which relies on the developer to tell Astro when to do hydration. Astro is still in the pre-release stage, and maybe this will change in the future.

Another key advantage Marko has over Astro is that Marko decides what is inside the Islands and what's not in it. This means components such as footers, headers, etc., that only display static content don't become islands, while forms and other rich components with dynamic content become islands that can be hydrated.

Qwik, on the other hand, takes this to a component level, breaking down how hydration is done so that it is done only when needed. This is achieved by aggressively breaking apart your website's JavaScript into multiple chunks, setting up global event listeners, and serializing points of interest directly into the HTML. For each distinct user interaction, Qwik has all it needs to load only the code required to perform the action and nothing more.

{% embed https://x.com/Steve8708/status/1516137857038966786 %}

In return, this leads to smaller chunks, which are faster to load, parse and load only what the user needs. This is known as [progressive hydration](https://www.builder.io/blog/why-progressive-hydration-is-harder-than-you-think?utm_source=twitter), which is out of scope for this article, and hopefully, I will write about it soon.

## Conclusion

This article looked at Islands Architecture, why they exist, and the frameworks currently applying them. In the next series of articles, I want to dig deeper into the frameworks mentioned above - Astro, Marko, and Qwik, plus other frameworks such as Svelte, Angular, and React and how they differ internally from each other.

## Resources

1. [Why Progressive Hydration is Harder than You Think](https://www.builder.io/blog/why-progressive-hydration-is-harder-than-you-think?utm_source=twitter)
2. [From Static to Interactive: Why Resumability is the Best Alternative to Hydration](https://www.builder.io/blog/from-static-to-interactive-why-resumability-is-the-best-alternative-to-hydration)
3. [JavaScript vs. JavaScript. Fight!](https://dev.to/this-is-learning/javascript-vs-javascript-fight-53fa)
4. [Why Efficient Hydration in JavaScript Frameworks is so Challenging](https://dev.to/this-is-learning/why-efficient-hydration-in-javascript-frameworks-is-so-challenging-1ca3)
5. [Resumable JavaScript with Qwik](https://dev.to/this-is-learning/resumable-javascript-with-qwik-2i29)
6. [Conquering JavaScript Hydration Event delegation is the key to not running over the component... Apr 15](https://dev.to/ryansolid/comment/1ni8p)
7. [State of JavaScript 2021: Framework Reflections](https://dev.to/ryansolid/state-of-javascript-2021-framework-reflections-2i77)
8. [A first look at Qwik - the HTML first framework WRITTEN BYMIŠKO HEVERY JULY 2, 2021](https://www.builder.io/blog/introducing-qwik-framework)
