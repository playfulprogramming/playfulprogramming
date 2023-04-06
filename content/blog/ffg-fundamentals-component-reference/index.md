---
{
    title: "Component Reference",
    description: "While you usually want to pass data to child components, sometimes you need to access arbitrary data from the child without needing to explicitly pass the data.",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 9,
    series: "The Framework Field Guide"
}
---

In our previous chapter, we were able to use element reference to gain access to underlying DOM node APIs. Using this, we were able to hook into the `getBoundingClientRect` method in order to get the positional data from another element for a home-grown context menu.

While the context menu we wrote worked, it lacked a key feature: The ability to close itself when a user clicks outside of the context menu.

![// TODO: Add alt](../ffg-fundamentals-element-reference/context-close.png)

This code is _functional_, but this code is getting a bit out of hand, let's move our context menu code into it's own component. This way, we're able to do easier refactors, code cleanup, and more.

<!-- tabs:start -->

## React

```jsx {0-12}
const ContextMenu = ({ x, y, onClose }) => {
  const [contextMenu, setContextMenu] = useState();

  useEffect(() => {
    if (!contextMenu) return;
    const closeIfOutsideOfContext = (e) => {
      const isClickInside = contextMenu.contains(e.target);
      if (isClickInside) return;
      onClose();
    };
    document.addEventListener('click', closeIfOutsideOfContext);
    return () => document.removeEventListener('click', closeIfOutsideOfContext);
  }, [contextMenu, onClose]);

  return (
    <div
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

export default function App() {
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

  // An addEventListener is easier to tackle when inside of the conditional render
  // Add that as an exploration for `useImperativeHandle`
  const [isOpen, setIsOpen] = useState(false);

  function onContextMenu(e) {
    e.preventDefault();
    setIsOpen(true);
  }

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
          onClose={() => setIsOpen(false)}
        />
      )}
    </Fragment>
  );
}
```

## Angular

```typescript {0-43}
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
})
class ContextMenuComponent implements AfterViewInit, OnDestroy {
  @ViewChild('contextMenu') contextMenu: ElementRef<HTMLElement>;

  @Input() x: number;
  @Input() y: number;
  @Output() close = new EventEmitter();

  ngAfterViewInit() {
    document.addEventListener('click', this.closeIfOutsideOfContext);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.closeIfOutsideOfContext);
  }

  closeIfOutsideOfContext = (e: MouseEvent) => {
    const contextMenuEl = this?.contextMenu?.nativeElement;
    if (!contextMenuEl) return;
    const isClickInside = contextMenuEl.contains(e.target as HTMLElement);
    if (isClickInside) return;
    this.close.emit();
  };
}

@Component({
  selector: 'my-app',
  template: `
  <div [style]="{ marginTop: '5rem', marginLeft: '5rem' }">
    <div #contextOrigin (contextmenu)="open($event)">
      Right click on me!
    </div>
  </div>
  <context-menu *ngIf="isOpen" [x]="bounds.x" [y]="bounds.y" (close)="close()"></context-menu>  
  `,
})
class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('contextOrigin') contextOrigin: ElementRef<HTMLElement>;

  isOpen = false;

  bounds = {
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  };

  resizeListener = () => {
    this.bounds = this.contextOrigin.nativeElement.getBoundingClientRect();
  };

  ngAfterViewInit() {
    this.bounds = this.contextOrigin.nativeElement.getBoundingClientRect();

    window.addEventListener('resize', this.resizeListener);
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
      padding: '1rem'
    }"
  >
    <button @click="$emit('close')">X</button>
    This is a context menu
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref} from 'vue';

const props = defineProps(['x', 'y']);
const emit = defineEmits(['close']);

const contextMenuRef = ref(null);

function closeIfOutside(e) {
  const contextMenuEl = contextMenuRef.value;
  if (!contextMenuEl) return;
  const isClickInside = contextMenuEl.contains(e.target);
  if (isClickInside) return;
  emit('close');
}

onMounted(() => {
  document.addEventListener('click', closeIfOutside);
})

onUnmounted(() => {
  document.removeEventListener('click', closeIfOutside);
})
</script>
```

```vue
<!-- App.vue -->
<template>
  <div :style="{ marginTop: '5rem', marginLeft: '5rem' }">
    <div ref="contextOrigin" @contextmenu="open($event)">
      Right click on me!
    </div>
  </div>
  <ContextMenu v-if="isOpen" :x="bounds.x" :y="bounds.y" @close="close()"/>
</template>

<script setup>
import {onMounted, onUnmounted, ref} from 'vue';
import ContextMenu from './ContextMenu.vue';

const isOpen = ref(false);
const bounds = ref({
  height: 0,
  width: 0,
  x: 0,
  y: 0,
});

const contextOrigin = ref();

function resizeListener() {
  if (!contextOrigin.value) return;
  bounds.value = contextOrigin.value.getBoundingClientRect();
}

onMounted(() => {
  resizeListener();

  window.addEventListener('resize', resizeListener);
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeListener);
})

function close() {
  isOpen.value = false;
}

function open(e) {
  e.preventDefault();
  isOpen.value = true;
}
</script>
```

<!-- tabs:end -->

You may have noticed that during this migration, we ended up removing a crucial accessibility feature: **We're no longer running `focus` on the context menu when it opens.**

Why was it removed and how can we add it back?

# Introducing Element Reference 

**The reason we removed the context menu's focus management is to keep the control of the context menu in the parent. **

While we could add the focus management feature into [the `ContextMenu` component's initial render lifecycle method](/posts/ffg-fundamentals-side-effects), but this muddies the water a bit. Ideally in a framework, **you want your parent to be in charge of the child component's behavior**. This allows you to re-use your context menu component in more places, should you ever want to use the component without forcing a focus change.

To do this, let's move the `.focus` method out of our component. Moving from this:

```javascript
/* This is valid JS, but psuedocode of what each framework is doing */
// Child component
function onComponentRender() {
    document.addEventListener('click', closeIfOutsideOfContext);
    contextMenu.focus();
}

// Parent component
function openContextMenu(e) {
	e.preventDefault();
	setOpen(true);
}
```

To this:

```javascript
/* This is valid JS, but psuedocode of what each framework is doing */
// Child component
function onComponentRender() {
    document.addEventListener('click', closeIfOutsideOfContext);
}

// Parent component
function openContextMenu(e) {
	e.preventDefault();
	setOpen(true);
    contextMenu.focus();
}
```

While this might seem like a straightforward change at first, there's a new problem present: Our `contextMenu` is now inside of a component. As a result, we need to not only [access the underlying DOM node using element reference](/posts/ffg-fundamentals-element-reference), but we need to access the `ContextMenu` component instance.

Luckily for us, each framework enables us to do just that! Before we implement the `focus` logic, let's dive into how component reference works:

<!-- tabs:start -->

## React

React has two APIs that help us gain insights into a component's internals from it's parent:

- [`forwardRef`](#forward-ref)
- [`useImperativeHandle`](#imperative-handle)

Let's start with the basics: `forwardRef`.

### `forwardRef` {#forward-ref}

`forwardRef` does what it says on the tin: It allows you to forward a `ref` through a component instance.

See, in React, `ref` is a special property. This means that in order to be used properly, React has to have a special syntax to enable it's expected functionality.

As a result, the following code does not work:

```jsx
const Component = ({ref, style}) => {
	return <div ref={ref} style={style}/>
}

const App = () => {
	return (
      <Component
        ref={el => console.log(el)}
        style={{height: 100, width: 100, backgroundColor: 'red'}}
      />
    )
}
```

Doing this will result in our `ref` callback not being called as expected, alongside two error messages explaining why:

> Warning: Component: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)

> Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use `forwardRef()`?

To solve this, we have two options:

1) Rename our `ref` property to another name, like `divRef`:

```jsx
const Component = ({divRef, style}) => {
	return <div ref={divRef} style={style}/>
}

const App = () => {
	return (
        <Component
            divRef={el => console.log(el)}
            style={{height: 100, width: 100, backgroundColor: 'red'}}
        />
    );
}
```

2. Use the `forwardRef` API, as suggested by the error message originally printed.

```jsx
import { forwardRef } from 'react';

const Component = forwardRef((props, ref) => {
	return <div ref={ref} style={props.style}/>
});

const App = () => {
	return (
        <Component
            ref={el => console.log(el)}
            style={{height: 100, width: 100, backgroundColor: 'red'}}
        />
    );
}
```

As we can see, `forwardRef` accepts slightly modified component function. While the first argument might look familiar as our place to access properties, our special property `ref` is passed as a second argument.

We can then _forward_ that `ref` to wherever we want to gain access to an underlying DOM node in the child.

But what if we wanted _more_ control over our child component? What if we wanted to access data and methods from the child component using a `ref`?

Luckily, `useImperativeHandle` does just that!

### `useImerativeHandle` {#imperative-handle}

While `forwardRef` enables us to pass a `ref` to a child component, `useImperativeHandle` allows us to fully customize this `ref` to our heart's content.

```jsx
import { forwardRef, useImperativeHandle } from 'react';

const Component = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => {
    // Anything returned here will be assigned to the forwarded `ref`
    return {
      pi: 3.14,
      sayHi() {
        console.log('Hello, world');
      },
    };
  });

  return <div />;
});

const App = () => {
  return (
    <Component
      ref={(el) => console.log(el)}
    />
  );
};
```

Here, we can assign properties, functions, or any other JavaScript values into the forwarded `ref`. If we look at the output of our `ref` callback from `App` it shows up the object that we assigned using `useImperativeHandle`:

```javascript
{ pi: 3.14, sayHi: sayHi() }
```

That `sayHi` function still works, too! If we change `App` to the following:

```jsx
const App = () => {
  const compRef = useRef();
  return (
	<>
		<button onClick={() => compRef.sayHi()}>
        <Component
          ref={compRef}
        />
    </>
  );
};
```

It will output `Hello, world` just as we would expect it to!

## Angular

Just as we can use `ViewChild` to access an underlying DOM node, we can do the same thing with a component reference. In fact, we can use a template reference variable just like we would to access the DOM node.

```typescript
// TODO: Check this code
@Component({
	selector: "child",
	template: `<div></div>`
})
class ChildComponent {
  pi = 3.14;
  sayHi() {
    console.log('Hello, world');
  }
}

@Component({
	selector: "parent",
	template: `<child #childVar></child>`
})
class ParentComponent implements AfterViewInit {
  @ViewChild("childVar") childComp: ChildComponent;
  
