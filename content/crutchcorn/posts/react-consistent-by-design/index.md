---
{
	title: "React: Consistent by Design",
	description: "",
	published: '2025-07-01T05:12:03.284Z',
	tags: ['react', 'javascript', 'webdev'],
	license: 'cc-by-nc-sa-4'
}
---

React isn't a frontend framework: It's a web framework. While this distinction might seem narrow, the impact of it enables a shift in how your mental model of React that explains many of their design systems from day one.

In this article, we'll explore the concepts React has introduced along the way and potentially build out a new mental model for the framework as we go. 

While things may get fairly technical, I'll make sure to keep things relatively beginner-friendly and even leverage visuals as much as possible. Let's dive in.

# JSX

// TODO: Talk about the representation of the DOM, and how consolidating it into your templating enables lots of flexibility

# The Virtual DOM (VDOM)

// TODO: Talk about how the decision to make JSX a representation of DOM led to a need for the VDOM

# Error Components

// TODO: Talk about how this set up the pattern for throwing upward in the VDOM to introduce state to the parent

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

// TODO: Talk about Next.js' pre-RSC SSR story and how shipping VDOM state enabled
// TODO: Talk about how this is powered by a similar boundary system as Suspense (only between loading states and not) 

# Async components

// TODO: Talk about how, once we have a loading pattern and a designation between the client and server, it enables a lot of cool data loading mechanisms

# `<Activity>`

// TODO: Talk about how we can lean into the VDOM state system to allow for preserving state between unrenders and re-renders
