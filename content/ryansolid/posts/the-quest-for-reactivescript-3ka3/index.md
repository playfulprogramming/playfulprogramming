---
{
title: "The Quest for ReactiveScript",
published: "2021-11-23T15:07:50Z",
edited: "2021-11-24T17:28:45Z",
tags: ["javascript", "webdev", "reactivity"],
description: "This article isn't going to teach you about the latest trends in frontend development. Or look in...",
originalLink: "https://dev.to/this-is-learning/the-quest-for-reactivescript-3ka3",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

This article isn't going to teach you about the latest trends in frontend development. Or look in detail into the way to get the most performance out of your website. Instead I want to write about something that I've been playing with in my head for the past year but never can find the time to work on. Reactivity as general purpose language.

If you want someone to blame. Blame Jay Phelps (I kid). After a demo I made showing off the power of fine-grained reactivity he got it in my head that we should look at this more as a generalized language. I was content in my DSL bubble, thinking of ways we can make building frameworks easier, but he challenged me to think about it more generally.

{% twitter 1353193651887857665 %}

I've been meaning to take him up on his offer, but in the meantime what I can do is write about it. Because the last year I've done a lot of searching and thinking into how I'd approach this. And thanks to more recent conversations around Svelte, Vue Ref Sugar, and my work on Marko etc.. this seems as good time as ever to share what I've learned. 

## The Destiny Operator

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/yc372sbywl4dim12mwc3.jpeg)

One of the best introductions I've ever read to reactivity, after the fact is [What is Reactive Programming?](https://paulstovell.com/reactive-programming/). I can't promise it's the best introduction for the uninitiated. But it introduced reactivity in a very simple way. That reactivity is when an equation which holds true even after its values change. If `a = b + c`, then it is reactive if `a` still reflects this sum after `b` or `c` updates. 

This article proposes the use the "Destiny Operator" `<=` to denote this relationship:

```js
var a = 10;
var b <= a + 1;
a = 20;
Assert.AreEqual(21, b);
```
A simple addition to the language but capable of doing so much. Most importantly it highlights the difference between a reactive declaration and an assignment. It makes no sense for `b` to ever be re-assigned as then its relationship of always being one larger than `a` wouldn't hold. Whereas `a` needs to be re-assigned or this system isn't really doing much.

This is just the start. In many ways this has been seen to be the ideal. Reality is a bit more complicated than that. We will return to the "Destiny Operator" a bit later.

## Identifiers

If you've ever used a fine-grained reactive library in JavaScript you've seen the common pattern of using function getters/setters. They might be hidden behind proxies but at the core there is an accessor so that values can be tracked and subscriptions made.

```js
const [value, setValue] = createSignal(0);

// log the value now and whenever it changes
createEffect(() => console.log(value()));

setValue(10); // set a new value
```
In fact I'd say the majority of frontend JavaScript frameworks have fallen into this 3 part reactive API/language:

1. Reactive State (Signal, Observable, Ref)
2. Derived Values (Memo, Computed )
3. Side Effects (Effect, Watch, Reaction, Autorun)

The example above uses Solid but you should be able to picture that pretty easily in React, Mobx, Vue, Svelte etc. They all look very similar.

