---
{
    title: "Element Reference",
    description: "React, Angular, and Vue provide powerful APIs that let you avoid DOM manipulations most of the time. But sometimes you need to access the underlying DOM. Here's how.",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 8,
    series: "The Framework Field Guide"
}
---

While React, Angular, and Vue all provide simple built-in APIs to access events, inputs, and other bindings to underlying HTML elements, sometimes it's just not enough.

For example, let's say that we want to build a right-click menu so that a user can see a relevant list of actions associated with the file the user is currently hovering over:

![// TODO: Add alt text](./context-open.png)



We're able to build some of this functionality with the APIs we've covered thus far, namely we can:

- Using our framework's event binding to listen to the browser's [`contextmenu`](https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event) event which lets us know when the user has right-clicked
- Conditionally rendering the context menu's elements until relevant
- Binding the `style` attribute to position the popup's `x` and `y` value

<!-- tabs:start -->

# React

```jsx
/**
 * This code sample is inaccessible and generally not
 * production-grade. It's missing:
 * - Focus on menu open
 * - Closing upon external click
 * 
 * Read on to learn how to add these
 */
export default function App() {
  const [mouseBounds, setMouseBounds] = useState({
    x: 0,
    y: 0,
  });

  const [isOpen, setIsOpen] = useState(false);

  function onContextMenu(e) {
    e.preventDefault();
    setIsOpen(true);
    setMouseBounds({
      // Mouse position on click
      x: e.clientX,
      y: e.clientY,
    });
  }

  return (
    <>
      <div style={{ marginTop: '5rem', marginLeft: '5rem' }}>
        <div onContextMenu={onContextMenu}>Right click on me!</div>
      </div>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: `${mouseBounds.y}px`,
            left: `${mouseBounds.x}px`,
            background: 'white',
            border: '1px solid black',
            borderRadius: 16,
            padding: '1rem',
          }}
        >
          <button onClick={() => setIsOpen(false)}>X</button>
          This is a context menu
        </div>
      )}
    </>
  );
}
```

# Angular

```typescript
/**
 * This code sample is inaccessible and generally not
 * production-grade. It's missing:
 * - Focus on menu open
 * - Closing upon external click
 * 
 * Read on to learn how to add these
 */
@Component({
  selector: 'my-app',
  standalone: true,
  imports: [NgIf, JsonPipe, NgStyle],
  template: `
  <div style="margin-top: 5rem; margin-left: 5rem">
    <div (contextmenu)="open($event)">
      Right click on me!
    </div>
  </div>
  <div
    *ngIf="isOpen"
    [style]="'
      position: fixed;
      top: ' + mouseBounds.y + 'px;
      left: ' + mouseBounds.x + 'px;
      background: white;
      border: 1px solid black;
      border-radius: 16px;
      padding: 1rem;
    '"
  >
  <button (click)="close()">X</button>
  This is a context menu
</div>
  
  `,
})
class AppComponent {
  isOpen = false;

  mouseBounds = {
    x: 0,
    y: 0,
  };

  close() {
    this.isOpen = false;
  }

  open(e: MouseEvent) {
    e.preventDefault();
    this.isOpen = true;
    this.mouseBounds = {
      // Mouse position on click
      x: e.clientX,
      y: e.clientY,
    };
  }
}
```


# Vue

```vue
<!-- App.vue -->

<!-- This code sample is inaccessible and generally not -->
<!--  production-grade. It's missing:                   -->
<!--  - Focus on menu open                              -->
<!--  - Closing upon external click                     -->
<!--                                                    -->
<!--  Read on to learn how to add these                 -->
<template>
  <div style="margin-top: 5rem; margin-left: 5rem">
    <div @contextmenu="open($event)">Right click on me!</div>
  </div>
  <div
    v-if="isOpen"
    :style="`
      position: fixed;
      top: ${mouseBounds.y}px;
      left: ${mouseBounds.x}px;
      background: white;
      border: 1px solid black;
      border-radius: 16px;
      padding: 1rem;
    `"
  >
    <button @click="close()">X</button>
    This is a context menu
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)

const mouseBounds = ref({
  x: 0,
  y: 0,
})

const close = () => {
  isOpen.value = false
}

const open = (e) => {
  e.preventDefault()
  isOpen.value = true
  mouseBounds.value = {
    // Mouse position on click
    x: e.clientX,
    y: e.clientY,
  }
}
</script>
```

<!-- tabs:end -->



This works relatively well, until we think about two features that are missing:

- Listening for any click that's outside of the popup's contents
- Focusing on the popup's contents when the user right-clicks, so keyboard shortcuts apply to the popup immediately

While these features are _possible_ without any newly introduced APIs, they'd both require you to utilize browser APIs such as [`document.querySelector`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) to eject away from the framework's limitations.

In those rare events you want to eject away from the framework controlling your access to HTML nodes, each framework enables you to access the underlying DOM nodes without using browser APIs specifically. This allows our code to still retain full control over the underlying elements while remaining within the reactivity systems these frameworks provide.

In this chapter, we'll learn:

- How to reference the underlying DOM element
- How to reference an array of elements
- Adding focus and external click listening to the context menu
- A code challenge to re-enforce knowledge

# Basic Element References

<!-- tabs:start -->

## React

In React, there's no simpler demonstration of an element reference than passing a function to an element's `ref` property.

```jsx
const RenderParagraph = () => {
    // el is HTMLElement
	return <p ref={el => console.log({el: el})}></p>
}
```

In this example, once the paragraph tags renders, it will `console.log` the underlying HTML DOM node.

> You may be wondering where the `ref` property has come from, since it's not a known [`HTMLElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) property. This is because `ref` is a reserved property by React for this special case. 

Knowing that we can pass a function to gain access to the HTML DOM node, we can pass a function that adds an event listener to the HTML element.

```jsx
const RenderButton = () => {
    // el is HTMLElement
    const addClickListener = (el) => {
        el.addEventListener('click', () => {
            console.log("User has clicked!");
        })
    }
    
	return <button ref={addClickListener}>Click me!</button>
}
```

> This is just used as an example of what you can do with the underlying HTML element. While there _are_ perfectly valid reasons for using `ref` to `addEventListener` (we'll touch on one such case later on), it's usually suggested to use `onClick` style event bindings instead.

### `useState` `ref`s

However, this is a problem because our `addEventListener` is never cleaned up! Remember, this is part of the API that `useEffect` provides.

As a result, let's store the value of `el` into a `useState`, then pass that value into a `useEffect`, which will then add the event listener:

```jsx
const CountButton = () => {
    const [count, setCount] = useState(0);
    const [buttonEl, setButtonEl] = useState();
    
    const storeButton = (el) => {
        setButtonEl(el);
    }
    
    useEffect(() => {
        // Initial render will not have `buttonEl` defined, subsequent renders will
        if (!buttonEl) return;
        const clickFn = () => {
            /**
             * We need to use `v => v + 1` instead of `count + 1`, otherwise `count` will
             * be stale and not update further than `1`. More details in the next paragraph.
             */
            setCount(v => v + 1);
        };

        buttonEl.addEventListener('click', clickFn)
        
        return () => {
	        buttonEl.removeEventListener('click', clickFn)            
        }
    }, [el]);
    
    return <>
    	<button ref={storeButton}>Add one</button>
    	<p>Count is {count}</p>
    </>
}
```

> Once again: You should be using `onClick` to bind a method, this is only to demonstrate how element `ref`s work

You'll notice in this example that within our `useEffect`, we're utilizing a function to update `setCount`. This is because otherwise, we will run into a "Stale Closure", which means that our `count` value will never update past `1`.

// TODO: Explain closures (or link out to curse-free mirror of https://whatthefuck.is/closure)


Overall, we're utilizing a familiar `useState` hook in order to store our `ref`. Fairly standard stuff thus far.

However, if you look through the [React Hooks API documentation](// TODO: Link), you'll notice something called `useRef`. Sensibly, based on the name, it's very commonly used with an element's `ref` property. But why aren't we using it in this example? What is `useRef`?

### What's a `useRef` and why aren't we using it?

`useRef` allows you to persist data across renders, similar to `useState`. There are two major differences from `useState`:

1) You access data from a ref using `.current`
2) It does not trigger a re-render when updating values (more on that soon)

>  `useRef` is able to avoid re-rendering by using [object mutation](// TODO: Find blog post) instead of following [React's change detection mechanism of explicit update surfacing](// TODO: Link to React CD chapter).

Here, we can see an example of what `useRef` might look like in our `CountButton` example:

```jsx
import {useRef, useEffect} from 'react';

const CountButton = () => {
    // `ref` is `{current: undefined}` right now
    const buttonRef = useRef();

    useEffect(() => {
        const clickFn = () => {
            setCount(v => v + 1);
        };

        buttonRef.current.addEventListener('click', clickFn)
        
        return () => {
	        buttonRef.current.removeEventListener('click', clickFn)            
        }
    // DO NOT DO THIS, USE A FUNCTION OR `useState` for your `useEffect` `ref`s INSTEAD
    }, [buttonRef.current]);
    
    return <>
    	<button ref={el => buttonRef.current = el}>Add one</button>
    	<p>Count is {count}</p>
    </>
}
```

Luckily for us, there's even a shorthand method for using `useRef` values inside of an element's `ref`:

```jsx
// This will update `.current` for us
<button ref={buttonRef}>Add one</button>
```

Unluckily for us, neither the shorthand nor the fully typed out `useRef` usage will behave as-expected for this case.

Take the following code sample:

```jsx
import {useRef, useEffect} from 'react';

const Comp = () => {
	const ref = useRef();
    
    useEffect(() => {
        ref.current = Date.now();
    });
    
    return <p>The current timestamp is: {ref.current}</p>
}
```

Why doesn't this show a timestamp?

This is because when you change `ref` it never causes a re-render, which then never re-draws the `p` . 

Here, `useRef` is set to `undefined` and only updates _after_ the initial render in the `useEffect`, which does not cause a re-render.

To solve for this, we must set a `useState` to trigger a re-render.

```jsx
const Comp = () => {
	const ref = useRef();
    
    // We're not using the `_` value, just the `set` method in order to force a re-render 
    const [_, setForceRenderNum] = useState(0);

      useEffect(() => {
        ref.current = Date.now();
      });

      useEffect(() => {
        setForceRenderNum((v) => v + 1);
      }, []);

    return <>
    	<p>The current timestamp is: {ref.current}</p>
    	<button onClick={() => setForceRenderNum(v => v + 1)}>Check timestamp</button>
    </>
}
```

 You'll notice that even though `ref.current` is being set every time `useEffect` is ran (every render) it will update `ref.current`, but does not re-render.

Only when the `useState` variable is updated (via the `button`'s `onClick`) does the component re-render.

This isn't to say that `useRef` is bad by any means, though. Instead, what I'm trying to say is that you shouldn't use a `useRef` inside of a `useEffect` (unless you _really_ know what you're doing).

[I wrote more about why we shouldn't use `useRef` in `useEffect`s and when and where they're more useful in another article linked here.](https://unicorn-utterances.com/posts/react-refs-complete-story)

## Angular

In our chapter about [content reference](/posts/ffg-fundamentals-accessing-children), we touched on `ContentChild`, a method of accessing the projected content programmatically without our component class instance.

While this is extremely useful when you're able to use it, projected content isn't the only thing HTML elements we want to reference programatically.

This is where `ContentChild`'s sibling API comes into play: `ViewChild`. Using `ViewChild`, we can access an Element that's within an Angular component's `template`:

```typescript
import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';

@Component({
    selector: 'paragraph',
    template: `<p #pTag></p>`
})
class RenderParagraphComponent implements AfterViewInit {
    @ViewChild('pTag') pTag: ElementRef<HTMLElement>;
    
    ngAfterViewInit() {
        console.log(this.pTag.nativeElement);
    }
}
```

Here, we're using a [template reference variable](/posts/ffg-fundamentals-accessing-children#ng-templates) to access the `p` tag instance and, upon `ngAfterViewInit`, running a `console.log`.

> What's this new `ngAfterViewInit` method?

Similar to how `ViewContent` has an associated lifecycle method that tells our component when the project content is ready, so too do we have a lifecycle method to let us know when our template is rendered fully: `ngAfterViewInit`.

If we were to run our `console.log` within `ngOnInit`, it would throw an error due to `nativeElement` being `undefined`.

<!-- Editors note: This isn't true. `{static: true}` fixes this problem for us -->

<!-- TODO: Make this true -->

Using this, we can add a `addEventListener` and `removeEventListener` to manually bind a `button`'s `click` event:

```typescript
import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';

@Component({
    selector: 'paragraph',
    template: `
		<button #btn>Add one</button>
    	<p>Count is {{count}}</p>
    `
})
class RenderParagraphComponent implements AfterViewInit, OnDestroy {
    @ViewChild('btn') btn: ElementRef<HTMLElement>;
    
    count = 0;
    
    addOne() {
        this.count++;
    }
    
    ngAfterViewInit() {
        this.btn.nativeElement.addEventListener('click', this.addOne);
    }
    
    ngOnDestroy() {
        this.btn.nativeElement.removeEventListener('click', this.addOne);
    }
}
```

But wait! When we click on the `button`, `count` is not updated!

This is because `this` is being unbound from the component instance within `addEventListener`, and we need to forcibly rebind the `count` to the component instead.

Change `addOne` to the following:

```typescript
addOne = function () {
  this.count++;
}.bind(this);
```

And boom, the count suddenly starts updating when the button is pressed.

> Wat?!

## Vue

Vue's ability to store reactive data using `ref` enables a super simplistic API to access DOM nodes; Simply create a `ref` with the same variable name as a `ref` property of an element's `ref` attribute value.

```vue
<!-- App.vue -->
<template>
  <p ref="el"></p>
</template>

<script setup>
import {ref} from "vue";

const el = ref();
</script>
```

Here, `el.value` points to an [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) of the `p` tag within `template`.

Vue also allows you to pass a function to `ref` in order to run a function when the `ref` is being set, like so:

```vue
<!-- App.vue -->
<template>
  <p :ref="logEl"></p>
</template>

<script setup>
function logEl(el) {
  console.log(el);
}
</script>
```

<!-- tabs:end -->



# How to keep an array of element references

When we learned [how to access content that's been projected](/posts/ffg-fundamentals-accessing-children), we had to learn different APIs in order both to access a single projected item and access multiple projected items at once. We have a similar challenge in front of us with element referencing.

Let's say that we have an array of items that we want to be able to quickly scroll to the top or bottom of. One way of solving this is to store each item in the array into an element reference then use the top and bottom [elements' `scrollIntoView` method](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) to bring them onto the page visually.

Let's see how that's done with each framework.

<!-- tabs:start -->

## React

React's ability to persist data within a `useRef` allows us to create an index-based array to store our elements into.

Using this array, we can then access the `0`th and `.length - 1`th index to indicate the first and last element respectively. 

```jsx
const chapters = [
  'Preface',
  'Introduction to Components',
  'Dynamic HTML',
  'Lifecycle Methods',
  'Derived Values',
  'Forms',
  'Partial DOM Application',
  'Content Projection',
  'Content Reference',
  'Element Reference',
];

export default function App() {
  const chaptersRef = useRef([]);

  const scrollToTop = () => {
    chaptersRef.current[0].scrollIntoView();
  };

  const scrollToBottom = () => {
    chaptersRef.current[chaptersRef.current.length - 1].scrollIntoView();
  };

  return (
    <div>
      <button onClick={scrollToTop}>Scroll to top</button>
      <ul style={{ height: '100px', overflow: 'scroll' }}>
        {chapters.map((chapter, i) => {
          return <li ref={(el) => (chaptersRef.current[i] = el)}>{chapter}</li>;
        })}
      </ul>
      <button onClick={scrollToBottom}>Scroll to bottom</button>
    </div>
  );
}
```

## Angular

Just as there are both `ContentChild` and `ContentChildren` APIs to access a single and multiple projected elements, there's also `ViewChild` and `ViewChildren` to access more than one or more template elements using similar APIs.

Using `ViewChildren`, we can access [template reference variables](https://crutchcorn-book.vercel.app/posts/content-reference#ng-templates) in order to `scrollIntoView` the first and last elements.

````typescript
@Component({
  selector: 'my-app',
  template: `
    <div>
      <button (click)="scrollToTop()">Scroll to top</button>
      <ul style="height: 100px; overflow: scroll">
        <li #listItem *ngFor="let chapter of chapters; let i = index">
          {{chapter}}
        </li>
      </ul>
      <button (click)="scrollToBottom()">Scroll to bottom</button>
    </div>
  `,
})
class AppComponent {
  @ViewChildren('listItem') els: QueryList<ElementRef<HTMLElement>>;

  scrollToTop() {
    this.els.get(0).nativeElement.scrollIntoView();
  }

  scrollToBottom() {
    this.els.get(this.els.length - 1).nativeElement.scrollIntoView();
  }

  chapters = [
    'Preface',
    'Introduction to Components',
    'Dynamic HTML',
    'Lifecycle Methods',
    'Derived Values',
    'Forms',
    'Partial DOM Application',
    'Content Projection',
    'Content Reference',
    'Element Reference',
  ];
}
````



## Vue

Vue has a handy feature that [enables you to create an array of referenced elements using nothing more than a string inside of a `ref` attribute](https://vuejs.org/guide/essentials/template-refs.html#refs-inside-v-for). This then turns the `ref` of the same name into an array that we can access as-expected.

```vue
<!-- App.vue -->
<template>
  <div>
    <button @click="scrollToTop()">Scroll to top</button>
    <ul style="height: 100px; overflow: scroll">
      <li v-for="(chapter, i) of chapters" ref="items">
        {{chapter}}
      </li>
    </ul>
    <button @click="scrollToBottom()">Scroll to bottom</button>
  </div>
</template>

<script setup>
import {ref} from 'vue';

const items = ref([]);

function scrollToTop() {
  items.value[0].scrollIntoView();
}

function scrollToBottom() {
  items.value[this.$refs.items.length - 1].scrollIntoView();
}

const chapters = [
  'Preface',
  'Introduction to Components',
  'Dynamic HTML',
  'Lifecycle Methods',
  'Derived Values',
  'Forms',
  'Partial DOM Application',
  'Content Projection',
  'Content Reference',
  'Element Reference',
];
</script>
```

<!-- tabs:end -->



# Real world usage

TODO: Write

![// TODO: Add alt text](./context-close.png)

Let's first start by detecting when the user has right-clicked a `div`. We can use [the `contextmenu` event](https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event) to detect a right-click event. From there, it's as simple as [conditionally rendering](https://crutchcorn-book.vercel.app/posts/dynamic-html#Conditional-Rendering) the context menu component when the user has right-clicked.

----------------------

// TODO: Write

---------------------------

Let's add this functionality into our context menu component. To do this, let's:

- Add a listener for any time the user clicks on a page
- Inside of that click listener, get [the event's `target` property](https://developer.mozilla.org/en-US/docs/Web/API/Event/target)
  - The event target is the element that the user is taking an action on - AKA the element the user is currently clicking on
- We then [check if that `target` is inside of the context menu or not using the `element.contains` method](https://developer.mozilla.org/en-US/docs/Web/API/Node/contains).

This code in vanilla JavaScript might look something like this:

```html
<button id="clickInside">
    If you click outside of this button, it will hide
</button>
<script>
const clickInsideButton = document.querySelector("#clickInside");

function listenForOutsideClicks(e) {
    // This check is saying "`true` if the clicked element is a child of the 'clickInside' button"
    const isClickInside = clickInsideButton.contains(e.target);
    if (isClickInside) return;
    // Hide the button using CSS. In frameworks, we'd use conditional rendering.
    clickInsideButton.style.display = 'none';
}

document.addEventListener('click', listenForOutsideClicks)
</script>
```




Let's port this logic to React, Angular, and Vue:



-----------------

We also want to immediately [focus on the context menu using `element.focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) in order to make sure that keyboard users aren't lost when trying to use the feature.



