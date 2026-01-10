---
{
title: "Mutable Derivations in Reactivity",
published: "2024-10-23T22:59:58Z",
tags: ["javascript", "webdev", "reactivity", "signals"],
description: "All this exploration into scheduling and async made me realize how much we still don't understand...",
originalLink: "https://dev.to/this-is-learning/mutable-derivations-in-reactivity-2ffl",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "26115",
order: 1
}
---

All this exploration into scheduling and async made me realize how much we still don't understand about reactivity. A lot of the research originated from modeling circuits and other real-time systems. There has been a sizeable amount of exploration in functional programming paradigms as well. I feel this has largely shaped the modern perspective we have on reactivity.

When I first saw Svelte 3, and later the React compiler, people challenged that these frameworks were fine-grained in their rendering. And to be honest, they share a lot of the same characteristics. If we were to end the story with Signals and the derived primitives we've seen so far you could argue equivalence, except for these systems not allowing their reactivity to live outside their UI components.

But there is a reason that Solid never needed a compiler to accomplish this. And why to this day it is still more optimal. It isn't an implementation detail. It's architectural. It is related to reactive independence from UI components but it's more than that.

----------------------

## Mutable vs Immutable

In the definition, the ability to change vs not. But that isn't what we mean. We'd have pretty boring software if nothing ever changed. In programming, it is whether a value can be mutated. If a value cannot be mutated then the only way to change the value of a variable is to re-assign it.

From that perspective, Signals are Immutable by design. The only way they know if something has changed is by intercepting when the new value is assigned. If someone were to mutate their value independently nothing reactive would happen.

```js
const [signal, setSignal] = createSignal({ a: 1 });

createEffect(() => console.log(signal().a)); // logs "1"

// does not trigger the effect
signal().a = 2; 

setSignal({ a: 3 }); // the effect logs "3"
```

Our reactive system is a connected graph of immutable nodes. When we derive data we return the next value. It might even be calculated using the previous value.

```js
const [log, setLog] = createSignal("start");

const allLogs = createMemo(prev => prev + log()); // derived value
createEffect(() => console.log(allLogs())); // logs "start"

setLog("-end"); // effect logs "start-end"
```

But something interesting happens when we put Signals in Signals and Effects in Effects.
```js
function User(user) {
  // make "name" a Signal
  const [name, setName] = createSignal(user.name);
  return { ...user, name, setName };
}

const [user, setUser] = createSignal(
  new User({ id: 1, name: "John" })
);

createEffect(() => {
  const u = user();
  console.log("User", u.id);
  createEffect(() => {
     console.log("Name", u.name());
  })
}); // logs "User 1", "Name John"

// effect logs "User 2", "Name Jack"
setUser(new User({ id: 2, name: "Jack" })); 

// effect logs "Name Janet"
user().setName("Janet");
```
Now we cannot only change the user but also change a user's name. More importantly, we can skip doing unnecessary work when only the name changes. We don't re-run the outer Effect. This behavior isn't a consequence of where the state is declared but where it is used.

This is incredibly powerful, but it is hard to say our system is Immutable. Yes the individual atom is, but by nesting them we have created a structure optimized for mutation. Only the exact part of the code that needs to execute runs when we change anything.

We could get the same results without nesting, but we'd do so by running additional code to diff:

```js
const [user, setUser] = createSignal({ id: 1, name: "John" });

let prev;
createEffect(() => {
  const u = user();
  // diff values
  if (u.id !== prev?.id) console.log("User", u.id);
  if (u.name !== prev?.name) console.log("Name", u.name);
 
  // set previous
  prev = u;
}); // logs "User 1", "Name John"

// effect logs "User 2", "Name Jack"
setUser({ id: 2, name: "Jack" }); 

// effect logs "Name Janet"
setUser({ id: 2, name: "Janet" });
```

There is a fairly clear tradeoff here. Our nested version needed to map over the data coming in to generate the nested Signals, and then essentially map over it a second time to break apart how the data was accessed in independent effects. Our diff version could use the plain data but needs to re-run all the code on any change and diff all the values to determine what has changed.

Given that diffing is fairly performant, and that mapping over data especially deeply nested is cumbersome people generally have opted for the latter. React is basically this. However, diffing will only get more expensive as our data and work related to that data increases.

Once resigned to diffing it is unavoidable. We lose information. You can see it in the examples above. When we set the name to "Janet" in the first example we are telling the program to update the name `user().setName("Janet")`. In the second update, we are setting a whole new user and the program needs to figure out what has changed everywhere the user is consumed.

