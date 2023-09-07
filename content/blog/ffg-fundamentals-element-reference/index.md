---
{
    title: "Element Reference",
    description: "React, Angular, and Vue provide powerful APIs that let you avoid DOM manipulations most of the time. But sometimes you need to access the underlying DOM. Here's how.",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 8,
    collection: "The Framework Field Guide - Fundamentals"
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
  imports: [NgIf],
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

You'll notice in this example that within our `useEffect`, we're utilizing a function to update `setCount`. This is because otherwise, we will run into a ["Stale Closure"](/posts/ffg-fundamentals-side-effects#Stale-Values), which means that our `count` value will never update past `1`.

### Why aren't we using `useRef`?

[If you think back to an earlier chapter in the book, "Side Effects", you may remember our usage of a hook called "`useRef`"](/posts/ffg-fundamentals-side-effects#Persist-data-without-re-rendering-using-useRef). Sensibly, based on the name, it's very commonly used with an element's `ref` property. In fact, it's so commonly used to store an element's reference that it even has a shorthand:

```jsx
const App = () => {
	const divRef = useRef();
	
	// Ta-da! No need to pass a function when using `useRef` and `ref` together 
	return <div ref={divRef}/>
}
```

Knowing this, why aren't we using `useRef` in the previous button counter example? Well, the answer goes back to the "Side Effects" chapter once again. Back in said chapter, [we explained how `useRef` doesn't trigger `useEffect`s as one might otherwise expect](/posts/ffg-fundamentals-side-effects#useRefs-dont-trigger-useEffects). 

Let's look at how using an element reference using `useRef` could cause havoc when binding an event via `addEventListener`. Here, we can see an example of what `useRef` might look like in our `CountButton` example:

```jsx
const CountButton = () => {
    const [count, setCount] = useState(0);
    const buttonRef = useRef();

    useEffect(() => {
        const clickFn = () => {
            setCount(v => v + 1);
        };

        buttonRef.current.addEventListener('click', clickFn)
        
        return () => {
	        buttonRef.current.removeEventListener('click', clickFn)            
        }
    // Do not use a useRef inside of a useEffect like this, it will likely cause bugs
    }, [buttonRef.current]);
    
    return <>
    	<button ref={buttonRef}>Add one</button>
    	<p>Count is {count}</p>
    </>
}
```

This works as we would expect because `buttonRef` is defined before the first run of `useEffect`. However, let's add a short delay to the `button`'s rendering. We can do this using a `setTimeout` and another `useEffect`:

```jsx
// This code intentionally doesn't work to demonstrate how `useRef`
//  might not work with `useEffect` as you might think
const CountButton = () => {
  const [count, setCount] = useState(0);
  const buttonRef = useRef();

  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowButton(true);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const clickFn = () => {
      setCount((v) => v + 1);
    };

    if (!buttonRef.current) return;
    buttonRef.current.addEventListener('click', clickFn);

    return () => {
      buttonRef.current.removeEventListener('click', clickFn);
    };
  }, [buttonRef.current]);

  return (
    <>
      {showButton && <button ref={buttonRef}>Add one</button>}
      <p>Count is {count}</p>
    </>
  );
};
```

Now, if we wait the second it takes to render the `<button>Add one</button>` element and press the button, we'll see that our `click` event handler is never set properly. 

This is because `buttonRef.current` is set to `undefined` in the first render and the mutation of `buttonRef` when the `<button>` element is rendered does not trigger a re-render, which in turn does not re-run `useEffect` to add the event binding.

> This is not to say that you shouldn't use `useRef` for element reference, just that you should be aware of its downfalls and alternatives.
>
> We'll see some usage of the `ref` property with `useRef` in a bit.

## Angular

Using `ViewChild`, we can access an [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) that's within an Angular component's `template`:

```typescript
@Component({
  selector: 'paragraph',
  standalone: true,
  template: `<p #pTag>Hello, world!</p>`,
})
class RenderParagraphComponent {
  @ViewChild('pTag') pTag: ElementRef<HTMLElement>;
}
```

You may notice that our `<p>` tag has a attribute prefixed with a pound sign (`#`). This pound-sign prefixed attribute allows Angular to associate the element with a "template reference variable", which can then be referenced inside of our `ViewChild` to gain access to an element.

For example, the `#pTag` attribute assigns the template reference variable named `"pTag"` to the `<p>` element and allows `ViewChild` to find that element based on the variable's name.

----

Now that we have access to the underlying `<p>` element, let's print it out inside of a `ngOnInit`:

```typescript
@Component({
  selector: 'paragraph',
  standalone: true,
  template: `<p #pTag>Hello, world!</p>`,
})
class RenderParagraphComponent implements OnInit {
  @ViewChild('pTag') pTag: ElementRef<HTMLElement>;

