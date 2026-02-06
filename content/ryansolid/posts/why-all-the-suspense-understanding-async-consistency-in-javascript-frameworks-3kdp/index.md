---
{
title: "Why all the Suspense? Understanding Async Consistency in JavaScript Frameworks",
published: "2021-12-14T19:54:19Z",
edited: "2021-12-14T20:14:27Z",
tags: ["javascript", "webdev", "react", "solidjs"],
description: "I had someone recently reach out to me to ask \"What is Suspense in the general sense?\" They said all...",
originalLink: "https://dev.to/this-is-learning/why-all-the-suspense-understanding-async-consistency-in-javascript-frameworks-3kdp",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

I had someone recently reach out to me to ask "What is Suspense in the general sense?" They said all they could find was [React](https://reactjs.org) resources. And I told them that made sense they coined the term. But looking around I realized it was more than that.

When I look at the topic as explained in most articles it talks about the symptoms of the Suspense component but not really what it is. So I'm going to try to show today why it is so much more than a component that renders placeholders.

## Consistency in User Interfaces

Consistent display of information is a fundamental expectation of a good user interface. If you show users inconsistent information within the same page(without indicating it) it erodes trust.

![Inconsistent Avatar](./lxd9x6okpctcrs8j04kh.png)

> From Michel Westrate's [Becoming Fully Reactive: An in-depth explanation of MobX](https://medium.com/hackernoon/becoming-fully-reactive-an-in-depth-explanation-of-mobservable-55995262a254)

If your avatar is updated in one place and not another can you trust that what you are reading is up to date? You might be tempted to reload the browser page just in case. If the count of comments doesn't match the number of comments you see, even if the number is smaller you might assume you are missing something. But there are more consequential glitches, what about prices on products not matching?

This goes beyond what you can see. What happens if the internal state of our web app doesn't match what we are displaying to the end-user. Could that cause them to make decisions they otherwise would not make? Decisions of consequence? And could they not even be aware of it if you are showing them one thing and doing another?

Sure on the web, we are accustomed to the fact that what we see might not be the latest. There is always a delay to send it over the wire compared to the current state of the backend. While this can lead to things being out of date and certain requests we make being rejected, but inconsistent interfaces could put us in a scenario where the application believes it is doing the right thing and passes validation and it is only the end user left unaware.

Luckily, we have tools built for this. Generally, modern UI libraries and frameworks are all built with consistency in mind.

---

## Consistency in Frameworks

The simplest form of consistency is ensuring that derived state stays in sync with its source state. For instance if you had a state `count` a state `doubleCount` would always be in fact double that count. In a reactive library we often refer to this as `glitch-free` execution. It might look something like this:

```js
const [count, setCount] = useState(1);
const doubleCount = useMemo(() => count * 2, [count]);
```

Different frameworks have different ways to ensure this relationship holds. In [React](https://reactjs.org) state updates aren't applied immediately in so you continue to see the previous state until a time that [React](https://reactjs.org) applies all the state at the same time. Reactive libraries like Vue or [Solid](https://solidjs.com) tend to more aggressively update so that on the next line after an update not only is the source data updated but all derived data.

```js
// React
setCount(20);
console.log(count, doubleCount); // 1, 2

// Solid
setCount(20);
console.log(count, doubleCount); // 20, 40
```

In this scenario, the difference is inconsequential as in both cases they are consistent. In the end, it has a similar result. Looking from the outside state updates are atomic, applying in all places at the same time.

---

## Async Consistency

The thing is with glitch-free libraries whether the updates happen now or sometime later they all get applied synchronously. All updates are with the same tick and they all see each other. This is essential to have consistency guarantees. But what happens if everything cannot be calculated synchronously?

This is a pretty hard problem and it's been the subject of many academic papers. Even stuff related to JavaScript ecosystem like [this paper on Elm from 2013](http://people.seas.harvard.edu/~chong/pubs/pldi13-elm.pdf). But to illustrate the problem consider our `count` and `doubleCount` again but pretend we need to go to the server to calculate `doubleCount`.

```js
// Not real React code, just for illustrative purposes
const [count, setCount] = useState(1);
const doubleCount = useMemo(async () =>
  await fetchDoubleCount(count)
  , [count]
);

// somewhere else:
setCount(20);
```

Now our `count` would start at 1 and `doubleCount` would initially be undefined while it was fetching putting us in an inconsistent state. At some point later when it resolved `doubleCount` would be 2 and we would be consistent again. This happens later when we set `count` to 20. `doubleCount` would be value 1 until it settled at 40. If you were logging this in a `useEffect` you might see:

```js
1, undefined
1, 2
20, 1
20, 40
```

That isn't unexpected but it isn't consistent. And here lies the problem. There are only 3 possible outcomes to prevent our users from seeing this inconsistent state:

### 1. Bail out

Show something instead of the inconsistent state. Some sort of loading indicator to hide the inconsistency from the end-user and let things settle in the background until it is ready to be displayed.

### 2. Stay in the Past

Don't apply any of the changes and continue to show things as they were until the new content is ready to be displayed.

### 3. Predict the Future

Apply the changes immediately and show the future value while the asynchronous state is updating, and then when it is done replace it (but it should already be the same thing).

---

Well, the first one is relatively easy compared to the others as a general solution. We do it all the time. We might apply the source changes right away and then show a loading indicator until we are ready to show updated content. And many people and libraries saw Suspense and stopped there.

But what if we wanted to do more. Removing content and replacing it after some time can be a rather jarring user experience. I think all of us would love to live in the future but there is a certain unpracticality in this unless the user is performing a mutation. These "optimistic updates" are a great tool but they aren't perfect and aren't always applicable. If you are just trying to fetch the latest data, well you don't have what you haven't received yet.

![Image description](./t438cxofqb58i1zrf2bi.jpg)

So let's stay in the past. The tricky part is how do we trigger the upcoming async requests if we don't apply any data changes?

Well, we can make a copy of the state we wish to update in the future. Like we can have `count`, and `futureCount` and have `doubleCount` be derived from `futureCount` instead and only apply `futureCount`'s value back to `count` when everything has resolved. But this gets tricky. What if there are more than one thing fetching and multiple different sources. We'd need to clone everything downstream of that change.

And that's what is being done more or less with [Transitions](https://github.com/reactwg/react-18/discussions/41) in [React](https://reactjs.org) or [Solid](https://solidjs.com). Concurrent Rendering exists so that the app can stay in one state while we are safe to render a new updated reality and only commit those changes when everything is settled. It is a systematic way of staying consistent in the past until we are ready.

Why concurrency though? Well, you are still displaying UI to the end-user so you don't want it to just stop working completely. Things like animations and other non-destructive interactions. It means more work reconciling the changes in the end but ultimately this is an end-user experience feature.

---

## Putting it all Together

Suddenly [React](https://reactjs.org)'s decision for `setState` to stay in the past doesn't look so unusual. You don't know what might cause asynchronous derived state downstream so you would need to hedge on the side of not updating until you know. That being said these frameworks still have explicit opt-in to concurrent rendering for the same reason.

Picturing writing a component that creates and updates some state. It would be very unusual if some downstream child component that received the props was responsible for isolating your state change in a Concurrent Transition by virtue of that state being a dependency. This behavior needs to be opt-in.

And similarly, it may be important to be able to opt out of this behavior. Sometimes some amount of inconsistency is warranted or even desirable. For example, if you need to see the data as fast as possible.

All in all, Suspense and Transitions provide very useful tools for handling the problem of making our user interfaces consistent. That's a big benefit to end-users. It isn't about performance. It isn't just about data fetching. It's about making it easier to create UIs that users can trust, that behave in expected ways, and that offer a smooth experience no matter how they navigate your web application.