While nesting is more cumbersome it will never run unnecessary code. What inspired me to create Solid was realizing that the biggest problem with mapping nested reactivity could be solved with Proxies. And reactive `Stores` were born:

```js
const [user, setUser] = createStore({ id: 1, name: "John" });

createEffect(() => {
  console.log("User", user.id);
  createEffect(() => {
     console.log("Name", user.name);
  })
}); // logs "User 1", "Name John"

// effect logs "User 2", "Name Jack"
setUser({ id: 2, name: "Jack" }); 

// effect logs "Name Janet"
setUser(user => user.name = "Janet");
```
Much better.

The reason this works is that we still know that the name is updated when we `setUser(user => user.name = "Janet")`. The setter for the `name` property is hit. We achieve this granular update, without mapping over our data or diffing.

Why does this matter? Picture if you had a list of users instead. Consider an immutable change:
```js
function changeName(userId, name) {
  // immutable
  setUsers(users.map(user => {
    if (user.id !== userId) return user;
    return { ...user, name };
  }));
}
```
We get a fresh array with all existing user objects except the new one with the updated name. All the framework knows at this point is the list has changed. It will need to iterate over the whole list to determine if any rows need to move, be added or removed, or if any row has changed.  If it has changed, it will re-run the map function and generate the output that will be replaced/diffed against what is currently in the DOM.

Consider a mutable change:
```js
function changeName(userId, name) {
  // mutable
  setUsers(users => {
    users.find(user => user.id === userId).name = name;
  });
}
```
We don't return anything. Instead, the one signal that is the name for that user updates and runs the specific effect that updates the place we show the name. No list recreation. No list diffing. No row recreation. No DOM diffing.

By treating mutable reactivity as a first-class citizen we get an authoring experience similar to immutable state but with capabilities that even the smartest compiler cannot achieve. But we aren't here today to talk about reactive Stores exactly. What does this have to do with derivations?

---------------------

## Revisiting Derivations

Derived values as we know them are immutable. We have a function that whenever it runs it returns the next state.

> state = fn(state)

When the input changes they re-run and you get the next value. They serve a couple of important roles in our reactive graph.

First, they serve as a memoization point. We can save work on expensive or async calculations if we recognize the inputs haven't changed. We can use a value multiple times without recalculating it.

Secondly, they act as convergence nodes. They are the "joins" in our graph. They tie multiple different sources together defining their relationship. This is the key to things updating together, but it also goes to reason that with a finite number of sources and an ever-increasing amount of dependencies between them, everything would eventually become entangled.

{% twitter 1252839841630314497 %}

It makes a lot of sense. With derived immutable data structures you only have "joins" not "forks". As complexity scales you are destined to merge. Interestingly reactive "Stores" don't have this property. Individual parts update independently. So how do we apply this thinking to derivation?

----------------------

## Following the Shape

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ykbj4lwlwzehlc20g444.png)

