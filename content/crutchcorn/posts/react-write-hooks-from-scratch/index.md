---
{
	title: "Let's Write React Hooks From Scratch",
	description: "",
	published: '2025-08-09T05:12:03.284Z',
	tags: ['react', 'javascript', 'webdev'],
	license: 'cc-by-nc-sa-4'
}
---

// TODO: Write intro

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

// TODO: Talk about how the "increment" isn't a slight of hand, either but based on how the VDOM works

Let's expand this idea out a bit and store the array state in an abstract representation of the component via an internal `Component` class:

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

// TODO: Write

In reality, Hooks are implemented using a linked list.

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



https://github.com/facebook/react/blob/c0464aedb16b1c970d717651bba8d1c66c578729/packages/react-reconciler/src/ReactFiberHooks.js#L193-L198

https://github.com/facebook/react/blob/c0464aedb16b1c970d717651bba8d1c66c578729/packages/react-reconciler/src/ReactFiberHooks.js#L261-L266