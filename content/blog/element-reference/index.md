---
{
    title: "Element Reference",
    description: "React, Angular, and Vue provide powerful APIs that let you avoid DOM manipulations most of the time. But sometimes you need to access the underlying DOM. Here's how.",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 10,
    series: "The Framework Field Guide"
}
---

While React, Angular, and Vue all provide simple built-in APIs to access events, inputs, and other bindings to underlying HTML elements, sometimes it's just not enough.

In those rare events you want to eject away from the framework controlling your access to HTML nodes, each framework enables you to access the underlying DOM nodes via element reference.

Let's look at some basic examples.

<!-- tabs:start -->

# React

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

## `useState` `ref`s

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

## What's a `useRef` and why aren't we using it?

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

# Angular

In our chapter about [content reference](/posts/content-reference), we touched on `ContentChild`, a method of accessing the projected content programmatically without our component class instance.

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

Here, we're using a [template reference variable](/posts/content-reference#ng-templates) to access the `p` tag instance and, upon `ngAfterViewInit`, running a `console.log`.

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

## What does `.bind` mean and why did it fix our problem?

OK, so here's the deal. Remember this headache inducing sentence that I just used as an explaination:

> This is because `this` is being unbound from the component instance within `addEventListener`, and we need to forcibly rebind the `count` to the component instead.

Even I'm ready to admit that, while it is _technically correct_, it's absolute gibberish to anyone that's already in the know.

Here's what's actually happening.

This behavior isn't unique to Angular, it's a JavaScript "feature" of `this` that's introduced a bug in our code.

Take the following two classes:

```javascript
class Cup {
	contents = "water";
    
    consume() {
        console.log("You drink the ", this.contents, ". Hydrating!");
    }
}

class Bowl {
    contents = "chili";
    
    consume() {
        console.log("You eat the ", this.contents, ". Spicy!");
    }
}

cup = new Cup();
bowl = new Bowl();
```

If we run:

```javascript
cup.consume();
```

It will `console.log` "You drink the water. Hydrating!". Meanwhile, if you run:

```javascript
bowl.consume();
```

It will `console.log` "You eat the chili. Spicy!".

Makes sense, right?

Now, what do you think will happened if I do the following?

```javascript
cup = new Cup();
bowl = new Bowl();

cup.consume = bowl.consume;

cup.consume();
```

While you might think that it would log `"You eat the chili. Spicy!"`, it doesn't! Instead, it logs: `"You drink eat the water. Spicy!"`.

Why?

The `this` keyword isn't bound to the `Bowl` class, like you might otherwise expect. Instead, the `this` keyword searches for the  [scope](https://developer.mozilla.org/en-US/docs/Glossary/Scope) of the caller. 

> To explain this better using plain English, this might be reiterated as: "JavaScript looks at the class that uses the `this` keyword, not the class that creates the `this` keyword"

Because of this:

```javascript
cup = new Cup();
bowl = new Bowl();

// This is assigning the `bowl.consume` message
cup.consume = bowl.consume;

// But using the `cup.contents` `this` scoping
cup.consume();
```

![Imagine bowl and cup as two boxes. Inside of the boxes are 2 items each. The "Bowl" box contains a yellow container of "Chili", a red "consume" method. The "Cup" box contains a blue container of "Water" and a purple "consume" method. When we assign the red "bowl" consume method to `cup` and call "consume", it will still have `this` pointed towards "Water"](./this_explainer_chart.png)



This can be a problem at times. If we want `bowl.consume` to _always_ reference the `this` scope of `bowl`, then we can use `.bind` to force `bowl.consume` to use the same `this` method.

```javascript
cup = new Cup();
bowl = new Bowl();

// This is assigning the `bowl.consume` message and binding the `this` context to `bowl`
cup.consume = bowl.consume.bind(bowl);

// Because of this, we will now see the output "You eat the chili. Spicy!" again
cup.consume();
```



![When using the "bind" method, you're telling cup.consume to always reference "bowl"'s binding.](./bind_explainer.png)

## What does `.bind` have to do with an Angular event listener?

