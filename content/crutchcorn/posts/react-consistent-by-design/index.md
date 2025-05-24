---
{
	title: "React: Consistent by Design",
	description: "TODO: Write this",
	published: '2025-07-01T05:12:03.284Z',
	tags: ['react', 'javascript', 'webdev'],
	license: 'cc-by-nc-sa-4'
}
---

React isn't a frontend framework: It's a web framework. While this distinction might seem narrow, the impact of it enables a shift in how your mental model of React that explains many of their design systems from day one.

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

# Hooks

// TODO: Talk about the composition of hooks, how they're more similar to components in that way
// TODO: Talk about the rules of React and how it helps keeps components pure
// TODO: Talk about useEffect and the need for a more 1:1 mapped system for effect cleanup

# `<StrictMode>` Effect Changes

// TODO: Talk about how this is consistent with Hooks, despite the perceived changeup

# Suspense Boundaries & `use`

// TODO: Talk about how `use` throwing up, required state to be lifted up (consistent with messaging from React for years)
// TODO: Talk about waterfalling
// TODO: Talk about how this introduced the ideas of boundaries in the VDOM

# JSX over the wire

/
Even in the earliest days of React the idea of representing your HTML code in a JavaScript file was established.



/ TODO: Talk about Next.js' pre-RSC SSR story and how shipping VDOM state enabled
// TODO: Talk about how this is powered by a similar boundary system as Suspense (only between loading states and not) 

# Async components

// TODO: Talk about how, once we have a loading pattern and a designation between the client and server, it enables a lot of cool data loading mechanisms

# `<Activity>`

// TODO: Talk about how we can lean into the VDOM state system to allow for preserving state between unrenders and re-renders