<!-- tabs:start -->

## React

We can run `getBoundingClientRect` when the `ref` is set by simply passing a `callback` to the element's `ref`.

From there, it's a basic `useRef` passing in order to `focus` on the context menu. We're able to do this despite a conditional rendering of the context menu because React will automatically update the value of `ref` depending on if the base element is rendered or not.

```jsx

export default function App() {
  const [mouseBounds, setMouseBounds] = useState({
    x: 0,
    y: 0,
  });

  const [isOpen, setIsOpen] = useState(false);

  function onContextMenu(e) {
    e.preventDefault();
    setIsOpen(true);
    setMouseBounds({
      // Mouse position on click
      x: e.clientX,
      y: e.clientY,
    });
  }

  const [contextMenu, setContextMenu] = useState();

  useEffect(() => {
    if (contextMenu) {
      contextMenu.focus();
    }
  }, [contextMenu]);

  useEffect(() => {
    if (!contextMenu) return;
    const closeIfOutsideOfContext = (e) => {
      const isClickInside = contextMenu.contains(e.target);
      if (isClickInside) return;
      setIsOpen(false);
    };
    document.addEventListener('click', closeIfOutsideOfContext);
    return () => document.removeEventListener('click', closeIfOutsideOfContext);
  }, [contextMenu]);

  return (
    <>
      <div style={{ marginTop: '5rem', marginLeft: '5rem' }}>
        <div onContextMenu={onContextMenu}>Right click on me!</div>
      </div>
      {isOpen && (
        <div
          ref={(el) => setContextMenu(el)}
          tabIndex={0}
          style={{
            position: 'fixed',
            top: mouseBounds.y,
            left: mouseBounds.x,
            background: 'white',
            border: '1px solid black',
            borderRadius: 16,
            padding: '1rem',
          }}
        >
          <button onClick={() => setIsOpen(false)}>X</button>
          This is a context menu
        </div>
      )}
    </>
  );
}
```