  ngOnInit() {
    // This will log `undefined`
    console.log(this.pTag);
  }
}
```

> Why does this log as `undefined`? How do we fix this?

Well, let's think about the following example:

```typescript
@Component({
  selector: 'paragraph',
  standalone: true,
  imports: [NgIf],
  template: `
    <ng-container *ngIf="true">
      <p #pTag>Hello, world!</p>
    </ng-container>
  `,
})
class RenderParagraphComponent implements OnInit {
  @ViewChild('pTag') pTag: ElementRef<HTMLElement>;

  ngOnInit() {
    // This will still log `undefined`
    console.log(this.pTag);
  }
}
```

Here, we're conditionally rendering our `p` tag using an `ngIf`. But see, under the hood the `ngIf` won't initialize the `<p>` tag until _after_ the `ngOnInit` lifecycle method is executed.

To solve this, we can do one of two things:

1) Tell Angular that our code doesn't contain any dynamic HTML (IE: No `*ngIf`, `*ngFor`, or `<ng-template>`s)
2) Use a different lifecycle method that occurs after `ngOnInit`. 

### Using `{static: true}` to use `ViewChild` immediately

To tell Angular that there is no dynamic HTML and it should immediately query for the elements, you can use the `{static: true}` property on `ViewChild`:

```typescript
@Component({
  selector: 'paragraph',
  standalone: true,
  imports: [NgIf],
  template: `
    <p #pTag>Hello, world!</p>
  `,
})
class RenderParagraphComponent implements OnInit {
  @ViewChild('pTag', { static: true }) pTag: ElementRef<HTMLElement>;

  ngOnInit() {
    // This will log the HTML element
    console.log(this.pTag.nativeElement);
  }
}
```

However, keep in mind that if you _do_ later add any dynamic HTML that our element will be `undefined` once again:

```typescript
@Component({
  selector: 'paragraph',
  standalone: true,
  imports: [NgIf],
  template: ` 
    <ng-container *ngIf="true">
      <p #pTag>Hello, world!</p>
    </ng-container>
  `,
})
class RenderParagraphComponent implements OnInit {
  @ViewChild('pTag', { static: true }) pTag: ElementRef<HTMLElement>;

  ngOnInit() {
    // This will log `undefined`
    console.log(this.pTag);
  }
}
```

To solve this, we'll have to use a different lifecycle method than `ngOnInit`.

### Using `ngAfterViewInit` to use a deferred `ViewChild`

While the values a dynamic HTML may not be defined in `ngOnInit`, there is a different lifecycle method to be called when Angular has fully initialized all of the child values of your dynamic HTML: `ngAftrerViewInit`.

```typescript
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'paragraph',
  standalone: true,
  imports: [NgIf],
  template: `
  <ng-container *ngIf="true">
    <p #pTag>Hello, world!</p>
  </ng-container>
  `,
})
class RenderParagraphComponent implements AfterViewInit {
  @ViewChild('pTag') pTag: ElementRef<HTMLElement>;

