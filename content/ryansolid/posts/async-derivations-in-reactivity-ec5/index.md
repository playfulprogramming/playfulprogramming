---
{
title: "Async Derivations in Reactivity",
published: "2024-08-06T17:10:48Z",
edited: "2024-08-06T20:28:58Z",
tags: ["javascript", "webdev", "signals", "solidjs"],
description: "Congratulations on making it through the series thus far. But this is where things start to go off...",
originalLink: "https://dev.to/this-is-learning/async-derivations-in-reactivity-ec5",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "Derivations in Reactivity",
order: 3
}
---

Congratulations on making it through the series thus far. But this is where things start to go off the rails. Reactivity might involve scheduling but most of what we've looked at is synchronous, where the state can be checked at any point in time.

Async changes everything. There is little prior art in the JavaScript space where we go next. Instead of pulling from the ecosystem, let's explore how we could approach this using what we've learned so far.

---

## Why Async Reactivity?

Async is hard. It is a lot easier to think of things as a sequence that happens one step after the other. It's why we have things like `async`/`await`:

```ts
async function fetchUser(id: number): Promise<User> {
  const res = await fetch(`/api/user/${id}`);
  const user = await res.json();
  console.log("user", user);
  return user;
}
```

But making it appear sequential isn't the end of our problems. The caller also needs to know something is async:

```ts
// didn't await it
const user1 = fetchUser(1);
console.log("I will log before user 1 is fetched");

// did await
const user2 = await fetchUser(2);
console.log("I will log after user 2 is fetched");
```

Async/Await is said to color the functions that use it. Once you are dealing with async data the caller also needs to be async and so on until you are in a position where you no longer care to wait for the results.

It also unintentionally can cause waterfalls because it makes our model block.

```ts
async function ShowSomeUI() {
  const user1 = await fetchUser(1);
  // only start fetching 2 after 1 completes
  const user2 = await fetchUser(2); 
  
  return <>
    <User user={user1} />
    <User user={user2} />
  </>
}
```

We have ways to parallelize but it is still blocking:

```ts
async function ShowSomeUI() {
  const [user1, user2] = await Promise.all([fetchUser(1), fetchUser(2)]);
  
  return <SharedLayout>
    <ShowUnrelatedUI />
    <User user={user1} />
    <User user={user2} />
  </SharedLayout>
}
```

What if that `<ShowUnrelatedUI />` had other async dependencies? You still have a waterfall. What if you could display `<ShowUnrelatedUI />` before the async stuff loaded? What if there is other state that could try to update independently while the async requests were in flight?

All these reasons make async functions a poor choice for interactive components. It is a mismatch with the expectation of independently interactive parts.

What you want to do is not `await` and pass the promise down to where it is used:

```ts
function ShowSomeUI() {
  const user1 = fetchUser(1);
  const user2 = fetchUser(2); 
  
  return <SharedLayout>
    <ShowUnrelatedUI />
    <User user={user1} />
    <User user={user2} />
  </SharedLayout>
}
```

But this is awkward for 2 reasons.

First, your components expect a Promise as their props. `props.user` is a `Promise<User>` rather than a `User`. So we have a new type of coloration as every downstream prop needs to handle the potential of this being a Promise. This includes derived values:

```ts
function User(props: {user: Promise<User>}) {
  return <>
    <h3>{props.user.then(u => u.firstName)}'s Profile</h3>
    <Address address={props.user.then(u => u.address)} />
  <>
}
```

We could `await` here. It does need to be resolved at some level but are we doing so because it's the right location or because we need to escape from Promise hell? Is it because we don't want to write 2 versions of every component or update existing components to handle Promises that didn't before?

The second concern is that we aren't only dealing with Promises, but Promise factories. You don't just fetch a user, you fetch a user based on a prop. This prop can change and so must the Promise as it can only resolve once. But you also don't want to fetch when unrelated state changes.

```ts
function ShowSomeUI(props: {id: number}) {
  const user = fetchUser(props.id); // id can update
  
  return <User user={user} />
}
```

If you are doing things like Signals to update your UI, you already have the means to accomplish this. Signals have all the properties you want to solve this problem.

They are lazily evaluated to where they read which pushes resolution down to the leaves of the UI tree. You can write the await higher in the UI tree but only block lower where it is used. With things like prop transformation(found in Solid, and Qwik) you pass the type through rather than the Promise or Signal of that type.

They easily derive data. They can generate new promises when props change. They share a common interface between sync and async.

When combined with fine-grained rendering components don't re-run so you don't need to worry about having stable references or refetching. You can put them at the top of your component and they won't be impacted by unrelated state changes.

---

## Colorless Async

![Image description](./t82ykj7mdjxz1ozi8o3l.jpg)

One could almost argue today, async with Signals is colorless. There is a difference between a Signal that holds a synchronous value and one that holds an async one.

```ts
// sync
const [user1] = createSignal<User>(user1JSON);

// async
const [user2, setUser2] = createSignal<User | undefined>();
fetchUser(2).then(setUser2)
```

