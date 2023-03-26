---
{
    title: "Shared Component Logic",
    description: "Components provide a great way to share layout, styling, and logic between multiple parts of your app. But what about times you only need to share logic in React, Angular, and Vue?",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 12,
    series: "The Framework Field Guide"
}
---

Components are awesome. They allow you to make your code logic more modular and associate that logic to a related collection of DOM nodes; but sometimes you need code logic you can share between components that have no associated DOM nodes.

For example, let's say that you have some component code that detects the current window size. While this might seem like a simple problem at first, it requires you to:

- Get the initial window size and share that data with the component
- Add and cleanup event listeners for when the user resizes their browser window
- Compose the window sizing logic inside of other shared logic, such as a `onlyShowOnMobile` boolean

 The method how this logic is shared between components differs from framework to framework.

| Framework | Method Of Logic Sharing |
| --------- | ----------------------- |
| React     | Custom Hooks            |
| Angular     | Services            |
| Vue     | Compositions            |

We'll spend the chapter talking about how to do all of this and see how we can apply these methods to production code.

But here's my favorite part about these methods: We don't have to introduce any new APIs to use them. Instead, we'll combine a culmination of other APIs we've learned to this point.

Without further ado, let's build the window size shared logic.

# Sharing Data Storage Methods

The first step to sharing component logic between multiple components is sharing data storage mechanisms.

This doesn't mean that we're going to be sharing data between mutliple components: we won't be.

Instead, we're going to be providing some logic that allows a consistent set of data every time you create a new component that extends this shared logic.

<!-- tabs:start -->

## React

In a normal React component, we'd store data using `useState` or `useReducer` hook. Using React's custom hooks, we'll use the same APIs to create our own hook that combines (or, composes) these other APIs:

```jsx
const useWindowSize = () => {
  const [height, setHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth);

  return {height, width};
}
```

We can then use this `useWindowSize` custom hook just as we would any other hook:

```jsx
const App = () => {
  const {height, width} = useWindowSize();

  return <p>The window is {height}px high and {width}px wide</p>
}
```

<!-- Editor's note: We should probably move these much earlier in the book -->

### Rules of Custom Hooks

While creating a custom hook like `useWindowSize` is undoubtably useful, there are some limitations around all custom hooks. 

Namely, any custom hook hook must:

- Have a variable name that starts with `use`
- Be called from within another hook or component (no normal function)
- Not be called conditionally inside of a component
- Not be called inside of a loop 

This means that **the following custom hooks are not allowed**: 

```jsx
// ❌ Not allowed, the function name must start with `use`
const getWindowSize = () => {
  const [height, setHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth);

  return {height, width};
}
```

```jsx
const useWindowSize = () => {
  const [height, setHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth);

  return {height, width};
}

// ❌ Not allowed, you must use a hook _inside_ a component or another hook
const {height, width} = useWindowSize();

const Component = () => {
  return <p>Height is: {height}</p>
}
```

```jsx
const useWindowSize = () => {
  const [height, setHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth);

  return {height, width};
}

function getWindowSize() {
  // ❌ Not allowed, you cannot use a hook inside of a non-hook function
  const {height, width} = useWindowSize();
  return {height, width};
}
```

```jsx
const useWindowSize = () => {
    // ❌ Not allowed, you cannot `return` before using a hook
    if (bool) return {height: 0, width: 0}
    const [height, setHeight] = useState(window.innerHeight);
    const [width, setWidth] = useState(window.innerWidth);
  
    return {height, width};
}
```


## Angular

To share data setup between components in Angular, we'll create an instance of a class that can be provided by each consuming component.

