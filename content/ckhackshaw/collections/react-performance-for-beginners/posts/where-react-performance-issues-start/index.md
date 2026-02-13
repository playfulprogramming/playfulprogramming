---
{
  title: "Where React performance issues start",
  description: "Let's dive into the React fundamentals. This will help us build up a solid mental model that will allow us to understand what happens when react updates the UI.",
  published: '2026-01-06',
  tags: ["react", "javascript"],
  license: 'cc-by-4',
  collection: "react-performance-for-beginners",
  order: 1
}
---

# Intro

When I just started out learning React, one of the concepts that I initially misunderstood was **rendering**. You see, in a time before React, the term rendering was used to describe something visual. It referred to browsers painting pixels on the screen to show the UI to the user. With React however, the term has a very different meaning. 

> **Rendering is React running your component functions to figure out what the UI should look like**

It is just one part of the process of *state/prop change > render > diff > commit*.

Let's look at a basic example to illustrate this.

```js
function MyComponent() {
  return (
    <div>
      <h1>This is My Component</h1>
    </div>
  )
}
<div>
  <MyComponent>
</div>
```

# Rendering

When React encounters `<MyComponent />`, it calls the function of this component. What is even more surprising is what the function returns. It doesn't return anything that looks like HTML.

To be oddly specific, and for completeness, the return value gets transpiled into something like the following (remember JSX has to get converted to JS):

```js
React.createElement(
  "div",
  null,
  React.createElement(
    "h1",
    null,
    "This is My Component"
  )
);
```

> Each JSX element gets converted a function that looks like `React.createElement(type, props, children)`.

In the end, the return value of our component function loosely resembles something that looks like:

```js
{
  type: "div",
  props: null,
  children: {
    type: "h1",
    props: null,
    children: "This is My Component"
  }
}
```

This is a simplified representation of what people usually refer to as the Virtual DOM (VDOM). At this point, nothing on the screen has changed as yet. 

Whenever a state or prop changes, React repeats this process:

1. It calls the component function again
2. It compares the result to what it produced last time
3. It figures out the minimum set of changes needed
4. Only then does it update the real DOM

Notice where “render” sits in that pipeline, it is before the DOM is touched. This entire process is done so that React can minimize the number of updates it does to the DOM since DOM updates are expensive.

# Rendering in action

With this mental model in mind, a pattern starts to emerge. When a React app feels slow, the problem is rarely the DOM updates themselves. React is already very good at minimizing DOM updates. More often, performance issues come from the render phase, more specifically from how much work your component functions do while producing this tree.

Let's put this idea down in code to demonstrate what it looks like. We will add a new component, see the implementation of `<MyInefficientComponent/>`.

```js
function MyInefficientComponent() {
  const [text, setText] = useState('');

  // Intentionally awful render work
  const start = performance.now();
  while (performance.now() - start < 1500) {}

  return (
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Try typing..."
      />
      <p>{text}</p>
    </div>
  );
}

export default function App() {
	return (
		<div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
		<MyInefficientComponent />
		</div>
	);
}
```

You can run the code below to see this in action. As you can see, the input lags since during render, a while loop runs for approximately 1.5 seconds.

<iframe data-frame-title="React Expensive Render - StackBlitz" src="pfp-code:./react-expensive-render?template=node&embed=1&file=src%2Fmain.jsx" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

# Explanation

Let’s walk through what is actually happening in this example.

`MyInefficientComponent` has a controlled input, this just means that its value comes from React state. Every time you type, the `onChange` handler calls `setText` to update that state. However, as we already discussed above, updating state causes the component re-render, which means React calls the component function again from top to bottom.

Inside our component function, we also have the following:

```js
const start = performance.now();
while (performance.now() - start < 1500) {}
```

This is the intentionally expensive part of the component. This loop runs synchronously during render and blocks the JavaScript main thread for about 1.5 seconds before React can finish rendering the component. Because this work happens during render:

1. React cannot commit the update yet
2. The browser cannot update the input value
3. User interactions feel delayed or laggy

You will also notice that the delay compounds. This happens because every time you type a character:

1. State updates
2. The component re-renders
3. The 1.5 second loop runs again

If you type multiple characters quickly, each keystroke triggers another render, and each render incurs the same delay. That’s why typing *x* characters results in roughly *1.5x* seconds of total lag before the UI fully catches up. This confirms something important.

> The component is re-rendered on every state update, and the cost of render directly affects responsiveness.

The key takeaway here is that the input feels slow not because React is slow, and not because DOM updates are expensive. It feels slow because the component is doing too much work during render. Once you understand that in React rendering is JavaScript execution and not browser painting, you become much better able to spot React performance issues in your code.

# Conclusion

It’s worth noting that this example is intentionally extreme. You would **never** write code like this in a real application. The goal isn’t to show a realistic bug, but to make render cost visible. 

In the real world performance issues are more subtle, they usually comes from expensive calculations, large component trees re-rendering unnecessarily, expensive derived values recalculated on every render, or components re-rendering when their props didn’t meaningfully change.

At this point, we haven’t talked about memoization, splitting components, or performance hooks. That’s intentional, before you can fix performance problems in React, you need to understand where they come from.

In the next article, we’ll look at how to reduce the amount of work React has to do during render. These techniques will include React performance hooks as well as refactoring components to make your application more efficient.