  ngAfterViewInit() {
    console.log(this.childComp);
  }
}
```

 Doing this, we'll see the console output:

```javascript
Object { pi: 3.14 }
```

But how do we know that this is properly the `ChildComponent` instance? Simple! We'll `console.log` `childComp.constructor` and we'll see:

```typescript
class ChildComponent {}
```

This means that, as a result, we can also call the `sayHi` method:

```typescript
@Component({
	selector: "parent",
	template: `<child #childVar></child>`
})
class ParentComponent implements AfterViewInit {
  @ViewChild("childVar") childComp: ChildComponent;
  
  ngAfterViewInit() {
    this.childComp.sayHi();
  }
}
```

And it will output:

```
Hello, world
```


## Vue

Using the same `ref` API as element nodes, you can access a component's instance:

```javascript
const Child = {
	template: `<div></div>`,
	data() {
		return {
			pi: 3.14,
		};
	},
	methods: {
		sayHi() {
			console.log('Hello, world');
		},
	}
}

const Parent = {
	template: `<child ref="childComp"></child>`,
	mounted() {
		console.log(this.$refs.childComp);
	},
	components: {
		Child
	}
}
```

If we look at our console output, we might see something unexpected:

```javascript
Proxy { <target>: {…}, <handler>: {…} }
```

This is because of how [Vue works under-the-hood](// TODO: Link to Vue internals chapter). Rest assured, however; this `Proxy` is still our component instance.

### Exposing Component Variables to References 

We're not able to do much with this component instance currently. If we change out `Parent` component to `console.log` the `pi` value from `Child`:

```vue
<!-- Parent.vue -->
<template>
  <Child ref="childComp"/>