Just as we covered [in the dependency injection chapter](/posts/ffg-fundamentals-dependency-injection#Providing-Basic-Values-with-Dependency-Injection), we'll use `Injectable` to create a class that can be provided to a component instance.

```typescript
@Injectable()
class WindowSize {
  height = window.innerHeight;
  width = window.innerWidth;
}

@Component({
  selector: 'my-app',
  template: `
    <p>The window is {{windowSize.height}}px high and {{windowSize.width}}px wide</p>
  `,
  providers: [WindowSize],
})
class AppComponent {
  windowSize = inject(WindowSize);
}
```

## Vue

Because Vue's `ref` and `reactive` data reactivity systems work anywhere, we can extract these values to a dedicated function called `useWindowSize`.

```javascript
// use-window-size.js
import { ref } from 'vue'

export const useWindowSize = () => {
  const height = ref(window.innerHeight)
  const width = ref(window.innerWidth)
  return { height, width }
}
```

This custom function is often called a "composition", since we're using Vue's Composition API inside of it. We can then use this composition inside of our setup `script`, like so:

```vue
<!-- App.vue -->
<template>
  <p>The window is {{ height }}px high and {{ width }}px wide</p>
</template>

<script setup>
import { useWindowSize } from './use-window-size'

const { height, width } = useWindowSize()
</script>

```

> While React requires you to name your custom hooks "useX", you don't have to do the same with custom compositions. We could have easily called this code `createWindowSize` and have it work just as well.
>
> We still use the `use` composition prefix to keep things readible. While this is subjective, it's the naming convention the ecosystem seems to favor for compositions like this.

<!-- tabs:end -->



# Sharing Lifecycle Methods

While sharing a consistent set of data setup for each consuming component is helpful in its own right, this is only a fraction of the capabilities these frameworks have for cross-component logic reuse.

One of the most powerful things that can be reused between components is [lifecycle method](/posts/ffg-fundamentals-side-effects) logic.

Using this, we can say something alone the lines of:

> When a component that implements this shared bit of code renders, do this behavior.

And combine it with our data storage to say:

> When the component renders, store some calculation and expose it back to the consuming component.

This can be a bit vague to discuss without code, so let's dive in.

While our last code sample was able to expose the browser window's height and width, it didn't respond to window resizing. This means that if you resized the browser window, the value of `height` and `width` would no longer be accurate.

Let's hook into [a consuming component's `rendered` lifecycle method](/posts/ffg-fundamentals-side-effects#Render-Lifecycle) in order to add an event handler to listen for window resizing.

<!-- tabs:start -->

## React

If we look back to the Lifecycle Method chapter's insights, we'll remember that we can simulate a `rendered` lifecycle method using an `useEffect` alongside an empty dependency array:

```jsx
const useWindowSize = () => {
  const [height, setHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function onResize() {
      setHeight(window.innerHeight);
      setWidth(window.innerWidth);
    }

    window.addEventListener('resize', onResize);

    // Don't forget to cleanup the listener
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return {height, width};
}
```

... That's it!

There's nothing more we need to do inside of our `useWindowSize` consuming component, it simply works transparently as-if we had placed the `useEffect` in the component itself.

```jsx
const App = () => {
  const {height, width} = useWindowSize();
  return <p>The window is {height}px high and {width}px wide</p>
}
```

> Notice that we've changed exactly zero lines of code from our previous example of this component! ✨ Magic ✨

## Angular

While Angular can _technically_ [create a base component that shares its lifecycle with a consuming component](https://unicorn-utterances.com/posts/angular-extend-class), it's messy, fragile, and overall considered a malpractice.

Instead, we can use a per-component instance injectable that uses its own `constructor` and `ngOnDestroy` lifecycle methods.

> Yes, technically `constructor` isn't strictly a lifecycle method, but `Injectable`s don't have access to `ngOnInit`; only `ngOnDestroy`.
>
> The reason `Injectable`s don't have `ngOnInit` is because that method means something very specific under-the-hood, pertaining to UI data binding. Because an `Injectable` can't UI data bind, it has no need for `ngOnInit` and instead the `constructor` takes the role of setting up side effects.

```typescript
@Injectable()
class WindowSize implements OnDestroy {
  height = 0;
  width = 0;

  constructor() {
    this.height = window.innerHeight
    this.width = window.innerWidth
    // In a component, we might add this in an `OnInit`, but `Injectable` classes only have `OnDestroy`
    window.addEventListener('resize', this.onResize);
  }
  onResize = () => {
    this.height = window.innerHeight;
    this.width = window.innerWidth;
  }
  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize);
  }
}

@Component({
  selector: 'app-root',
  template: `
    <p>The window is {{windowSize.height}}px high and {{windowSize.width}}px wide</p>
  `,
  providers: [WindowSize]
})
class AppComponent {
  windowSize = inject(WindowSize);
}
```

> I acknowledge that this method of sharing lifecycle methods is far from perfect; This is one of Angular's greatest weaknesses when it comes to Angular's code reuse story.

> While this is the only method we'll be looking at in this book for writing this code, [Lars Gyrup Brink Nielsen showcased how we could improve this code using RxJS in another article on the Unicorn Utterances site.](https://unicorn-utterances.com/posts/angular-extend-class#The-Angular-way-to-fix-the-code)

## Vue

Sharing lifecycle methods within custom compositions is just as straightforward as using them within components. We can simply use the same `onMounted` and `onUnmounted` lifecycle methods as we do within our `setup` `script`.

```javascript
// use-window-size.js
import { onMounted, onUnmounted, ref } from 'vue'

export const useWindowSize = () => {
  const height = ref(window.innerHeight)
  const width = ref(window.innerWidth)

  function onResize() {
    height.value = window.innerHeight
    width.value = window.innerWidth
  }

  onMounted(() => {
    window.addEventListener('resize', onResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', onResize)
  })

  return { height, width }
}
```

```vue
<!-- App.vue -->
<template>
  <p>The window is {{ height }}px high and {{ width }}px wide</p>
</template>

<script setup>
import { useWindowSize } from './use-window-size'

const { height, width } = useWindowSize()
</script>
```

<!-- tabs:end -->





# Composing Custom Logic

We've covered how shared logic can access data storage and lifecycle methods, now let's talk about the fun stuff: Composability.

Not only can you call your custom logic from components, but you can call them from other shared logic fragments.

For example, let's say that we want to take our window size getter and create another custom logic fragment that composes it.

If we were using plain-ole functions, it might look something like this:

```javascript
function getWindowSize() {
	return {
	  height: window.innerHeight,
    width: window.innerWidth
	}
}

function isMobile() {
  const {height, width} = getWindowSize();
  if (width <= 480) return true;
  else return false;
}
```

But of course, this comes with downsides when trying to include this logic into a framework, such as:

- No access to lifecycle methods
- No automatic-re-rendering when `height` or `width` changes

Luckily for us, we can do this with our frameworks with full access to all of the other framework-specific APIs we've covered until now.

<!-- tabs:start -->

## React

So, you remember how we used `useState` inside of `useWindowSize`? That's because all hooks are composable: meaning that you can use a hook inside of another hook.

This is true for custom hooks as well, meaning that we can do the following code:

```jsx
const useMobileCheck = () => {
  const {height, width} = useWindowSize();

  if (width <= 480) return {isMobile: true}
  else return {isMobile: false}
}
```

Without modifying the `useWindowSize` component. To consume our new `useMobileCheck` component is just as straightforward as it was to use `useWindowSize`:

```jsx
const Component = () => {
  const {isMobile} = useMobileCheck();

  return <p>Is this a mobile device? {isMobile ? "Yes" : "No"}</p>
}
```

> Remember, custom hooks are still hooks!
>
> This means that our custom hooks (both `useWindowSize` and `useMobileCheck` alike) are subject to the same rules as built-in hooks. We still need to:
>
> - Name the function starting with `use`
> - Not place the hooks in a conditional (`if`) statement
> - Use the hooks inside of components or other hooks

## Angular

Just as we can use dependency injection to provide an instance of our `WindowSize` class, we can use an instnace of our provided `WindowSize` class inside of a new `IsMobile` class, that's also provided in a class.

First, though, we need to provide a way to add behavior to our `onResize` class:

````typescript
@Injectable()
class WindowSize implements OnDestroy {
  height = 0;
  width = 0;
  
  // We'll overwrite this behavior in another service
  _listener: () => void | undefined;

  constructor() {
    this.onResize();
    window.addEventListener('resize', this.onResize);
  }

  onResize = () => {
    this.height = window.innerHeight;
    this.width = window.innerWidth;
    // We will call this "listener" function if it's present
    if (this._listener) {
      this._listener();
    }
  };

  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize);
  }
}
````