  ngAfterViewInit() {
    console.log(this.pTag.nativeElement);
  }
}
```

### Adding an Event Listener using `@ViewChild`

Now that we know how to use `ViewChild`, we can add a `addEventListener` and `removeEventListener` to manually bind a `button`'s `click` event:

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
    
    addOne = () => {
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

> Remember, the `addOne` function cannot be a class method, as otherwise [it will not cleanup inside the `removeEventListener` properly.](https://unicorn-utterances.com/posts/javascript-bind-usage#event-listeners)

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

Let's say that we're building an email application and want to provide the user a button that scrolls them to the top of their messages quickly.

![// TODO](./scroll_to_top.png)



One way of building out this button is to store each underlying message's DOM element in the array into an element reference then use the top and bottom [elements' `scrollIntoView` method](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) to bring them onto the page visually.

Let's see how that's done with each framework.

<!-- tabs:start -->

## React

React's ability to persist data within a `useRef` allows us to create an index-based array to store our elements into.

Using this array, we can then access the `0`th and last index (using `messages.length - 1`) to indicate the first and last element respectively. 

```jsx
const messages = [
    "The new slides for the design keynote look wonderful!",
    "Some great new colours are planned to debut with Material Next!",
    "Hey everyone! Please take a look at the resources I’ve attached.",
    "So on Friday we were thinking about going through that park you’ve recommended.",
    "We will discuss our upcoming Pixel 6 strategy in the following week.",
    "On Thursday we drew some great new ideas for our talk.",
    "So the design teams got together and decided everything should be made of sand."
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

Just as there is a `ViewChild` to gain access to a single underlying HTML element,  you can also use a`ViewChildren` to access more than one or more template elements using similar APIs.

Using `ViewChildren`, we can access [template reference variables](https://crutchcorn-book.vercel.app/posts/content-reference#ng-templates) in order to `scrollIntoView` the first and last elements.

````typescript
@Component({
  selector: 'my-app',
  standalone: true,
  imports: [NgFor],
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
    "The new slides for the design keynote look wonderful!",
    "Some great new colours are planned to debut with Material Next!",
    "Hey everyone! Please take a look at the resources I’ve attached.",
    "So on Friday we were thinking about going through that park you’ve recommended.",
    "We will discuss our upcoming Pixel 6 strategy in the following week.",
    "On Thursday we drew some great new ideas for our talk.",
    "So the design teams got together and decided everything should be made of sand."
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
    "The new slides for the design keynote look wonderful!",
    "Some great new colours are planned to debut with Material Next!",
    "Hey everyone! Please take a look at the resources I’ve attached.",
    "So on Friday we were thinking about going through that park you’ve recommended.",
    "We will discuss our upcoming Pixel 6 strategy in the following week.",
    "On Thursday we drew some great new ideas for our talk.",
    "So the design teams got together and decided everything should be made of sand."
];
</script>
```

<!-- tabs:end -->



# Real world usage

Now that we know how to access an underlying HTML element in our given framework, let's go back to our previous context menu example from the start of the chapter.

See, while our context menu was able to show properly, we were missing two distinct features:

1) Focusing the dropdown element when opened
2) Closing the context menu when the user clicks elsewhere

![// TODO: Add alt text](./context-close.png)

Let's add this functionality into our context menu component. 

To add the first feature, we'll [focus on the context menu using `element.focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) in order to make sure that keyboard users aren't lost when trying to use the feature.

To add the second feature, let's:

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

<!-- tabs:start -->

## React

Let's add a `ref` usage that stores our `contextMenu` inside of a `useState`.

Then, when we change the value of `contextMenu`, we can `.focus` the element and use the `addEventListener` code from above:

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

We can adopt the above code and place it within our `ngAfterViewInit` lifecycle method to add the `addEventListener` to our context menu.

Additionally, we'll use `ViewChild` to track the `contextMenu` element and `.focus` it when it becomes active.

> We need to use a `setTimeout` in our `open` method to make sure the HTML element renders before our `focus` call.

```typescript
@Component({
  selector: 'my-app',
  standalone: true,
  imports: [NgIf],
  template: `
  <div style="margin-top: 5rem; margin-left: 5rem">
    <div (contextmenu)="open($event)">
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
  @ViewChild('contextMenu') contextMenu: ElementRef<HTMLElement>;

  isOpen = false;

  mouseBounds = {
    x: 0,
    y: 0,
  };

  closeIfOutsideOfContext = (e: MouseEvent) => {
    const contextMenuEl = this.contextMenu?.nativeElement;
    if (!contextMenuEl) return;
    const isClickInside = contextMenuEl.contains(e.target as HTMLElement);
    if (isClickInside) return;
    this.isOpen = false;
  };

  ngAfterViewInit() {
    document.addEventListener('click', this.closeIfOutsideOfContext);
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
      x: e.clientX,
      y: e.clientY,
    };
    // Wait until the element is rendered before focusing it
    setTimeout(() => {
      this.contextMenu.nativeElement.focus();
    }, 0);
  }
}
```



## Vue

Let's adopt the above click listener and apply it within our `onMounted` lifecycle method.

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

Let's build out a fresh component from our understanding of element reference.

Specifically, let's build out tooltip functionality so that, when the user hovers over a button for a second or longer, it displays a popup message to help the user understand how it's used. 

![// TODO: Write](./tooltip.png)



To do this, we'll need to consider a few things:

1) How to track when the user has hovered over an element for a second or longer
2) How to remove the popup when the user has moved their mouse
3) Make sure the tooltip is positioned above the button
4) Make sure the tooltip is horizontally centered
5) Adding any necessary polish



## Step 1: Track when the user has hovered an element

In order to track when an element is being hovered, we can use [the `mouseover` HTML event](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseover_event).

To make sure the user has been hovering for at least 1 second, we can add a `setTimeout` to delay the display of the tooltip.

> Don't forget to clean up the `setTimeout` when the component is un-rendered!

<!-- tabs:start -->

### React

```jsx
export default function App() {
  const buttonRef = useRef();

  const mouseOverTimeout = useRef();
    
  const [tooltipMeta, setTooltipMeta] = useState({
    show: false,
  });

  const onMouseOver = () => {
    mouseOverTimeout.current = setTimeout(() => {
      setTooltipMeta({
        show: true,
      });
    }, 1000);
  };
    
  useEffect(() => {
    return () => {
      clearTimeout(mouseOverTimeout.current);
    };
  }, []);
    
  return (
    <div style={{ padding: '10rem' }}>
      <button onMouseOver={onMouseOver} ref={buttonRef}>
        Send
      </button>
      {tooltipMeta.show && <div>This will send an email to the recipients</div>}
    </div>
  );
}
```

### Angular

```typescript
@Component({
  selector: 'my-app',
  standalone: true,
  imports: [NgIf],
  template: `
  <div style="padding: 10rem">
    <button
      #buttonRef
      (mouseover)="onMouseOver()"
    >
      Send
    </button>
    <div *ngIf="tooltipMeta.show">
      This will send an email to the recipients
    </div>
  </div>
  `,
})
class AppComponent implements OnDestroy {
  @ViewChild('buttonRef') buttonRef: ElementRef<HTMLElement>;

