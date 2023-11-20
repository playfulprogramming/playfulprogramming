---
{
    title: "Component Reference",
    description: "While you usually want to pass data to child components, sometimes you need to access arbitrary data from the child without needing to explicitly pass the data.",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 9,
    collection: "The Framework Field Guide - Fundamentals"
}
---

In our previous chapter, we build context menu functionality into our `App` component. This functionality allowed us to right-click on an element and get a list of actions we could take. 

![// TODO: Add alt](../ffg-fundamentals-element-reference/context-close.png)

This code works as we'd expect, but it doesn't follow a fundamental pattern of React, Angular, or Vue: It's not componentized.

Let's fix this by moving our context menu code into it's own component. This way, we're able to do easier refactors, code cleanup, and more.

<!-- tabs:start -->

## React

```jsx {0-12}
const ContextMenu = ({ isOpen, x, y, onClose }) => {
  const [contextMenu, setContextMenu] = useState();

  useEffect(() => {
    if (!contextMenu) return;
    const closeIfOutsideOfContext = (e) => {
      const isClickInside = contextMenu.contains(e.target);
      if (isClickInside) return;
      onClose(false);
    };
    document.addEventListener('click', closeIfOutsideOfContext);
    return () => document.removeEventListener('click', closeIfOutsideOfContext);
  }, [contextMenu]);

  if (!isOpen) return null;

  return (
    <div
      ref={(el) => setContextMenu(el)}
      tabIndex={0}
      style={{
        position: 'fixed',
        top: y,
        left: x,
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
};

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

  return (
    <>
      <div style={{ marginTop: '5rem', marginLeft: '5rem' }}>
        <div onContextMenu={onContextMenu}>Right click on me!</div>
      </div>
      <ContextMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        x={mouseBounds.x}
        y={mouseBounds.y}
      />
    </>
  );
}
```

## Angular

```typescript {0-43}
@Component({
  selector: 'context-menu',
  standalone: true,
  imports: [NgIf],
  template: `
    <div
      *ngIf="isOpen"
      tabIndex="0"
      #contextMenu
      [style]="'
        position: fixed;
        top: ' + y + 'px;
        left: ' + x + 'px;
        background: white;
        border: 1px solid black;
        border-radius: 16px;
        padding: 1rem;
      '"
    >
      <button (click)="close.emit()">X</button>
      This is a context menu
    </div>
  `,
})
class ContextMenuComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('contextMenu') contextMenu: QueryList<ElementRef<HTMLElement>>;

  @Input() isOpen: boolean;
  @Input() x: number;
  @Input() y: number;

  @Output() close = new EventEmitter();

  closeIfOutsideOfContext = (e: MouseEvent) => {
    const contextMenuEl = this.contextMenu?.first?.nativeElement;
    if (!contextMenuEl) return;
    const isClickInside = contextMenuEl.contains(e.target as HTMLElement);
    if (isClickInside) return;
    this.close.emit();
  };

  ngAfterViewInit() {
    document.addEventListener('click', this.closeIfOutsideOfContext);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.closeIfOutsideOfContext);
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgIf, ContextMenuComponent],
  template: `
    <div style="margin-top: 5rem; margin-left: 5rem">
      <div #contextOrigin (contextmenu)="open($event)">
        Right click on me!
      </div>
    </div>
    <context-menu
      (close)="close()"
      [isOpen]="isOpen"
      [x]="mouseBounds.x"
      [y]="mouseBounds.y"
    />
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
      x: e.clientX,
      y: e.clientY,
    };
  }
}
```

## Vue

```vue
<!-- ContextMenu.vue -->
<script setup>
  import { ref, onMounted, onUnmounted } from 'vue'

  const props = defineProps(['isOpen', 'x', 'y'])

  const emit = defineEmits(['close'])

  const contextMenuRef = ref(null)

  function closeIfOutside(e) {
    const contextMenuEl = contextMenuRef.value
    if (!contextMenuEl) return
    const isClickInside = contextMenuEl.contains(e.target)
    if (isClickInside) return
    emit('close')
  }

  onMounted(() => {
    document.addEventListener('click', closeIfOutside)
  })

  onUnmounted(() => {
    document.removeEventListener('click', closeIfOutside)
  })