> Both `cup` and `bowl` are both classes, which creates a scope. This makes sense why `this` is being reassigned, by what does this have to do with `addEventListener`?

To answer this question, let's look back at a minimal version of our unbound Angular code. 

```typescript
@Component({
    selector: 'paragraph',
    template: `
		<button #btn>Add one</button>
    	<p>Count is {{count}}</p>
    `
})
class RenderParagraphComponent implements AfterViewInit {
    @ViewChild('btn') btn: ElementRef<HTMLElement>;
    
    count = 0;
    
    addOne() {
        // What is `this` being set to?
        this.count++;
    }
    
    ngAfterViewInit() {
        this.btn.nativeElement.addEventListener('click', this.addOne);
    }
}
```

Remember that `this` is being bound to _something_. To understand what that might be, let's do a small rewrite of the code:

```typescript
// ngAfterViewInit
const button = this.btn.nativeElement;
button.onClick = this.addOne;
```

We can then think of your browser calling an event on `button` to look something like this:

```javascript
/**
 * This is a representation of what your browser is doing when you click the button.
 * This is NOT how it really works, just an explainatory representation
 */
function clickButton() {
	button.onClick();
}
```

Now that we have that code written to be a little simpler, let's chart out what's happening behind-the-scenes:

![When onClick is assigned to addOne, it doesn't carry over the `this`, because it isn't bound. As a result, when button.onClick is called, it will utilize Button's `this` value.](./component_this_explainer.png)

Here, we can see that, despite assigning `component.addOne` to `button.onClick`, when the browser calls `button.onClick`, the `this` keyword (from within `addOne`) is actually pointing at the scope of the [`HTMLElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) `button`, not the Angular `Component` instance.

This means that within this code:
```typescript
addOne() {
	this.count++;
}

ngAfterViewInit() {
    this.btn.nativeElement.addEventListener('click', this.addOne);
}
```

`this.count` is pointing at the Button HTML DOM instance instead of the component instance.

To prove this, let's `console.log` the DOM element's `count` value:

```typescript
@Component({
    selector: 'paragraph',
    template: `
		<button #btn>Add one</button>
		<button (click)="logButtonCount()">Click me</button>
    `
})
class RenderParagraphComponent implements AfterViewInit {
    @ViewChild('btn') btn: ElementRef<HTMLElement>;

    addOne() {
        // What is `this` being set to?
        this.count++;
        console.log(this); // Will output an HTMLElement instance of `button`
    }
    
    ngAfterViewInit() {
        // Otherwise `logButtonCount` will show `NaN`
        this.btn.nativeElement.count = 0;
        this.btn.nativeElement.addEventListener('click', this.addOne);
    }
    
    logButtonCount() {
        console.log(this.btn.nativeElement.count); // This increments every time `addOne` is ran
    }
}
```

This is the reason we utilized `.bind` in the previous Angular example: it forces `this.count` to be bound to the component instance.

```typescript
addOne = function () {
  this.count++;
}.bind(this);
```


## Can we solve this without `.bind`?

> The `.bind` code looks obtuse and increases the amount of boilerplate in our components. Is there any other way to solve the `this` issue without `bind`?

Yes! Introducing: Arrow functions.

When learning JavaScript, you may have come across an alternative way of creating functions. Sure, there's the original `function` keyword:

```javascript
function SayHi() {
	console.log("Hi");
}
```

But if you wanted to remove a few characters, you could alternatively use an "arrow function" syntax instead:

```javascript
const SayHi = () => {
	console.log("Hi");
}
```

Some people even start explanations by saying that there are no differences between these two methods, but that's not quite right.

Take our `Cup` and `Bowl` example from earlier:

```javascript
class Cup {
	contents = "water";
    
    consume() {
        console.log("You drink the ", this.contents, ". Hydrating!");
    }
}

class Bowl {
    contents = "chili";
    
    consume() {
        console.log("You eat the ", this.contents, ". Spicy!");
    }
}

cup = new Cup();
bowl = new Bowl();

cup.consume = bowl.consume;

cup.consume();
```

We already know that this example will log `"You eat the water. Spicy!"` when `cup.consume()` is called.

But what happens if we instead change `Bowl.consume()` from a class method to an arrow function:

```javascript
class Cup {
	contents = "water";
    
    consume = () => {
        console.log("You drink the ", this.contents, ". Hydrating!");
    }
}

class Bowl {
    contents = "chili";
    
    consume = () => {
        console.log("You eat the ", this.contents, ". Spicy!");
    }
}

cup = new Cup();
bowl = new Bowl();

cup.consume = bowl.consume;

// What will this output?
cup.consume();
```

 While it might seem obvious what the output would be, if you thought it was the same `"You eat the water. Spicy!"`  as before, you're in for a suprise.

Instead, it outputs: `"You eat the chili. Spicy!"`, as if it were bound to `bowl`.

> Why does an arrow function act like it's bound?

That's simply the semantic meaning of an arrow function! While `function` (and methods) both implicitly bind `this` to a callee of the function, an arrow function is bound to the original `this` scope and cannot be modified.

Even if we try to use `.bind` on an arrow function to overwrite this behavior, it will never change its scope away from `bowl`.

```javascript
cup = new Cup();
bowl = new Bowl();

// The `bind` does not work on arrow functions
cup.consume = bowl.consume.bind(cup);

// This will still output as if we ran `bowl.consume()`.
cup.consume();
```

Knowing this, we can refactor our Angular component to set `addOne` to an arrow function instead of using `.bind`:

```typescript
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

Now our component works as intended and has minimal boilerplate to solve the problem of `this`!

# Vue

Vue's ability to use the `this` keyword enables a super simplistic API to access DOM nodes.

```jsx
const App = {
  template: '<p ref="el"></p>',
  mounted() {
    console.log(this.$refs.el);
  },
};
```

Here, `this.$refs.el` points to an [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) of the `p` tag within `template`.

Vue also allows you to pass a function to `ref` in order to run a function when the `ref` is being set, like so:

```javascript
const App = {
  template: '<p :ref="logEl"></p>',
  methods: {
    logEl(el) {
      console.log(el);
    },
  },
};
```

<!-- tabs:end -->



# How to keep an array of element references

When we learned [how to access content that's been projected](/posts/content-reference), we had to learn different APIs in order both to access a single projected item and access multiple projected items at once. We have a similar challenge in front of us with element referencing.

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
  const chaptersRef = React.useRef([]);

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

Vue has a handy feature that [enables you to create an array of referenced elements using nothing more than a string inside of a `ref` attribute](https://vuejs.org/guide/essentials/template-refs.html#refs-inside-v-for). This then turns the `this.$ref` reference into an array that we can access as-expected.

```javascript
const App = {
  template: `
  <div>
  <button @click="scrollToTop()">Scroll to top</button>
  <ul style="height: 100px; overflow: scroll">
    <li #listItem v-for="(chapter, i) of chapters" ref="items">
      {{chapter}}
    </li>
  </ul>
  <button @click="scrollToBottom()">Scroll to bottom</button>
</div>
  `,
  methods: {
    scrollToTop() {
      this.$refs.items[0].scrollIntoView();
    },
    scrollToBottom() {
      this.$refs.items[this.$refs.items.length - 1].scrollIntoView();
    },
  },
  data() {
    return {
      chapters: [
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
      ],
    };
  },
};
```



<!-- tabs:end -->



# Real world usage

These concepts are handy to know, but what good are they if we can't utilize them in a real-world use case?

Let's take our existing [file hosting app project](/posts/intro-to-components#Whats-an-app-anyway) and think about a feature that we can build.

Oh, I know! Let's add in a context menu, so that when you right-click a file in the files list, it allows you to take actions on it such as deleting or renaming.

Let's first start by detecting when the user has right-clicked a `div`. We can use [the `contextmenu` event](https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event) to detect a right-click event. From there, it's as simple as [conditionally rendering](https://crutchcorn-book.vercel.app/posts/dynamic-html#Conditional-Rendering) the context menu component when the user has right-clicked.

<!-- tabs:start -->

## React

```jsx
// TODO: Check this code
export default function App() {
  const [isOpen, setIsOpen] = React.useState(false);

  function onContextMenu(e) {
    e.preventDefault();
    setIsOpen(true);
  }

  return (
    <React.Fragment>
      <div>
        <div onContextMenu={onContextMenu}>
          Right click on me!
        </div>
      </div>
      {isOpen && (
        <div>
          <button onClick={() => setIsOpen(false)}>X</button>
          This is a context menu
        </div>
      )}
    </React.Fragment>
  );
}
```

## Angular

```typescript
// TODO: Check this code
@Component({
  selector: 'my-app',
  template: `
  <div>
    <div (contextmenu)="open($event)">
      Right click on me!
    </div>
  </div>
  <div *ngIf="isOpen">
  <button (click)="close()">X</button>
  This is a context menu
</div>
  `,
})
class AppComponent implements AfterViewInit {
  isOpen = false;

  close() {
    this.isOpen = false;
  }

  open(e: UIEvent) {
    e.preventDefault();
    this.isOpen = true;
  }
}
```

## Vue

// TODO: Add code sample

<!-- tabs:end -->



That works! That said, it's not an ideal experience for a context menu. After all, one of the defining traits of a context menu is that it opens on top of the element that you've right-clicked on.

To do this, we need to [get the position of the base element using `getBoundingClientRect`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect). Then, we can pass the base element's `x` and `y` values to a `position: fixed` context menu to have the appearance of a floating context menu.

We also want to immediately [focus on the context menu using `element.focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) in order to make sure that keyboard users aren't lost when trying to use the feature.



<!-- tabs:start -->

## React

We can run `getBoundingClientRect` when the `ref` is set by simply passing a `callback` to the element's `ref`.

From there, it's a basic `useRef` passing in order to `focus` on the context menu. We're able to do this despite a conditional rendering of the context menu because React will automatically update the value of `ref` depending on if the base element is rendered or not.

```jsx
export default function App() {
  const [bounds, setBounds] = React.useState({
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  });

  const ref = React.useCallback((el) => {
    if (!el) return;
    const localBounds = el.getBoundingClientRect();
    setBounds(localBounds);
  }, []);

  const [isOpen, setIsOpen] = React.useState(false);

  const contextMenuRef = React.useRef();

  React.useEffect(() => {
    if (isOpen && contextMenuRef.current) {
      contextMenuRef.current.focus();
    }
  }, [isOpen]);

  function onContextMenu(e) {
    e.preventDefault();
    setIsOpen(true);
  }

  return (
    <React.Fragment>
      <div style={{ marginTop: '5rem', marginLeft: '5rem' }}>
        <div ref={ref} onContextMenu={onContextMenu}>
          Right click on me!
        </div>
      </div>
      {isOpen && (
        <div
          ref={contextMenuRef}
          tabIndex={0}
          style={{
            position: 'fixed',
            top: bounds.y + 20,
            left: bounds.x + 20,
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
    </React.Fragment>
  );
}
```

## Angular

To get the base element's position, we're able to use our previous `ViewChild` to get the underlying DOM node.

However, in order to `focus` on the context menu, we're relying on [the `changes` functionality of `ViewChildren`](https://angular.io/api/core/QueryList#changes) to run a function every time the context menu is rendered and unrendered.

```typescript
@Component({
  selector: 'my-app',
  template: `
  <div [style]="{ marginTop: '5rem', marginLeft: '5rem' }">
    <div #contextOrigin (contextmenu)="open($event)">
      Right click on me!
    </div>
  </div>
  <div
    #contextMenu
    *ngIf="isOpen"
    tabIndex="0"
    [style]="{
      position: 'fixed',
      top: bounds.y + 20,
      left: bounds.x + 20,
      background: 'white',
      border: '1px solid black',
      borderRadius: 16,
      padding: '1rem'
    }"
  >
  <button (click)="close()">X</button>
  This is a context menu
</div>
  
  `,
})
class AppComponent implements AfterViewInit {
  @ViewChild('contextOrigin') contextOrigin: ElementRef<HTMLElement>;
  @ViewChildren('contextMenu') contextMenu: QueryList<ElementRef<HTMLElement>>;

  isOpen = false;

  bounds = {
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  };

  ngAfterViewInit() {
    this.bounds = this.contextOrigin.nativeElement.getBoundingClientRect();

    this.contextMenu.changes.forEach(() => {
      // TODO: Explain ?. and why we need it
      const isLoaded = this?.contextMenu?.first?.nativeElement;
      if (!isLoaded) return;
      this.contextMenu.first.nativeElement.focus();
    });
  }

  close() {
    this.isOpen = false;
  }

  open(e: UIEvent) {
    e.preventDefault();
    this.isOpen = true;
  }
}

```



## Vue

// TODO: Add code sample

<!-- tabs:end -->

























-------



# Challenge

When you resize the browser, it does not recalculate the element's height and width.

// TODO: Create demo GIF showcasing issue

//  TODO: Simplify and explain

<!-- tabs:start -->

## React

```jsx {8-32}
export default function App() {
  const [refBounds, setBounds] = React.useState({
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  });

  const trackingRef = React.useRef();

  const resizeListener = React.useCallback((e) => {
    if (!trackingRef.current) return;
    const localBounds = trackingRef.current.getBoundingClientRect();
    setBounds(localBounds);
  }, []);

  React.useEffect(() => {
    window.addEventListener('resize', resizeListener);

    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, [resizeListener]);

  const trackingCBRef = React.useCallback(
    (el) => {
      if (!el) return;
      trackingRef.current = el;
      const localBounds = el.getBoundingClientRect();
      setBounds(localBounds);
    },
    [resizeListener]
  );

  const [isOpen, setIsOpen] = React.useState(false);

  function onContextMenu(e) {
    e.preventDefault();
    setIsOpen(true);
  }

  return (
    <React.Fragment>
      <div style={{ marginTop: '5rem', marginLeft: '5rem' }}>
        <div ref={trackingCBRef} onContextMenu={onContextMenu}>
          Right click on me!
        </div>
      </div>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: refBounds.y,
            left: refBounds.x,
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
    </React.Fragment>
  );
}
```

## Angular

```typescript {41-45,49}
@Component({
  selector: 'my-app',
  template: `
  <div [style]="{ marginTop: '5rem', marginLeft: '5rem' }">
    <div #contextOrigin (contextmenu)="open($event)">
      Right click on me!
    </div>
  </div>
  <div
    #contextMenu
    *ngIf="isOpen"
    tabIndex="0"
    [style]="{
      position: 'fixed',
      top: bounds.y + 20,
      left: bounds.x + 20,
      background: 'white',
      border: '1px solid black',
      borderRadius: 16,
      padding: '1rem'
    }"
  >
  <button (click)="close()">X</button>
  This is a context menu
</div>
  
  `,
})
class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('contextOrigin') contextOrigin: ElementRef<HTMLElement>;
  @ViewChildren('contextMenu') contextMenu: QueryList<ElementRef<HTMLElement>>;

  isOpen = false;

  bounds = {
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  };

  // Do you remember why we can't use a class method here?
  resizeListener = () => {
    this.bounds = this.contextOrigin.nativeElement.getBoundingClientRect();
  };

  ngAfterViewInit() {
    this.bounds = this.contextOrigin.nativeElement.getBoundingClientRect();

    window.addEventListener('resize', this.resizeListener);

    this.contextMenu.changes.forEach(() => {
      const isLoaded = this?.contextMenu?.first?.nativeElement;
      if (!isLoaded) return;
      this.contextMenu.first.nativeElement.focus();
    });
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeListener);
  }

  close() {
    this.isOpen = false;
  }

  open(e: UIEvent) {
    e.preventDefault();
    this.isOpen = true;
  }
}

```

## Vue

// TODO: Add code sample

<!-- tabs:end -->