Now that we have this ability to tap into the `resize` event handler, let's write our own `IsMobile` class:

```typescript
@Injectable()
class IsMobile implements OnDestroy {
  isMobile = false;

  // We cannot use the `inject` function here, because we need to overwrite our `constructor` behavior
  // and it's an either-or decision to use `constructor` or the `inject` function
  constructor(private windowSize: WindowSize) {
    windowSize._listener = () => {
      if (windowSize.width <= 480) this.isMobile = true;
      else this.isMobile = false;
    };
  }
}
```

This allows us to have a `isMobile` field that we can access from our `AppComponent` class:

```typescript
@Component({
  selector: 'app-root',
  template: `
    <p>Is mobile? {{isMobile.isMobile}}</p>
  `,
  providers: [WindowSize, IsMobile],
})
class AppComponent implements OnInit, OnDestroy {
  isMobile = inject(IsMobile);
}
```

Something worth mentioning is that we need to provide both `WindowSize` and `IsMobile`, otherwise we'll get an error like so:

```
Error: R3InjectorError(AppModule)[WindowSize -> WindowSize -> WindowSize]:
NullInjectorError: No provider for WindowSize!
```

> This process of creating an `isMobile` field would be a lot easier with [`RxJS`](https://rxjs.dev/), which is widely used amongst Angular apps. However, I'm holding off on teaching RxJS until [the second "Framework Field Guide" book, which covers the "Ecosystem" of the frameworks more in-depth.](https://framework.guide)

## Vue

Composing custom composables (say that 10 times fast) is a straightforward task, thanks to custom composables acting like normal functions. 

```javascript
// use-mobile-check.js
import { computed } from 'vue'
import { useWindowSize } from './use-window-size.js'

export const useMobileCheck = () => {
  const { height, width } = useWindowSize()
  const isMobile = computed(() => {
    if (width.value <= 480) return true
    else return false
  })

  return { isMobile }
}
```

> Notice that we aren't showing the source code for `useWindowSize` again, that's because we haven't changed it!

Then, to use this new composable in our components we use it just like we did our previous composables:

````vue
<!-- App.vue -->
<template>
  <p>Is this a mobile device? {{ isMobile ? 'Yes' : 'No' }}</p>
</template>

<script setup>
import { useMobileCheck } from './use-mobile-check'

const { isMobile } = useMobileCheck()
</script>
````

<!-- tabs:end -->



# Refactoring Our Code to use Composable Logic

Take code from `component-reference` and refactor to use custom hooks/services/etc.

// TODO: Write

<!-- tabs:start -->

## React

// TODO: This is missing the `resize` listener for the bounds

```jsx
import React from 'react';

const useOutsideClick = ({ ref, onClose }) => {
  useEffect(() => {
    const closeIfOutsideOfContext = (e) => {
      const isClickInside = ref.current.contains(e.target);
      if (isClickInside) return;
      onClose();
    };
    document.addEventListener('click', closeIfOutsideOfContext);
    return () => document.removeEventListener('click', closeIfOutsideOfContext);
  }, [onClose]);
};

const ContextMenu = forwardRef(({ x, y, onClose }, ref) => {
  const divRef = useRef();

  useImperativeHandle(ref, () => ({
    focus: () => divRef.current && divRef.current.focus(),
  }));

  useOutsideClick({ ref: divRef, onClose });

  return (
    <div
      ref={divRef}
      style={{
        position: 'fixed',
        top: y + 20,
        left: x + 20,
        background: 'white',
        border: '1px solid black',
        borderRadius: 16,
        padding: '1rem',
      }}
    >
      <button onClick={() => onClose()}>X</button>
      This is a context menu
    </div>
  );
});

const useBounds = () => {
  const [bounds, setBounds] = useState({
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  });

  const ref = useCallback((el) => {
    if (!el) return;
    const localBounds = el.getBoundingClientRect();
    setBounds(localBounds);
  }, []);

  return { ref, bounds };
};

export default function App() {
  const { ref, bounds } = useBounds();

  // An addEventListener is easier to tackle when inside of the conditional render
  // Add that as an exploration for `useImperativeHandle`
  const [isOpen, setIsOpen] = useState(false);

  function onContextMenu(e) {
    e.preventDefault();
    setIsOpen(true);
  }

  const contextMenuRef = useRef();

  useEffect(() => {
    if (isOpen && contextMenuRef.current) {
      contextMenuRef.current.focus();
    }
  }, [isOpen]);

  return (
    <Fragment>
      <div style={{ marginTop: '5rem', marginLeft: '5rem' }}>
        <div ref={ref} onContextMenu={onContextMenu}>
          Right click on me!
        </div>
      </div>
      {isOpen && (
        <ContextMenu
          x={bounds.x}
          y={bounds.y}
          ref={contextMenuRef}
          onClose={() => setIsOpen(false)}
        />
      )}
    </Fragment>
  );
}
```

## Angular

// TODO: Write

While we were able to use the `constructor` to set up our event listeners in previous code samples, we need to explicitly have a `setup` function in this code sample. This is because our `ViewChild` element reference isn't available until `AfterViewInit`, and isn't immediately accessible from `constructor`

<!-- Editor's note: What about `{static: true}`? Is the above still true in this instance? -->

```typescript
@Injectable()
class CloseIfOutSideContext implements OnDestroy {
  getCloseIfOutsideFunction = (contextMenu: ElementRef<HTMLElement>, close: EventEmitter<any>) => {
    return (e: MouseEvent) => {
      const contextMenuEl = contextMenu?.nativeElement;
      if (!contextMenuEl) return;
      const isClickInside = contextMenuEl.contains(e.target as HTMLElement);
      if (isClickInside) return;
      close.emit();
    }
  };

  setup(contextMenu: ElementRef<HTMLElement>, close: EventEmitter<any>) {
    this.closeIfOutsideOfContext = this.getCloseIfOutsideFunction(contextMenu, close);
    document.addEventListener('click', this.closeIfOutsideOfContext);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.closeIfOutsideOfContext);
    this.closeIfOutsideOfContext = () => {};
  }

  closeIfOutsideOfContext: (e: MouseEvent) => void = () => {};
}

@Component({
  selector: 'context-menu',
  template: `
  <div
    #contextMenu
    tabIndex="0"
    [style]="{
      position: 'fixed',
      top: y + 20,
      left: x + 20,
      background: 'white',
      border: '1px solid black',
      borderRadius: 16,
      padding: '1rem'
    }"
  >
    <button (click)="close.emit()">X</button>
    This is a context menu
  </div>
  `,
  providers: [CloseIfOutSideContext]
})
export class ContextMenuComponent implements AfterViewInit {
  @ViewChild('contextMenu') contextMenu!: ElementRef<HTMLElement>;

  @Input() x: number = 0;
  @Input() y: number = 0;
  @Output() close = new EventEmitter();

  constructor(private closeIfOutsideContext: CloseIfOutSideContext) {
  }

  focus() {
    this.contextMenu.nativeElement.focus();
  }

  ngAfterViewInit() {
    this.closeIfOutsideContext.setup(this.contextMenu, this.close);
  }
}

@Injectable()
class BoundsContext {
  bounds = {
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  };

  contextOrigin: ElementRef | undefined;

  resizeListener = () => {
    if (!this.contextOrigin) return;
    this.bounds = this.contextOrigin.nativeElement.getBoundingClientRect();
  };

  setup(contextOrigin: ElementRef) {
    this.bounds = contextOrigin.nativeElement.getBoundingClientRect();
    this.contextOrigin = contextOrigin;

    window.addEventListener('resize', this.resizeListener);
  }

  cleanup() {
    window.removeEventListener('resize', this.resizeListener);
    this.contextOrigin = undefined;
  }
}

@Component({
  selector: 'my-app',
  template: `
  <div [style]="{ marginTop: '5rem', marginLeft: '5rem' }">
    <div #contextOrigin (contextmenu)="open($event)">
      Right click on me!
    </div>
  </div>
  <context-menu #contextMenu *ngIf="isOpen" [x]="boundsContext.bounds.x" [y]="boundsContext.bounds.y" (close)="close()"></context-menu>
  `,
  providers: [BoundsContext]
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('contextOrigin') contextOrigin!: ElementRef<HTMLElement>;
  @ViewChildren('contextMenu') contextMenu!: QueryList<ContextMenuComponent>;

  isOpen = false;

  constructor(public boundsContext: BoundsContext) {
  }

  ngAfterViewInit() {
    this.boundsContext.setup(this.contextOrigin);

    this.contextMenu.changes.forEach(() => {
      const isLoaded = this?.contextMenu?.first;
      if (!isLoaded) return;
      this.contextMenu.first.focus();
    });
  }

  ngOnDestroy() {
    this.boundsContext.cleanup();
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

// TODO: Write code

```javascript
// use-outside-click.js
import { onMounted, onUnmounted } from 'vue'