</script>

<template>
  <div
    v-if="props.isOpen"
    ref="contextMenuRef"
    tabIndex="0"
    :style="`
      position: fixed;
      top: ${props.y}px;
      left: ${props.x}px;
      background: white;
      border: 1px solid black;
      border-radius: 16px;
      padding: 1rem;
    `"
  >
    <button @click="emit('close')">X</button>
    This is a context menu
  </div>
</template>
```

```vue
<!-- App.vue -->
<script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import ContextMenu from './ContextMenu.vue'

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
      x: e.clientX,
      y: e.clientY,
    }
  }
</script>

<template>
  <div style="margin-top: 5rem; margin-left: 5rem">
    <div @contextmenu="open($event)">Right click on me!</div>
  </div>
  <ContextMenu :isOpen="isOpen" :x="mouseBounds.x" :y="mouseBounds.y" @close="close()" />
</template>
```

<!-- tabs:end -->

You may have noticed that during this migration, we ended up removing a crucial accessibility feature: **We're no longer running `focus` on the context menu when it opens.**

Why was it removed and how can we add it back?

# Introducing Component Reference

**The reason we removed the context menu's focus management is to keep the control of the context menu in the parent.**

While we could have kept the `.focus()`  logic in the component using [a component side effect handler](/posts/ffg-fundamentals-side-effects), this muddies the water a bit. Ideally in a framework, **you want your parent to be in charge of the child component's behavior**. 

This allows you to re-use your context menu component in more places, should you theoretically ever want to use the component without forcing a focus change.

To do this, let's move the `.focus` method out of our component. Moving from this:

```javascript
/* This is valid JS, but is only psuedocode of what each framework is doing */
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
/* This is valid JS, but is only psuedocode of what each framework is doing */
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

`forwardRef` does what it says on the tin: It allows you to forward a `ref` property through a component instance.

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

<!-- TODO: Add useImperativeHandle deps array -->

## Angular

Just as we can use `ViewChild` to access an underlying DOM node, we can do the same thing with a component reference. In fact, we can use a template reference variable just like we would to access the DOM node.

```typescript
// TODO: Check this code
@Component({
	selector: "child-comp",
    standalone: true,
	template: `<div></div>`
})
class ChildComponent {
  pi = 3.14;
  sayHi() {
    console.log('Hello, world');
  }
}

