---
{
title: "How React isn't reactive, and why you shouldn't care",
published: "2021-03-18T14:41:16Z",
edited: "2021-03-23T09:04:13Z",
tags: ["javascript", "webdev", "react", "svelte"],
description: "If the title agrees with you, you can stop reading right now. Move on to the next article. In technol...",
originalLink: "https://https://dev.to/playfulprogramming/how-react-isn-t-reactive-and-why-you-shouldn-t-care-152m",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

If the title agrees with you, you can stop reading right now. Move on to the next article. In technology, we tend to grab on to differences to come up with easily identifiable discussion points even when the truth is less clear-cut.

So save yourself some time and move on if you don't want to put some mostly unnecessary information in your head. But if you are interested in this sort of thing let me give this a shot.

# What is reactive programming?

This is the heart of it. If there was ever a more overloaded term... Reactive programming refers to a great number of things and most definitions are pretty poor. Either too specific to a mechanism or too academic. So I'm going to take yet another stab.

> Reactive Programming is a declarative programming paradigm built on data-centric event emitters.

There are two parts to this. "Declarative programming paradigm" means that the code describes the behavior rather than how to achieve it. Common examples of this are HTML/templates where you describe what you will see rather than how it will be updated. Another is the SQL query language where you describe what data you want rather than how to fetch it.

```sql
SELECT name FROM customers
WHERE city = "Dallas"
ORDER BY created_at DESC
```

This paradigm can apply to data transformation as well and is often associated with functional programming. For example, this map/filter operation describes what your output is rather than how you get there.

```js
const upperCaseOddLengthWords = words
  .filter(word => word.length % 2)
  .map(word => word.toUpperCase());
```

The second part is "data-centric event emitter". We've all worked in systems with events. DOM has events for when the user interacts with Elements. Operating systems work off event queues. They serve as a way to decouple the handling of changes in our system from the actors that trigger them.

The key to a reactive system is the actors are the data. Each piece of data is responsible for emitting its own events to notify its subscribers when its value has changed. There are many different ways to implement this from streams and operators to signals and computations, but at the core, there is always this data-centric event emitter.

# Common types of reactivity

There are 2 distinct common types of reactivity found in JavaScript. They evolved to solve different problems. They share the same core properties but they are modeled slightly differently.

### 1. Reactive Streams

This is probably the one you hear about the most but isn't necessarily the most used. This one is based around async streams and processing those with operators. This is a system for transformation. It is ideal for modeling the propagation of change over time.

Its most famous incarnation in JavaScript is RxJS and powers things like Angular.

```js
const listener = merge(
  fromEvent(document, 'mousedown').pipe(mapTo(false)),
  fromEvent(document, 'mousemove').pipe(mapTo(true))
)
  .pipe(sample(fromEvent(document, 'mouseup')))
  .subscribe(isDragging => {
    console.log('Were you dragging?', isDragging);
  });
```

You can see this stream build in front of you. You can describe some incredibly complex behavior with minimal code.

### 2. Fine-Grained Signals

This is the one often associated with spreadsheets or digital circuits. It was developed to solve synchronization problems. It has little sense of time but ensures glitchless data propagation so that everything is in sync.

It is built on signals and auto-tracking computations instead of streams and operators. Signals represent a single data point whose changes propagate through a web of derivations and ultimately result in side effects.

Often you use these systems without realizing it. It is the core part of Vue, MobX, Alpine, Solid, Riot, Knockout.

```js
import { observable, autorun } from "mobx"

const cityName = observable.box("Vienna")

autorun(() => {
    console.log(cityName.get())
})
// Prints: 'Vienna'

cityName.set("Amsterdam")
// Prints: 'Amsterdam'
```

If you look, `cityName`'s value looks like it is actually being pulled instead of pushed. And it is on initial execution. These systems use a hybrid push/pull system, but not for the reason you might think. It is to stay in sync.

Regardless of how we attack it, computations need to run in some order, so it is possible to read from a derived value before it has been updated. Given the highly dynamic nature of the expressions in computations topological sort is not always possible when chasing optimal execution. So sometimes we pull instead of push to ensure consistency when we hit a signal read.

Also worth mentioning: Some people confuse the easy proxy setter as being a sure sign something is reactive. This is a mistake. You might see `city.name = "Firenze"` but what is really happening is `city.setName("Firenze")`. React could have made their class component `state` objects proxies and had no impact on behavior.

Which brings us to...

# Is React not reactive?

Well, let's see about that. React components are driven off state, and `setState` calls are sort of like data events. And React's Hooks and JSX are basically declarative. So what's the issue here?

Well actually very little. There is only one key difference, React decouples the data events from component updates. In the middle, it has a scheduler. You may `setState` a dozen times but React takes notice of which components have been scheduled to update and doesn't bother doing so until it is ready.

But all of this is a type of buffering. Not only is the queue filled by the state update event, but the scheduling of processing that queue is as well. React isn't sitting there with some ever-present polling mechanism to poll for changes. The same events drive the whole system.

So is React not reactive? Only if you view reactivity as a push-only mechanism. Sure React's scheduling generally doesn't play as nice with push-based reactive systems as some would want but that is hardly evidence. It seems to pass the general criteria. But it is definitely not typical reactivity. Know what else isn't? Svelte.

# Strawman Argument

When you update a value in Svelte in an event handler and happen to read a derived value on the next line of code it isn't updated. It is definitely not synchronous.

```html
<script>
  let count = 1;
  $: doubleCount = count * 2;
</script>
<button on:click={() => {
  count = count + 1;
  console.log(count, doubleCount);  // 2, 2
}}>Click Me</button>
```

In fact, updates are scheduled batched and scheduled similarly to React. Maybe not interruptable like time-slicing but still scheduled. In fact, most frameworks do this sort of batching. Vue as well when talking about DOM updates. Set count twice synchronously and sequentially doesn't result in Svelte updating the component more than once.

Taking it a step further, have you seen the compiled output of this? The important parts look like this:

```js
let doubleCount;
let count = 1;

const click_handler = () => {
  $$invalidate(0, count = count + 1);
  console.log(count, doubleCount); // 2, 2
};

$$self.$$.update = () => {
  if ($$self.$$.dirty & /*count*/ 1) {
    $: $$invalidate(1, doubleCount = count * 2);
  }
};
```

Unsurprisingly `$$invalidate` is a lot like `setState`. Guess what it does? Tell the component to call its `update` function. Basically exactly what React does.

There are differences in execution after this point due to differences in memoization patterns and VDOM vs no VDOM. But for all purposes, Svelte has a `setState` function that re-evaluates its components. And like React it is component granular, performing a simple flag-based diff instead of one based on referential value check.

So is Svelte not reactive? It has all the characteristics we were willing to disqualify React for.

# Summary

This whole line of argument is mostly pointless. Just like the argument of JSX versus custom template DSLs. The difference in the execution model can be notable. But Svelte's difference isn't due to reactivity but because its compiler separates create/update paths allowing skipping on a VDOM.

React team acknowledges that [it isn't fully reactive](https://reactjs.org/docs/design-principles.html#scheduling). While that seems like it should be worth something, in practice it isn't that different than many libraries that claim to be reactive. Sure, React Fiber takes scheduling to the extreme, but most UI Frameworks automatically do some amount of this.

Reactivity isn't a specific solution to a problem, but a way to model data change propagation. It's a programming paradigm. You can model almost any problem with reactive approaches. And the sooner we treat it as such the sooner we can focus on the problems that matter.
