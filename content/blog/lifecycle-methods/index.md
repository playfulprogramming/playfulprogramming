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

While these frameworks' ability to render dynamic HTML is a powerful ability that helps make their usage so widespread, it's only telling half of the story of their capabilities. In particular, lifecycle methods are a way to attach JavaScript logic to specific behaviors these components have.

While [we lightly touched on one of these lifecycle methods in chapter 1](/posts/intro-to-components#Intro-to-Lifecycles), there are many others that come into play.

Let's start by recapping what we already know.

# Render Lifecycle

When we introduced components, we touched on the [concept of "rendering"](/posts/intro-to-components#Rendering-the-app). This occurs when a component is drawn on-screen.

This occurs when the user loads a page and when shown or hidden using a [conditional render, which we touched on in the last chapter](/posts/dynamic-html#Conditional-Branches).

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



What would we need to do to add in a `console.log` whenever the `setShowChild` method is called?

Well, we can use a lifecycle method to detect when `Child` is rendered!

<!-- tabs:start -->

## React

```jsx {1-3}
const Child = () => {
	useEffect(() => {
        console.log("I am rendering");
    }, []);

    return <p>I am the child</p>
}
```

React works slightly differently from the other frameworks we're looking at in this series. In particular, while there's an alternative way of writing React components called "class components", which does have traditional lifecycle methods, the way we're writing components — called "functional components" — does not.

Instead of a direct analogous, React's functional components have a different API [called "Hooks"](https://reactjs.org/docs/hooks-intro.html). These Hooks can then be used to recreate similar effects to lifecycle methods.

For example, in the above code, we're using `useEffect` with an empty array as the second argument to create a [side effect](// TODO: Link to glossary) that runs only once per render.

We'll touch on what a side effect is and what the empty array is doing in just a moment.

## Angular

```typescript {4-8}
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

Angular's version of the "rendered" lifecycle method is called "OnInit". All of Angular's lifecycle methods are prepended with `ng` and requires you to add `implements` to your component class.

If you forget the `implements`, your lifecycle method will not run when you expect it to. 

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

Despite some other frameworks having their lifecycle methods called implicitly, Vue requires you to import them from the `vue` root package. Vue's lifecycle methods all start with an `on` prefix when used inside of a `<script setup>` component. 

This means that if you see me talking about a "mounted" lifecycle method, it's imported via `onMounted` instead. 

<!-- tabs:end -->

The framework then calls these lifecycle methods when a specific lifecycle event occurs. No need to call these methods yourself manually!

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

````javascript
window.shoppingCartItems = 0;

function addToShoppingCart() {
	window.shoppingCartItems++;
}
````

## Production Side Effects

On top of global storage, both [`window`](https://developer.mozilla.org/en-US/docs/Web/API/Window#methods) and [`document`](https://developer.mozilla.org/en-US/docs/Web/API/Document#methods) expose a number of APIs that can be useful in an application.

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

Because we aren't listening for the change in Window size, we never get an updated render with the new screen size!

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
  window.addEventListener('resize', resizeHandler)
})
</script>
```

<!-- tabs:end -->

Now, when we resize the browser, our values on-screen should update as well!

## Event Bubbling Aside

You might be wondering why we don't simply utilize event binding, [which we covered in our introduction to components](/posts/intro-to-components#Event-Binding), to listen for the `resize` event.

This is because the `resize` event is only triggered on the `window` object (associated with the `<html>` tag) and does not permeate downwards towards other elements.

You see, by default, events will always "bubble" upwards from their emitted position. So, if we click on a `div`, the `click` event will start from the `div` and bubble all the way up to the `html` tag.

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
import { defineProps, onUpdated } from 'vue'

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