@Component({
	selector: "parent-comp",
    standalone: true,
    template: `<child-comp #childVar></child-comp>`
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
	selector: "parent-comp",
    standalone: true,
    imports: [ChildComponent],
	template: `<child-comp #childVar></child-comp>`
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
	template: `<child-comp ref="childComp"></child-comp>`,
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

This is because Vue uses Proxies under-the-hood to power component state. Rest assured, however; this `Proxy` is still our component instance.

### Exposing Component Variables to References 

We're not able to do much with this component instance currently. If we change out `Parent` component to `console.log` the `pi` value from `Child`:

```vue
<!-- Parent.vue -->
<script setup>
  import {ref, onMounted} from "vue";
  import Child from './Child.vue';

  const childComp = ref();

  onMounted(() => {
    console.log(childComp.value.pi);
  })
</script>

<template>
  <Child ref="childComp"/>
</template>
```

 We'll see that `childComp.value.pi` is `undefined` currently. This is because, by default, Vue's `setup script` does not "expose" internal variables to component refences externally.

To fix this, we can use Vue's `defineExpose` global API to allow parent components to access a child component's variables and methods:

```vue
<!-- Child.vue -->
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

<template>
  <div></div>
</template>
```

Because we now have access to the component instance, we can access data and call methods similar to how we're able to access data and call a methods from an element reference.

```vue
<!-- Parent.vue -->
<script setup>
  import {ref, onMounted} from "vue";
  import Child from './Child.vue';

  const childComp = ref();

  onMounted(() => {
    console.log(childComp.value.pi);
    childComp.value.sayHi();
  })
</script>

<template>
  <Child ref="childComp"/>
</template>
```

<!-- tabs:end -->



# Using component reference to focus our context menu

Now that we sufficiently understand what component references look like in each framework, let's add it into our `App` component to re-enable focusing our `ContextMenu` component when it opens.

> Remember, if you see:
>
> ```javascript
> setTimeout(() => {
> 	doSomething();
> }, 0);
> ```
>
> It means that we want to defer the `doSomething` call until after all other tasks are complete. We're using this in our code samples to say:
>
> "Wait until the element is rendered to run `.focus()` on it"

<!-- tabs:start -->

## React

```jsx
const ContextMenu = forwardRef(({ isOpen, x, y, onClose }, ref) => {
  const [contextMenu, setContextMenu] = useState();

  useImperativeHandle(ref, () => ({
    focus: () => contextMenu && contextMenu.focus(),
  }));

  useEffect(() => {
    if (!contextMenu) return;
    const closeIfOutsideOfContext = (e) => {
      const isClickInside = contextMenu.contains(e.target);
      if (isClickInside) return;
      onClose(false);
    };
    document.addEventListener('click', closeIfOutsideOfContext);
    return () => document.removeEventListener('click', closeIfOutsideOfContext);
  }, [contextMenu]);

  if (!isOpen) return null;

  return (
    <div
      ref={(el) => setContextMenu(el)}
      tabIndex={0}
      style={{
        position: 'fixed',
        top: y,
        left: x,
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

  const contextMenuRef = useRef();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (contextMenuRef.current) {
          contextMenuRef.current.focus();
        }
      }, 0);
    }
  }, [isOpen, mouseBounds]);

  return (
    <>
      <div style={{ marginTop: '5rem', marginLeft: '5rem' }}>
        <div onContextMenu={onContextMenu}>Right click on me!</div>
      </div>
      <ContextMenu
        ref={contextMenuRef}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        x={mouseBounds.x}
        y={mouseBounds.y}
      />
    </>
  );
}
```

## Angular

```typescript
@Component({
  selector: 'context-menu',
  standalone: true,
  imports: [NgIf],
  template: `
    <div
      *ngIf="isOpen"
      tabIndex="0"
      #contextMenu
      [style]="'
        position: fixed;
        top: ' + y + 'px;
        left: ' + x + 'px;
        background: white;
        border: 1px solid black;
        border-radius: 16px;
        padding: 1rem;
      '"
    >
      <button (click)="close.emit()">X</button>
      This is a context menu
    </div>
  `,
})
class ContextMenuComponent implements AfterViewInit, OnDestroy {
  @ViewChild('contextMenu') contextMenu: ElementRef<HTMLElement>;

  @Input() isOpen: boolean;
  @Input() x: number;
  @Input() y: number;

  @Output() close = new EventEmitter();

  focus() {
    this.contextMenu?.nativeElement?.focus();
  }

  closeIfOutsideOfContext = (e: MouseEvent) => {
    const contextMenuEl = this.contextMenu?.nativeElement;
    if (!contextMenuEl) return;
    const isClickInside = contextMenuEl.contains(e.target as HTMLElement);
    if (isClickInside) return;
    this.close.emit();
  };

  ngAfterViewInit() {
    document.addEventListener('click', this.closeIfOutsideOfContext);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.closeIfOutsideOfContext);
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgIf, ContextMenuComponent],
  template: `
    <div style="margin-top: 5rem; margin-left: 5rem">
      <div #contextOrigin (contextmenu)="open($event)">
        Right click on me!
      </div>
    </div>
    <context-menu
      #contextMenu
      (close)="close()"
      [isOpen]="isOpen"
      [x]="mouseBounds.x"
      [y]="mouseBounds.y"
    />
  `,
})
class AppComponent {
  @ViewChild('contextMenu') contextMenu: ContextMenuComponent;

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
      x: e.clientX,
      y: e.clientY,
    };
    setTimeout(() => {
      this.contextMenu.focus();
    }, 0);
  }
}
```

## Vue

```vue
<!-- ContextMenu.vue -->
<script setup>
  import { ref, onMounted, onUnmounted } from 'vue'

  const props = defineProps(['isOpen', 'x', 'y'])

  const emit = defineEmits(['close'])

  const contextMenuRef = ref(null)

  function closeIfOutside(e) {
    const contextMenuEl = contextMenuRef.value
    if (!contextMenuEl) return
    const isClickInside = contextMenuEl.contains(e.target)
    if (isClickInside) return
    emit('close')
  }

  onMounted(() => {
    document.addEventListener('click', closeIfOutside)
  })

  onUnmounted(() => {
    document.removeEventListener('click', closeIfOutside)
  })

  function focusMenu() {
    contextMenuRef.value.focus()
  }

  defineExpose({
    focusMenu,
  })
</script>

<template>
  <div
    v-if="props.isOpen"
    ref="contextMenuRef"
    tabIndex="0"
    :style="`
      position: fixed;
      top: ${props.y}px;
      left: ${props.x}px;
      background: white;
      border: 1px solid black;
      border-radius: 16px;
      padding: 1rem;
    `"
  >
    <button @click="emit('close')">X</button>
    This is a context menu
  </div>
</template>
```

```vue
<!-- App.vue -->
<script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import ContextMenu from './ContextMenu.vue'

  const isOpen = ref(false)

  const mouseBounds = ref({
    x: 0,
    y: 0,
  })

  const contextMenu = ref()

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
    setTimeout(() => {
      contextMenu.value.focusMenu()
    }, 0)
  }
</script>

<template>
  <div style="margin-top: 5rem; margin-left: 5rem">
    <div @contextmenu="open($event)">Right click on me!</div>
  </div>
  <ContextMenu ref="contextMenu" :isOpen="isOpen" :x="mouseBounds.x" :y="mouseBounds.y" @close="close()" />
</template>
```

<!-- tabs:end -->




# Challenge

This information about component reference isn't just theoretically useful. You're able to apply it to your codebase to enable new methods of building out components.

Let's see that in action by building a sidebar component that's able to expand and collapse.

![// TODO: Alt](./collapsible_sidebar.png)

To add an extra special interaction with this sidebar, **let's make it so that when the user shrinks their screen to a certain size, it will automatically collapse the sidebar**.

To do this, we'll:

1) Setup our `App` component to handle a left and main column.
2) Make a sidebar that can collapse and expand to grow and shrink the main column.
3) Automatically expand or collapse the sidebar as the browser grows and shrinks.

