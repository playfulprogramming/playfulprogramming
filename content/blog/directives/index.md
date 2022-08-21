---
{
    title: "Directives",
    description: "",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 14,
    series: "The Framework Field Guide"
}
---

In our last chapter, we talked about how you can create custom logic that isn't associated with any particular component, but can be used by said components to extend its logic.

This is helpful for sharing logic between components, but isn't the whole story of code re-use within React, Angular, and Vue.

For example, we may want to have logic that's associated with a given DOM node without having to create an entire component specifically for that purpose. This exact problem is what a Directive aims to solve.

In this chapter, we'll explore:

- What a directive is
- Basic directive usage
- How to use lifecyle methods in directives
- How to conditionally render UI with directives

# What is a directive

In our [Introduction to Components chapter](/posts/intro-to-components), we talked about how a component is a collection of structure, styling, and logic that's associated with one or more HTML nodes. 

A directive, on the other hand, is a collection of JavaScript logic that you can apply to a single DOM element.

While this comparison between a directive and a component seem stark, think about it: Components have a collection of JavaScript logic that's applied to a single "virtual" element.

As a result, some frameworks, like Angular, take this comparison literally and utilize directives under-the-hood in order to create components.

Here's what a basic directive looks like in each of the three frameworks:



<!-- tabs:start -->

## React

React as a framework doesn't _quite_ have the concept of directives built-in. 

Luckily, this doesn't mean that us React developers need to be left behind. Because a React component is effectively just a JavaScript function, we can use the base concept of a directive to create shared logic for DOM nodes.

Remember from our [Element Reference chapter that you can use a function associated with an element's `ref` property](localhost:9000/posts/element-reference). We'll use this concept alongside the idea of a [custom hook](/posts/shared-component-logic#Rules-of-Custom-Hooks) in order to create a simple API to add logic to an HTML element:

```jsx
const useLogElement = () => {
  const ref = (el) => console.log(el);
  return { ref };
};

const App = () => {
  const { ref } = useLogElement();
  return <p ref={ref}>Hello, world</p>;
};
```

> While we'll continue to cover alternative APIs that can do much of the same as directives in other frameworks, it might be beneficial to broaden your horizons and take a glance at what a "true" directive looks like in other frameworks. 

## Angular

You setup a directive in Angular very similarly to how you might construct a component: using the `@Directive` decorator.

```typescript
import { Component, ElementRef, Directive } from '@angular/core';

@Directive({
  selector: '[sayHi]',
})
class LogElementDirective {
  constructor() {
    console.log("Hello, world!");
  }
}

@Component({
  selector: 'my-app',
  template: `
    <p sayHi>Hello, world</p>
  `,
})
class AppComponent {}
```

Here, we've told Angular to listen for any `sayHi` attributes ([using a CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors)) and run a `console.log` any time an element with said attribute is rendered.

This isn't particularly useful, but demonstrates the most minimal version of what a directive looks like.

Instead, it's oftentimes more useful to get a reference to the element that the attribute is present on. To do this, we'll use Angular's [dependency injection](/posts/dependency-injection) to ask Angular for an `ElementRef` that's present within the framework's internals when you create a directive instance.

```typescript
@Directive({
  selector: '[logElement]',
})
class LogElementDirective {
  constructor(private el: ElementRef<any>) {
    // This will output a reference to the HTMLParagraphElement
    console.log(this.el.nativeElement);
  }
}

@Component({
  selector: 'my-app',
  template: `
    <p logElement>Hello, world</p>
  `,
})
class AppComponent {}
```

## Vue

// TODO: Write

<!-- tabs:end -->

Once our apps load up, you should see a `console.log` execute that prints out the [HTMLParagraphElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLParagraphElement) reference.

You'll notice that these directives' logic are applied to elements through some means of an attribute-like selector, similar to how a component has a named tag associated with it.

Now that we've seen what a directive looks like, let's apply it to some real-world examples.


# Basic Directives

// TODO: Write

Add CSS to button



# Lifecycle Methods in Directives

// TODO: Write

`focus` when component is rendered

- React / `useEffect` inside of custom hook
- Angular is `implements` hooks

- Vue / [Directive Hooks](https://vuejs.org/guide/reusability/custom-directives.html#directive-hooks)



# Conditionally Rendered UI Via Directives

// TODO: Write

Feature flags

<!-- tabs:start -->

## React

```jsx
const flags = {
  testing: true,
};

const useFeatureFlag = ({
  flag,
  enabledComponent,
  disabledComponent = null,
}) => {
  if (flags[flag]) {
    return { comp: enabledComponent };
  }
  return {
    comp: disabledComponent,
  };
};

export default function App() {
  const { comp } = useFeatureFlag({
    flag: 'testing',
    enabledComponent: <p>Testing</p>,
  });
  return <div>{comp}</div>;
}
```

## Angular

// TODO: Structural directives

## Vue

Does this work? How do we pass data into the `template`?

```vue
<template>
  <ul>
    <li>1</li>
    <template v-render="'#here'">
      <li>2</li>
    </template>
    <li>3</li>
  </ul>
</template>

<script>
const render = {
  mounted: (el) => {
    el.after(...el.children);
  },
};

export default {
  name: 'App',
  directives: {
    // enables v-focus in template
    render,
  },
};
</script>

<style></style>
```

Answer: We don't. That's the job of a Vue component. Namely an [async Vue component](https://vuejs.org/guide/components/async.html)



> On top of that, you shouldn't use Vue directives on components, which is what we'd want to do anyway

> https://vuejs.org/guide/reusability/custom-directives.html#usage-on-components



This is why directives are a bad solution to this problem in Vue

<!-- tabs:end -->