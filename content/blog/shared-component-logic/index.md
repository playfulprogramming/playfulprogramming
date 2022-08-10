---
{
    title: "Shared Component Logic",
    description: "",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 13,
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



// TODO: Write

## Angular

// TODO: Write

Class properties and DI



While we mentioned that we won't be sharing data between mutliple components, Angular's services **do** share logic by default.



## Vue

`ref`, `reactive`

// TODO: Write

<!-- tabs:end -->



# Sharing Lifecycle Methods



<!-- tabs:start -->

## React

// TODO: Write

`useEffect` inside of `useX`

## Angular

While Angular can _technically_ do this, it's messy, fragile, and overall considered a malpractice.

This is one of Angular's greatest weaknesses when it comes to Angular's code reuse stories.

## Vue

// TODO: Write

`onMounted` inside of `useX`

<!-- tabs:end -->





# Composing Custom Logic

Here's where these abilities get really powerful: Not only can you call your custom logic from components, but you can call them from other custom logic compossible.

<!-- tabs:start -->

## React

// TODO: Write

`useX` in other `useX`

## Angular

// TODO: Write

DI in services from other services

## Vue

// TODO: Write

Compositions in compositions

<!-- tabs:end -->



# Refactoring Our Code to use Composable Logic

Take code from `component-reference` and refactor to use custom hooks/services/etc.



<!-- tabs:start -->

## React

```jsx
import React from 'react';

const useOutsideClick = ({ ref, onClose }) => {
  React.useEffect(() => {
    const closeIfOutsideOfContext = (e) => {
      const isClickInside = ref.current.contains(e.target);
      if (isClickInside) return;
      onClose();
    };
    document.addEventListener('click', closeIfOutsideOfContext);
    return () => document.removeEventListener('click', closeIfOutsideOfContext);
  }, [onClose]);
};

const ContextMenu = React.forwardRef(({ x, y, onClose }, ref) => {
  const divRef = React.useRef();

  React.useImperativeHandle(ref, () => ({
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

  return { ref, bounds };
};

export default function App() {
  const { ref, bounds } = useBounds();

  // An addEventListener is easier to tackle when inside of the conditional render
  // Add that as an exploration for `useImperativeHandle`
  const [isOpen, setIsOpen] = React.useState(false);

  function onContextMenu(e) {
    e.preventDefault();
    setIsOpen(true);
  }

  const contextMenuRef = React.useRef();

  React.useEffect(() => {
    if (isOpen && contextMenuRef.current) {
      contextMenuRef.current.focus();
    }
  }, [isOpen]);

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
}
```

## Angular

```typescript
@Injectable()
class CloseIfOutSideContext {
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

  cleanup() {
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
export class ContextMenuComponent implements AfterViewInit, OnDestroy {
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

  ngOnDestroy() {
    this.closeIfOutsideContext.cleanup();
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



<!-- tabs:end -->