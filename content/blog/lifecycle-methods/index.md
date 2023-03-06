---
{
    title: "Lifecycle Methods",
    description: "One way for JavaScript logic to run in components is for a framework to call a specific bit of JS when an event occurs. These are called 'Lifecycle methods'.",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 4,
    series: "The Framework Field Guide"
}
---

React, Angular, and Vue all work by using JavaScript to render contents into the DOM. Because of this, [we're able to conditionally render contents on screen and remove them programmatically, as we did in our last chapter](/posts/dynamic-html).

However, doing this introduces some new complexities for us to consider:

1) How can we take an action when something is shown on screen for the first time?
    - What terms and concepts should we know when talking about these actions?
    - What actions _would_ we even _want_ to take in a production codebase?
    - How does the browser itself help us make these actions relevant to the user?
2) How can we take an action when something is removed from the screen?
    - What is an "action cleanup" and why do we want them in production?
    - How do we prevent memory leaks?

3. What are other ways our components can trigger an action for us?

These complexities help make up production applications and their ability to dynamically respond to user's input.

Because they're so commonplace, each of the three frameworks implements a series of APIs that, when put together, help solve the questions listed above. **These APIs are called "Lifecycle methods".**

Lifecycle methods **allow the framework to call code on your behalf when a component-related event occurs**.

These "events" come in many flavors, including:

- When a component renders for the first time
- When a component is removed from the screen
- When a component re-renders due to props changing
- Other component-specific events

Because these events typically have a one-to-one matching of a component's lifespan, they're called "Lifecycle" events.

Let's explore what these lifecycle methods look like in usage:

# Render Lifecycle

