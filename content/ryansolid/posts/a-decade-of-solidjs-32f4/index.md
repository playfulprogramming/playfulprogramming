---
{
title: "A Decade of SolidJS",
published: "2025-04-24T18:48:10Z",
edited: "2025-04-25T06:46:30Z",
tags: ["javascript", "webdev", "solidjs", "devjournal"],
description: "As of today, it has been 7 years since I open-sourced SolidJS. It wasn't for noble reasons. I wasn't...",
originalLink: "https://dev.to/this-is-learning/a-decade-of-solidjs-32f4",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

As of today, it has been 7 years since I open-sourced SolidJS. It wasn't for noble reasons. I wasn't trying to show people the way. I wasn't trying to change the world. I just had one of those itches to scratch. It irked me some of the dialog I had seen online about fine-grained reactivity (not that anyone called it that back then). Something didn't sit right with me, and while I could have sat back in my armchair and continued being that old man shouting at the clouds, I decided I wanted to enter a benchmark to prove otherwise.

And thanks to that we have SolidJS today. Well, that and the next 7 years of mine and several other people's lives. But the story starts several years before that.

---

## Journey into Open Source

SolidJS wasn't my first Open Source project. I got my start under the guidance of the company ([Vidigami](https://vidigami.com/)) I worked for 13 years ago. They maintained and built their libraries out in the open and I admit I could have cared less. I was so comfortable with my workflow from years of working in .NET in Visual Studio that if code didn't have IntelliSense with direct links to documentation I found it tedious. And no. Back in 2012, Sublime Text Editor did not have that capability.

Pretty early on, my very patient boss (and creator of [Knockback](https://github.com/kmalakoff/knockback)) sat me down and was like, "You know Ryan, if you don't know how something works you can always just go into the modules and look at the source code." Obvious. I know. But suddenly a whole new world opened up to me. I had flashbacks to when I first learned to make websites in the late 90s by clicking View Source.

Still, I wasn't jumping to create PRs. I didn't feel any ownership until I was tasked with updating our application to use Web Components. And that is when I finally made open source work for me. I found libraries with the polyfills I needed. I made some of my own internally. And I used that experience to create my first libraries: `component-register` a way of authoring web components using functional composition instead of classes, and `webcomponent-router` a nested router that used light/shadow DOM projections.

---

## React's Monumental Rise

So skip forward a couple of years and it is Fall 2015. And I'd recently seen Ryan Florence's React Hype talk:

<iframe src="https://www.youtube.com/watch?v=z5e7kWSHWTg"></iframe>

I saw the stock ticker demo and I kept thinking, "Who sends the whole page of data over and over again from the server? React is super fast here, but you've already lost."

I had no idea how I was going to solve this with my beloved KnockoutJS. I knew it didn't matter but I couldn't let it go. I watched early React talks from Pete Hunt and the gang and I thought "How could this possibly be the best thing we can be doing?" And yet Knockout was a dead project and everywhere I looked people were flocking to React.

---

## Humble Beginnings

Over the summer of 2015, shortly after my daughter was born, I started playing with building the reactive library that would become SolidJS. I found myself up all hours of the night and my mind kept going back to this problem space. For the most part, it was something that I'd tinker with occasionally at the end of my work day, and it wasn't until the holidays I finally consolidated it.

It took another few months to finish up a basic renderer. I committed in a private BitBucket called "framework" and that was where SolidJS found its first home. Honestly, it looked a lot like Vue (with like "s-if" bindings) except like Knockout I used composable Signals instead of configuration objects. It also didn't have a VDOM. I used the same approach Knockout did fine-grained data-bindings.

I sought out every benchmark I could find. In some it was fast but in others (including Ryan's) it was slow, or complicated to write. I spent the next 2 years trying many approaches to understand what was performant and what was not. I refined APIs (including switching to JSX) until sometime in early 2018 when Solid reached a point where it outperformed all the popular solutions in every benchmark I could find. I was finally ready to officially submit it. To do that I needed to publish the library and I did so on April 24th, 2018.

And sure enough, SolidJS's initial version jumped straight to the front of the JS Framework Benchmark. Of course, I was politely told by the maintainers that I had cheated. So it took a few more tries to solve common problems generically. It took almost a year until [my birthday in 2019 for SolidJS to legitimately reach the front of the pack](https://ryansolid.medium.com/how-i-wrote-the-fastest-javascript-ui-framework-37525b42d6c9).

---

## Taking things Seriously

Now I probably would have just dropped it then and gone back to grumbling from my chair about the good old days of Knockout. But something happened between open-sourcing the project and reaching my goal. Dan Abramov came on stage October 26th, 2018 and unveiled Hooks to the world:

<iframe src="https://www.youtube.com/watch?v=dpw9EHDh2bM"></iframe>

I never thought React would promote composable primitives. It looked just like SolidJS. I had chosen JSX ultimately as our templating language for portability as it fit well with our function components. Solid Components are just functions that run once and have no internal state so unlike React, Classes never made any sense for us.

And here Dan was on stage showing something that looked almost identical. Now I had a new mission: show that this fine-grained model was capable of doing everything you could do with a VDOM, without one. I knew performance wasn't a barrier, so it was a question of whether the model was powerful enough. I may have started this journey inspired by Web Components, and nerd-sniped by a performance demo, but now I had something real to show.

So I implemented Suspense, Transitions, HMR, SSR, Hydration, and Streaming over the next 2 years. These problems were similar but required completely different solutions than those used for a VDOM. While we didn't invent any of these concepts no one had solved them in a Fine-Grained model.

---

## Spreading the Word

Admittedly, I had done zero marketing. I had written some technical blog posts but I did not know how to market the project. I hadn't even joined any social media platforms since Facebook which I had stop using back in 2008. So when I joined Twitter December 2019 I had no idea what I was getting into.

I tried to engage people on Twitter and realized very quickly people had no idea what I was saying. They treated me like I was crazy. It was like they'd fact-check me, pulling in the experts. I tried to put ideas out to other framework authors and was mostly shot down immediately. There were a few exceptions, like Dominic Gannaway (creator of Inferno) but it was clear to me every solution was quite content with the space they had carved out for themselves. And more so Solid threatened that.

It wasn't with the React folks that I felt the hostility from as much as the smaller libraries. They contended that what they could do wasn't possible with JSX and there was a clear decision you needed to make between DX experiences. React had educated the ecosystem in a certain way and all the others re-enforced those boundaries, and I sought to tear them down. There was no reason we couldn't have all of the above and do it better than how things were done.

The average developer had gone through a few years of JavaScript fatigue which was very much still a fresh topic at the time, so a new framework was the last thing anyone wanted. People were angry. I got accused of doing it to try to move up the ranks at the large company I worked for. This was eBay at the time, where ironically I was working on a different JS framework, Marko, as my day job.

So yeah, I ran into some friction and I wasn't so versed in social media to understand what HTMX came to know. Memes win the day regardless of whether you have anything of substance to say.

<!-- ::start:link-preview -->
[Of Chickens and Pigs: The Dilemma of Creator Self-Promotion](/posts/of-chickens-and-pigs-the-dilemma-of-creator-self-promotion-51ea)
<!-- ::end:link-preview -->

To be fair, I didn't see what I was doing as self-promotion. I was building and learning in public. I'd write articles and do long un-markettable live streams. I didn't feel that I created something, as much as I discovered something obvious if you just laid out everything in front of you.

Signals and fine-grained rendering were capable of everything you could do with a VDOM with similar or even better DX. A problem you could solve by diffing could probably be solved better by not diffing. Everyone was so intent on carving their own space that they didn't stop to ask if the boundaries were something we artificially made.

---

## Finding Allies

I started SolidJS very much on my own. I added Spectrum and Gitter chats and found support by sharing my ideas, but it wasn't until David Di Biase reached out that I found someone willing to put time into making the project successful. We brought on others over time as they were available to work on projects. Alexandre, Milo, Ryan, Dan, Nikhil to begin with and so many others afterwards.

We used our OpenCollective to sponsor two hackathons(SolidHack) to bring in missing parts of the ecosystem like component libraries. We funneled our donations into the Solid Fellowship program to support important initiatives like Dev Tools and Documentation. We found friends in content creators who were open to newer ideas. People like Jason Lengstorf, Theo Browne, Jack Herrington. I started speaking at conferences and meeting people from around the world who would advocate for Solid like Daniel and Atila.

<iframe src="https://www.youtube.com/watch?v=O6xtMrDEhcE&list=PL16vUvov3c5D1_KlYevpriA9QMkVkY32l"></iframe>

But most of all we just kept doing what we were doing. We released 1.0 in the Summer of 2021. This would kick off a revolution that I never could have predicted when I first started.

<!-- ::start:link-preview -->
[SolidJS Official Release: The Long Road to 1.0](https://dev.to/ryansolid/solidjs-official-release-the-long-road-to-1-0-4ldd)
<!-- ::end:link-preview -->

---

## Signals Everywhere

<iframe src="https://x.com/theo/status/1730711700805140908"></iframe>

In 2015, no one would be caught dead saying "Knockout always had it right." Hell, few people would have said that in 2018 or even 2020. It is because this has so little to do with Knockout other than inspiring the creation of SolidJS. In 2025 you would be hard-pressed to find a popular frontend library that doesn't work or is in the process of migrating to work the way SolidJS does. In 2018 there were zero, and now almost every notable framework other than React has jumped on board. So what happened?

It didn't happen overnight. My shouting out into the void caught the particular attention of one audience. Framework authors. It was my articles on SolidJS that got me hired by eBay, and it was those articles many published incidentally through a primarily Angular publication (thanks @layzee) that got my writing in front of the folks on the Angular team. This would start a multi-year conversation with Pawel Kozlowski that would ultimately lead to Angular Signals.

I convinced Misko Hevery that Signals were what he was missing to achieve true Resumability in Qwik. We'd nerd sniped Jason Miller (Preact) and crew around some of the performance we were getting with Signals. After early pushback, convinced Evan You (Vue) and Rich Harris (Svelte) that Fine-Grained rendering was the future, as they'd go on to create Svelte Runes, and Vue Vapor. Vue on its way to giving up its Virtual DOM, and Svelte giving up its all-compiler approach to doing runtime reactivity. And now both are nearly indistinguishable in output from SolidJS. Hell, there is even a TC-39 proposal for Signals now for the browser.

The only audience that wasn't convinced was React, but to be fair this solution was never for them. It was born out of not accepting all the conclusions they had made. I've learned an immeasurable amount from React over the years, but you don't evolve if you don't challenge baseline assumptions.

<!-- ::start:link-preview -->
[React vs Signals: 10 Years Later](/posts/react-vs-signals-10-years-later-3k71)
<!-- ::end:link-preview -->

---

## Another Decade of SolidJS

Open-source is a funny thing. Over the last 5 years, I've been fortunate enough to find support from companies like eBay, Netlify, and Sentry to work full-time on it, but it didn't start that way for me and it isn't a possibility for everyone. It takes time it takes patience, and it is often thankless. People are critical of it the same way they are of a paid product, without realizing most people aren't receiving any financial compensation for their efforts. It means that can't judge a project's health or people's dedication to these projects in the same way.

At this point, this project has been a significant part of my life. It is almost funny to read comments on Hacker News  (they never change) that at this point worry about me deciding to drop the project. How long did they wait for React to be around to jump on the bandwagon back in 2015... less than 2 years? Have we just gotten older as an industry? Are those who preached change now so afraid of it?

As for SolidJS's future, there is a discussion that now Svelte and Vue have changed themselves to be nearly identical, are we just done? Did we succeed at what I originally set out to do?

We did succeed at that. But for me, I accomplished that goal 6 years ago. The rest of this is inertia catching up with the inevitable. My whole perspective has grown and changed over the last several years. We don't live in a vacuum and we constantly learn from what is around us. We haven't sat still waiting for everyone to catch up.

The difference in time between SolidJS being released and other solutions getting here is the same amount of time between the initial release of jQuery and React. This journey is still early. Picture if we had the same sort of resources React has had over the years to explore this direction. I had to work hard to prove that we could do everything other solutions could. What if we instead put that effort towards unlocking capabilities unique to the model that other solutions haven't even imagined?

That keeps me busy and gives the project direction. There are still ways to make Web Development better and that energizes me. If what we accomplished as a small force in a hostile environment is impressive, imagine what we can accomplish with that many more people living and working in this space. This is only the beginning of the journey.

While it is true most developers that will pick up a frontend framework have no idea of what goes into building one. They might even think syntax is the most defining feature. At some point someone has to create the actual technology and that is an effort worth exploring and investing in.