  tooltipMeta = {
    show: false,
  };

  mouseOverTimeout = null;

  onMouseOver() {
    this.mouseOverTimeout = setTimeout(() => {
      this.tooltipMeta = {
        show: true,
      };
    }, 1000);
  }

  ngOnDestroy() {
    clearTimeout(this.mouseOverTimeout);
  }
}
```

### Vue

```vue
<!-- App.vue -->
<template>
  <div style="padding: 10rem">
    <button ref="buttonRef" @mouseover="onMouseOver()">Send</button>
    <div v-if="tooltipMeta.show">This will send an email to the recipients</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const buttonRef = ref()

const mouseOverTimeout = ref(null)

const tooltipMeta = ref({
  show: false,
})

const onMouseOver = () => {
  mouseOverTimeout.value = setTimeout(() => {
    tooltipMeta.value = {
      show: true,
    }
  }, 1000)
}

onUnmounted(() => {
  clearTimeout(mouseOverTimeout.current)
})
</script>
```

<!-- tabs:end -->

## Step 2: Remove the element when the user stops hovering

Now that we have our tooltip showing up when we'd expect, let's remove it when we stop hovering on the button element.

To do this, we'll utilize [the `mouseleave` HTML event](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseleave_event) to set `show` to `false` and cancel the timer to show the tooltip if the event is active.

<!-- tabs:start -->

### React

```jsx
export default function App() {
  const buttonRef = useRef();

  const mouseOverTimeout = useRef();

  const [tooltipMeta, setTooltipMeta] = useState({
    show: false,
  });

  const onMouseOver = () => {
    mouseOverTimeout.current = setTimeout(() => {
      setTooltipMeta({
        show: true,
      });
    }, 1000);
  };

  const onMouseLeave = () => {
    setTooltipMeta({
      show: false,
    });
    clearTimeout(mouseOverTimeout.current);
  };

  useEffect(() => {
    return () => {
      clearTimeout(mouseOverTimeout.current);
    };
  }, []);

  return (
    <div style={{ padding: '10rem' }}>
      <button
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
        ref={buttonRef}
      >
        Send
      </button>
      {tooltipMeta.show && <div>This will send an email to the recipients</div>}
    </div>
  );
}
```

### Angular

```typescript
@Component({
  selector: 'my-app',
  standalone: true,
  imports: [NgIf],
  template: `
  <div style="padding: 10rem">
    <button
      #buttonRef
      (mouseover)="onMouseOver()"
      (mouseleave)="onMouseLeave()"
    >
      Send
    </button>
    <div *ngIf="tooltipMeta.show">
      This will send an email to the recipients
    </div>
  </div>
  `,
})
class AppComponent implements OnDestroy {
  @ViewChild('buttonRef') buttonRef: ElementRef<HTMLElement>;

  tooltipMeta = {
    show: false,
  };

  mouseOverTimeout = null;

  onMouseOver() {
    this.mouseOverTimeout = setTimeout(() => {
      this.tooltipMeta = {
        show: true,
      };
    }, 1000);
  }

  onMouseLeave() {
    this.tooltipMeta = {
      show: false,
    };
    clearTimeout(this.mouseOverTimeout);
  }

  ngOnDestroy() {
    clearTimeout(this.mouseOverTimeout);
  }
}
```

### Vue

```vue
<!-- App.vue -->
<template>
  <div style="padding: 10rem">
    <button ref="buttonRef" @mouseover="onMouseOver()" @mouseleave="onMouseLeave()">Send</button>
    <div v-if="tooltipMeta.show">This will send an email to the recipients</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const buttonRef = ref()

