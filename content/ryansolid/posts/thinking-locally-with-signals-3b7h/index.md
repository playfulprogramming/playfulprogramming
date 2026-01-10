---
{
title: "Thinking Locally with Signals",
published: "2023-10-13T17:16:23Z",
edited: "2023-10-13T18:12:17Z",
tags: ["javascript", "webdev", "react", "solidjs"],
description: "As the creator of SolidJS, I was very influenced by React when designing the library. Despite what...",
originalLink: "https://dev.to/this-is-learning/thinking-locally-with-signals-3b7h",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

As the creator of SolidJS, I was very influenced by React when designing the library. Despite what people might believe by looking at it, it wasn't the technology of Virtual DOM or JSX, but the principles that inspired me. Those technologies may showcase React's capability, and maybe even define it as a solution, but aren't its legacy.

Instead, it is things like unidirectional flow, composition, and explicit mutation, that continue to influence how we build user interfaces. As I watch the wave of adoption of Solid's core reactive technology, Signals, by libraries across the whole ecosystem it is vitally important we don't forget the lessons learned from React.

---------------------

## Locality of Thinking

![Locally grown produce](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/jcdmw39jezuetw3dyiui.png)

The real magic of React is that when you combine all its design principles, the result is that you can reason about how a given component behaves without seeing the rest of the code.

This allows new people to be productive without knowing the whole code base. It allows features to be built in isolation without impacting the rest of the application. It lets you return to something that you wrote a year ago and understand what it is doing.

These are incredible powers to have for building software. Thankfully aren't limited to the technology choices made by React.

----------

## Passing Values Down

![Component Graph from React Docs](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/flynnwnbily1n4hl6fep.png)

Unidirectional Flow is probably the most important part of achieving locality of thinking. Generally, this starts with immutability as with passing something mutable you can never trust it after that call.

```js
let obj = {}
someFunction(obj)

// Is this true?
console.log(obj.value === undefined)

// You can't tell without looking at the code for `someFunction`
```

However, this does not require true immutability to pull off. It does require read/write segregation. Or in other words explicit mutation. The act of passing a value down should not implicitly give the ability to mutate it.

So any interface leaving our component whether it be for primitive composition (like custom Signals) or JSX should not by default pass both the value and the setter. We encourage this in SolidJS by using a pass-by-value approach in JSX and by providing primitives that by default are read/write separated.

```jsx
// [read, write]
const [title, setTitle] = createSignal("title");

// `title()` is the value, `SomeComponent` can't change `title`
<SomeComponent title={title()} />

// Now `SomeComponent` can update it
<SomeComponent title={title()} updateTitle={setTitle} />
```

Svelte Runes has taken another way to accomplish this by compiling their variable accesses to Signal reads. A variable can only be passed by value so there is no fear of it being written outside of the current scope.

```js
let title = $state("title")

// `SomeComponent` can't change `title` that you see declared in this file
<SomeComponent title={title} />

// Now `SomeComponent` can update it
<SomeComponent title={title} updateTitle={(v) => title = v} />
```

This mechanically is essentially the same Solid example when it gets compiled. In both cases, the Signal doesn't leave the component and the only way to mutate it is defined alongside its definition.

----------------

## Receiving Values from Above

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/jv3e22agjixdbqduvt90.jpg)

This pass-by-value approach is also beneficial for things coming into your component as well. Picture if you could pass Signals or values.

```js
function SomeComponent(props) {
  createEffect(() => {
    // Do we call this as a function or not?
    document.title = props.title
  })
}
```

We could always check:
```js
document.title = isSignal(props.title) ? props.title() : props.title
```

But picture having to do that everywhere for every prop you use in any component you ever author. SolidJS doesn't even ship with an `isSignal` to discourage this pattern.

As the component author you could force only Signals but that isn't ergonomic. Solid uses functions so maybe not a big deal, but picture if you are using Vue or Preact Signals that use `.value`. You wouldn't want to force people to:

```js
<SomeComponent title={{value: "static title"}} />

// or unnecessary signal
const title = useSignal("static title")
<SomeComponent title={title} />
```

I'm not being critical of those APIs here but emphasizing the importance of maintaining a pass-by-value API surface for props. For ergonomics and performance, you don't want users overwrapping.

The way to solve this is to provide the same interface for reactive and non-reactive values. Then mentally treat all props as being reactive if you need them to be. If you treat everything as reactive you don't have to worry about what happens above.

In the case of Solid reactive props are getters:

```js
<SomeComponent title={title()} />

// becomes
SomeComponent({
  get title() { return title() }
})

// whereas
<SomeComponent title="static title" />

// becomes
SomeComponent({
  title: "static title"
})

// Inside our component we aren't worried about what is passed to us
function SomeComponent(props) {
  createEffect(() => {
    document.title = props.title
  })
}
```

Using getters has an added benefit in that writing back to props doesn't update the value, enforcing the mutation control.

```js
props.title = "new value";

console.log(props.title === "new value"); //false
```

-------------

## Limits to Locality of Thinking

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ygcu9jhcy4t8scf328hr.png)

While it might be the most valuable result of modern UI practices, locality of thinking isn't perfectly achieved in the tools we use today. UI components aren't all pure. They have state. While not necessarily having external side effects the fact that we preserve references in closures that can impact future executions means those executions do matter.

Even with following these principles, the one thing we can't control is how often our parent calls us. On one hand, we can think of our components as purely the output of our inputs and this keeps things simple. But sometimes when we hit performance issues it isn't what we are doing but something above and we are forced out of our local frame.

Paired with a model that doesn't encourage the parent to re-call us that often does go a long way. This is one of several contributing motivations to why frameworks are choosing Signals over VDOM re-renders. It isn't that Signals can completely avoid over-notification from parents, but that the impact is generally much smaller and it happens less often as the guards are much finer-grained and built into the model.

-------------------

## Wrapping Up

I've talked to many long-time React users who remember when these fine-grained reactive patterns went through their last cycle. They remember crazy cycles of butterfly effects like event notifications. But the reality today is that when we look at Signals those concerns have lost all substance.

It is much more like an evolution of the move to break things down into more controllable pieces.

> Components -> Hooks -> Signals

But only if we stay to the same principles that were laid out in the first place in React. There is a reason why Solid doesn't have `isSignal` or Svelte Runes don't allow you to assign a Signal to a variable. We don't want you to worry about the data graph outside of your view.

Inside your local scope, there is no way to avoid it. JavaScript doesn't do automated granular updates, so even if we try to hide it with the best compiler imaginable with automated reactivity or memoization you need to have the language to make sense of what you are seeing. 

The common ground is, that if you treat everything as reactive that could be, the burden of the decision of what is reactive is pushed up to the consumer, regardless of whether you dealing with simple Signals, nested Stores, primitives passed from props or coming from global singletons. Regardless of how heavily you rely on compilation for the solution.

The consumer, the owner of the state (or at least the one passing it down), is precisely the one who can make that decision. And if you give them the ability to think locally you unburden them by giving them the confidence that they can make the right one.