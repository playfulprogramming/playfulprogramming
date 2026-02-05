---
{
title: "Understanding Transitional JavaScript Apps",
published: "2021-11-12T15:19:34Z",
edited: "2021-11-17T19:20:22Z",
tags: ["javascript", "webdev", "frameworks", "architecture"],
description: "Transitional JavaScript Apps? What? Well honestly I'm not sure I know completely myself. It is an...",
originalLink: "https://dev.to/this-is-learning/understanding-transitional-javascript-apps-27i2",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

Transitional JavaScript Apps? What? Well honestly I'm not sure I know completely myself. It is an umbrella term for the progress that has been happening in JavaScript frameworks the past few years to represent that things are changing. Single Pages as a technology have existed now for over 10 years and Single Page apps today are not the same as they were decade ago, or even 6 years ago. We've embraced server-side rendering and taking responsibility for the side effects of what abusing the technology looks like.

As usual this isn't a new idea, but sometimes it just takes someone to put a name on it, and who better than @richharris in his recent talk at JamStack conf:

<iframe src="https://www.youtube.com/watch?v=860d8usGC0o"></iframe>

Now as some of you know this has been an area of focus for me the last couple years both with [Marko](https://markojs.com/) and even to some degree with [Solid](https://solidjs.com/). In fact it's kind of been on everyone's mind:

<iframe src="https://x.com/dan_abramov/status/1259614150386425858"></iframe>

I've written countless articles about the technologies around these topics but maybe it's time to step back and really appreciate what this means for the average web developer.

---

## Death of Single Page Apps?

Well not exactly. Every time you touch this topic some Rails developer jumps out of the back of the crowd to tell us DHH had this all figured out in 2005. And honestly, that developer would probably wish we spent our time building time machines rather than move the web forward. But that's not why we are here.

No. Server rendering has been part of the equation for frontend JavaScript frameworks for years now. What has changed? Why are these suddenly transitional? Well very little from a technology perspective. It boils down to the fact that in many ways Single Page Apps have set poor expectations for the frontend ecosystem. We built them originally to mimic the behavior of mobile applications, but in reality not all experiences need to be that way. But like any tooling with great Developer Experience people naturally want to use it everywhere.

The problem is this directs people to pull in tons of JavaScript and often to replace functionality that might already be present natively in the browser. And it isn't just people not selecting lean enough libraries. It's architectural. The new hot library like Svelte or Solid doesn't change the equation on its own. Yes I'm author of Solid and I'm saying this without reservation. They are huge improvements and have been able to learn from the lessons of the past but their pedigree is inherent.

Server Side rendering in itself never did anything to reduce the JavaScript bloat. If anything it only adds to it as the code to hydrate tends to be larger than the code to render. We've found ways to statically generate pages, but the second we need JavaScript bam there is the whole bundle. Now for small sites and small framework like Svelte, Solid, or Preact I mean seriously who cares, but we aren't talking silver bullets.

We are more conscious now than in the past about accessibility and the importance of progressive enhancement, allowing for pages to work fine without any JavaScript present. But these are implementation considerations and not architectural. These are characteristics of being a good citizen of the web and our tools should support this.

---

## Lost in Translation

I've publically been a bit critical of the term Transitional Apps, mostly because while SPA frameworks are finding ways they can play nicer, there has been research and development going into actually solving the problem of sending too much JavaScript. And I don't mean resurrecting Rails. I mean full JavaScript frameworks designed for this use case. No need to juggle multiple apps or not be able to leverage the latest tooling.

<iframe src="https://x.com/dan_abramov/status/1259618524751958016"></iframe>

Dan is right on the money again. Right now on this front there are only a couple games in town. [React Server Components](https://reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html) might be a consideration once you are in the larger side of things. But React and related infrastructure is too large for what I'm driving at. Let's talk frameworks that can start from nearly 0kb of JavaScript and disappear your app:

[Marko](https://markojs.com/)

[Qwik](https://github.com/BuilderIO/qwik)

[Astro](https://astro.build/)

[iles](https://iles-docs.netlify.app/)

[Elder](https://github.com/Elderjs/elderjs)

[Slinkity](https://slinkity.dev)

These have one thing in common. They only send the JavaScript you need to the browser. They do so in different ways but if you want to live the promise of disappearing app here it is. And the reason? Because regardless of the authoring experience they don't view the application as a single top down system.

These solutions also have something else in common. They tend to be used as what is being referred to as Multi Page Apps(MPAs). Yes your next-gen static site generator(Next, Nuxt, Gatsby, SvelteKit, VuePress, VitePress, SolidStart) can generate multiple pages but it is not this. Your SPA framework still treats each page as part of the whole and still can't isolate the pieces. Before you say but what about \_\_\_\_? If the framework isn't in the list above and it was created before 2022, 99% chance it is not doing this.

Aren't MPAs bad? Surprisingly not really so much these days. There are a lot of technologies and the browsers themselves that make these experiences quite nice. Sure there are certain things you can only do when you can preserve the browser state through navigation but for many things they are kind of great. See @swyx' [Svelte for Sites, React for Apps](https://dev.to/swyx/svelte-for-sites-react-for-apps-2o8h). This article is actually more a case for Elder than Svelte and it applies to all frameworks above.

The problem is this conversation is still being had between SPA enthusiasts and, our stranded in time, classic MPA proponents missing the fact that the world has moved on from this argument. MPAs are not old fashioned anymore. If anything JavaScript MPAs are as cutting edge as it gets. But they aren't your grandfather's MPAs.

And here's the thing. This is a distinction so technical in nature that authors of these MPA JavaScript frameworks are struggling to tell the story in a way their value can be understood by an ecosystem flooded with SPAs. The last thing they want to be associated with is SPAs. I've received criticism for misinterpreting Rich Harris' intent and for being divisive rather than inclusive. But is something inclusive when some of the many of defining parties don't want to be included?

<iframe src="https://x.com/mhevery/status/1458882912779046912"></iframe>
<iframe src="https://x.com/matthewcp/status/1458899129292234756"></iframe>
<iframe src="https://x.com/dylan_piercey/status/1449031353220009992"></iframe>

Now there is no ill intent here. We're all fighting different battles. Rich is rallying the troops to fend off the would-be time travelers. I'm just standing up for the little guy. Maybe this is a technical distinction that doesn't mean anything. But it does to some of us.

> Rich is doing a great service to the community on a whole to bring awareness. He didn't need to include or even mention these other tools yet he did because he believes in where things are going. This response is only concerned with preserving identity and allowing these frameworks to find their voice.

---

## Long Live ~~SPAs~~ Transitional Apps

Didn't I just say SPAs are dead, and MPAs are the future. Not quite. Dan Abramov had it right when he said the future is hybrid. Hell, Rich had it right when he suggested in an ideal future there is no need for MPAs.

<iframe src="https://x.com/Rich_Harris/status/1433438931555688448"></iframe>

It's just that future is not something that is here yet. There are currently unreconciled downsides alongside the numerous benefits. Which is why I dislike the term Transitional Apps now because it jumps the gun a bit. When we have truly Transitional Apps it'd be cool to market them as such. But I didn't coin the term so that isn't my call.

I want to take moment to talk about [Qwik](https://github.com/BuilderIO/qwik) again (and this is also relevant to the next version of [Marko](https://markojs.com/)). These frameworks support automatic independent hydration without manual islands, and hydrating children before for their parent. They can deliver experiences with all the benefits of Multi-Page apps and scale to Single page experiences seamlessly.

That is a *Transitional App* in my view. An application that literally can transition from a minimal page to an interactive client navigated experience on demand. This is a unique challenge with a whole slew of new tradeoffs. You don't get to pick up an existing framework and just do this. Maybe this deserves a new term. Then next year we can debate the merits of *Transitional Apps* vs *Transformative Apps*. Is that the better outcome?

Now there is nothing wrong with any of this inherently so far as that any of these can't be the right solution. You have many options. This really should start from your requirements of what you are building rather than building what your favorite tool enables you to do. When did JavaScript frameworks become the Highlander?

![There can be only one](./kp7hxc9dx5x9jpwjpmh0.png)

I might generally be pessimistic about framework agnostic endeavors but I'm all for celebrating our differences. Each framework is different and that's a good thing.