## Angular

To get the base element's position, we're able to use our previous `ViewChild` to get the underlying DOM node.

However, in order to `focus` on the context menu, we're relying on [the `changes` functionality of `ViewChildren`](https://angular.io/api/core/QueryList#changes) to run a function every time the context menu is rendered and unrendered.

```typescript
@Component({
  selector: 'my-app',
  standalone: true,
  imports: [NgIf, JsonPipe, NgStyle],
  template: `
  <div style="margin-top: 5rem; margin-left: 5rem">
    <div #contextOrigin (contextmenu)="open($event)">
      Right click on me!
    </div>
  </div>
  <div
    *ngIf="isOpen"
    tabIndex="0"
    #contextMenu
    [style]="'
      position: fixed;
      top: ' + mouseBounds.y + 'px;
      left: ' + mouseBounds.x + 'px;
      background: white;
      border: 1px solid black;
      border-radius: 16px;
      padding: 1rem;
    '"
  >
  <button (click)="close()">X</button>
  This is a context menu
</div>
  
  `,
})
class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('contextMenu') contextMenu: QueryList<ElementRef<HTMLElement>>;

  isOpen = false;

  mouseBounds = {
    x: 0,
    y: 0,
  };

  closeIfOutsideOfContext = (e: MouseEvent) => {
    const contextMenuEl = this.contextMenu?.first?.nativeElement;
    if (!contextMenuEl) return;
    const isClickInside = contextMenuEl.contains(e.target as HTMLElement);
    if (isClickInside) return;
    this.isOpen = false;
  };

  ngAfterViewInit() {
    document.addEventListener('click', this.closeIfOutsideOfContext);

    this.contextMenu.changes.forEach(() => {
      const isLoaded = this.contextMenu?.first?.nativeElement;
      if (!isLoaded) return;
      this.contextMenu.first.nativeElement.focus();
    });
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.closeIfOutsideOfContext);
  }

  close() {
    this.isOpen = false;
  }

  open(e: MouseEvent) {
    e.preventDefault();
    this.isOpen = true;
    this.mouseBounds = {
      // Mouse position on click
      x: e.clientX,
      y: e.clientY,
    };
  }
}
```