const mouseOverTimeout = ref(null)

const tooltipMeta = ref({
  show: false,
})

const onMouseOver = () => {
  mouseOverTimeout.value = setTimeout(() => {
    tooltipMeta.value = {
      show: true,
    }
  }, 1000)
}

const onMouseLeave = () => {
  tooltipMeta.value = {
    show: false,
  }
  clearTimeout(mouseOverTimeout.current)
}

onUnmounted(() => {
  clearTimeout(mouseOverTimeout.current)
})
</script>
```

<!-- tabs:end -->



## Step 3: Placing the tooltip above the button

To place the tooltip above the button, we'll measure the button's position, height, and width using an element reference and [the `HTMLElement`'s method of `getBoundingClientRect`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect).

We'll then use this positional data, alongside [the CSS `position: fixed`](https://developer.mozilla.org/en-US/docs/Web/CSS/position) to position the tooltip to be placed `8px` above the `y` axis of the button:

<!-- tabs:start -->

### React

```jsx
export default function App() {
  const buttonRef = useRef();

  const mouseOverTimeout = useRef();

  const [tooltipMeta, setTooltipMeta] = useState({
    x: 0,
    y: 0,
    height: 0,
    width: 0,
    show: false,
  });

  const onMouseOver = () => {
    mouseOverTimeout.current = setTimeout(() => {
      const bounding = buttonRef.current.getBoundingClientRect();
      setTooltipMeta({
        x: bounding.x,
        y: bounding.y,
        height: bounding.height,
        width: bounding.width,
        show: true,
      });
    }, 1000);
  };

  const onMouseLeave = () => {
    setTooltipMeta({
      x: 0,
      y: 0,
      height: 0,
      width: 0,
      show: false,
    });
    clearTimeout(mouseOverTimeout.current);
  };

  useEffect(() => {
    return () => {
      clearTimeout(mouseOverTimeout.current);
    };
  }, []);

  return (
    <div style={{ padding: '10rem' }}>
      {tooltipMeta.show && (
        <div
          style={{
            position: 'fixed',
            top: `${tooltipMeta.y - tooltipMeta.height - 8}px`,
          }}
        >
          This will send an email to the recipients
        </div>
      )}
      <button
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
        ref={buttonRef}
      >
        Send
      </button>
    </div>
  );
}
```

### Angular

```typescript
@Component({
  selector: 'my-app',
  standalone: true,
  imports: [NgIf],
  template: `
  <div style="padding: 10rem">
    <div
      *ngIf="tooltipMeta.show"
      [style]="'
        position: fixed;
        top: ' + (tooltipMeta.y - tooltipMeta.height - 8) + 'px;
      '"
    >
        This will send an email to the recipients
    </div>
    <button
      #buttonRef
      (mouseover)="onMouseOver()"
      (mouseleave)="onMouseLeave()"
    >
      Send
    </button>
  </div>
  `,
})
class AppComponent implements OnDestroy {
  @ViewChild('buttonRef') buttonRef: ElementRef<HTMLElement>;

  tooltipMeta = {
    x: 0,
    y: 0,
    height: 0,
    width: 0,
    show: false,
  };

  mouseOverTimeout = null;

  onMouseOver() {
    this.mouseOverTimeout = setTimeout(() => {
      const bounding = this.buttonRef.nativeElement.getBoundingClientRect();
      this.tooltipMeta = {
        x: bounding.x,
        y: bounding.y,
        height: bounding.height,
        width: bounding.width,
        show: true,
      };
    }, 1000);
  }

  onMouseLeave() {
    this.tooltipMeta = {
      x: 0,
      y: 0,
      height: 0,
      width: 0,
      show: false,
    };
    clearTimeout(this.mouseOverTimeout);
  }

  ngOnDestroy() {
    clearTimeout(this.mouseOverTimeout);
  }
}
```

### Vue

```vue
<!-- App.vue -->
<template>
  <div style="padding: 10rem">
    <div
      v-if="tooltipMeta.show"
      :style="`
        position: fixed;
        top: ${tooltipMeta.y - tooltipMeta.height - 8}px;
      `"
    >
      This will send an email to the recipients
    </div>
    <button ref="buttonRef" @mouseover="onMouseOver()" @mouseleave="onMouseLeave()">Send</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const buttonRef = ref()

const mouseOverTimeout = ref(null)

const tooltipMeta = ref({
  x: 0,
  y: 0,
  height: 0,
  width: 0,
  show: false,
})

const onMouseOver = () => {
  mouseOverTimeout.value = setTimeout(() => {
    const bounding = buttonRef.value.getBoundingClientRect()
    tooltipMeta.value = {
      x: bounding.x,
      y: bounding.y,
      height: bounding.height,
      width: bounding.width,
      show: true,
    }
  }, 1000)
}

const onMouseLeave = () => {
  tooltipMeta.value = {
    x: 0,
    y: 0,
    height: 0,
    width: 0,
    show: false,
  }
  clearTimeout(mouseOverTimeout.current)
}

// Just in case
onUnmounted(() => {
  clearTimeout(mouseOverTimeout.current)
})
</script>
```