export const useOutsideClick = ({ ref, onClose }) => {
  const closeIfOutsideOfContext = (e) => {
    const isClickInside = ref.value.contains(e.target)
    if (isClickInside) return
    onClose()
  }

  onMounted(() => {
    document.addEventListener('click', closeIfOutsideOfContext)
  })

  onUnmounted(() => {
    document.removeEventListener('click', closeIfOutsideOfContext)
  })
}
```



Then



```vue
<!-- ContextMenu.vue -->
<template>
  <div
    tabIndex="0"
    ref="contextMenuRef"
    :style="{
      position: 'fixed',
      top: props.y + 20,
      left: props.x + 20,
      background: 'white',
      border: '1px solid black',
      borderRadius: 16,
      padding: '1rem',
    }"
  >
    <button @click="$emit('close')">X</button>
    This is a context menu
  </div>
</template>
<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useOutsideClick } from './use-outside-click'

const props = defineProps(['x', 'y'])
const emit = defineEmits(['close'])
const contextMenuRef = ref(null)

useOutsideClick({ ref: contextMenuRef, onClose: () => emit('close') })

function focusMenu() {
  contextMenuRef.value.focus()
}
defineExpose({
  focusMenu,
})
</script>
```



Also

```javascript
// use-bounds.js
import { ref, onMounted, onUnmounted } from 'vue'

