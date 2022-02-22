---
{
    title: "Lifecycle Methods",
    description: "",
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

When we introduced components, we touched on the [concept of "rendering"](/posts/intro-to-components#Rendering-the-app). This occurs when a component is drawn on screen.

This occurs at first when the user loads a page, but also when shown or hidden using a [conditional render, which we touched on last chapter](/posts/dynamic-html#Conditional-Branches).

Say we have the following code:



------





<!-- tabs:start -->

## React

```jsx {1-3,15}
const Child = () => {
	useEffect(() => {
        console.log("I am rendering");
    }, []);

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

React works slightly differently from the other frameworks we're looking at in this series. In particular, while there's an alternative way of writing React components called "class components" which does have traditional lifecycle methods, the way we're writing components — called "functional components" — does not.

Instead of a direct analogous, React's functional components have a different API [called "Hooks"](https://reactjs.org/docs/hooks-intro.html). These Hooks can then be used to recreate similar effects to lifecycle methods.

For example, in the above code we're using `useEffect` with an empty array as the second argument in order to create a [side effect](// TODO: Link to glossary) that runs only once per render.

We'll touch on what a side effect is and what the empty array is doing in just a moment.

## Angular

```typescript {7,22-26}
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
export class ChildComponent implements OnInit {
  ngOnInit() {
    console.log('I am rendering');
  }
}
```

Angular's version of the "rendered" lifecycle method is called "OnInit". Each of Angular's lifecycle methods are prepended with `ng` and require you to add `implements` to your component class.

If you forget the `implements`, your lifecycle method will not run when you expect it to. 

## Vue

```javascript {2-4,13}
const Child = {
  template: `<p>I am the child</p>`,
  mounted() {
    console.log('I am rendering');
  },
};

const Parent = {
  template: `
  <div>
  	<button @click="setShowChild()">
  		Toggle Child
  	</button>
    <child v-if="showChild"></child>
  </div>
  `,
  components: {
    Child: Child,
  },
  data() {
    return {
      showChild: false,
    };
  },
  methods: {
    setShowChild() {
      this.showChild = !this.showChild;
    },
  },
};
```

Despite Vue's lifecycle methods being called "methods", they do not live in the "methods" object on a component. Instead, they live at the root of the component declaration.

<!-- tabs:end -->

These lifecycle methods are then called by the framework when a specific lifecycle event occurs. No need to call these methods yourself manually!

Try clicking the toggle button repeatedly, and you'll see that the `console.log` occurs every time the `Child` component renders again.

## Side Effects

A common usage of this `rendered` lifecycle is to be able to do some kind of **side effect**.

A side effect is when a piece of code changes or relies on state outside of it's local environment. When a piece of code does not contain a side effect, it is considered "pure".

![A pure function is allowed to mutate state from within it's local environment, while a side effect changes data outside of its own environment](./pure-vs-side-effect.png)

For example, say we have the following code:

```javascript
function pureFn() {
	let data = 0;
    data++;
    return data;
}
```

This logic would be considered "pure", as it does not rely on external data sources. However, if we move the `data` variable outside of the local environment, and mutate elsewhere:

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

`increment` would be considered a "side-effect" that mutates a variable outside of it's own environment.

> When does this come into play in a production application?

This is a great question! A great example of this occurs in the browser with the `window` and `document` APIs.

Say we wanted to store a global counter that we use in multiple parts of the app, we might store this in `window`.

````javascript
window.shoppingCartItems = 0;

function addToShoppingCart() {
	window.shoppingCartItems++;
}
````

### Production Side Effects

On top of global storage, both [`window`](https://developer.mozilla.org/en-US/docs/Web/API/Window#methods) and [`document`](https://developer.mozilla.org/en-US/docs/Web/API/Document#methods) expose a number of APIs that can be useful in an application.

Let's say that inside of our component we'd like to display the window size:

<!-- tabs:start -->

#### React

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

#### Angular

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

#### Vue

```javascript
const Child = {
  template: `
   <div>
  	<p>Height: {{height}}</p>
  	<p>Width: {{width}}</p>
  </div>
  `,
  data() {
  	return {
      height: window.innerHeight,
  	  width: window.innerWidth
  	}
  },
};
```

<!-- tabs:end -->

This works to display the window size on the initial render, but what happens when the user resizes their browser?

Because we aren't listening for the change in Window size, we never get an updated render with the new screen size!

Let's solve this by using [`window.addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) to handle [`resize` events](https://developer.mozilla.org/en-US/docs/Web/API/Window/resize_event); emitted when the user changes their window size.

<!-- tabs:start -->

#### React

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
  }, []);
    
  return <div>
  	<p>Height: {height}</p>
  	<p>Width: {width}</p>
  </div>
}
```

#### Angular

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
export class WindowSizeComponent implements OnInit {
  height = window.innerHeight;
  width = window.innerWidth;

  ngOnInit() {
    function resizeHandler() {
      this.height = window.innerHeight;
      this.width = window.innerWidth;
    }
    window.addEventListener('resize', resizeHandler);
  }
}
```

#### Vue

```javascript
const WindowSize = {
  template: `
   <div>
  	<p>Height: {{height}}</p>
  	<p>Width: {{width}}</p>
  </div>
  `,
  data() {
  	return {
      height: window.innerHeight,
  	  width: window.innerWidth
  	}
  },
  mounted() {
    function resizeHandler() {
      this.height = window.innerHeight;
      this.width = window.innerWidth;
    }
    window.addEventListener('resize', resizeHandler);
  }
};
```

<!-- tabs:end -->

Now, when we resize the browser, our values on-screen should update as well!

#### Event Bubbling Aside

You might be wondering why we don't simply utilize event binding, [which we covered in our introduction to components](/posts/intro-to-components#Event-Binding), to listen for the `resize` event.

This is because the `resize` event is only trigged on the `window` object (associated with the `<html>` tag) and does not permeate downwards towards other elements.

You see, by default events will always "bubble" upwards from their emitted position. So, if we click on a `div`, the `click` event will start from the `div` and bubble all the way up to the `html` tag.

![A click event bubbling to the top of the document](./event_bubbling.png) 

Because our `resize` event is emitted directly from the `html` node, the only way to get access to it from the `div` parent component is to use `addEventListener`.

[You can learn more about event bubbling, how it works, and how to overwrite it in specific instances from Mozilla Developer Network.](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_bubbling_and_capture)

# Unrendering

Side effects are, among other things, a powerful way to utilize browser APIs. However, we need to make sure to cleanup any side effects we utilize.

Why? Because `addEventListener` runs 



Just as there's a lifecycle method for when a component is rendered, there's a







<!-- tabs:start -->

## React

```jsx {1-3,15}
const Child = () => {
	useEffect(() => {
        console.log("I am rendering");
        
        return () => console.log("I am unrendering");
    }, []);

    return <p>I am the child</p>
}
```



## Angular

```typescript {7,22-26}
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

```javascript {2-4,13}
const Child = {
  template: `<p>I am the child</p>`,
  mounted() {
    console.log('I am rendering');
  },
  unmounted() {
    console.log('I am unrendering');      
  }
};
```



<!-- tabs:end -->






----

- Lifecycle methods
    - Mounted/rendered
    - Unmounted/unrendered
    - On Updated
        - Compare old vs new
    - Others
        - ngAfterViewInit
        - BeforeUpdated/BeforeMounted
    - Include graphs for each framework