<!-- tabs:end -->



## Step 4: Centering the tooltip horizontally

To center a `position: fixed` element is a challenge and a half. While there's half a dozen ways we could go about this, we're going to opt for a solution that involves:

- Creating a `<div>` with the same width of the button
- Making this `<div>` a `display: flex` element with `justify-content: center` CSS applied to center all children
- Allowing overflow inside the `div` using `overflow: visible`
- Placing our tooltip's text  inside of the `<div>` with `white-space: nowrap` applied to avoid our text wrapping to meet the `<div>` width.

This works because the `<div>`'s position should mirror the button's, and allow content to be centered around it, like so:

![// TODO](./button_positioned.png)

In the end, our styling should look something like this HTML markup:

```html
<div style="padding: 10rem">
  <!-- The PX values here may differ on your system -->
  <div
    style="
      display: flex;
      overflow: visible;
      justify-content: center;
      width: 40.4667px;
      position: fixed;
      top: 138.8px;
      left: 168px;
    "
  >
    <div style="white-space: nowrap">
      This will send an email to the recipients
    </div>
  </div>
  <button>Send</button>
</div>
```

Let's implement this within our frameworks:

<!-- tabs:start -->

### React

```jsx
export default function App() {
  const buttonRef = useRef();

  const mouseOverTimeout = useRef();

  const [tooltipMeta, setTooltipMeta] = useState({
    x: 0,
    y: 0,
    height: 0,
    width: 0,
    show: false,
  });

  const onMouseOver = () => {
    mouseOverTimeout.current = setTimeout(() => {
      const bounding = buttonRef.current.getBoundingClientRect();
      setTooltipMeta({
        x: bounding.x,
        y: bounding.y,
        height: bounding.height,
        width: bounding.width,
        show: true,
      });
    }, 1000);
  };

  const onMouseLeave = () => {
    setTooltipMeta({
      x: 0,
      y: 0,
      height: 0,
      width: 0,
      show: false,
    });
    clearTimeout(mouseOverTimeout.current);
  };

  useEffect(() => {
    return () => {
      clearTimeout(mouseOverTimeout.current);
    };
  }, []);

  return (
    <div style={{ padding: '10rem' }}>
      {tooltipMeta.show && (
        <div
          style={{
            overflow: 'visible',
            position: 'fixed',
            top: `${tooltipMeta.y - tooltipMeta.height - 8}px`,
            display: 'flex',
            justifyContent: 'center',
            width: `${tooltipMeta.width}px`,
            left: `${tooltipMeta.x}px`,
          }}
        >
          <div
            style={{
              whiteSpace: 'nowrap',
            }}
          >
            This will send an email to the recipients
          </div>
        </div>
      )}
      <button
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
        ref={buttonRef}
      >
        Send
      </button>
    </div>
  );
}
```

### Angular

```typescript
@Component({
  selector: 'my-app',
  standalone: true,
  imports: [NgIf],
  template: `
  <div style="padding: 10rem">
    <div
      *ngIf="tooltipMeta.show"
      [style]="'
        display: flex;
        overflow: visible;
        justify-content: center;
        width: ' + tooltipMeta.width + 'px;
        position: fixed;
        top: ' + (tooltipMeta.y - tooltipMeta.height - 8) + 'px;
        left: ' + tooltipMeta.x + 'px;
      '"
    >
      <div
        style="
          white-space: nowrap;
        "
      >
        This will send an email to the recipients
      </div>
    </div>
    <button
      #buttonRef
      (mouseover)="onMouseOver()"
      (mouseleave)="onMouseLeave()"
    >
      Send
    </button>
  </div>
  `,
})
class AppComponent implements OnDestroy {
  @ViewChild('buttonRef') buttonRef: ElementRef<HTMLElement>;

  tooltipMeta = {
    x: 0,
    y: 0,
    height: 0,
    width: 0,
    show: false,
  };

  mouseOverTimeout = null;

  onMouseOver() {
    this.mouseOverTimeout = setTimeout(() => {
      const bounding = this.buttonRef.nativeElement.getBoundingClientRect();
      this.tooltipMeta = {
        x: bounding.x,
        y: bounding.y,
        height: bounding.height,
        width: bounding.width,
        show: true,
      };
    }, 1000);
  }

  onMouseLeave() {
    this.tooltipMeta = {
      x: 0,
      y: 0,
      height: 0,
      width: 0,
      show: false,
    };
    clearTimeout(this.mouseOverTimeout);
  }

  ngOnDestroy() {
    clearTimeout(this.mouseOverTimeout);
  }
}
```

### Vue

```vue
<!-- App.vue -->
<template>
  <div style="padding: 10rem">
    <div
      v-if="tooltipMeta.show"
      :style="`
        display: flex;
        overflow: visible;
        justify-content: center;
        width: ${tooltipMeta.width}px;
        position: fixed;
        top: ${tooltipMeta.y - tooltipMeta.height - 8}px;
        left: ${tooltipMeta.x}px;
      `"
    >
      <div
        :style="`
          white-space: nowrap;
        `"
      >
        This will send an email to the recipients
      </div>
    </div>
    <button ref="buttonRef" @mouseover="onMouseOver()" @mouseleave="onMouseLeave()">Send</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const buttonRef = ref()

const mouseOverTimeout = ref(null)

const tooltipMeta = ref({
  x: 0,
  y: 0,
  height: 0,
  width: 0,
  show: false,
})

const onMouseOver = () => {
  mouseOverTimeout.value = setTimeout(() => {
    const bounding = buttonRef.value.getBoundingClientRect()
    tooltipMeta.value = {
      x: bounding.x,
      y: bounding.y,
      height: bounding.height,
      width: bounding.width,
      show: true,
    }
  }, 1000)
}

const onMouseLeave = () => {
  tooltipMeta.value = {
    x: 0,
    y: 0,
    height: 0,
    width: 0,
    show: false,
  }
  clearTimeout(mouseOverTimeout.current)
}

onUnmounted(() => {
  clearTimeout(mouseOverTimeout.current)
})
</script>
```

<!-- tabs:end -->



## Step 5: Adding polish

Our tooltip works now! But, being honest, it's a bit plain looking without much styling.

Let's fix that by adding:

1) Background colors
2) A dropdown arrow indicating the location of the element the tooltip is for

