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

Now that we have a reference to the underlying DOM node, we can utilize that to do various things with the element.

For example, let's say that we wanted to change the color of a button using nothing more than an HTML attribute - we can do that now using [the HTMLElement's `style` property](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style):

<!-- tabs:start -->

## React

```jsx
const useStyleBackground = () => {
  const ref = (el) => {
    el.style.background = 'red';
  };
  return { ref };
};

const App = () => {
  const { ref } = useStyleBackground();
  return <button ref={ref}>Hello, world</button>;
};
```

## Angular

```typescript
@Directive({
  selector: '[styleBackground]',
})
class StyleBackgroundDirective {
  constructor(private el: ElementRef<any>) {
    this.el.nativeElement.style.background = 'red';
  }
}

@Component({
  selector: 'my-app',
  template: `
    <button styleBackground>Hello, world</button>
  `,
})
class AppComponent {}
```

## Vue

// TODO: Write

<!-- tabs:end -->

>While this is a good demonstration of how you can use an element reference within a directive, styling an element is generally suggested to be done within a CSS file itself, unless you have good reason otherwise.

# Lifecycle Methods in Directives

[Previously in the book, we've explored adding in a `focus` event when an element is rendered](/posts/component-reference#Using-component-reference-to-focus-our-context-menu). However, in this chapter we explicitly had to call a `focus` method. What if we could have our `button` focus itself immediately when it's rendered onto the page?

Luckily, with attributes we can!

See, while a component has a lifecycle of being rendered, updated, cleaned up, and beyond - so too does an element that's bound to a directive!

Because of this, we can hook into the ability to use lifecycle methods within directives to [add a side effect](/posts/lifecycle-methods#Side-Effects) that focuses when an element is rendered.

<!-- tabs:start -->

## React

// TODO: Write

- React / `useEffect` inside of custom hook

## Angular

// TODO: Write

- Angular is `implements` hooks

## Vue

// TODO: Write

Vue / [Directive Hooks](https://vuejs.org/guide/reusability/custom-directives.html#directive-hooks)

<!-- tabs:end -->





# Passing Data to Directives





But you know, that red we're applying to the `button` element is rather harsh, isn't it?

We could just set the color to a nicer shade of red — say, `#FFAEAE` — but then what if we wanted to re-use that code elsewhere to set a different button to blue?



To solve this issue of per-instance customization of a directive, let's add the ability to pass in data to a directive.

<!-- tabs:start -->

## React

Because a React Hook is a function at heart, we're able to just pass values as we would to any other function:

```jsx
const useStyleBackground = (color) => {
  const ref = (el) => {
    el.style.background = color;
  };
  return { ref };
};

const App = () => {
  const { ref } = useStyleBackground('#FFAEAE');
  return <button ref={ref}>Hello, world</button>;
};
```

## Angular

// TODO: Write

## Vue

// TODO: Write

<!-- tabs:end -->



// TODO: Write

Button color custom set



This works similarly to how a component's inputs might work, and as such you can pass any valid JavaScript in as a property value.



// TODO: `Color` class instance



<!-- tabs:start -->

## React

// TODO: Write

## Angular

// TODO: Write

// TODO: Multiple inputs

## Vue

// TODO: Write

<!-- tabs:end -->





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