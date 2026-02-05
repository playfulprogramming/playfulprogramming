---
{
title: "The Cost of Consistency in UI Frameworks",
published: "2022-07-12T16:58:20Z",
edited: "2022-07-12T22:11:24Z",
tags: ["react", "vue", "svelte", "solidjs"],
description: "Sometimes there are problems that have no universally good solutions. There is some tradeoff to be...",
originalLink: "https://dev.to/this-is-learning/the-cost-of-consistency-in-ui-frameworks-4agi",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

Sometimes there are problems that have no universally good solutions. There is some tradeoff to be made. Some perspectives that can't be protected. Sometimes it isn't even clear if any of the options are preferable to the others.

<iframe src="https://x.com/RyanCarniato/status/1353801009844240389"></iframe>

What we ended up with in the log was:

> React 0 0 0
> Vue 1 2 0
> Svelte 1 0 0
> Solid 1 2 2

I first posted this a year and a half ago but it's been haunting me ever since. I keep revisiting it. In my dreams, and my day job. When working on [Marko](https://markojs.com/) 6, we couldn't make a decision and decided to throw an error if one tried to read a value already updated in that cycle until we could make up our minds.

So how can all these JavaScript frameworks all have different behavior? Well, there is a good argument for each. I had people reply to that tweet about how their framework did the only sensible thing. And they are all right, and perhaps all wrong.

---

## Batched Consistency

<iframe src="https://x.com/dan_abramov/status/1540441999324610560"></iframe>

Let's start with [React](https://reactjs.org/). When you update state, it holds off committing those changes until the next render cycle. The benefit here is that React is always consistent. `count` and `doubleCount` and the DOM are always observed to be in sync.

Consistency in frameworks is important. It builds trust. You know when you interact with the view what you see is what you get. If the user sees something but the state of the app is different, that can lead to obscure bugs because user-driven actions can cause unexpected results while appearing intentional. Sometimes to serious consequences (financial or otherwise).

This extends to development. If a developer can be sure everything they are dealing with is in sync they can trust their code will run as expected.

However, what this means is the often painful:

```js
// updating state in React
count === 0; // true

setCount(count + 1);

console.log(count, doubleCount, el.textContent); // 0, 0, 0
```

Updating state does not update right away. If you are doing a sequence of changes, passing values around you will have the old value. On the positive, this pushes you to do all your state changes together which can be better for performance, but you need to be conscious that if you set the same state multiple times the last set wins.

**React's batched update consistency model is always the safe bet. No one is thrilled about it, but it is a really good default.**

---

## Reactive Consistency

Even if "correct", batch consistency often leads to its confusion and bugs because of the expectation of values updating. So doing the opposite is what [Solid](https://www.solidjs.com/) does and by the next line, everything is updated.

```js
// updating state in Solid
count() === 0; // true

setCount(count() + 1);

console.log(count(), doubleCount(), el.textContent); // 1, 2, 2
```

This is perfectly consistent and it fits expectations but as you can imagine there must be a tradeoff.

If you make multiple changes you will trigger multiple re-renders and do a bunch of work. Even though this is a sensible default in a framework like Solid which doesn't re-render components and only updates what changes, sometimes this can still cause unnecessary work. However, independent changes have no performance overhead. But like React it might push you to apply all your changes once.

**Solid's consistency model also prices you into being aware there is a batching mechanism, as it is important for optimization.**

---

## Reactive Batching

<iframe src="https://x.com/_jin_nin_/status/1543537797612576768"></iframe>

The author of the [$mol](https://mol.hyoo.ru/) framework makes a pretty good argument to defend his framework and [Vue](https://vuejs.org/)'s position. In Vue, things update reactively but are scheduled like React. However, they apply the direct state changes immediately.

```js
// updating state in Vue
count.value === 0; // true

count.value++;

console.log(count.value, doubleCount.value, el.textContent) // 1, 2, 0
```

The trick that these libraries do is, they mark values as stale and schedule them, but don't run the updates immediately unless you read from a derived value. Only then will they will eagerly execute it instead of waiting to where it usually will be scheduled. This has the benefit of being as performant as it needs to be while pushing off the heaviest work like the rendering side effects.

This is the first approach that isn't consistent we've talked about. You have partial consistency of the pure calculations but it isn't immediately reflected in the DOM. This has the benefit of appearing consistent for most things. However, if downstream side effects would ever update state, then those changes are also not applied until after even if read.

**Vue's batched reactivity is probably the most effective at making this all a "non-thing", but it might be the least predictable.**

---

## Natural Execution

In the company of the others, [Svelte](https://svelte.dev/)'s execution might not seem that desirable. It isn't consistent. And does not attempt to appear to be. It also is sort of perfect for Svelte.

```js
// updating state in Svelte
let count = 0;

count++;

console.log(count, doubleCount, el.textContent); // 1, 0, 0
```

In Svelte everything looks like normal JavaScript. Why would you ever expect the derived `doubleCount` or the DOM to be updated on the next line when you set a variable? It makes no sense.

Like Vue, people won't think about this much. However, they are much more likely to hit that inconsistency with derived data sooner. Initially, this requires no explanation to get up and running, making this model feel the most natural to those with no pre-conceptions. But is it what we are really looking for?

**Svelte doesn't even try to be consistent. This might be a blessing and a curse.**

---

## Choosing the Best Model

This is the point of the article where I'm supposed to say the right answer is "it depends" and leave you all with some profound thoughts. But that's not where I'm at.

There is a mutability vs immutability argument behind all of these. Like picture grabbing an item at a certain index in an array and putting it at the end of the array.

```js
const array = ["a", "c", "b"];
const index = 1;

// immutable
const newArray = [
  ...array.slice(0, index),
  ...array.slice(index + 1),
  array[index]
];

// or, mutable
const [item] = array.splice(index, 1);
array.push(item);
```

In either case, one would expect to end up with `["a", "b", "c"]`.

As you can see the immutable change can be applied as a single assignment to the newArray. However, with our mutable example, we change the actual array with 2 operations.

If the state did not update in between our operations like React (maybe picture something like Vue's proxy) we'd end up with `["a", "c", "b", "c"]`. While we would get "c" as our item from the splice. The second array operation ("push") would effectively overwrite the first so it would not get removed from the list.

In addition, reality is a little bit more complicated than these examples. I intentionally chose an event handler because it is outside of the typical update/render flow but inside you will find different behavior.

Using React's function setters gives up to date values:

```js
// count === 0

setCount(count => count + 1);
setCount(count => count + 1); // results in 2 eventually

console.log(count); // still 0
```

Vue can mimic Svelte's behavior with Effects:

```js
const count = ref(0);
const doubleCount = ref(0);

// deferred until after
watchEffect(() => doubleCount.value = count.value * 2);

console.log(count.value, doubleCount.value, el.textContent) // 1, 0, 0
```

Solid's updates work like Vue's default while propagating any internal change from the reactive system. This is necessary to prevent infinite loops. However, it's explicit batching and Transitions API leave things in the past like React.

---

## So... ?

<iframe src="https://x.com/DevinRhode2/status/1545968130186412033"></iframe>

So honestly, this all sucks. Enough that I feel the need to be aware of batching behavior. And with that awareness then I'm compelled to offer a consistent default as it feels like the sanest thing to do.

For many of you this is probably unsurprising.. I'm the author of SolidJS, so why wouldn't I say that? Solid's eager updates work well with its rendering model and are complemented by an opt-in for batching.

But the real revelation to me was just how much my opinion changed in the past couple of years. When I first saw this problem designing Marko 6, I was all in on Vue's batched reactivity. Being a compiled syntax having explicit opt-in felt out of place and mutation not updating is awkward. However, I definitely would have put Svelte's approach as my least favorite.

But now I'm not nearly as certain. Working on Solid which embraces explicit syntax I have all the tools at my disposal. If batching is opt-in, and if I'm going to give up consistency for "intuitive behavior" (and supporting mutation), I want predictability atleast. And in that Svelte's too-simple model makes a lot of sense.

So coming into Solid 1.5 we are evaluating a new "natural" batching model to complement our eager consistent defaults (and our in-the-past batching of Transitions). I don't know if there is a lesson here. I can't fault anyone for coming to a different conclusion. These tricky problems are why I love this work so much.

The skeptic might point out that would Solid have all update models in it, and they'd be kind of right. I don't know. Can't beat them, join them?

---

> If you have opinions on this and want to be part of the discussion come join the [SolidJS discord](https://discord.com/invite/solidjs) where this topic is being discussed currently.
