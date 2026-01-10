---
{
title: "JavaScript Frameworks and Metagaming",
published: "2021-07-06T15:14:07Z",
edited: "2021-07-06T16:21:12Z",
tags: ["solidjs", "devjournal", "javascript", "webdev"],
description: "Last week we released SolidJS 1.0. A JavaScript framework built on a foundation of ideas long ago...",
originalLink: "https://dev.to/this-is-learning/javascript-frameworks-and-metagaming-pb5",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

[Last week we released SolidJS 1.0](https://dev.to/ryansolid/solidjs-official-release-the-long-road-to-1-0-4ldd). A JavaScript framework built on a foundation of ideas long ago dismissed, that accomplishes what some thought to be impossible. It was also a great personal achievement for me. Years of work realized and put on display.

And many of you know that. Since 2018 I made the deliberate choice to write about every detail of building a JavaScript framework. That's several dozen articles. In a lot of ways [Solid](https://www.solidjs.com/) was built in public. And just because we've hit 1.0 doesn't mean I have any intention to stop writing about my experiences and the things I learn in a highly introspective way.

It's no secret it's been hard to push a new JavaScript framework in such an overcrowded space. And 1.0 release has lead me to reflect further on this.

## Metagaming in Games

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qg8ko3ofi29xkey96xh9.png)

I was an avid [Magic the Gathering](https://magic.wizards.com/en)(collectable card game) player for several years. I mostly was a deck designer and play-tester. I was not the best technical player but what I did well was understand how the the whole field of possible decks would play against each other and how to take a given strategy and have it invalidate another approach. You can view this as a huge game of Rock Paper Scissors, except there were more than just 3 options.

What makes Magic interesting is that each match is a best out of 3 games and the person who goes first in a game generally has the advantage. But for game 1 that is random and something you can't control. In games 2 the loser goes first and should it go to game 3 the person who won the first game goes first again.

But what makes it really interesting is after game 1 either player can swap up to a quarter of the cards in their deck. And depending on each strategy one can change their approach to combat other strategies. This is incredibly deep when you consider the [Princess Bride leveling game](https://www.youtube.com/watch?v=EZSx3zNZOaU) involved.

Through Magic I learned lessons on game theory. It's immensely deep. I've applied these sort of patterned thinking to a lot of problems I've faced since. Mark Rosewater, the Head Designer, gives one of my favorite talks on lessons learned when designing.
{% youtube QHHg99hwQGY %}

## Framework Design

So what does this have to do with designing JavaScript Frameworks. Well, features-wise it is just as much about positioning as anything. How to balance a solution with no obvious weakness, yet offer the best offering on average. Sometimes you win in game 1 and there is nothing anyone can reasonably do to catch up. Other times you just need to be able draw it into the deciding game 3 where you will have the advantage.

While this seems sort of ruthless it has given me a framework for looking at balance. You don't get to change your fundamental identity (or say colors in Magic). Only certain tools can be available to you depending on the choices you make. All you can do is look at maximizing your strengths, and adjusting what is actually the deciding factor that is being fought over.

In Framework design this means sometimes the solution isn't to solve a known problem, but redefine it to avoid being trapped in solutions that don't suit the toolset. I had to do a lot of work to re-imagine things with VDOM-less JSX and how hydration and SSR could work in a granular reactive library. These technologies had been built on diffing Solid doesn't have.

Time and time again when I get stuck I don't concede. I go back to the drawing board and see if there is a way to re-imagine the problem.

Now picture this from another perspective. There is a reason Solid has such an unorthodox combination of elements, between mixing reactivity + JSX, doing some compilation but leaving some to the runtime, adopting uni-directional flow and immutable patterns with mutable internals. These things together edge out existing solutions in all the places they are weakest. Where the common knowledge is that we're reaching the limits of that abstraction.

I've had framework authors say things like, I'd love to do _blank_ but it's not worth focusing on incremental improvements. And they are right. But what if the actual base configuration of a framework was setup to live in that space.

I'm not necessarily claiming Solid's tradeoffs are better. Obviously I have personal bias here and I think at least it provides a unique set of strengths. However, I'm finding that those decisions have bigger implications beyond the technical.

## Social Metagaming

Social is not something I had as much experience in. I had MySpace to promote my band, and when Facebook came around, I was like "Pass. I don't need to do this again." I eventually signed up 3 years later. I didn't join Twitter for over a decade after that.

All I had were articles that I wrote and the output of my work. And you can probably see the flaw in my approach to framework design. That's not how to make friends and influence people.

Now framework authors live and breathe these problems. They've thought about the tradeoffs. They've chose their place and continue to work to understand these tradeoffs and implications of their decisions. Great video by Evan You on the topic:

{% youtube ANtSWq-zI0s %}

This video establishes axis to compare our projects on and clearly states how moving the dial from left to right has different repercussions. It doesn't get super deep here, but decisions on one slide directly impact which options are open to you on the next.

Now this is the kind of simple message that influencers can carry and amplify out to the masses. It is always an oversimplification, but it serves the purpose. But what if what is in contention are the axis that we make these comparisons on? What if something bends the rules of the established model?

People are tired. The term JavaScript fatigue has been thrown around a lot. There is this perspective that JavaScript ecosystem as it matures should stabilize and look more like Ruby or Java on the backend. There should be established tools and practices that we make incremental improvements on. 

The last thing any influencer wants is to push more uncertainty on their followers. People trust them because they bring clarity. Things fit into clear buckets. An idea that breaks down those walls has no place.

I don't expect people to drop what they are doing to change frameworks, but I've repeatedly found myself against an incredible barrier in the mind space. No one wanted JSX to be analyzable. No one wants to hear a well written VDOM scales better than most other solutions. Hell, no one wants to hear that React might as well be considered reactive when you consider how similar all frontend frameworks are. Or so I thought...

## Reflecting on 1.0 release

I'm used to people seeing [Solid](https://www.solidjs.com/) and dismissing it. After all it is intentionally designed to be a sleeper. But what I saw was positivity from people around the React community. They saw the release, looked at it, and said "you know this is kind of incredible."

Isn't Solid some sort of React killer/replacement? Why would the React community welcome it and where others wouldn't?

Simple. It reaffirms their values. They don't see Solid as a competitor. Maybe just a re-imagining of their favorite framework. Despite the surface story playing up this React vs Solid narrative, there is no reality where they'd feel threatened by this.

From a cynic's perspective, Solid's existence gives them a gift. Here is the foil in those framework discussions. Touching on topics that compare with other frameworks on compilation, templates, reactivity, they can simply point at Solid as proof that one doesn't need to go through such lengths to get all the benefits.

One could even argue, if anything Solid re-enforces why you should be using React. 

## Where to go from here

Well not to disappoint anyone but React isn't going to take this path. Some critics have said, "React is an idea and the VDOM is just an implementation detail." Well, I have it on good authority it's an implementation detail they neither want to nor can escape at this point. This isn't a Vue/AlpineJS scenario where the larger player only has to flex.

{% twitter 1410763549228609537 %}

We've had a lot of new exposure from places where we've struggled to get even a nod. They might not all have positive things to say but the acknowledgement is a step in the right direction. That's the important part.

In my experience, it is the fellow maintainers and contributors that have the greatest understanding and tolerance of different ideas. I'm still learning to work with influencers to not, "well, actually" them all the time. I have a body of work that may contradict what they've been telling people. And I am in a position where I have no choice really in the matter.

Solid has grown beyond what I singularly can focus on. So I'm going to keep working on the things that I can and have trust in people who continue to share my passion for this great little framework so that we continue to grow. It's come to my attention there are international communities sprouting up and there is already a demand for localization of the documentation into different languages. That's so amazing.

I've seen renewed interest in people taking their reactive state libraries and trying to skip the framework and see what they can do. That's where [this all started](https://ryansolid.medium.com/b-y-o-f-part-1-writing-a-js-framework-in-2018-b02a41026929). I've learned so much a long the way. Watching people take the same steps and making the same discoveries I did years ago is the greatest validation I could hope for.

Honestly this all is so amazing. So thank you all for being with me on this journey.