Let's dive in.

## Step 1: Setup App Component Layout

Let's start creating our sidebar!

Our first step in doing so will be creating a layout file that includes a left-hand sidebar and a main content area on the right side.

To do that might look something like this:

<!-- tabs:start -->

### React

```jsx
export const Layout = ({sidebar, sidebarWidth, children}) => {
    return (
        <div style={{display: 'flex', flexWrap: 'nowrap', minHeight: '100vh'}}>
            <div
                style={{
                    width: `${sidebarWidth}px`,
                    height: '100vh',
                    overflowY: 'scroll',
                    borderRight: '2px solid #bfbfbf',
                }}
            >
                {sidebar}
            </div>
            <div style={{width: '1px', flexGrow: 1}}>
                {children}
            </div>
        </div>
    );
};

export const App = () => {
    return (
        <Layout sidebar={<p>Sidebar</p>} sidebarWidth={150}>
            <p style={{padding: '1rem'}}>Hi there!</p>
        </Layout>
    )
}
```

### Angular

```typescript
@Component({
    selector: 'app-layout',
    standalone: true,
    template: `
        <div style="display: flex; flex-wrap: nowrap; min-height: 100vh">
        <div [style]="' 
          width: ' + sidebarWidth + 'px;
          height: 100vh;
          overflow-y: scroll;
          border-right: 2px solid #bfbfbf;
        '">
                <ng-content select="[sidebar]"/>
            </div>
            <div style="width: 1px; flex-grow: 1">
                <ng-content/>
            </div>
        </div>
    `
})
export class LayoutComponent {
    @Input() sidebarWidth!: number;
}

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [LayoutComponent],
    template: `
        <app-layout [sidebarWidth]="150">
            <p sidebar>Sidebar</p>
            <p style="padding: 1rem">Hi there!</p>
        </app-layout>   
    `
})
export class AppComponent {
}
```



### Vue