</template>

<script setup>
import {ref, onMounted} from "vue";
import Child from './Child.vue';

const childComp = ref();

onMounted(() => {
  console.log(childComp.value.pi);
})
</script>
```

 We'll see that `childComp.value.pi` is `undefined` currently. This is because, by default, Vue's `setup script` does not "expose" internal variables to component refences externally.

To fix this, we can use Vue's `defineExpose` global API to allow parent components to access a child component's variables and methods:

```vue
<!-- Child.vue -->
<template>
  <div></div>
</template>

<script setup>
const pi = 3.14;

function sayHi() {
  console.log('Hello, world');
}

defineExpose({
  pi,
  sayHi
})
</script>
```

Because we now have access to the component instance, we can access data and call methods similar to how we're able to access data and call a methods from an element reference.

```vue
<!-- Parent.vue -->
<template>
  <Child ref="childComp"/>
</template>

<script setup>
import {ref, onMounted} from "vue";
import Child from './Child.vue';

const childComp = ref();

onMounted(() => {
  console.log(childComp.value.pi);
  childComp.value.sayHi();
})
</script>
```

<!-- tabs:end -->

















# Using component reference to focus our context menu

Now that we sufficiently understand what component references look like in each framework, let's add it into our `App` component.

Knowing that we can access a component instance's methods and properties, we can use a combination of an element reference and a component reference to focus the `ContextMenu` underlying DOM node.

<!-- tabs:start -->

## React

```jsx
const ContextMenu = forwardRef(({ x, y, onClose }, ref) => {
  const divRef = useRef();

  useImperativeHandle(ref, () => ({
    focus: () => divRef.current && divRef.current.focus(),
  }));

  useEffect(() => {
    const closeIfOutsideOfContext = (e) => {
      const isClickInside = divRef.current.contains(e.target);
      if (isClickInside) return;
      onClose();
    };
    document.addEventListener('click', closeIfOutsideOfContext);
    return () => document.removeEventListener('click', closeIfOutsideOfContext);
  }, [onClose]);

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

export default function App() {
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

```typescript
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
})
export class ContextMenuComponent implements AfterViewInit, OnDestroy {
  @ViewChild('contextMenu') contextMenu: ElementRef<HTMLElement>;

  @Input() x: number;
  @Input() y: number;
  @Output() close = new EventEmitter();

  focus() {
    this.contextMenu.nativeElement.focus();
  }

  ngAfterViewInit() {
    document.addEventListener('click', this.closeIfOutsideOfContext);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.closeIfOutsideOfContext);
  }

  closeIfOutsideOfContext = (e: MouseEvent) => {
    const contextMenuEl = this?.contextMenu?.nativeElement;
    if (!contextMenuEl) return;
    const isClickInside = contextMenuEl.contains(e.target as HTMLElement);
    if (isClickInside) return;
    this.close.emit();
  };
}

@Component({
  selector: 'my-app',
  template: `
  <div [style]="{ marginTop: '5rem', marginLeft: '5rem' }">
    <div #contextOrigin (contextmenu)="open($event)">
      Right click on me!
    </div>
  </div>
  <context-menu #contextMenu *ngIf="isOpen" [x]="bounds.x" [y]="bounds.y" (close)="close()"></context-menu>  
  `,
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('contextOrigin') contextOrigin: ElementRef<HTMLElement>;
  @ViewChildren('contextMenu') contextMenu: QueryList<ContextMenuComponent>;

  isOpen = false;

  bounds = {
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  };

  resizeListener = () => {
    this.bounds = this.contextOrigin.nativeElement.getBoundingClientRect();
  };

  ngAfterViewInit() {
    this.bounds = this.contextOrigin.nativeElement.getBoundingClientRect();

    window.addEventListener('resize', this.resizeListener);

    this.contextMenu.changes.forEach(() => {
      const isLoaded = this?.contextMenu?.first;
      if (!isLoaded) return;
      this.contextMenu.first.focus();
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
      padding: '1rem'
    }"
  >
    <button @click="$emit('close')">X</button>
    This is a context menu
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref} from 'vue';

const props = defineProps(['x', 'y']);
const emit = defineEmits(['close']);

const contextMenuRef = ref(null);

function closeIfOutside(e) {
  const contextMenuEl = contextMenuRef.value;
  if (!contextMenuEl) return;
  const isClickInside = contextMenuEl.contains(e.target);
  if (isClickInside) return;
  emit('close');
}

onMounted(() => {
  document.addEventListener('click', closeIfOutside);
})

onUnmounted(() => {
  document.removeEventListener('click', closeIfOutside);
})

function focusMenu() {
  contextMenuRef.value.focus();
}

defineExpose({
  focusMenu
})
</script>
```

```vue
<!-- App.vue -->
<template>
  <div :style="{ marginTop: '5rem', marginLeft: '5rem' }">
    <div ref="contextOrigin" @contextmenu="open($event)">
      Right click on me!
    </div>
  </div>
  <ContextMenu ref="contextMenu" v-if="isOpen" :x="bounds.x" :y="bounds.y" @close="close()"/>
</template>

<script setup>
import {onMounted, onUnmounted, ref} from 'vue';
import ContextMenu from './ContextMenu.vue';

const isOpen = ref(false);
const bounds = ref({
  height: 0,
  width: 0,
  x: 0,
  y: 0,
});

const contextOrigin = ref();
const contextMenu = ref();

function resizeListener() {
  if (!contextOrigin.value) return;
  bounds.value = contextOrigin.value.getBoundingClientRect();
}

onMounted(() => {
  resizeListener();

  window.addEventListener('resize', resizeListener);
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeListener);
})

function close() {
  isOpen.value = false;
}

function open(e) {
  e.preventDefault();
  isOpen.value = true;
  setTimeout(() => {
    contextMenu.value.focusMenu();
  }, 0);
}
</script>
```

<!-- tabs:end -->















-------




# Challenge

Let's add functionality for a drag handler into another part of our app. This will use what we know of 



<!-- tabs:start -->

## React

https://stackblitz.com/edit/react-ts-gpjzsm?file=components%2Futils.ts

```tsx
import { MouseEventHandler, useState, useRef, useEffect } from 'react';
import { render } from 'react-dom';

export const debounce = <T extends (...args: any) => any>(
  func: T,
  time: number
): T => {
  let timeout: any;
  return ((...args: any) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, time);
  }) as any;
};

interface DragHandlerProps {
  moveX: (relativeX: number) => void;
}

export const DragHandler = ({ moveX }: DragHandlerProps) => {
  const elRef = useRef<HTMLElement | null>(null);

  const onMouseMove = useMemo(
    () =>
      debounce((e) => {
        if (!elRef.current) return;
        const boundingBox = elRef.current.getBoundingClientRect();
        const relativeX = e.clientX - boundingBox.x;
        moveX(relativeX);
      }, 1),
    [elRef]
  );

  const onMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', onMouseMove);
  }, [onMouseMove]);

  useEffect(() => {
    return () => document.removeEventListener('mousemove', onMouseMove);
  }, [onMouseMove]);

  useEffect(() => {
    return () => document.removeEventListener('mouseup', onMouseUp);
  }, [onMouseUp]);

  const onMouseDown: MouseEventHandler = (e) => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div
      ref={elRef as any}
      style={{ width: '2px', backgroundColor: 'red', cursor: 'col-resize' }}
      onMouseDown={onMouseDown}
    />
  );
};

const App = () => {
  const [width, setWidth] = useState(100);

  // Callback ref
  const homeRef = (props) => {
    // Comment these out for different behavior
    if (!props) return;
    setWidth(props.width);
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
      <div style={{ width: `${width}px` }}>
        <Home ref={homeRef} />
      </div>
      <DragHandler moveX={(val) => setWidth((w) => w + val)} />
      <div>
        <Home />
      </div>
    </div>
  );
};

render(<App />, document.getElementById('root'));
```

## Angular

// TODO

## Vue

// TODO: Add

<!-- tabs:end -->
