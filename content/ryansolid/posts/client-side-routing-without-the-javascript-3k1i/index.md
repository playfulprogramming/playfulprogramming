---
{
title: "Client-side Routing without the JavaScript",
published: "2022-11-07T16:17:37Z",
edited: "2022-11-22T19:07:43Z",
tags: ["javascript", "solidjs", "webdev", "performance"],
description: "It's been a while since I wrote a piece about a SolidJS technology innovation. It's been two years...",
originalLink: "https://dev.to/this-is-learning/client-side-routing-without-the-javascript-3k1i",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

It's been a while since I wrote a piece about a [SolidJS](https://www.solidjs.com) technology innovation. It's been two years now since we added Suspense on the server with Streaming SSR. And even longer to go back to when we first introduced Suspense for data fetching and concurrent rendering back in 2019.

While React had introduced these concepts, implementing them for a fine-grained reactive system was a whole other sort of beast. Requiring a little imagination and completely different solutions that avoided diffing.

And that is a similar feeling to the exploration we've been doing recently. Inspired equal parts from [React Server Components](https://reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html) and Island solutions like [Marko](https://markojs.com/) and [Astro](https://astro.build/), Solid has made it's first steps into [Partial Hydration](https://dev.to/this-is-learning/why-efficient-hydration-in-javascript-frameworks-is-so-challenging-1ca3). (*comparison at the bottom*)

---

## SolidStart

![Image description](./yp4mgz83hkkst75m5be6.jpeg)

Since releasing Solid 1.0 I've been kinda swamped. Between keeping open issues down and trying to check off more boxes for adoption I definitely have felt spread thin. Everything pointed to the need for a SSR meta-framework, an effort I started even before the 1.0 release.

The community stepped up to help. But ultimately, for getting the beta out the door I would become the blocker. And Nikhil Saraf, never one to sit still, having recently been introduced to [Fresh](https://fresh.deno.dev/) wanted to see if he couldn't just add Islands to SolidStart.

Wanting to keep things focused on a release, I agreed but told him to time-box it as I'd need his help the next day. The next day he showed me a demo where he did not only add Islands, recreating the Fresh experience, but he had added client-side routing.

---

## Accidental Islands

![Image description](./3xc5lnbxuu1qnwg6xvu9.jpeg)

Now the demo was rough, but it was impressive. He'd taken one of my Hackernews demos and re-implemented the recursive Islands. What are recursive Islands.. that's when you project Islands in Islands:

```js
function MyServerComponent(props) {
  return <>{ props.data && 
    <MyClientIsland>
      <MyServerComponent data={props.data.childData} />
    </MyClientIsland>
  }</>
}
```

Why would you want this? It would be nice to wrap server rendered content with interactivity without completely losing our low JavaScript for the whole subtree.

However, there is a rule with Islands that you cannot import and use Server only components in them. The reason is you don't want the client to be able to pass state to them. Why? Well if the client could pass state to them then they'd need to be able to update and since the idea is to not send this JavaScript to the browser this wouldn't work. Luckily `props.children` enforces this boundary pretty well. (Assuming you disallow passing render functions/render props across Island boundaries).

```js
function MyClientIsland() {
  const [state, setState] = createSignal();

  // can't pass props to the children
  return <div>{props.children}</div>
}
```

How was he able to make this demo in such short order? Well, it was by chance. Solid's hydration works off of matching hierarchical IDs to templates instantiated in the DOM. They look something like this:

```html
<div data-hk="0-0-1-0-2" />
```

Each template increments a count and each nested component adds another digit. This is essential for our single-pass hydration. After all JSX can be created in any order and Suspense boundaries resolved at any time.

But at a given depth all ids will be assigned in the same order client or server.

```js
function Component() {
  const anotherDiv = <div data-hk="1" /> 
  return <div data-hk="2">{anotherDiv}</div>
}

// output
<div data-hk="2">
  <div data-hk="1" />
</div>
```

Additionally, I had added a `<NoHydration>` component to suppress these IDs so that we could skip hydrating assets like links and stylesheets in the head. Things that only ran on the server and didn't need to run in the browser.

And also unrelated, working on the Solid integration with Astro, I had added a mechanism to set a prefix for hydration roots to prevent the duplication of these IDs for unrelated islands.

It just never occurred to me that we could feed our own IDs in as the prefix. And since it would just append on the end we could hydrate a Server rendered Solid page starting at any point on the page. With `<NoHydration>` we could stop hydrating at any point to isolate the children as server-only.

---

## Hybrid Routing

![Image description](./xl6otfhzrza38udsto3k.png)

For all the benefits of Islands and Partial Hydration, to not ship all the JavaScript, you need to not require that code in the browser. The moment you need to client render pages you need all the code to render the next page.

While Technologies like [Turbo](https://turbo.hotwired.dev/) have been used to fetch and replace the HTML without fully reloading the page, people have noted this often felt clunky.

But we had an idea a while back that we could take our nested routing and only replace HTML partials. Back in March, Ryan Turnquist(co-creator of Solid Router) made [this demo](https://server-nested-routing-mk2.rturnq.workers.dev/). While not much of a visual demo it proved we could have this sort of functionality with only 1.3kb of JavaScript.

The trick was that through event delegation of click events we could trigger a client router without hydrating the page. From there we could use AJAX to request the next page and pass along the previous page and the server would know from the route definition exactly what nested parts of the page it needed to render. With the returned HTML the client-side router could swap in the content.

---

## Completing the Picture

The original demo was rough, but it showed a lot of promise. It was still had the double data problem for server-only content and this was something we needed to address in the core. So we added detection for when a Solid Resource was created under a server-only portion of the page. We knew that if what would trigger the data fetching could only happen on the server there was no need to serialize it all. Islands already serialized their props passed in.

We also took this opportunity to create a mechanism to pass reactive context through `hydrate` calls allowing Context to work in the browser between Islands seperated by server content.

With those in place, we were ready for the recursive Hackernews comments demo:

<iframe src="https://x.com/RyanCarniato/status/1578108737968971776"></iframe>

But there was one thing we were missing. Swapping HTML was all good for new navigations but what about when you need to refresh part of the page? You wouldn't want to lose client state, input focus etc... Nikhil managed a version that did that. But ultimately we ended up using [micromorph](https://github.com/natemoo-re/micromorph) a light DOM diff written by Nate Moore (of [Astro](https://astro.build/)).

And with that, we have ported the Taste movie app demo in its 13kb of JS glory. (Thanks to a gentle nudge from Addy Osmani, and the great work of Nikhil, David, and several members of the Solid community: dev-rb, Muhammad Zaki, Paolo Ricciuti, and others).

The search page especially shows off reloading without losing client state. As you type the input doesn't lose focus even though it needs to update that whole nested panel.

[Solid Movies Demo](https://solid-movies.app/)
And on [Github](https://github.com/solidjs/solid-start/tree/movies/examples/movies)

Just to give you an idea of how absurdly small this is. This is the total JavaScript navigating between two movie listings pages, then navigating into a movie in various frameworks with client-side routing from https://tastejs.com/movies/.

| Framework                 | Demo                                  | Size   |
| ------------------------- | ------------------------------------- | ------ |
| Next                      | https://next-movies-zeta.vercel.app/  | 190kb  |
| Nuxt                      | https://movies.nuxt.space/            | 90.8kb |
| Angular                   | https://angular-movies-a12d3.web.app/ | 121kb  |
| SvelteKit                 | https://sveltekit-movies.netlify.app/ | 34.8kb |
| Lit                       | https://lit-movies.netlify.app/       | 108kb  |
| SolidStart (experimental) | https://solid-movies.app              | 13.2kb |

> **Note**: Only the Solid demo is using server rendered partials so it is a bit of an unequal comparison. But the point is to emphasize the difference in size. Other frameworks are working on similar solutions, things like RSCs in [Next](https://nextjs.org/) and Containers in [Qwik](https://qwik.builder.io/), but these are the demos that are available today.

> [Qwik demo](https://qwik-city-movies-wm.netlify.app/) was originally part of this but they changed from client navigation(SPA) to server(MPA) which makes it unsuitable for this comparison.

---

## Conclusion

The more apps we build this way, the more excited I am about the technology. It feels like a Single Page App in every way yet it's considerably smaller. Honestly, I surprise myself every time I open the network tab.

We're still working on moving this out of experimental and solidifying the APIs. And there is more room to optimize on the server rendering side, but we think there are all the makings of a new sort of architecture here. And that's pretty cool.

Follow our progress on this feature [here](https://github.com/solidjs/solid-start/issues/400).
