---
{
title: "What the hell is Reactive Programming anyway?",
published: "2021-03-23T08:10:18Z",
edited: "2021-03-23T09:20:50Z",
tags: ["javascript", "webdev", "reactivity"],
description: "My recent article How React is not reactive, and why you shouldn't care opened up a much larger debat...",
originalLink: "https://dev.to/this-is-learning/what-the-hell-is-reactive-programming-anyway-31p5"
}
---

My recent article [How React is not reactive, and why you shouldn't care](https://dev.to/ryansolid/how-react-isn-t-reactive-and-why-you-shouldn-t-care-152m) opened up a much larger debate on the definition of reactive programming in general. And in hindsight, I don't even really like the definition I presented much at all myself.

I fell once again into the trap of defining it by the implementation. I read a number of different definitions, in my search but they all weren't right. [Wikipedia](https://en.wikipedia.org/wiki/Reactive_programming), [Stack Overflow](https://stackoverflow.com/questions/1028250/what-is-functional-reactive-programming), [Reactive Manifesto](https://www.reactivemanifesto.org/), etc...

The one that spoke to me the most was Andre Staltz's from [The introduction to Reactive Programming you've been missing](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754), but it was still so ReactiveX focused:

> Reactive programming is programming with asynchronous data streams.

Asynchronous? Not necessarily. Streams? Not always. So I generalized it to:

> Reactive Programming is a declarative programming paradigm built on data-centric event emitters.

Not great. Who cares about the event emitters? It's still too mechanical.

So let's give this another shot.

# Take Two

So if we aren't going to focus on the mechanism, the events, what makes programming reactive? I found my answer a bit further down that Wikipedia entry. How about the ability to describe a system like:

```js
a = b + c
```

And have that relationship represent a rule rather than an assignment. To ensure `a` always equals the sum of `b` and `c` were `b` or `c` to ever change. And that relationship never changes.

That is the core of every reactive system whether we are applying operators to transform streams or doing some sort of auto-tracking signal. We are dealing with a declarative expression of the relationship between values that change over time.

So is that what reactive programming is?

> The declarative expression of the relationship between values that change over time.

This isn't a new concept. Dates back as far as 1969 when Rene Pardo and Remy Landau co-invented "LANPAR" (LANguage for Programming Arrays at Random), more or less the blueprint for the modern spreadsheet. And is a similar problem space to Hardware Description Languages(HDLs) that were being developed around the same time.

And it isn't surprising this desire traces back to early research in computing. After all how to best save work but through automation. In setting the rules around how data elements behave in relation to each other we can abstract the complexity of execution.

Simple in concept but not without its own complexity in implementation. Starting with the fact that software isn't inherently declarative. Whether that involves the fixed relationship between variables or observably "glitch-free" synchronization. So I'm sure we will debate how to best achieve this for years to come.

# Conclusion

Unsurprisingly, perhaps, even now that I feel more content with my definition it doesn't provide any further distinction. In a sense, reactive programming is just another name for declarative programming. It's everywhere.

Sure there are specific flavors with their own models and we can differentiate on them. But in the same way, [RxJS isn't strictly FRP](https://medium.com/@andrestaltz/why-i-cannot-say-frp-but-i-just-did-d5ffaa23973b) or should I say DCTP, these distinctions only serve to differentiate implementations/models but not a paradigm.

It isn't about push vs pull, signals(behaviors) vs streams, async vs sync. When fully pull-based systems still fall under this umbrella it is clear that update semantics is not a defining criterion for inclusion. To quote the [1989 paper](https://hal.inria.fr/file/index/docid/75494/filename/RR-1065.pdf) which first used the term reactive programming:

> Real-time programs are usually reactive.

What are modern browser UIs but a form of real-time programs?

---

> EDIT: Like most things, apparently someone already wrote this article in 2010. https://paulstovell.com/reactive-programming/. Thanks to Pawel Kozlowski for sharing. I wish I had found articles like that years ago. Would have saved a lot of time.
