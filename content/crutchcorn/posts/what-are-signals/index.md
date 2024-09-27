---
{
    title: "What are Signals?",
    description: "",
    published: '2024-09-26T21:52:59.284Z',
    tags: ['javascript','angular'],
    license: 'cc-by-4'
}
---

Signals are seemingly everywhere today. Among others, there's some flavor of signals in:

- [Angular](https://angular.dev/guide/signals)
- [Vue](https://vuejs.org/guide/extras/reactivity-in-depth.html#connection-to-signals)
- [Preact](https://preactjs.com/guide/v10/signals/)
- [Solid.js](https://www.solidjs.com/docs/latest/api#createsignal)
- [Svelte](https://svelte.dev/blog/runes)
- [Qwik](https://qwik.dev/docs/components/state/#usesignal)
- [And many more](https://dev.to/this-is-learning/the-evolution-of-signals-in-javascript-8ob)

There's even [efforts to bring signals into JavaScript itself](https://github.com/tc39/proposal-signals).

Given this explosion of popularity, many are left wondering:

> What even **are** signals?!

It's a good question! Let's explore signals, how they operate under-the-hood, and how we can use them in our libraries today.

# Signals Basics

In their most basic form, signals are a method of having some state and a way of subscribing to that state.

```javascript
// This is psuedo code. This API is possible, but not
// representative of any of the tools we're looking at today.
const counter = signal(0);

// This will re-run whenever `counter` updates
counter.subscribe(() => {
	console.log(counter.get());
})

// We can call it once 
counter.set(1);

// Or any number of times
setInterval(() => {
    counter.set(count.get() + 1);
}, 1000);
```

There's a few ways to implement this, but here's a basic implementation of the API above:

```javascript
function signal(initialValue) {
    let value = initialValue;
    const subscribers = new Set();

    return {
        get: () => value,
        set: (newValue) => {
            value = newValue;
            subscribers.forEach(fn => fn());
        },
        subscribe: (listener) => {
            subscribers.add(listener);
            return () => subscribers.delete(listener);
        }
    }
}
```

> You can see another basic variant of a signals implementation in [a 5 minute lightning talk I gave at ngConf 2024](https://www.youtube.com/watch?v=cJ7AuQUBmA4).

Here, we can see how a signal has:

- An initial value
- A getter to retrieve the value
- A setter to update the value and notify subscribers
- A way to subscribe to the signal

This is incredibly useful for being able to run one bit of code when your state changes, like binding the text value of a DOM node to some JavaScript state:

```html
<button id="clicker">0</button>

<script>
	const clickerBtn = document.getElementById("clicker");
    
    const countSignal = signal(0);
    
    countSignal.subscribe(() => {
        clickerBtn.innerText = countSignal.get();
    });
    
    clickerBtn.addEventListener("click", () => {
       countSignal.set(countSignal.get() + 1); 
    });

    // ...
</script>
```

// TODO: Add iframe

Here, we can see how a signal acts as a primitive for recreating [JavaScript Reactivity](/posts/what-is-reactivity) to sync state between the DOM and JS.

# Computed Properties



# Auto-tracking





# Effects


# Glitches