> For a more in detailed introduction check out [A Hands-on Introduction to Fine-Grained Reactivity](https://dev.to/ryansolid/a-hands-on-introduction-to-fine-grained-reactivity-3ndf)

The problem is no matter what we do with fine-grained reactivity at runtime there is extra syntax. There is no way at runtime to just have `value` be a value and be reactive. It's going to be `value()` or `something.value` or `value.something`. A small ergonomic detail but one that there is a desire to solve.

The simplest compiler aided approach is decorate the variable identifiers to let it know it should compile to function calls. I first saw this in the framework [Fidan](https://github.com/ismail-codar/fidan) and later in some Babel plugins the community had created for [Solid](https://solidjs.com).

```js
let value$ = createSignal(0);

// log the value now and whenever it changes
createEffect(() => console.log(value$));

value$ = 10; // set a new value
```

What's great about this is no matter the source we can use this syntax sugar:
```js
let value$ = createCustomReactiveThing();
```

However, now our signal is always treated as a value. How would we pass it outside of this module context and retain reactivity? Maybe we reference it without the `$`? Do we pass it in a thunk `() => value$`, do we invent a syntax for this? Do we have control over if the reactive value is readonly? As shown above derived reactive values probably should be. I actually saw a version of this where single `$` meant mutable and `$$` meant readonly.

The crux though is this syntax doesn't simplify the mental model. You need to be aware exactly what is being passed around and what you are receiving. You are saving typing some characters, possibly as little as 1 as the shortest way to express reactivity without compiler tricks is 2 characters(`()` or `_.v`). It's hard for me to consider adding all this is worth it.

## Keywords, Decorators, Labels

So how to do this better? Well what if reactivity was a keyword, decorator, or label? MobX has been doing this for ages with decorators on classes but [Svelte](https://svelte.dev) has taken this to a whole new level.

The basic idea is:
```js
signal: value = 0;

// log the value now and whenever it changes
effect: console.log(value);

value = 10; // set a new value
```

Svelte realized that if it treated every variable as a Signal it could reduce that to:
```js
let value = 0;

// log the value now and whenever it changes
$: console.log(value);

value = 10; // set a new value
```

If this draws similarities to the "Destiny Operator" it should. Svelte's `$:` label is really approaching it. They recognized the "Destiny Operator" was insufficient as you don't only have reactive derivations but side effects like this `console.log`. In so you can use `$:` both define variables with reactive declarations like the "Destiny Operator" as well as reactive effectful expressions.

So we're done right. Well no. There are huge limitations of this approach. How does reactivity leave this module? There is no way to get a reference to the reactive signal itself; just its value.

> Note: Svelte does have 2 way binding syntax and `export let` as a way to do parent to child passing of reactivity. But in general you can't just export or import a function and have it reactive without using an auxiliary reactive system like Svelte Stores. 

How do we know what to do with:

```js
import createCustomReactiveThing from "somewhere-else";

let value = createCustomReactiveThing();
```
Is it reactive? Can it be assigned? We could introduce a symbol on our identifiers for this case, but we are back to where we were with the last solution. What if you wanted to extract out a derivation like `doubleValue` how would the template know what to do with it.

```js
let value = 0;

// can this
$: doubleValue = value * 2;

// become
const doubleValue = doubler(value);
```

Not intuitively. We have a keyword(label) for it and it doesn't transpose.

## Function Decoration

Well composition is king. Probably the single most important part of [React](https://reactjs.org)'s success and for many of us no composition is a non-starter. Svelte has composition and extensibility through its stores, but the focus here today is in the reactive language where it falls short.

There is another approach that I first came across talking with the [Marko](https://markojs.com) team almost 2 years ago. Marko is an interesting language because it heavily values markup syntax, and the maintainers had basically resolved that they wanted to bring their reactivity into their tags.

```html
<let/value = 0 />
<!-- log the value now and whenever it changes -->
<effect() { console.log(value); }/>

value = 10; // set a new value
```
Definitely foreign on the first look but by using tags they'd basically solved Svelte's problem. You knew these were reactive. It is the syntax version of something similar to React's convention that `use____` is a hook.

Interestingly enough, about a year later Evan You independently came to the same conclusion with [version 2 of his Ref Sugar API](https://github.com/vuejs/rfcs/discussions/369) for [Vue](https://vuejs.org) 3. Version 1 was labels like above but he realized the shortcomings of that approach and ended up with:

```js
let value = $ref(0)

// log the value now and whenever it changes
watchEffect(() => console.log(value));

value = 10; // set a new value
```
Well it's almost the same thing as the Marko example. This approach actually gives most of what we are looking for. We've regained composition.

However, there is one consideration here still when it comes to passing references out of our current scope. Since Vue is using this as a bit of a syntax sugar like the identifier example earlier it needs to tell the compiler still when it wants to pass by reference instead of by value, and there is the `$$()` function for that. For instance if we wanted to pass explicit dependencies in:

```js
let value = $ref(0)

// log the value now and whenever it changes
watch($$(value), v => console.log(v));
```

Notice how `watch` here is just an ordinary function. It couldn't know how to handle `value` any differently. If left alone it would compile to `watch(value.value, v => ... )`, which would do the reactive access too soon outside a tracking scope.

There are some comments in the proposal asking for a `$watch` to handle exactly that but I suspect they won't pass because that is specific behavior that `$(function)` doesn't have. Vue's goal is to be composable, so having `$watch` be special isn't acceptable. That makes it basically a keyword, as `$mywatch` wouldn't be known to be given the same behavior, unless we added another syntax or made more general changes to behavior.

In fact none of the solutions, short of Marko's tags, handle that case without extra syntax. Marko can leverage the knowledge of being a tag to make some assumptions you can't make about an ordinary function. And being tags we inadvertently stumbled on what I believe might be the actual solution.

## Rethinking Reactive Language

All the approaches suffer from the same challenge. How do we preserve reactivity? We are always worried about losing it, and we are forced into this pass by reference vs pass by value discussion. But that is because we are living in an imperative world, and we are a declarative ~~girl~~ paradigm.

Let me elaborate a bit. Marko uses a `<const>` tag for declaring reactive derivations. Our "Destiny Operator" so to speak. This sometimes confuses people because derived values can change so how is it "const"? Well it never gets re-assigned and the expressions holds for all time.  

When I was trying to explain this to someone new, Michael Rawlings(also on the Marko team) clarified it was the `let`(Signal) that was special not the `const`(Derivation). Every expression in our templates act like a derivation, every attribute binding, component prop. Our `<const value=(x * 2)>` is no different than a `<div title=(name + description)>`.

Which got me thinking what if we've been looking at this all backwards. What if expressions were reactive by default and instead we needed to denote the imperative escape hatches? Instead of a "Destiny Operator" we'd need a side-effect operator.

This seems crazy because would it be intuitive to change the semantic meaning of JavaScript yet keep the same syntax? I assumed no, but I mean we've already seen this done to great success. Svelte's scripts are nothing like "plain JavaScript" yet people seem to be accepting of those and some even advertising them as such.

I did poll a while back and while not conclusive the results suggested many developers are much more sensitive to syntax than semantics.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/hjra1zcz9tfswdjynefi.png)

So the question is can we do something using the existing syntax of JavaScript and keep all the tooling advantages(even TypeScript)? I mean completely mess with how it executes in the way things like Svelte, React Hooks, or Solid's JSX defies expectations but do so with pure JavaScript syntax and in way people can make sense of. Well, we can try.

## Designing ReactiveScript

For all of my, what might sound like criticism, over decisions made in the various approaches above there is a lot of great prior work to tap into. I think Svelte today is a good starting point as it has simple syntax and already distorts the expected semantics. Taking the example from above picture we want to hoist the `console.log` into another function (maybe imported from another module). This isn't something Svelte does today but maybe something like this:

```js
function log(arg) {
  $: console.log(arg);
}

let value = 0;

// log the value now and whenever it changes
log(value);

value = 10; // set a new value
```

For the sake of visualizing how things actually behave I'm going to "compile" these down to Solid's explicit runtime syntax. Although this being runtime based isn't a requirement.

```js
function log(arg) {
  createEffect(() => console.log(arg());
}

const [value, setValue] = createSignal(0);

// log the value now and whenever it changes
log(value); // or log(() => value())

setValue(10); // set a new value
```

All function arguments get wrapped in functions (or pass the function straight through). All local scoped variables get called as functions.

How about if we want to create a derived value? In our new reactive world that might look like:

```js
let value = 0;
const doubleValue = value * 2;

// log double the value now and whenever it value changes
log(doubleValue);

value = 10; // set a new value
```
Or we could even hoist it out:
```js
function doubler(v) {
  return v * 2;
}

let value = 0;
const doubleValue = doubler(value);
```
Which could compile to:
```js
function doubler(v) {
  return () => v() * 2;
}

const [value, setValue] = createSignal(0);
const doubleValue = doubler(value);
```
You might be scratching your head at this example because well does anything ever run? Well it doesn't unless it needs to. As in it is used in a side effect denoted by `$:`. We have a lazy evaluated language that only runs code when absolutely needed. 

Our derived value is still assigned to a `const` so it remains consistent. No need for new syntax to know exactly what its behavior is. In a sense reactive values don't escape their local scope like in Svelte from a mutation standpoint but they do from a tracking standpoint. The retains clear control while affording the convenience of local mutation.

This "every expression is reactive" can extend to language primitives as well. In a similar way to how Solid transforms ternaries in JSX we could look at things like `if` and `for` statements and compile them accordingly.

```js
let value = 0;

if (value < 5) {
  log("Small number");
} else log("Large number");
// logs "Small number"

value = 10;
// logs "Large number"
```
This code would end up running both branches of the `if` once the condition changes. And those side effects don't need to `console.logs` at all and could be anything like maybe JSX.

What if you could write components like this and have it work with minimal executing fine-grained reactivity.

```js
function Component({ visible }) {
  let firstName, lastName = "";
  if (!visible) return <p>Hidden</p>;

  // only do this calculation when visible
  const fullName = `${firstName} ${lastName}`

  return <>
    <input onInput={e => firstName = e.target.value} />
    <input onInput={e => firstName = e.target.value} />
    <p>{fullName}</p>
  </>
}
```

## Just a taste

Honestly, there is a ton of details to work through. Like loops for example. We naturally want a `.map` operator rather than a `for` in this paradigm so how do we reconcile that? However what this has going for it is, it is analyzable and the pattern applied consistent.

Performance of such a system might require a lot more consideration. I think this actually has more potential with additional analysis and compile time approaches. Looking at what `let`/`const` are actually stateful could inform what to wrap or not. And once on that path, well, this goes many places. It could be used as a tool for things like partial hydration to know exactly what code actually can update and be sent to the browser.

Honestly this is just an idea for now. And I have a lot more thoughts on how this could function. But with all the recent discussions I thought someone might be interested in exploring this and I encourage them to reach out and discuss!