export const useBounds = () => {
  const elRef = ref()

  const bounds = ref({
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  })

  function resizeListener() {
    if (!elRef.value) return
    bounds.value = elRef.value.getBoundingClientRect()
  }
  onMounted(() => {
    resizeListener()
    window.addEventListener('resize', resizeListener)
  })
  onUnmounted(() => {
    window.removeEventListener('resize', resizeListener)
  })

  return { bounds, ref: elRef }
}
```



Which allows



```vue
<!-- App.vue -->
<template>
  <div :style="{ marginTop: '5rem', marginLeft: '5rem' }">
    <div ref="contextOrigin" @contextmenu="open($event)">Right click on me!</div>
  </div>
  <ContextMenu ref="contextMenu" v-if="isOpen" :x="bounds.x" :y="bounds.y" @close="close()" />
</template>
<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import ContextMenu from './ContextMenu.vue'
import { useBounds } from './use-bounds'
const isOpen = ref(false)

const { ref: contextOrigin, bounds } = useBounds()
const contextMenu = ref()

function close() {
  isOpen.value = false
}
function open(e) {
  e.preventDefault()
  isOpen.value = true
  setTimeout(() => {
    contextMenu.value.focusMenu()
  }, 0)
}
</script>
```







<!-- tabs:end -->