When we introduced components, we touched on the [concept of "rendering"](/posts/intro-to-components#Rendering-the-app). This occurs when a component is drawn on-screen, either when the user loads a page for the first time or when shown or hidden using a [conditional render](/posts/dynamic-html#Conditional-Branches).

Say we have the following code:

<!-- tabs:start -->

## React

```jsx
const Child = () => {
    return <p>I am the child</p>
}

const Parent = () => {
  const [showChild, setShowChild] = useState(true);
  
  return <div>
  	<button onClick={() => setShowChild(!showChild)}>
  		Toggle Child
  	</button>
    {showChild && <Child/>}
  </div>
}
```

## Angular

```typescript
@Component({
  selector: 'parent',
  template: `
  <div>
  	<button (click)="setShowChild()">
  		Toggle Child
  	</button>
    <child *ngIf="showChild"></child>
  </div>
  `,
})
export class ParentComponent {
  showChild = true;
  setShowChild() {
    this.showChild = !this.showChild;
  }
}

@Component({
  selector: 'child',
  template: '<p>I am the child</p>',
})
export class ChildComponent {
}
```

## Vue

```vue
<!-- Child.vue -->
<template>
  <p>I am the child</p>
</template>
```

```vue
<!-- Parent.vue -->
<template>
  <div>
    <button @click="setShowChild()">Toggle Child</button>
    <child v-if="showChild"></child>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Child from './Child.vue'

const showChild = ref(false)

function setShowChild() {
  showChild.value = !showChild.value
}
</script>
```

<!-- tabs:end -->



Here, `Child` is being added and removed from the DOM every time `setShowChild` is clicked. Let's say we wanted to add a way to call a `console.log` every time `Child` is shown on screen.

While we _could_ add this log inside of `setShowChild`, it's more likely to break when we inevitably refactor the `Parent` component's code. Instead, let's use one of the aforementioned lifecycle methods to call `console.log` whenever `Child` is rendered.

<!-- tabs:start -->

## React

React works slightly differently from the other frameworks we're looking at in this series. In particular, while there's an alternative way of writing React components called "class components", which does have traditional lifecycle methods, the way we're writing components — called "functional components" — does not.

Instead of a direct analogous, React's functional components have a different API [called "Hooks"](https://reactjs.org/docs/hooks-intro.html). These Hooks can then be used to recreate similar effects to lifecycle methods.

One such Hook that we can use to mimic different lifecycle methods is called `useEffect`:

```jsx {1-3}
const Child = () => {
    // Pass a function that React will run for you
	useEffect(() => {
        console.log("I am rendering");
       // Pass an array of items to track changes of
    }, []);

    return <p>I am the child</p>
}
```

For example, in the above code, we're using `useEffect` with an empty array as the second argument indicating that our inner function should only run only once per render. This hook is named as such because it enables us to create [side effects](// TODO: Link to glossary) in our components, just like other frameworks' lifecycle methods.

We'll touch on what a side effect is and what the `useEffect`'s empty array is doing in just a moment.

## Angular

Angular looks for a method named `ngOnInit` to be ran as part of the "rendered" lifecycle event:

```typescript {4-8}
import {Component, OnInit} from "@angular/core";

@Component({
  selector: 'child',
  template: '<p>I am the child</p>',
})
export class ChildComponent implements OnInit {
  ngOnInit() {
    console.log('I am rendering');
  }
}
```

All of Angular's lifecycle methods are prepended with `ng` and add `implements` to your component class.

This `implements` clause help TypeScript figure out which methods have which properties and throws an error when the related method is not included in the class.

## Vue

```vue
<!-- Child.vue -->
<template>
  <p>I am the child</p>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.log('I am rendering')
})
</script>
```

Here, we're importing the `onMounted` lifecycle handler from the `vue` import. Vue's lifecycle methods all start with an `on` prefix when used inside of a `<script setup>` component. 

This means that if you see me talking about a "mounted" lifecycle method, it's imported via `onMounted` instead. 

<!-- tabs:end -->

As mentioned before, the framework itself calls these methods on your behalf when an internal event occurs; in this case, when `Child` is rendered.

Try clicking the toggle button repeatedly, and you'll see that the `console.log` occurs every time the `Child` component renders again.

## Side Effects

A common usage of this `rendered` lifecycle is to be able to do some kind of **side effect**.

A side effect is when a piece of code changes or relies on state outside its local environment. When a piece of code does not contain a side effect, it is considered "pure".

![A pure function is allowed to mutate state from within it's local environment, while a side effect changes data outside its own environment](./pure-vs-side-effect.png)

For example, say we have the following code:

```javascript
function pureFn() {
	let data = 0;
    data++;
    return data;
}
```

This logic would be considered "pure", as it does not rely on external data sources. However, if we move the `data` variable outside of the local environment and mutate it elsewhere:

```javascript
let data;

function increment() {
	data++;
}

function setupData() {
	data = 0;
	increment();
	return data;
}
```

`increment` would be considered a "side-effect" that mutates a variable outside of its own environment.

> When does this come into play in a production application?

This is a great question! A great example of this occurs in the browser with the `window` and `document` APIs.

Say we wanted to store a global counter that we use in multiple parts of the app, we might store this in `window`.

```javascript
window.shoppingCartItems = 0;

function addToShoppingCart() {
	window.shoppingCartItems++;
}

addToShoppingCart();
addToShoppingCart();
addToShoppingCart(); // window.shoppingCartItems is now `3`
```

Because `window` is a global variable, mutating a value within it is a "side effect" when done inside of a function; as the `window` variable was not declared within the `function`'s scope.

Notice how our `addToShoppingCart` method isn't returning anything; instead, it's mutating the `window` variable as a side effect to update a global value. If we attempted to remove side effects from `addToShoppingCart` without introducing a new variable, we'd be left with the following:

```js
window.shoppingCartItems = 0;

function addToShoppingCart() {
    // Nothing is happening here.
    // No side effects? Yay.
    // No functionality? Boo.
}

addToShoppingCart();
addToShoppingCart();
addToShoppingCart(); // window.shoppingCartItems is still `0`
```

Notice how `addToShoppingCart` now does nothing. To remove side effects while still retaining the functionality of incrementing a value, we'd have to both:

1. Pass an input
2. Return a value

With these changes, it might look something like this:

```js
function addToShoppingCart(val) {
	return val + 1;
}

let shoppingCartItems = 0;

shoppingCartItems = addToShoppingCart(shoppingCartItems);
shoppingCartItems = addToShoppingCart(shoppingCartItems);
shoppingCartItems = addToShoppingCart(shoppingCartItems);
// shoppingCartItems is now `3`
```

Because of the inherent nature of side effects, this demonstrates how **all functions that don't return a new value either do nothing or have a side effect within them**.

Further, because an application's inputs and outputs (combined often called "`I/O`") come from the user, rather than from the function itself, **all I/O operations are considered "side effects"**. This means that in addition to non-returning functions, all of the following are considered "side effects":

- A user typing something
- A user clicking something
- Saving a file
- Loading a file
- Making a network request
- Printing something to a printer
- Logging a value to `console`

## Production Side Effects

On top of providing a global variable which we can mutate to store values, both [`window`](https://developer.mozilla.org/en-US/docs/Web/API/Window#methods) and [`document`](https://developer.mozilla.org/en-US/docs/Web/API/Document#methods) expose a number of APIs that can be useful in an application.

Let's say that inside of our component we'd like to display the window size:

<!-- tabs:start -->

### React

```jsx
const Parent = () => {
  const [height, setHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth);
    
  return <div>
  	<p>Height: {height}</p>
  	<p>Width: {width}</p>
  </div>
}
```

### Angular

```typescript
@Component({
  selector: 'window-size',
  template: `
  <div>
  	<p>Height: {{height}}</p>
  	<p>Width: {{width}}</p>
  </div>
  `,
})
export class WindowSizeComponent {
  height = window.innerHeight;
  width = window.innerWidth;
}
```

### Vue

```vue
<!-- WindowSize.vue -->
<template>
  <div>
    <p>Height: {{ height }}</p>
    <p>Width: {{ width }}</p>
  </div>
</template>

<script setup>
const height = window.innerHeight
const width = window.innerWidth
</script>
```

<!-- tabs:end -->

This works to display the window size on the initial render, but what happens when the user resizes their browser?

Because we aren't listening for the change in window size, we never get an updated render with the new screen size!

Let's solve this by using [`window.addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) to handle [`resize` events](https://developer.mozilla.org/en-US/docs/Web/API/Window/resize_event); emitted when the user changes their window size.

<!-- tabs:start -->

### React

```jsx {4-10}
const WindowSize = () => {
  const [height, setHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth);
    
  useEffect(() => {
      function resizeHandler() {
          setHeight(window.innerHeight);
          setWidth(window.innerWidth);
      }
      
      // This code will cause a memory leak, more on that soon
      window.addEventListener('resize', resizeHandler);
  }, []);
    
  return <div>
  	<p>Height: {height}</p>
  	<p>Width: {width}</p>
  </div>
}
```

### Angular

```typescript {13-20}
@Component({
  selector: 'window-size',
  template: `
  <div>
  	<p>Height: {{height}}</p>
  	<p>Width: {{width}}</p>
  </div>
  `,
})
export class WindowSizeComponent implements OnInit {
  height = window.innerHeight;
  width = window.innerWidth;

  resizeHandler() {
    this.height = window.innerHeight;
    this.width = window.innerWidth;
  }
    
  ngOnInit() {
    // This code will cause a memory leak, more on that soon
    window.addEventListener('resize', this.resizeHandler);
  }
}
```

### Vue

```vue
<!-- WindowSize.vue -->
<template>
  <div>
    <p>Height: {{ height }}</p>
    <p>Width: {{ width }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const height = ref(window.innerHeight)
const width = ref(window.innerWidth)

function resizeHandler() {
  height.value = window.innerHeight
  width.value = window.innerWidth
}

onMounted(() => {
  // This code will cause a memory leak, more on that soon
  window.addEventListener('resize', resizeHandler)
})
</script>
```

<!-- tabs:end -->

Now, when we resize the browser, our values on-screen should update as well.

## Event Bubbling Aside

In our introduction to components, we demonstrated that [components can listen to HTML events](/posts/intro-to-components#Event-Binding).

What if we changed our code above to listen for the `resize` event that way to sidestep `addEventListener`?

<!-- tabs:start -->

### React

```jsx
const WindowSize = () => {
  const [height, setHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth);
  
  function resizeHandler() {
    setHeight(window.innerHeight);
    setWidth(window.innerWidth);
  }

  // This code doesn't work, we'll explain why soon
  return <div onResize={resizeHandler}>
  	<p>Height: {height}</p>
  	<p>Width: {width}</p>
  </div>
}
```

### Angular

```typescript {13-20}
@Component({
  selector: 'window-size',
  template: `
  <!-- This code doesn't work, we'll explain why soon -->
  <div (resize)="resizeHandler()">
  	<p>Height: {{height}}</p>
  	<p>Width: {{width}}</p>
  </div>
  `,
})
export class WindowSizeComponent implements OnInit {
  height = window.innerHeight;
  width = window.innerWidth;

  resizeHandler() {
    this.height = window.innerHeight;
    this.width = window.innerWidth;
  }
}
```

### Vue

```vue
<!-- WindowSize.vue -->
<template>
  <!-- This code doesn't work, we'll explain why soon -->
  <div @resize="resizeHandler()">
    <p>Height: {{ height }}</p>
    <p>Width: {{ width }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const height = ref(window.innerHeight)
const width = ref(window.innerWidth)

function resizeHandler() {
  height.value = window.innerHeight
  width.value = window.innerWidth
}
</script>
```

<!-- tabs:end -->

If we run this code, it will render as-expected with the initial screen size, but on subsequent re-renders will not update the value on screen. This is because the `resize` event is only triggered on the `window` object (associated with the `<html>` tag) and does not permeate downwards towards other elements.

You see, by default, events will always "bubble" upwards in the DOM tree from their emitted position. So, if we click on a `div`, the `click` event will start from the `div` and bubble all the way up to the `html` tag.

![A click event bubbling to the top of the document](./event_bubbling.png) 
We can demonstrate this inside of our frameworks.

<!-- tabs:start -->

### React

```jsx
<div onClick={() => logMessage()}>
  <p><span>Click me</span> or even me!</p>
</div>
```

### Angular

```html
<div (click)="logMessage()">
  <p><span>Click me</span> or even me!</p>
</div>
```

### Vue

```html
<div @click="logMessage()">
  <p><span>Click me</span> or even me!</p>
</div>
```

<!-- tabs:end -->

If you click on the `span`, the `click` event will start from the `span`, bubble up to the `p` tag, then finally bubble up to the `div`. Because we add an event listener on the `div`, it will run `logMessage`, even when clicking on the `span`.

This is why we don't we simply utilize event binding for the `resize` event: It's only ever emitted directly from the `html` node. Because of this behavior, if we want to access the `resize` event inside of our `WindowSize` component, we need to use `addEventListener`.

[You can learn more about event bubbling, how it works, and how to overwrite it in specific instances from Mozilla Developer Network.](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_bubbling_and_capture)

# Un-rendering

Side effects are, among other things, a powerful way to utilize browser APIs. However, we need to make sure to clean up any side effects we utilize.

This holds true for our `addEventListener` usage since `addEventListener` will continue to run the passed function until a `removeEventListener` is called. We should run this any time an element is un-rendered. After all, it makes no sense to listen to DOM events on a DOM node that isn't present anymore.

Luckily, similar to the lifecycle method for a component's render, there's another lifecycle method for when a component is unrendered.

<!-- tabs:start -->

## React

```jsx {1,4,5}
const Child = () => {
	useEffect(() => {
        console.log("I am rendering");
        
        return () => console.log("I am unrendering");
    }, []);

    return <p>I am the child</p>
}
```

React utilizes `useEffect`'s ability to do cleanup to act as an "unrendered" of sorts. This cleanup is set up by returning a function at the end of a `useEffect` call. What's more, if `useEffect` is called more than once for whatever reason, it will execute the cleanup before running the next time.

## Angular

```typescript {4,9-11}
@Component({
  selector: 'child',
  template: '<p>I am the child</p>',
})
export class ChildComponent implements OnInit, OnDestroy {
  ngOnInit() {
    console.log('I am rendering');
  }
    
  ngOnDestroy() {
      console.log("I am unrendering");
  }
}
```

## Vue

```vue
<!-- Child.vue -->
<template>
  <p>I am the child</p>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  console.log('I am rendering')
})

onUnmounted(() => {
  console.log('I am unrendering')
})
</script>
```

<!-- tabs:end -->

Knowing this, we can add a `removeEventListener` to the `WindowSize` component we were building previously.

<!-- tabs:start -->

## React

```jsx
const WindowSize = () => {
  const [height, setHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth);
    
  useEffect(() => {
      function resizeHandler() {
          setHeight(window.innerHeight);
          setWidth(window.innerWidth);
      }
      window.addEventListener('resize', resizeHandler);
      
      return () => window.removeEventListener('resize', resizeHandler);
  }, []);
    
  return <div>
  	<p>Height: {height}</p>
  	<p>Width: {width}</p>
  </div>
}
```

## Angular

```typescript
@Component({
  selector: 'window-size',
  template: `
  <div>
  	<p>Height: {{height}}</p>
  	<p>Width: {{width}}</p>
  </div>
  `,
})
export class WindowSizeComponent implements OnInit, OnDestroy {
  height = window.innerHeight;
  width = window.innerWidth;

  resizeHandler() {
    this.height = window.innerHeight;
    this.width = window.innerWidth;
  }
    
  ngOnInit() {
    window.addEventListener('resize', this.resizeHandler);
  }
    
  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeHandler);
  }
}
```

## Vue

```vue
<!-- WindowSize.vue -->
<template>
  <div>
    <p>Height: {{ height }}</p>
    <p>Width: {{ width }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const height = ref(window.innerHeight)
const width = ref(window.innerWidth)

function resizeHandler() {
  height.value = window.innerHeight
  width.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler)
})
</script>
```

<!-- tabs:end -->

> Something to keep in mind with `removeEventListener` is that it needs to be the same function passed as the second argument to remove it from the listener.
>
> This means that inline arrow functions like this:
>
> ```javascript
> window.addEventListener('resize', () => console.log('a'));
> window.removeEventListener('resize', () => console.log('a'));
> ```
>
> Won't work, but the following will:
>
> ```javascript
> const fn = () => console.log('a');
> window.addEventListener('resize', fn);
> window.removeEventListener('resize', fn);
> ```
>

# Re-renders & Beyond

While rendering and un-rendering are primary actions in a component's lifecycle, they're not the only lifecycle methods on the table.

Each of the frameworks has a handful of lifecycle methods beyond the two we've looked at today. However, this is where these frameworks tend to diverge, as their lifecycle methods tend to reflect the framework's internals. While we'll touch on the framework's internals in a future chapter, for now, let's take a look at one more component lifecycle that's fairly consistent between every framework: Re-rendering.

Re-rendering is just what it sounds like! While the initial "render" is what allows us to see the first contents on screen being drawn, subsequent updates — like our live-updated values — are drawn during subsequent re-renders.

Re-renders may occur for many reasons:

- Props being updated
- State being changed
- Explicitly calling a re-render with other means

While we might attribute the definition of "rendering" to mean "showing something new on-screen", this is only partially true. In some instances, the framework may do some internal updates to the DOM that may not show anything new to the user but is still considered a "re-render".

> While this isn't always a bad thing — conventional knowledge says that these "empty" re-renders aren't usually bad things — this can lead to problems with an app's performance. [We'll touch on how to improve your app's performance with these frameworks in our "Performance" chapter.](// TODO: Add link)

 <!-- Note to author: This is because Angular does not use a virtual DOM but instead uses an incremental DOM. This is why there's no clean direct "re-render" lifecycle method -->

Each render that displays new content to the user is called a "paint".

Let's take a look at how each framework exposes re-rendering to the user via lifecycle methods.

<!-- tabs:start -->

## React

```jsx
const ReRenderListener = () => {
  useEffect(() => {
      console.log("Component has re-rendered")
  }); // Notice the lack of an array
    
  return (
  	<div/>
  )
}
```

Do you remember how I said we'd mention what the array for the second argument of `useEffect`? Well, here we are!

The array at the end of the `useEffect` allows you to limit how often `useEffect` runs. If there is no array, `useEffect` will run the side effect on every render, regardless of if said render has "painted" or not.

However, if you pass an array, it will only run when the references inside of the `useEffect` run.

```jsx
useEffect(() => {
	// ...
}, [test])
```

Here, if the reference to `test` changes during a render, `useEffect` will run after the render.

This means that if we pass an empty array:

```jsx
useEffect(() => {
	// ...
}, [])
```

It will run once the array is initialized - during the initial render - but not again afterward. This is what allows it to act as an alternative to a `rendered` lifecycle.

## Angular

We mentioned earlier that outside of the basics of "rendering" and "un-rendering", each framework tends to diverge. Well, dear reader, it's coming into play here.

Angular does not have a lifecycle method specifically for when a component re-renders. This is because Angular does not track DOM changes internally the same way the other two frameworks do.

This isn't to say that Angular components don't re-paint the DOM — we've already demonstrated that it's able to live-refresh the DOM — just that Angular doesn't provide a lifecycle for detecting when it does.

To answer "why" is a much longer topic, [which we'll touch on in our "Angular Internals" section](// TODO), but feel free to see how the other two frameworks work as a reference for what you might expect elsewhere.

## Vue

```vue
<!-- ReRenderListener.vue -->
<template>
  <div>{{ val }}</div>
</template>

<script setup>
import { onUpdated } from 'vue'

const props = defineProps(['val'])

onUpdated(() => {
  console.log('Component was painted')
})
</script>
```

Every time the `ReRenderListener` component is re-rendered **and the DOM is painted with the changes**, the `updated` method will run.

Vue also exposes a lifecycle method, called `renderTriggered`, for when a re-render occurs in general, regardless of if a paint has also occurred. 

```vue
<!-- ReRenderListener.vue -->
<template>
  <div></div>
</template>

<script setup>
import { onRenderTriggered } from 'vue'

onRenderTriggered(() => {
  console.log('Component was re-rendered, paint may not have occured')
})
</script>
```

Something worth mentioning is that `onRenderTriggered` only runs in Vue's `dev` mode and, therefore, cannot be used in production apps.

<!-- tabs:end -->

## Other lifecycles

We haven't touched on every lifecycle present, either!

While these lifecycles vary even further from framework to framework, some other lifecycles that may be present depending on your selected tool might include:

- When an error is caught
- Before a component is rendered
- Before a component is unrendered
- Specifically when props are changed
- After a component's children are rendered

These additional lifecycles tend to be utilized in more niche usages and, as such, won't be touched on currently.

# Lifecycle Chart

Let's take a look visually at how each framework calls the relevant lifecycle methods we've touched on today:

<!-- tabs:start -->

## React

![A component starts by rendering, then "useEffect" has its first run. After that, the component is rendered. For each time the component re-renders, it will run the "useEffect" array check. Finally, when a component is being unrendered, it will run the "useEffect" cleanup.](./react_lifecycles.jpg)

## Angular

![When a component renders, it will trigger ngOnInit. Then, when it unrenders, it will call ngOnDestroy.](./angular_lifecycles.jpg)

## Vue

![A component starts by rendering with the "mounted" lifecycle method running as a result. After that, the component is rendered. For each time the component re-renders, it will run the "updated" lifecycle method. Finally, when a component is being unrendered, it will run the "unmounted" lifecycle method.](./vue_lifecycles.jpg)

<!-- tabs:end -->

# Challenge

Implement a way to show a different message to the user if they're focused on the tab or not