While the first item can be added [using some `background-color` CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/background-color), the dropdown arrow is a bit more challenging to solve.

The reason a dropdown arrow is more challenging is because CSS typically wants all elements to be represented as a square - not any other shape.

However, we can use this knowledge to use a square and trick the human eye into thinking it's a triangle by:

1) Rotating a square 45 degrees to be "sideways" [using CSS' `transform`](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)
2) Adding color to the square [using `background-color`](https://developer.mozilla.org/en-US/docs/Web/CSS/background-color)
3) Positioning the square to only show the bottom half [using `position: absolute`](https://developer.mozilla.org/en-US/docs/Web/CSS/position) and [a negative CSS `top` value](https://developer.mozilla.org/en-US/docs/Web/CSS/top)
4) Placing it under the tooltip background [using a negative `z-index`](https://developer.mozilla.org/en-US/docs/Web/CSS/z-index)

![// TODO](./tooltip_steps.png)



Let's build it!

<!-- tabs:start -->

### React

```jsx
export default function App() {
  const buttonRef = useRef();

  const mouseOverTimeout = useRef();

  const [tooltipMeta, setTooltipMeta] = useState({
    x: 0,
    y: 0,
    height: 0,
    width: 0,
    show: false,
  });

  const onMouseOver = () => {
    mouseOverTimeout.current = setTimeout(() => {
      const bounding = buttonRef.current.getBoundingClientRect();
      setTooltipMeta({
        x: bounding.x,
        y: bounding.y,
        height: bounding.height,
        width: bounding.width,
        show: true,
      });
    }, 1000);
  };

  const onMouseLeave = () => {
    setTooltipMeta({
      x: 0,
      y: 0,
      height: 0,
      width: 0,
      show: false,
    });
    clearTimeout(mouseOverTimeout.current);
  };

  useEffect(() => {
    return () => {
      clearTimeout(mouseOverTimeout.current);
    };
  }, []);

  return (
    <div style={{ padding: '10rem' }}>
      {tooltipMeta.show && (
        <div
          style={{
            display: 'flex',
            overflow: 'visible',
            justifyContent: 'center',
            width: `${tooltipMeta.width}px`,
            position: 'fixed',
            top: `${tooltipMeta.y - tooltipMeta.height - 16 - 6 - 8}px`,
            left: `${tooltipMeta.x}px`,
          }}
        >
          <div
            style={{
              whiteSpace: 'nowrap',
              padding: '8px',
              background: '#40627b',
              color: 'white',
              borderRadius: '16px',
            }}
          >
            This will send an email to the recipients
          </div>
          <div
            style={{
              height: '12px',
              width: '12px',
              transform: 'rotate(45deg) translateX(-50%)',
              background: '#40627b',
              bottom: 'calc(-6px - 4px)',
              position: 'absolute',
              left: '50%',
              zIndex: -1,
            }}
          />
        </div>
      )}
      <button
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
        ref={buttonRef}
      >
        Send
      </button>
    </div>
  );
}
```

### Angular

```typescript
@Component({
  selector: 'my-app',
  standalone: true,
  imports: [NgIf],
  template: `
  <div style="padding: 10rem">
    <div
      *ngIf="tooltipMeta.show"
      [style]="'
        display: flex;
        overflow: visible;
        justify-content: center;
        width: ' + tooltipMeta.width + 'px;
        position: fixed;
        top: ' + (tooltipMeta.y - tooltipMeta.height - 16 - 6 - 8) + 'px;
        left: ' + tooltipMeta.x + 'px;
      '"
    >
      <div
        style="
          white-space: nowrap;
          padding: 8px;
          background: #40627b;
          color: white;
          border-radius: 16px;
        "
      >
        This will send an email to the recipients
      </div>
      <div
        style="
          height: 12px;
          width: 12px;
          transform: rotate(45deg) translateX(-50%);
          background: #40627b;
          bottom: calc(-6px - 4px);
          position: absolute;
          left: 50%;
          zIndex: -1;
        "
      ></div>
    </div>
    <button
      #buttonRef
      (mouseover)="onMouseOver()"
      (mouseleave)="onMouseLeave()"
    >
      Send
    </button>
  </div>
  `,
})
class AppComponent implements OnDestroy {
  @ViewChild('buttonRef') buttonRef: ElementRef<HTMLElement>;

  tooltipMeta = {
    x: 0,
    y: 0,
    height: 0,
    width: 0,
    show: false,
  };

  mouseOverTimeout = null;

  onMouseOver() {
    this.mouseOverTimeout = setTimeout(() => {
      const bounding = this.buttonRef.nativeElement.getBoundingClientRect();
      this.tooltipMeta = {
        x: bounding.x,
        y: bounding.y,
        height: bounding.height,
        width: bounding.width,
        show: true,
      };
    }, 1000);
  }

  onMouseLeave() {
    this.tooltipMeta = {
      x: 0,
      y: 0,
      height: 0,
      width: 0,
      show: false,
    };
    clearTimeout(this.mouseOverTimeout);
  }

  ngOnDestroy() {
    clearTimeout(this.mouseOverTimeout);
  }
}
```

### Vue

```vue
<!-- App.vue -->
<template>
  <div style="padding: 10rem">
    <div
      v-if="tooltipMeta.show"
      :style="`
        display: flex;
        overflow: visible;
        justify-content: center;
        width: ${tooltipMeta.width}px;
        position: fixed;
        top: ${tooltipMeta.y - tooltipMeta.height - 16 - 6 - 8}px;
        left: ${tooltipMeta.x}px;
      `"
    >
      <div
        :style="`
          white-space: nowrap;
          padding: 8px;
          background: #40627b;
          color: white;
          border-radius: 16px;
        `"
      >
        This will send an email to the recipients
      </div>
      <div
        :style="`
          height: 12px;
          width: 12px;
          transform: rotate(45deg) translateX(-50%);
          background: #40627b;
          bottom: calc(-6px - 4px);
          position: absolute;
          left: 50%;
          zIndex: -1;
        `"
      ></div>
    </div>
    <button ref="buttonRef" @mouseover="onMouseOver()" @mouseleave="onMouseLeave()">Send</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const buttonRef = ref()

const mouseOverTimeout = ref(null)

const tooltipMeta = ref({
  x: 0,
  y: 0,
  height: 0,
  width: 0,
  show: false,
})

const onMouseOver = () => {
  mouseOverTimeout.value = setTimeout(() => {
    const bounding = buttonRef.value.getBoundingClientRect()
    tooltipMeta.value = {
      x: bounding.x,
      y: bounding.y,
      height: bounding.height,
      width: bounding.width,
      show: true,
    }
  }, 1000)
}

const onMouseLeave = () => {
  tooltipMeta.value = {
    x: 0,
    y: 0,
    height: 0,
    width: 0,
    show: false,
  }
  clearTimeout(mouseOverTimeout.current)
}

onUnmounted(() => {
  clearTimeout(mouseOverTimeout.current)
})
</script>
```

<!-- tabs:end -->
