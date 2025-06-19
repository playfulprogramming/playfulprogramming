---
{
	title: "React: Consistent by Design",
	description: "TODO: Write this",
	published: '2025-07-01T05:12:03.284Z',
	tags: ['react', 'javascript', 'webdev'],
	license: 'cc-by-nc-sa-4'
}
---

I've often heard qualms from the broader developer community lamenting the perceived shift in React towards the backend.

But here's the thing; React isn't a frontend framework, it's a web framework. While this distinction might seem narrow, the impact of it enables a shift in how your mental model of React that explains many of their design systems from day one.

> **Semantics:**
>
> Many, including the React team themselves, call React a "library". While there's validity there, I gesture towards the ever expanding set of primitives - which now include data fetching and error handling - as evidence for my usage of the term "framework".

Moreover, I'd argue that **React has been aiming in this direction for many many years and its "movement towards the backend" has been a natural evolution of patterns established from day one of the framework.** In fact, I'd go even further and say that: **React today has had an incredibly consistent set of architectural designs, spanning from the server-side to the client-side.**

In this article, we'll explore the concepts React has introduced along the way and potentially build out a new mental model for the framework as we go. 

While things may get fairly technical, I'll make sure to keep things relatively beginner-friendly and even leverage visuals as much as possible. Let's dive in.

# JSX

Even in the earliest days of React, the idea of representing your HTML code in a JavaScript file was established.

This provided a large amount of flexibility for the early framework; not only did it enable the ability to sidestep custom
template tags for things like conditional rendering logic and loops, but it was fun to work with and allowed fast iteration of
UI code.

This meant that code that might've otherwise looked like this:

```html
<div>
    <!-- This is psuedo-syntax of a theoretical framework's template code -->
    <some-tag data-if="someVar"></some-tag>
    <some-item-tag data-for="let someItem of someList"></some-item-tag>
</div>
```

It could instead look like this:

```jsx
<div>
	{someVar && <some-tag/>}
	{someList.map(someItem => <some-item-tag/>)}
</div>
```

This also enables the template to JavaScript transform to stay extremely lightweight.

Instead of having to rely on some kind of HTML to JavaScript compiler, the tags of the JSX are able to be trivially transformed to JavaScript functions:

```jsx
// The following JSX
function App() {
	return <ul role="list"><li>Test</li></ul>
}

// Turns into a straightforward transform to function calls to run on the browser
function App() {
	return React.createElement("ul", {
		role: 'list'
    }, [
			React.createElement("li", {}, [
				"Test"
            ])
    ]);
}
```

# The Virtual DOM (VDOM)

While JSX allowed for lots of flexibility, it meant that templates that needed [reactivity](/posts/what-is-reactivity) required
a re-execution of all template nodes to construct [the DOM](/posts/understanding-the-dom) with new values.

![TODO: Write alt](./without_vdom.png)

To solve this, the team used a concept of a "virtual DOM" (VDOM). This VDOM was a copy of the browser's DOM stored in JavaScript; When React constructed a node in the DOM, it made a copy into its own copy of the DOM.

Then, when a given component needed to update the DOM, it would check against this VDOM and only localize the re-render to the specific node.

![TODO: Write alt](./with_vdom.png)

This was a huge optimization that allowed for much more performant React applications to scale outward.

# Error Components

Now that we had a component tree, there was a bit of a challenge.

See, because of the nature of the VDOM, whenever a component threw an error it would crash the entire React tree.

![TODO: Write alt](./without_err.png)

However, because components are laid out hierarchically, we can establish a boundary between a component that might potentially throw an error and the rest of the application state.

![TODO: Write alt](./with_err.png)

Not only does this work with single nodes, but because components are grouped by their parents we can remove a group of impacted nodes at once by wrapping them in a shared `ErrorBoundary`:

```jsx
import React, { useState } from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return <h1>Something went wrong.</h1>;
        }

        return this.props.children; 
    }
}

function App() {
    return (
        <div>
            {/* When an error is thrown in the ErrorBoundary, it will catch it, remove all child nodes, and render the fallback UI */}
            <ErrorBoundary>
                <ErrorCounter />
                <OtherCounter />
            </ErrorBoundary>
            {/* However, these nodes will be left unaffected */}
            <ul>
                <li>Item 1</li>
            </ul>
        </div>
    );
}
```

![TODO: Write alt](./error_bubble_group.png)

# Component Composition

Coming into 2018, React had a bit of a problem to solve: A class-based component's internal logic was extremely challenging to compose.