## Vue

In Vue, we can pass a string to the context origin in order to run `getBoundingClientRect` on a component mount.

We'll also use a callback ref in order to run a function every time the context menu is open. This function will then either do nothing or call `.focus` on the element depending on if it's rendered or not.

```vue
<!-- App.vue -->
<template>
  <div style="margin-top: 5rem; margin-left: 5rem">
    <div @contextmenu="open($event)">Right click on me!</div>
  </div>
  <div
    v-if="isOpen"
    :ref="(el) => focusOnOpen(el)"
    tabIndex="0"
    :style="`
      position: fixed;
      top: ${mouseBounds.y}px;
      left: ${mouseBounds.x}px;
      background: white;
      border: 1px solid black;
      border-radius: 16px;
      padding: 1rem;
    `"
  >
    <button @click="close()">X</button>
    This is a context menu
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isOpen = ref(false)

const mouseBounds = ref({
  x: 0,
  y: 0,
})

const contextMenuRef = ref(null)

function closeIfOutside(e) {
  const contextMenuEl = contextMenuRef.value
  if (!contextMenuEl) return
  const isClickInside = contextMenuEl.contains(e.target)
  if (isClickInside) return
  isOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', closeIfOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', closeIfOutside)
})

const close = () => {
  isOpen.value = false
}

const open = (e) => {
  e.preventDefault()
  isOpen.value = true
  mouseBounds.value = {
    // Mouse position on click
    x: e.clientX,
    y: e.clientY,
  }
}

function focusOnOpen(el) {
  contextMenuRef.value = el
  if (!el) return
  el.focus()
}
</script>
```

<!-- tabs:end -->



# Challenge

// TODO: Tooltip based on position of another DOM element, complete with browser resize handling and hiding on blur 