```vue
<!-- Layout.vue -->
<script setup>
  const props = defineProps(["sidebarWidth"]);
</script>

<template>
    <div style="display: flex; flex-wrap: nowrap; min-height: 100vh">
        <div :style="`
          width: ${props.sidebarWidth}px;
          height: 100vh;
          overflow-y: scroll;
          border-right: 2px solid #bfbfbf;
        `">
            <slot name="sidebar"/>
        </div>
        <div style="width: 1px; flex-grow: 1">
            <slot/>
        </div>
    </div>
</template>
```

```vue
<!-- App.vue -->
<script setup>
  import Layout from "./Layout.vue";
</script>

<template>
    <Layout :sidebarWidth="150">
        <template #sidebar><p>Sidebar</p></template>
        <p style="padding: 1rem">Hi there!</p>
    </Layout>
</template>
```

<!-- tabs:end -->

## Step 2: Make a collapsible sidebar

Now that we have a rough sidebar, we'll make it so that the user can manually collapse the sidebar.

This can be done by having an `isCollapsed` state that the user toggles with a button.

When `isCollapsed` is `true`, it will only show the toggle button, but when `isCollapsed` is `false`, it should display the full sidebar's contents.

We'll also setup constants to support different widths of this sidebar area if it's collapsed or not.

<!-- tabs:start -->

### React

```jsx
export const Sidebar = ({toggle}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const setAndToggle = (v) => {
        setIsCollapsed(v);
        toggle(v);
    };
    const toggleCollapsed = () => {
        setAndToggle(!isCollapsed);
    };

    if (isCollapsed) {
        return <button onClick={toggleCollapsed}>Toggle</button>;
    }

    return (
        <div>
            <button onClick={toggleCollapsed}>Toggle</button>
            <ul style={{padding: '1rem'}}>
                <li>List item 1</li>
                <li>List item 2</li>
                <li>List item 3</li>
                <li>List item 4</li>
                <li>List item 5</li>
                <li>List item 6</li>
            </ul>
        </div>
    );
};

const collapsedWidth = 100;
const expandedWidth = 150;

export const App = () => {
    const [width, setWidth] = useState(expandedWidth);

    return (
        <Layout
            sidebarWidth={width}
            sidebar={<Sidebar
            toggle={(isCollapsed) => {
                if (isCollapsed) {
                    setWidth(collapsedWidth);
                    return;
                }
                setWidth(expandedWidth);
            }}
        />
        }>
            <p style={{padding: '1rem'}}>Hi there!</p>
        </Layout>
    )
}
```

### Angular

```typescript
@Component({
    selector: "app-sidebar",
    standalone: true,
    imports: [NgIf],
    template: `
        <button *ngIf="isCollapsed" (click)="toggleCollapsed()">Toggle</button>
        <div *ngIf="!isCollapsed">
            <button (click)="toggleCollapsed()">Toggle</button>
            <ul style="padding: 1rem">
                <li>List item 1</li>
                <li>List item 2</li>
                <li>List item 3</li>
                <li>List item 4</li>
                <li>List item 5</li>
                <li>List item 6</li>
            </ul>
        </div>
    `
})
export class SidebarComponent {
    @Output() toggle = new EventEmitter<boolean>();

    isCollapsed = false;

    setAndToggle(v: boolean) {
        this.isCollapsed = v;
        this.toggle.emit(v);
    };

    toggleCollapsed() {
        this.setAndToggle(!this.isCollapsed);
    };
}

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [LayoutComponent, SidebarComponent],
    template: `
        <app-layout [sidebarWidth]="width">
            <app-sidebar sidebar
                     (toggle)="onToggle($event)"
            />
            <p style="padding: 1rem">Hi there!</p>
        </app-layout>
    `
})
export class AppComponent {
    collapsedWidth = 100;
    expandedWidth = 150;

    width = this.expandedWidth;

    onToggle(isCollapsed: boolean) {
        if (isCollapsed) {
            this.width = this.collapsedWidth;
            return;
        }
        this.width = this.expandedWidth;
    }
}
```

### Vue

```vue
<!-- Sidebar.vue -->
<script setup>
  import {ref} from "vue";

  const emit = defineEmits(["toggle"]);

  const isCollapsed = ref(false);

  function setAndToggle(v) {
    isCollapsed.value = v;
    emit("toggle", v);
  };

  function toggleCollapsed() {
    setAndToggle(!isCollapsed.value);
  };
</script>

<template>
  <button v-if="isCollapsed" @click="toggleCollapsed()">Toggle</button>
  <div v-if="!isCollapsed">
    <button @click="toggleCollapsed()">Toggle</button>
    <ul style="padding: 1rem">
      <li>List item 1</li>
      <li>List item 2</li>
      <li>List item 3</li>
      <li>List item 4</li>
      <li>List item 5</li>
      <li>List item 6</li>
    </ul>
  </div>
</template>
```

