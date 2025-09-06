---
{
	title: "Let's Write React Hooks From Scratch",
	description: "Ever wondered how React's hooks function under-the-hood? Let's write our own implementation and find out together.",
	published: '2025-07-29T05:12:03.284Z',
	tags: ['react', 'javascript', 'webdev'],
	license: 'cc-by-nc-sa-4'
}
---

In my article ["The History of React Through Code"](/posts/react-history-through-code), I talked a lot about how [the rules of React Hooks were introduced so that it could interact correctly with the previous "Fiber" rewrite](/posts/react-history-through-code#Enforcing-rules-for-consistency).

I'd like to think that I did a sufficient job explaining how this limitation led to more features in React and eventually even performance improvements through [the React Compiler](/posts/react-history-through-code#Optimizing-code-automatically) since React was able to store the state of a function relative to its parent component...

But wait, how does _that_, like, **work**?

# An Array-Focused Intro to Hooks

After all, React doesn't transform a function component in any way, so how does `useState` persist its value internally?

Were we to try this without `useState`, we'd notice quickly how this behavior differs from a normal JavaScript function:

```jsx
function Test() {
	const a = 1;
	console.log(a);
	a++;
}

Test(); // 1
Test(); // 1
Test(); // 1
```

See, to make the magic of a function remembering state to work, Hooks don't just _work alongside_ the VDOM, the method of persisting data in a component from a function **requires** the VDOM.

Here's one way we could persist state using a naïve implementation of hooks storage using an array:

```javascript
const state = [];

/**
 * React "increments" this internally
 * for each hook it runs into.
 * We won't for now, for simplicity.
 */
let idx = 0;

function useState(init) {
	state[idx] = state[idx] ?? { val: init };

	return [state[idx].val, (data) => (state[idx].val = data)];
}

function Test() {
	const [data, setData] = useState(1);

	console.log(data);

	setData(data + 1);
}

Test(); // 1
Test(); // 2
Test(); // 3
```

While it may seem silly to use an array to store a Hook's state in a component, this is exactly how the React team teaches early insider knowledge about Hooks publicly:

- [Swyx's "Getting Closure on React Hooks" article](https://www.swyx.io/hooks)
- [Dan Abramov's "Why Do React Hooks Rely on Call Order?"](https://overreacted.io/why-do-hooks-rely-on-call-order/)

> **Aside:**
>
> It's because a Hook's state is stored in an array — or, in reality, a linked list — that explains why you can't conditionally call a hook, by the way.
>
> If you were to conditionally call a hook, it would shift the index:
>
> ```javascript
> // First render
> let bool = true;
> function App() {
> 	if (bool) useState("some"); // Idx 1
> 	useState("val"); // Idx 2
> }
> 
> // Second render
> let bool = false;
> function App() {
> 	if (bool) useState("some"); // Skipped
> 	useState("val"); // Idx 1 - recieves the "some" val from prior hook
> }
> ```

# Component-focused state

Now that suffices as a high-level explaination, but let's expand this idea out a bit. After all, `"React "increments" this internally for each hook it runs into."`? That's a bit vague.

Let's try to implement this using the array storage system we came up with earlier, but instead lean into the VDOM's component tracking. This will allow us to store the array state in an abstract representation of the component via an internal `Component` class:

```jsx
// Global reference to current component
let currentComponent = null;

// Component class to hold hook state array
class Component {
	constructor() {
		this.state = [];
		this.currentHookIndex = 0;
	}

	render(renderFn) {
		// Reset state for this render
		currentComponent = this;

		// Reset hook index for this render
		this.currentHookIndex = 0;

		// Call the component function
		const result = renderFn();

		return result;
	}
}

function useState(init) {
	const component = currentComponent;
	const idx = component.currentHookIndex;

	component.state[idx] = component.state[idx] ?? { val: init };

	// Increment for next hook call
	component.currentHookIndex++;

	return [
		component.state[idx].val,
		(data) => (component.state[idx].val = data),
	];
}

function Test() {
	const [data, setData] = useState(1);

	console.log(data);

	setData(data + 1);
}

// Create component and run renders
const component = new Component();

component.render(Test); // 1
component.render(Test); // 2
component.render(Test); // 3
```

See, this internal `Component` class isn't just an idea I came up with; it's more representative of how state is stored in a VDOM node in React. When React decides it's time to render a given component, it pulls up the Hook state from the node.

# A rework to linked lists

But wait, if we look at [React's source code for a Hook's state](https://github.com/facebook/react/blob/c0464aedb16b1c970d717651bba8d1c66c578729/packages/react-reconciler/src/ReactFiberHooks.js#L192-L198):

```typescript
export type Hook = {
  memoizedState: any,
  baseState: any,
  baseQueue: Update<any, any> | null,
  queue: any,
  next: Hook | null,
};
```

We'll see that there's stuff we'd expect, but then a reference to the `next` Hook in the chain...

> Wait, Hooks are actually implemented internally using a linked list??

That's right!

In fact, we can even see that [React stores a global reference of the current Hook being processed](https://github.com/facebook/react/blob/c0464aedb16b1c970d717651bba8d1c66c578729/packages/react-reconciler/src/ReactFiberHooks.js#L261-L266):

```typescript
// Hooks are stored as a linked list on the fiber's memoizedState field. The
// current hook list is the list that belongs to the current fiber. The
// work-in-progress hook list is a new list that will be added to the
// work-in-progress fiber.
let currentHook: Hook | null = null;
let workInProgressHook: Hook | null = null;
```

----

Knowing this, let's modify our implementation to track a component's Hook using a linked list:

```javascript
// Linked list node for each hook
class Hook {
  constructor() {
    this.state = null;
    this.next = null;
  }
}

// Global state to simulate React's internals
let currentComponent = null;
let workInProgressHook = null;

// Component class to hold hook linked list
class Component {
  constructor() {
    this.hooks = null; // Head of the linked list
  }

  render(renderFn) {
    // Set up for this component's render
    currentComponent = this;
    workInProgressHook = this.hooks;
    
    // Call the component function
    const result = renderFn();
    
    // Clean up
    currentComponent = null;
    workInProgressHook = null;
    
    return result;
  }
}

// useState implementation using linked list
function useState(initialState) {
  let hook;
  
  if (workInProgressHook === null) {
    // Create new hook and add to linked list
    hook = new Hook();
    hook.state = initialState;
    
    // Find end of list and append, or set as first hook
    if (currentComponent.hooks === null) {
      currentComponent.hooks = hook;
    } else {
      let lastHook = currentComponent.hooks;
      while (lastHook.next !== null) {
        lastHook = lastHook.next;
      }
      lastHook.next = hook;
    }
  } else {
    // Use existing hook from linked list
    hook = workInProgressHook;
  }
  
  // Move to next hook for subsequent useState calls
  workInProgressHook = hook.next;
  
  const setState = (newState) => {
    hook.state = newState;
  };
  
  return [hook.state, setState];
}

function MyComponent() {
  const [count, setCount] = useState(1);

  console.log(count);

  setCount(count + 1);
}

const component = new Component();

component.render(MyComponent); // 1
component.render(MyComponent); // 2
component.render(MyComponent); // 3
```

# Conclusion

Hopefully this has been helpful to explore the internals of React Hooks and their storage in a function.

Want to now learn how to _leverage_ React's Hooks effectively in your applications and even how to write your own version of React from scratch?

Well, I've written a free book series teaching React, Angular, and Vue all at once that goes from newcomer at the start to framework author by the end of it. Take a look:

[![The Framework Field Guide](/custom-content/collections/framework-field-guide/framework_field_guide_social.png)](https://framework.guide)