> **Note:**
>
> Remember, hooks were not part of the framework yet.

See, a core tennant of components is that they're able to compose; meaning that **we can build a new component from existing components**:

```jsx
// Existing components
class Button extends React.Component {
    // ...
}

class Title extends React.Component {
    // ...
}

class Surface extends React.Component {
    // ...
}

// Can be reused and merged into a
// newly created broader component
class Card extends React.Component {
  render() {
    return (
      <Surface>
        <Title/>
        <Button/>
      </Surface>
    )
  }
}
```

Without this ability, React would be extremely hard to scale in larger applications. However, the same ability to compose could not (at that time) be said for the internal logic of class-based components.

Take the following example:

```jsx
class WindowSize extends React.Component {
  state = {
    width: window.innerWidth,
    height: window.innerHeight,
  }; 

  handleResize = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    // ...
  }
}
```

This `WindowSize` component gets the size of the browser window, stores it in `state`, and triggers a re-render of the component when this occurs.

Now let's say that we want to reuse this logic between components. If you've studied Object-Oriented Programming - where classes come from - you'll realize that there's a good way to do so: [**Class inheritence**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain).

## Class components inheritence

Without changing the code for `WindowSize` components, we can use [the `extends` keyword](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends) in JavaScript to allow a new class to inherit methods and properties from another class.

```jsx
class MyComponent extends WindowSize {
  render() {
    const { windowWidth, windowHeight } = this.state;

    return (
      <div>
        The window width is: {windowWidth}
        <br />
        The window height is: {windowHeight}
      </div>
    );
  }
}
```

While this simple example works, it's certainly not without its downsides. This especially becomes a problem when `MyComponent` becomes more complex; we need to use [the `super` keyword](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super) to allow the base class to continue behaving as it once was:

```jsx
class MyComponent extends WindowSize {
  state = {
    // Required with a base class
    ...this.state,
    counter: 0,
  };

  intervalId = null;
  
  componentDidMount() {
    // Required with a base class
    super.componentDidMount();

    this.intervalId = setInterval(() => {
      this.setState(prevState => ({ counter: prevState.counter + 1 }));
    }, 1000);
  }

  componentWillUnmount() {
    // Required with a base class
    super.componentWillUnmount();

    clearInterval(this.intervalId);
  }

  render() {
    const { windowWidth, windowHeight, counter } = this.state;

    return (
      <div>
        The window width is: {windowWidth}
        <br />
        The window height is: {windowHeight}
        <br />
        The counter is: {counter}
      </div>
    )
  }
}
```

However, miss a `super()` call or anything between, and you'll end up with behavior problems, memory leaks, or more.

To solve this, many apps and libraries reached for a pattern called "**Higher ordered Components**" (HoC).

## Higher ordered Components (HoC)

With higher-ordered components, you're able to avoid requiring your users to have `super` calls across their codebase and instead recieve arguments from the base class as `props` to the extending class:

```jsx
const withWindowSize = (WrappedComponent) => {
  return class WithWindowSize extends React.Component {
    state = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    handleResize = () => {
      this.setState({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    componentDidMount() {
      window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
    }

    render() {
      return <WrappedComponent {...this.props} windowWidth={this.state.width} windowHeight={this.state.height} />;
    }
  }
}

class MyComponentBase extends React.Component {
  render() {
    const { windowWidth, windowHeight } = this.props;

    return (
      <div>
        The window width is: {windowWidth}
        <br />
        The window height is: {windowHeight}
      </div>
    );
  }
}

const MyComponent = withWindowSize(MyComponentBase);
```

Prior to hooks, this was the state-of-the-art when it came to component logic reuse in React.

Unfortunately, this required knowledge of what `props` to expect from the parent component, was challenging to allow [TypeScript](/posts/introduction-to-typescript) and other type-checker usage, and ultimately felt like an addon pattern rather than a clean, built-in composition pattern from React itself.

This is why **Hooks** were introduced into React.

# Introducing Hooks

React's Hooks were introduced in React 16.8. With them, the baseline for future React features was established.