The async one has the potential of being `undefined` before it is resolved. There is much less impact in having a null check. Passing in defaults early removes tension. But as someone who has experienced firsthand that TypeScript can't identify idempotent functions, the second `undefined` enters the equation a lot of `!` and unnecessary `?.` show up.

Authoring a component that handles async means writing one that accepts `undefined` values. Well at least in Signals land. Not so in recent React. If React 19 encounters something(with `use`) that isn't resolved it just throws. Your user code doesn't need null checks because it won't get to that point.

They've solved the opposite part of the problem. Downstream of async resolution, there is no coloration. But upstream they need to pass promises around. This encourages blocking higher to avoid excessive upstream coloration. Signals allow us to resolve async higher without blocking UI at that point.

How do you get the best of both worlds? Create a Signals library that throws on unresolved async values.

---

## Deriving Async

The first step is identifying "what is async" vs just `undefined`. You might start with if a signal or derived node receives a Promise or Async Iterable, now it's Async. But if you remember from our last article, if derived nodes are lazily evaluated, that won't work well. Async that throws needs to be scheduled. So unfortunately existing basic primitives won't do.

We could bring back eager derivations, and add the special Promise/Async Iterable handling, but without context of whether that is desirable I will introduce a new primitive:

```ts
const user = createAsync(() => fetchUser(props.id));

// we can derive from it too. Notice no null check
const firstName = createMemo(() => user().firstName)

// use it in an effect (split like in the last article)
createEffect(firstName, (name) => console.log(name));
```

The way this would work is that when this code initially runs:

> 1. The fetch for the user with `props.id` is executed

2. The firstName memo is created but not run
3. The effect is scheduled
4. The front half of the effect runs, and reads `firstName`.

- `firstName` hasn't been evaluated so it runs. It reads `user`.
- It sees that `user` is in flight and throws.
- `firstName` catches the node and adds it as a dependency, then throws itself.
- The front half of the effect catches the node and adds it as a dependency and bails out of running the side effect.

5. `user` resolves, notifying down to the effect.
6. The front half of the effect runs, and reads `firstName`.

- `firstName` has been marked as potentially dirty so it runs. It reads `user`.
- `user` returns the resolved value
- `firstName` returns its resolved value
- The front half of the effect stores the updated value

7. The side effect runs `console.log`ing the user's name.

On update, it would run mostly the same except it would start from the `id` updating and then run steps 4 - 7.

Let's go back to our example:

```ts
function ShowSomeUI(props: { id: number }) {
  const user = createAsync(() => fetchUser(props.id));
  
  return <SharedLayout>
    <ShowUnrelatedUI />
    <User user={user()} />
  </SharedLayout>
}

function User(props: {user: User}) {
  return <Suspense fallback="Loading"}>
    <h3>{props.user.firstName}'s Profile</h3>
    <Address address={props.user.address} />
  </Suspense>
}
```

We can already see that this cleans things up considerably. Our user is a Signal that automatically updates. Our user prop is of type `User` now without being possibly `undefined` and we push async blocking down to where it is used. Of course, having a broken UI where part of it is missing and others appear isn't acceptable so we still need something like Suspense to manage the display of placeholders.

But the point is:

- Address component doesn't need to be aware of async.
- Derived state like `firstName` or `address` can be accessed without null checks
- There is no cost to hoisting up fetching.. if `user` was passed to other components from `ShowSomeUI` or not we don't need to block anything.
- We can eagerly render everything except the textNodes that show name and address (although we might not show them yet).
- Suspense can be put anywhere above the first read to manage placeholders as we see fit.

Suspense in this case would be something triggered by the `renderEffect` hierarchy but async would flow through the Pure part of the calculations uninhibited.

---

## Everything is Potentially Reactive with Colorless Async

So problem solved? The perfect Async system is out there for us to implement? Well with everything there is a cost. This shouldn't be a steep cost but it is one that we tend to shortcut. I want this to sink in:

> Everything is Potentially Reactive with Colorless Async

When it comes to templating we are used to treating everything as reactive as the default. For components, it varies. In SolidJS we did half the job. We `untrack` all the components so your app doesn't blow up when you access reactivity top-level. But we let you leverage this fact for brevity.