```vue
<!-- App.vue -->
<script setup>
  import Layout from "./Layout.vue";
  import Sidebar from "./Sidebar.vue";
  import {ref} from "vue";

  const collapsedWidth = 100;
  const expandedWidth = 150;

  const width = ref(expandedWidth);

  function onToggle(isCollapsed) {
    if (isCollapsed) {
      width.value = collapsedWidth;
      return;
    }
    width.value = expandedWidth;
  }
</script>

<template>
  <Layout :sidebarWidth="width">
    <template #sidebar>
      <Sidebar
             @toggle="onToggle($event)"
      />
    </template>
    <p style="padding: 1rem">Hi there!</p>
  </Layout>

</template>
```

<!-- tabs:end -->

## Step 3: Auto-collapse sidebar on small screens

Finally, let's auto-collapse the sidebar on screens smaller than 600px wide.

We can do this using [a side effect handler](/posts/ffg-fundamentals-side-effects) to add a listener for screen resizes. 

Then, we'll use framework-specific code similar to the following pseudo-code to expand or collapse the sidebar based on the screen size:

```javascript
const onResize = () => {
    if (window.innerWidth < widthToCollapseAt) {
        sidebarRef.collapse();
    } else if (sidebar.isCollapsed) {
        sidebarRef.expand();
    }
};

window.addEventListener('resize', onResize);

// Later

window.removeEventListener('resize', onResize);
```

Let's implement it:

<!-- tabs:start -->

### React

```tsx

export const Sidebar = forwardRef(({toggle}, ref) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const setAndToggle = (v) => {
        setIsCollapsed(v);
        toggle(v);
    };

    useImperativeHandle(
        ref,
        () => ({
            collapse: () => {
                setAndToggle(true);
            },
            expand: () => {
                setAndToggle(false);
            },
            isCollapsed: isCollapsed,
        }),
        [isCollapsed, setAndToggle]
    );

    const toggleCollapsed = () => {
        setAndToggle(!isCollapsed);
    };

    if (isCollapsed) {
        return <button onClick={toggleCollapsed}>Toggle</button>;
    }

    return (
        <div>
            <button onClick={toggleCollapsed}>Toggle</button>
            <ul style={{padding: '1rem'}}>
                <li>List item 1</li>
                <li>List item 2</li>
                <li>List item 3</li>
                <li>List item 4</li>
                <li>List item 5</li>
                <li>List item 6</li>
            </ul>
        </div>
    );
});

const collapsedWidth = 100;
const expandedWidth = 150;
const widthToCollapseAt = 600;

export const App = () => {
    const [width, setWidth] = useState(expandedWidth);

    const sidebarRef = useRef();

    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth < widthToCollapseAt) {
                sidebarRef.current.collapse();
            } else if (sidebarRef.current.isCollapsed) {
                sidebarRef.current.expand();
            }
        };

        window.addEventListener('resize', onResize);

        return () => window.removeEventListener('resize', onResize);
    }, [sidebarRef]);

    return (
        <Layout sidebarWidth={width} sidebar={
            <Sidebar
                ref={sidebarRef}
                toggle={(isCollapsed) => {
                    if (isCollapsed) {
                        setWidth(collapsedWidth);
                        return;
                    }
                    setWidth(expandedWidth);
                }}
            />
        }>
            <p style={{padding: '1rem'}}>Hi there!</p>
        </Layout>
    );
};
```

### Angular