Andre Staltz published an [amazing article](https://staltz.com/javascript-getter-setter-pyramid) several years back where he linked together all types of reactive/iterable primitives into a single continuum. Push/pull all unified under a single model.

I've long been inspired by the systematic thinking Andre applied in this article. And I've long been struggling with the topics that I've been covering in this series. Sometimes understanding that the design space exists is enough to open up the right exploration. Sometimes the shape of the solution is all you need to understand at first.

For example, I realized long ago that if we wanted to avoid synchronization for certain state updates we needed a way of deriving  writable state. It lingered in the back of my mind for several years but finally [I proposed](https://github.com/solidjs/solid-workgroup/discussions/2) a writable derivation.

```js
const [field, setField] = createWritable(() => props.field);
```
The idea is that it is always resettable from its source, but one can apply shortlived updates on top until the next time the source changes. Why use this over an Effect?

```js
const [field, setField] = createSignal();
createEffect(() => props.field);
```

Because, as covered in depth in part one of this series, the Signal here could never know that it depended on `props.field`. It breaks apart the consistency of the graph because we can't track back its dependencies. Intuitively I knew putting the read inside the same primitive unlocks that capability. In fact `createWritable` is implementable completely in userland today.

```js
// simplified to not include previous value
function createWritable(fn) {
  const computed = createMemo(() => createSignal(fn()))
  return [() => computed()[0](), (v) => computed()[1](v))]
}
```
It is just a higher-order Signal. A Signal of Signals or as Andre called it a "Getter-getter" and "Getter-setter" combination. When the passed in `fn` executes the outer derivation (`createMemo`) tracks it and creates a Signal. Whenever those dependencies change a new Signal is created. However, until replaced, that Signal is active and anything that listens to the returned getter function subscribes to both the derivation and the Signal keeping the dependency chain.

We landed here because we followed the shape of the solution. And over time following that shape, I now believe as indicated at the end of the last article this mutable derived primitive is less a Writable  Derivation but a Derived Signal.

```js
// normal signal
const [count, setCount] = createSignal(5);

// derived signal
const [field, setField] = createSignal(() => props.field);
```

But we are still looking at immutable primitives. Yes, this is a writable derivation but the value change and notification still occur wholesale.

---------------
## The Problem with Diffing

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tr6sv5ygvix3odtt4p4n.png)

Intuitively we can see there is a gap. I could find examples of things I wanted to solve but couldn't ever land on a single primitive to handle that space. I realized part of the problem is the shape.

On one hand, we could put derived values into Stores:
```js
const [store, setStore] = createStore({
  value,
  get derivedValue() {
    this.value * 2;
  }
})
```
But how can this change shape dynamically, ie generate different getters without writing to the Store?

On the other hand, we could derive dynamic shapes from Stores but their output would not be a Store.
```js
const value = createMemo(() => getNextValue(store.a, store.b));
```
If all derived values are made from passing in a wrapper function that returns the next value, how can we ever isolate change? At best we could diff the new results with previous and apply granular updates outward. But that assumed we always wanted to diff.

I read an article from Signia team about [incremental computeds](https://signia.tldraw.dev/docs/incremental) implementing something like Solid's `For` component in a generic way. However, beyond the logic being no simpler I noticed:

* It is a single immutable Signal. Nested changes can't independently trigger.

* Every node in the chain needs to participate. Each needs to apply its source diff to realize updated values and, with the exception of the end node, produce its diff to pass down.

When dealing with immutable data. References will be lost. Diffs help get this information back but then you pay the cost over the whole chain. And in some cases like with fresh data from the server, there are no stable references. Something needs to "key" the models and that isn't present in Immer which is used in the example. React has this ability.

That's when it occurred to me this library was built for React. The assumptions were already baked in that there would be more diffing. Once you resign yourself to diffing, diffing begets more diffing. That is the unavoidable truth. They had created a system to avoid the heavy lifting by pushing out incremental costs across the whole system.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/dg0mr3dvyqfegf491tdm.png)

I felt I was trying to be too clever. The "bad" approach while unsustainable is undeniably the more performant.

------------------------

## The Grand Unifying Theory of (Fine-Grained) Reactivity

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/dbhliwaxfcj0jg5vz7sj.jpg)

There is nothing wrong with modeling stuff immutably. But there is a gap.

So let's follow the shape:
```js
// immutable atom
const [todo, setTodo] = createSignal({ id: 1, done: false });

// next = fn(prev)
setTodo(todo => ({ ...todo, done: true }));

// immutable derivation - next = fn(prev)
const todoWithPriority = createMemo(todo => (
  { ...todo, priority: priority() }
), initialTodo);
```
What becomes apparent is the derived function is the same shape as the Signal setter function. In both cases, you pass in the previous value and return the new value.

Why don't we do this with Stores?

```js
// mutable proxy
const [todo, setTodo] = createStore({ id: 1, done: false });

// mutate(current)
setTodo(todo => { todo.done = true; });

// mutable derivation - mutate(current)
const todoWithPriority = createProjection(todo => {
  todo.priority = priority();
}, initialTodo);
```

We can even bring in the derived sources:
```js
// immutable
const [todo, setTodo] = createSignal(() => props.todo);

// mutable
const [todo, setTodo] = createStore(todo => {
  // Solid provided diff function to mutate `todo` to match `props.todo` 
  reconcile(props.todo)(todo); 
});
```

There is a symmetry here. Immutable change always constructs the next state, and mutable change mutates the current state into the next state. Neither do diffing. If the `priority` changes on the immutable derivation (`Memo`) then the whole reference is replaced and all side effects run. If the `priority` changes on the mutable derivation (`Projection`) only things that listen to `priority` specifically update.

------------------------

## Exploring Projections 

Immutable change is consistent in its operations, as it only needs to build the next state regardless of what changes. Mutable may have different operations depending on the change. Immutable change always has the unmodified previous state to work with while mutable change does not. This impacts expectations.

We can see this in the previous section with the need to use `reconcile` in the example. When a whole new object is getting passed in with Projections you aren't content with replacing everything. You need to incrementally apply the changes. Depending on what updates it might need to mutate in different ways. You can apply all changes each time and leverage a Store's internal equality checks:

```jsx
// mutable
const todoWithPriority = createProjection(todo => { 
  todo.priority = priority();
  todo.title = title();
  todo.done = done();
});
```
But this becomes prohibitive fast as it only works shallowly. Reconciling (diffing) is always an option. But often what we want to do is only apply what we need to. This leads to more complicated code but can be much more efficient.

Modifying an excerpt from [Solid's Trello clone](https://github.com/solidjs-community/strello/blob/main/src/components/Board.tsx) we can use a Projection to either individually apply each optimistic updates, or reconcile the board to the latest update from the server.
```js
let timestamp;
const board = createAsync(() => fetchBoard());
const realizedBoard = createProjection(notes => {
  const prevTimestamp = timestamp || 0;
  timestamp === Date.now();

  // Reconcile first time or due to fresh data from the server
  if (updatedSinceLastRun(board)) {
    reconcile(applyMutations([...board()], mutations()))(notes)
    return;
  }
  // modify prev state directly with only new mutations
  applyMutations(
    notes,
    mutations()
      .filter(mut => mut.timestamp > prevTimeStamp)
  );
});
```
This is powerful because not only does it retain references in the UI so only granular updates occur but it applies mutations (optimistic updates) incrementally without cloning and diffing. So not only do Components not need to re-run, but as you make each change it doesn't need to reconstruct the whole state of the board repeatedly to realize once again very little has changed. And finally, when it does need to diff, when the server finally returns our fresh data, it diffs against that updated projection. References are kept and nothing needs to re-render.

While I believe this approach will be a huge win for real-time and local-first systems in the future, we already use Projections today perhaps without realizing it. Consider reactive map functions that include signals for the index:
```js
<For each={rows()}>
  (row, index) => <div>{index() + 1} {row.text}</div>
</For>
```
The index is projected onto your list of rows that do not contain an index as a reactive property. Now this primitive is so baseline I probably won't be implementing it with `createProjection` but it is important to understand that it is one categorically.

Another example is Solid's obscure `createSelector` API. It lets you project the selection state onto a list of rows in a performant way so that changing what is selected doesn't update every row. Thanks to a formalized Projection primitive we don't need a special primitive anymore:

```js
let previous;
const selected = createProjection(s => {
  const sId = selectedId();
  s[sId] = true;
  if (previous != null) delete s[previous];
  previous = sId;
});

<For each={rows()}>
  (row) => <tr class={selected[row.id] ? "selected" : ""}></tr>
</For>
```
This creates a Map where you look up by id but only the selected row exists. Since it is a proxy for the life of the subscription we can track properties that don't exist and still notify them when they get updated. Changing the `selectionId` will at most update 2 rows: the one already selected, and the new one being selected. We turn a `O(n)` operation to `O(2)`.

As I played with this primitive more I realized that it not only accomplished direct mutable derivation but could be used to pass through reactivity dynamically.

```js
const [store, setStore] = createStore({ user: { id: 1, name: "John", privateValue: "don't share" }})
const protectedUser = createProjection(state => {
  const user = store.user;
  state.id = user.id;
  Object.defineProperty(state, "name", {
    get() { return user.name },
    configurable: true
  })
});

createEffect(() => console.log(protectedUser.name));

// reruns the projection and the effect
setStore(s => s.user = { id: 2, name: "Jack", privateValue: "Oh No"});

// only runs the effect
setStore(s => s.user.name = "Janet");
```
This projection only exposes the user's `id` and `name` but keeps `privateValue` inaccessible. It does something interesting in that it applies a getter to the name. So while the projection re-runs when we replace the whole user, only updating the user's name can run the effect without the projection re-running.

These use cases are only a few and I admit they take a bit more to wrap your head around. But I feel that Projections are the missing link in the Signals story.

--------------------

## Conclusion

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/u1a83qzqyqounipgzsc1.jpg)

Throughout this exploration into Derivations in Reactivity over the past couple of years, I've learned a lot. My whole perspective on Reactivity has changed. Mutability instead of being seen as a necessary evil has grown on me to become a distinct pillar of reactivity. Something that isn't emulated by course-grained approaches or compilers.

This is a powerful statement that suggests a fundamental difference between immutable and mutable reactivity. A Signal and a Store are not the same thing. Neither are Memos and Projections. While we might be able to unify their APIs, maybe we shouldn't.

I arrived at these realizations by following Solid's API shape, but other solutions have different APIs for their Signals. So I wonder if they'd come to the same conclusions. To be fair there are challenges to implementing Projections and the story here isn't over. But I think this ends our thought exploration for the time being. I've got a lot of work ahead of me.

Thanks for joining me on this journey.