While previous ["smart" components](/posts/layered-react-structure#smart-dumb-comps) were written using classes and special methods and properties to manage state and [side effects](/posts/ffg-fundamentals-side-effects):

```jsx
class WindowSize extends React.Component {
  state = {
    width: window.innerWidth,
    height: window.innerHeight,
  }; 

  handleResize = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    // ...
  }
}
```

With hooks, all of your components - both "smart" and "dumb" - could be written with functions and specially imported functions:

```jsx
function WindowSize() {
	const [size, setSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })
  
  const {height, width} = size;

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', this.handleResize);

    return () => window.removeEventListener('resize', this.handleResize);
  }, []);

  return (
  	// ...
  )
}
```

This had a number of benefits, the biggest of which going back to the concept of composition.

## Hook Composition

Whereas with class components the convention for composition (say that 10 times fast!) was higher-ordered components, hooks have.... 🥁

Other hooks. 😐

This might sound obvious, but its this obvious-nature that allows for Hook's superpowers, both current and future.

Let's look at a custom `useWindowSize` hook:

```javascript
function useWindowSize() {
	const [size, setSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })
  
  const {height, width} = size;

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', this.handleResize);

    return () => window.removeEventListener('resize', this.handleResize);
  }, []);

	return {height, width}
}
```

> **Note:**
> Notice how we had to change very little code from the `WindowSize` component itself; this flavor of logic composition allows us to avoid changing much of the code between the intial authoring and the rewrite to abstract this logic out to a custom hook.

This custom hook can then be reused in as many function components as we'd like:

```jsx
function MyComponent() {
	const {height, width} = useWindowSize();
		
  return (
    <div>
      The window width is: {windowWidth}
      <br />
      The window height is: {windowHeight}
    </div>
  )
}
```

## Rules of Hooks

This doesn't mean that authoring your own custom hooks is a free-for-all, however. All hooks follow a consistent set of rules:

- All hooks are functions
- The function names must start with `use`
- [Hooks cannot be called conditionally](https://react.dev/reference/rules/rules-of-hooks)
- They must be called at the top-level of a component
- [Dynamic usage of hooks is not allowed](https://react.dev/reference/rules/react-calls-components-and-hooks#dont-dynamically-use-hooks)
- [Properties passed to hooks must not be mutated](https://react.dev/reference/rules/components-and-hooks-must-be-pure#return-values-and-arguments-to-hooks-are-immutable)

Regardless of if a hook is custom or imported from React, regardless of when a hook was introduced, whether from the start with `useState` or much later with [the `useActionState` hook](https://playfulprogramming.com/posts/what-is-use-action-state-and-form-status), these rules are to be followed.

```jsx
// ✅ Allowed usages
function AllowedHooksUsage() {
	const [val, setVal] = React.useState(0);
	const {height, width} = useWindowSize();
	
	return <>{/* ... */}</>
}

// ❌ Dis-allowed usages
function DisallowedHooksUsage() {
	const obj = {};
    
    useObj(obj);
    
    // Not allowed to mutate objects after being passed to a hook
    obj.key = (obj.key ?? 0) + 1;    
    
    if (bool) {
		const [val, setVal] = React.useState(0);        
    }

    if (other) {
        return null;
    }
    
    // While otherwise valid, can't be after a return
    const {height, width} = useWindowSize();
	
    for (let i = 0; i++; i < 10) {
        const ref = React.useRef();
    }
    
	return <>{/* ... */}</>
}
```

> These rules enforced here are present due to thoughtful design of how to enable React to own dataflow more. [We'll learn more about what this means in our Hooks + the VDOM section](#TODO_ADD).

## Side Effects

[I could talk about side effects in programming for hours](/posts/ffg-fundamentals-side-effects). As a short recap of an introductory view of effects:

- A "side effect" is the idea of mutating state from some external boundary.

  ![A pure function is allowed to mutate state from within its local environment, while a side effect changes data outside its own environment](../../collections/framework-field-guide-fundamentals/posts/ffg-fundamentals-side-effects/pure-vs-side-effect.png)

- As a result of this, all I/O is a "side effect" since the user is external to the system executing the code

- Most I/O requires some flavor of cleanup: either to stop listening for user input or to reset state set during an output before the next iteration

- As a result, [side effects need a good way to cleanup, otherwise your application will suffer from bugs and memory leaks.](/posts/ffg-fundamentals-side-effects#cleaning-event-listeners)

Following this thought process, we can see how React's `useEffect` hook enables us to follow better side effect cleanup patterns.

Let's look at how classes handled side effects:

```jsx
class Listener extends React.Component {
  // Requires us to register a method on the `this` boundary
  // to reference in both places
  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  // There may be many lines between the mount and unmount
    
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  // Methods added to `window` via `addEventListener` needed to use
  // arrow functions, as otherwise `this` would be bound to `window`.
  handleResize = () => {
    // ...
  }
}
```

> **Note:**
>
> Confused about why `this` would be `window` when `handleResize` isn't an arrow function?
>
> We cover this and more in [our article covering the `this` keyword in JavaScript.](/posts/javascript-bind-usage)

Compare this to how side effects are registered and cleaned up using `useEffect`:

```jsx
function Listener() {
	useEffect(() => {
		// Method colocated next to the listeners
        const handleResize = () => {
			// ...
		}
		window.addEventListener('resize', handleResize);
        // Cleanup in same scope as the effect
		return () => window.removeEventListener('resize', handleResize);
	}, []);
    
    // ...
}
```



## Hooks + the VDOM

I hear you, React-Senior-Team-Lead-a-tron:

> This is all recap for me. How does this pertain to your thesis of React's consistency?

Well, while it may be obvious that React Hooks were a shift in how we author components, what may not have been obvious was the back-work that led to being able to implement Hooks.

See, to make this magic works, Hooks doesn't just *work alongside* the VDOM, the method of persisting data in a component from a function **requires** the VDOM.

After all, React doesn't transform a function component in any way, so how does `useState` persist its value internally?

Were we to try this without `useState`, we'd notice quickly how this behavior differs from a normal JavaScript function:

``` jsx
function Test() {
  const a = 1;
  console.log(a);
  a++;
}

Test() // 1
Test() // 1
Test() // 1
```

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
    state[idx] = state[idx] ?? {val: init};

    return [
        state[idx].val,
        (data => state[idx].val = data)
    ]
}

function Test() {
    const [data, setData] = useState(1);

    console.log(data);

    setData(data + 1)
}

Test() // 1
Test() // 2
Test() // 3
```
While it may seem silly to use an array to store a Hook's state in a component, this is exactly how the React team teaches early insider knowledge about Hooks publicly:

- [Swyx's "Getting Closure on React Hooks" article](https://www.swyx.io/hooks) 
- [Dan Abramov's "Why Do React Hooks Rely on Call Order?"](https://overreacted.io/why-do-hooks-rely-on-call-order/)

> **Aside:**
>
> It's because a Hook's state is stored in an array - or, in reality, a linked list - that explains why you can't conditionally call a hook, by the way.
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
    
    component.state[idx] = component.state[idx] ?? {val: init};
    
    // Increment for next hook call
    component.currentHookIndex++;

    return [
        component.state[idx].val,
        (data => component.state[idx].val = data)
    ]
}

function Test() {
    const [data, setData] = useState(1);

    console.log(data);

    setData(data + 1)
}

// Create component and run renders
const component = new Component();

component.render(Test); // 1
component.render(Test); // 2
component.render(Test); // 3
```

See, this internal `Component` class isn't just an idea I came up with; it's more representative of how state is stored in a VDOM node in React. When React decides it's time to render a given component, it pulls up the Hook state from the node.

### React Fiber

https://legacy.reactjs.org/blog/2017/09/26/react-v16.0.html#new-core-architecture

https://engineering.fb.com/2017/09/26/web/react-16-a-look-inside-an-api-compatible-rewrite-of-our-frontend-ui-library/

https://blog.openreplay.com/react-fiber-explained/

https://blog.logrocket.com/deep-dive-react-fiber/

https://github.com/acdlite/react-fiber-architecture?tab=readme-ov-file



# `<StrictMode>` Effect Changes

When React 18 was released, many were suprised to find that various parts of their apps seemingly broke out of nowhere, but only in dev mode. I even wrote an article at the time explaining the phenomenon called ["Why React 18 Broke Your App"](/posts/why-react-18-broke-your-app).

What _actually_ had happened is that [React intentionally introduced a change](https://github.com/reactwg/react-18/discussions/19) to the dev-only helper `<StrictMode>` component that was included in most React app templates.

Previously, [`<StrictMode>` was mostly used to warn developers when a deprecated API or lifecycle was being used](https://legacy.reactjs.org/blog/2018/03/29/react-v-16-3.html#strictmode-component).

Now `<StrictMode>` is mostly known for the following:

```jsx
function App() {
	useEffect(() => {
		// Runs twice on dev with StrictMode, once on prod
		console.log("Mounted");
	}, []);
  
  return <>{/* ... */}</>
}
```

> Why was this change made?

The simple answer to this question is that the React team wanted to ensure that you were [cleaning up side effects in your components to avoid memory leaks and bugs.](/posts/ffg-fundamentals-side-effects#ensuring-effect-cleanup).

But the longer answer is that they wanted to keep component rendering behavior idempotent.

### Idempotence

To explain idempotence let's use an analogy and then dive into the real deal.

Pretend you're working a factory line and you've been given a task: Press a button to drop an empty box from a chute above you onto a conveyor belt to move the boxes into a packaging machine. This machine will place an item in the box and seal it up for you.

// TODO: Include a visual of this

However, you've been warned by your supervisor: Don't press the button a second time until the first box has been fully packaged. If you do so, the second box will jam the conveyor belt as the machine in the middle of packaging the first box.

// TODO: Include a visual of this

An **idempotent** button would behave differently: It would only trigger the box to enter the factory line once the previous box had gone through the machine, **regardless of how many times you pressed the button**.

// TODO: Include a visual of this

----

> What does this analogy have to do with React rendering and `useEffect`?

Well, let's consider the following code:

```jsx
function BoxAddition() {
	useEffect(() => {
		window.addBox();
	}, []);
  
  return null;
}
```

Let's consider each render of "BoxAddition" to be akin to pressing the button on the factory line. If we want to show 10 `BoxAddition`s, then we should have 10 boxes coming down the pipeline.

But the global box count should remain consistent if we then render and unrender the `BoxAddition` component. With the code above, this doesn't happen. This means that if we do something like:

```jsx
function CheckBoxAddsOnce() {
  const [bool, setBool] = useState(true);
  
  useEffect(() => {
    setInterval(() => setBool(v => !v), 0);
    setInterval(() => setBool(v => !v), 100);
    setInterval(() => setBool(v => !v), 200);
  })

  if (bool) return null;
  return <BoxAddition></BoxAddition>
}
```

Because of this, the `BoxAddition` component wouldn't be considered idempotent; its behavior causes inconsistencies depending on how many times it's been rendered. This aligns with how the button could be considered idempotent **only if** the button doesn't cause inconsistencies depending on how many times it's been pressed.

To fix this, we'd need some kind of cleanup on our `BoxAddition` component:

```jsx
function BoxAddition() {
	useEffect(() => {
		window.addBox();
		return () => window.removeBox();
	}, []);
  
  return null;
}
```

These problematic behaviors on a non-idempotent component is why `StrictMode` was changed to enforce this behavior.

# Lazy Components

In our story thus far, we've managed to make it to "React 18" and the changes it brought; But before we look forward, we must look back. Let's rewind back to 2018 with [React 16.6](https://legacy.reactjs.org/blog/2018/10/23/react-v-16-6.html).

It's there that they introduced us to the concept of lazy loading components:

```jsx
import React, {lazy, Suspense} from 'react';
const LargeBundleComponent = lazy(() => import('./LargeBundleComponent'));

function MyComponent() {
  return (
    <LargeBundleComponent />
  );
}
```

Lazy loading components enable React to tree-shake away the bundled code relevant to only the imported component such that the `lazy` wrapped component code wouldn't be imported into the browser until the component was rendered:

// TODO: Show image of treeshaken code not appearing until the loaded component appears.

This enabled further usage of the VDOM as a representation of complex state by loading in a component and its associated code over the network (in this case `LargeBundleComponent`).

## Suspense Boundaries

> But wait, if the component is being loaded over the network that means there's latency involved. What does the user see when the component is being loaded?

This is where `Suspense` boundaries come into play. Introduced at [JSConf Iceland 2018](https://legacy.reactjs.org/blog/2018/03/01/sneak-peek-beyond-react-16.html), `Suspense` allowed you to handle loading states in your UI as a fallback during high latency scenarios - like a `lazy` component mentioned above:

```jsx
import React, {lazy, Suspense} from 'react';
const LargeBundleComponent = lazy(() => import('./LargeBundleComponent'));

function MyComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LargeBundleComponent />
    </Suspense>
  );
}
```

Just like the `ErrorBoundary` component API was able to handle upward sent errors, the `Suspense` component API handled upward sent loading mechanisms; allowing even more flexibility with how and where the VDOM handled asynchronous effects.

This stacked well with other problems you might face with loading states like how to handle multiple async sibling components:

``` jsx
import React, {lazy, Suspense} from 'react';
const LargeBundleComponent = lazy(() => import('./LargeBundleComponent'));
const AnotherLargeComponent = lazy(() => import('./AnotherLargeComponent'));

function MyComponent() {
  return (
    // Only resolves once both components are loaded
    <Suspense fallback={<div>Loading...</div>}>
      <LargeBundleComponent />
      <AnotherLargeComponent />
    </Suspense>
  );
}

// OR

function MyOtherComponent() {
  return (
    // Show two loading states for each
    <Suspense fallback={<div>Loading...</div>}>
      <LargeBundleComponent />
    </Suspense>
    <Suspense fallback={<div>Loading...</div>}>
      <AnotherLargeComponent />
    </Suspense>
  );
}
```

But that's not all `Suspense` was promised to do for us... There were hints even in its introduction that it would eventually lead to data fetching primitives in React...

# Data fetching & the `use` API

For as long as I can remember, the React team has provided guidance to "lift state" in your components to avoid headaches with data sharing. [They turned it into an official docs page in 2017](https://web.archive.org/web/20180128174149/https://reactjs.org/docs/lifting-state-up.html) and [Dan even referenced this problem in a GitHub comment from 2015](https://github.com/facebook/react/issues/4595#issuecomment-129786951).

What serendipity, then, that the data fetching solution that would come many years later should rely on this lifted state philosophy?

Here's how it works:

- Create a stable reference to a promise in a parent component
- Pass the promise to a child component via props
- Utilize the new `use` hook to recieve the data from the promise

```jsx
function Child({promise}) {
  const data = use(promise);
  return <p>{data}</p>
}

function App() {
  // useMemo is needed here, otherwise it will generate a new promise
  // for each render and cause an infinite loop
  const promise = useMemo(() => fakeFetch());
  
  return <Child promise={promise}/>
}

const fakeFetch = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1000);
    }, 1000);
  });
}
```

This is awesome! This code will run but, uh...

// TODO: Add iframe

Oh, there's no loading state... Now if only we had a mechanism in React already to handle loading state...

👀

```jsx
function Child({promise}) {
  const data = use(promise);
  return <p>{data}</p>
}

function App() {
  const promise = useMemo(() => fakeFetch());
  
  return (
    // This acts as our loading state for the promise above
    <Suspense fallback={<p>Loading...</p>}>
      <Child promise={promise}/>
	  </Suspense>
  )
}

const fakeFetch = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1000);
    }, 1000);
  });
}
```

// TODO: Add iframe

> How does this work?

Well, as hinted at before, [the `use` hook interacts with the VDOM to "throw" the promise up to the nearest suspense boundary to show the loading state](https://github.com/acdlite/rfcs/blob/first-class-promises/text/0000-first-class-support-for-promises.md). This throw upwards does two things for us:

1) Re-enforces the concepts we've already learned in regards to data moving up the VDOM tree
2) Helps solve waterfalling and real-world user experience problems

## Waterfalls & `use`

// TODO: Talk about how waterfalls work and show visuals of how network requests can stack on one another to cause problems

// TODO: Talk about how the boundaries of `use` enable better use UX crafting by deciding what needs to have loading state and what doesn't - refer to Dev's talk

## Error Boundaries & `use`

// TODO: Talk about how rendering itself is a side effect

// TODO: Talk about how if a promise passed to `use` rejects, it will open an error boundary

Something often missed is how updating the screen (called "rendering" in the context of React) is itself a form of a side effect. After all, 

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

function Load({ promise }) {
  const data = React.use(promise);

  return <p>Success</p>;
}

function App() {
  const promise = React.useMemo(
    () =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          reject();
        }, 1000);
      }),
    []
  );

  return (
    <div>
      {/* When an error is thrown in the ErrorBoundary, it will catch it, remove all child nodes, and render the fallback UI */}
      <ErrorBoundary>
        <React.Suspense fallback={<p>Loading..</p>}>
          <Load promise={promise} />
        </React.Suspense>
      </ErrorBoundary>
    </div>
  );
}
```

# JSX over the wire

Even in the earliest days of React the idea of representing your HTML code in a JavaScript file was established.



/ TODO: Talk about Next.js' pre-RSC SSR story and how shipping VDOM state enabled
// TODO: Talk about how this is powered by a similar boundary system as Suspense (only between loading states and not) 

# Async components

// TODO: Talk about how, once we have a loading pattern and a designation between the client and server, it enables a lot of cool data loading mechanisms

// TODO: Talk about the server-only `cache` API

# `<Activity>`

// TODO: Talk about how we can lean into the VDOM state system to allow for preserving state between unrenders and re-renders

# React Compiler

// TODO: Talk about how allowing React to control the dataflow of components and strict rules around said dataflow allows a compiler to optimize things further