{% embed https://x.com/devongovett/status/1629545561635389440 %}

While I disagree that this has anything to do with [locality of thinking](https://dev.to/this-is-learning/thinking-locally-with-signals-3b7h), it can lead to confusion at first when things don't work. We have ESLint rules for that but Solid isn't so strict here as to error. Maybe it should be?

### Deriving Signals from `props`

![Image description](./tf1rewk5dy8ppoplcny4.png)

I have an example I'm sure every developer has done at some point. Have you ever had state you initialize from a prop?

Let's consider the difference between:

```ts
const [count, setCount] = createSignal(props.count);

const doubleCount = createMemo(() => props.count * 2);
```

The Signal(state) has the initial value and the memo updates with the `props.count`. This example works similarly in Solid and React but for different reasons. React needs to retain the state so it only grabs the value initially. This is oddly inconsistent for React given it is probably the only time it will ignore a prop change that is accessed top-level. In Solid, this is the impact of the implicit `untrack`. In both cases you end up with `useEffect` or equivalent to synchronize state.

Now consider the difference between:

```ts
const [count, setCount] = createSignal(props.count);

const doubleCount = createMemo(() => untrack(() => props.count) * 2);
```

Yes, this is for illustrative purposes only. A memo that `untrack` its only source is useless. Both of these only rely on the initial value. Updating `props.count` won't change either of them.

So what happens if `props.count` becomes an async value in the future?

Then it becomes a reactive value you care to listen to. You wouldn't want the count to initialize as `undefined` if you expect it to be `number` from the prop types.

In fact with `createSignal`, we would throw here if the async resource underlying `props.count` had never resolved. And throw up to the nearest decision point. Maybe 3 ancestors up was a ternary expression. Upon async resolution, it would re-render the whole branch from that decision. But not a cheap VDOM re-render, a full DOM render, and if there were more of these downstream it'd keep doing it until everything was resolved.

Whereas with `createMemo` nothing would happen until it was read. When evaluated it would catch the the thrown async node itself and only apply to the specific binding where it was being rendered.

This is drastically different behavior from previously semantically similar code. You would never want something to throw the way the top-level access did with `createSignal`. It's as bad as if we didn't `untrack` components top-level, but with async there is no implicit guard if values aren't allowed to be `undefined`.

### Can Async even be `untrack`-able?

```ts
const [multiplier, setMultiplier] = createSignal(2);
const doubleCount = createMemo(
  () => untrack(() => props.count) * multiplier()
);
```

This is the crux of it. Not only does async make everything reactive it circumvents `untrack`. What if you have an async value that you read under an `untrack` and there are other reactive values that are read after. If `props.count` is async and you throw when reading it, then you need to re-run `doubleCount` when `props.count` resolves. While `props.count` will not be added as a dependency on the subsequent runs the first time it runs it is effectively a dependency.

You can't assume because something is `untrack`ed that you want it never to resolve. That would break anything downstream just because something became async that wasn't before.

So how do you opt out of this behavior? Not easily. If you only ever read the latest resolved value or `undefined` instead of throwing that would work but it changes the semantics of the code.

```ts
const [multiplier, setMultiplier] = createSignal(2);
const doubleCount = createMemo(
  () => latest(() => props.count) * multiplier()
);
```

You can't multiply `undefined` by a number. Even if you added the necessary null checks in scope here where you know there is a `latest` wrapper, this doesn't help you with an arbitrary reactive expression. You would need to ensure null checks for every potentially async value within the `latest` bounds without having the Type information to support that as each would believe they were of type `T` and not `T | undefined`.

At best you could make this opt-out at the source of the async:

```ts
const count = createAsync(() => fetchCount());

<Multiplier count={count.latest || 0} />
```

Where the `.latest` field is `number | undefined`. Since Multiplier is expecting a number we provide a default value. But this is not composable behavior.

We can't change code semantics at runtime and expect things not to break. So not only is everything potentially reactive with Colorless Async. It is inescapably so.

---

## Finding a Consistent Model

![Image description](./oyyy78qd02obllf8xb2m.png)

So is Colorless Async a lie?

Well, is it colored when everything is the same color? If we default to everything possibly being reactive and that reactivity is inescapable then we remove the choice. For better or worse we embrace the single model, very much in the same way one embraces the reactivity of a given library in the first place.

Perhaps it is a different model than we are used to? Solid's API has been designed with the intent of treating all data as potentially reactive. That is why it doesn't have `isSignal` and does prop wrapping. Svelte's Runes follow a similar philosophy preventing you from even holding reference to the underlying Signal. The React team has positioned their compiler as a way to more naturally experience React's full-component reactivity. But the common ground is while there is an explicit syntax for expressing state, reactivity flows through these systems permissively.

It demands complete compliance. In the way the React Compiler only works if you follow the rules of React, this approach requires you to strictly follow the rules of Reactivity--the idea that all data could be reactive and that "what can be derived, should be derived".

```js
// don't do this
const [count, setCount] = createSignal(props.count);
createEffect(() => setCount(props.count));

// do this (assuming this expresses a derived Signal)
const [count, setCount] = createSignal(() => props.count);
```

This only enforces what we've always hinted at. And in that it is beautiful. Why hasn't updatable state been derivable? How many `useEffect` disasters would have been avoided if we never needed to synchronize props? How much later would effects be introduced to beginners if you could derive this way? It is crazy to think that over a decade of deeply getting into reactivity, I'm still realizing things.

Next time we will look at another relatively underexplored area of Reactivity, mutable state and derivations. We will look at the nature of diffing and how immutable and mutable reactivity can co-exist.