```typescript
@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [NgIf],
  template: `
      <button *ngIf="isCollapsed" (click)="toggleCollapsed()">Toggle</button>
      <div *ngIf="!isCollapsed">
          <button (click)="toggleCollapsed()">Toggle</button>
          <ul style="padding: 1rem">
              <li>List item 1</li>
              <li>List item 2</li>
              <li>List item 3</li>
              <li>List item 4</li>
              <li>List item 5</li>
              <li>List item 6</li>
          </ul>
      </div>
  `
})
export class SidebarComponent {
  @Output() toggle = new EventEmitter<boolean>();

  isCollapsed = false;

  setAndToggle(v: boolean) {
      this.isCollapsed = v;
      this.toggle.emit(v);
  };

  collapse() {
      this.setAndToggle(true);
  }

  expand() {
      this.setAndToggle(false);
  }

  toggleCollapsed() {
      this.setAndToggle(!this.isCollapsed);
  };
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent, SidebarComponent],
  template: `
      <app-layout [sidebarWidth]="width">
          <app-sidebar
                  #sidebar
                  sidebar
                  (toggle)="onToggle($event)"
          />
          <p style="padding: 1rem">Hi there!</p>
      </app-layout>
  `
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('sidebar', {static: true}) sidebar!: SidebarComponent;

  collapsedWidth = 100;
  expandedWidth = 150;
  widthToCollapseAt = 600;

  width = this.expandedWidth;

  onToggle(isCollapsed: boolean) {
      if (isCollapsed) {
          this.width = this.collapsedWidth;
          return;
      }
      this.width = this.expandedWidth;
  }

  onResize = () => {
      if (window.innerWidth < this.widthToCollapseAt) {
          this.sidebar.collapse();
      } else if (this.sidebar.isCollapsed) {
          this.sidebar.expand();
      }
  };

  ngOnInit() {
      window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy() {
      window.removeEventListener('resize', this.onResize);
  }
}
```

### Vue

```vue
<template>
    <button v-if="isCollapsed" @click="toggleCollapsed()">Toggle</button>
    <div v-if="!isCollapsed">
        <button @click="toggleCollapsed()">Toggle</button>
        <ul style="padding: 1rem">
            <li>List item 1</li>
            <li>List item 2</li>
            <li>List item 3</li>
            <li>List item 4</li>
            <li>List item 5</li>
            <li>List item 6</li>
        </ul>
    </div>
</template>

<script setup>
    import {ref} from "vue";

    const emits = defineEmits(['toggle']);

    const isCollapsed = ref(false);

    const setAndToggle = (v) => {
        isCollapsed.value = v;
        emits('toggle', v);
    };

    const collapse = () => {
        setAndToggle(true);
    }

    const expand = () => {
        setAndToggle(false);
    }

    const toggleCollapsed = () => {
        setAndToggle(!isCollapsed.value);
    };

    defineExpose({
        expand,
        collapse,
        isCollapsed
    })
</script>
```

```vue
<!-- App.vue -->
<script setup>
  import {onMounted, onUnmounted, ref} from "vue";
  import Layout from "./Layout.vue";
  import Sidebar from "./Sidebar.vue";

  const collapsedWidth = 100;
  const expandedWidth = 150;
  const widthToCollapseAt = 600

  const sidebar = ref()

  const width = ref(expandedWidth);

  const onToggle = (isCollapsed) => {
    if (isCollapsed) {
      width.value = collapsedWidth;
      return;
    }
    width.value = expandedWidth;
  }

  const onResize = () => {
    if (window.innerWidth < widthToCollapseAt) {
      sidebar.value.collapse()
    } else if (sidebar.value.isCollapsed) {
      sidebar.value.expand()
    }
  }

  onMounted(() => {
    window.addEventListener('resize', onResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', onResize)
  })
</script>

<template>
    <Layout :sidebarWidth="width">
        <template #sidebar>
            <Sidebar ref="sidebar" @toggle="onToggle($event)"/>
        </template>
        <p style="padding: 1rem">Hi there!</p>
    </Layout>
</template>
```

<!-- tabs:end -->

// TODO

> Truth be told, this is not necessarily how I would build this component in production. Instead, I might ["raise the state"](https://unicorn-utterances.com/posts/master-react-unidirectional-data-flow) of "collapsed" from the `Sidebar` component to the `App` component.
>
> This would give us greater flexibility in controlling our sidebar's `isCollapsed` state without having to use a component reference.
>
> However, if you're building a UI library that's meant to interact with multiple applications, sometimes having this state lowered can allow you to reduce boilerplate between apps that share this component.
