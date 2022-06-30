---
{
    title: "Component Reference",
    description: "While you usually want to pass data to child components, sometimes you need to access arbitrary data from the child without needing to explicitly pass the data.",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 11,
    series: "The Framework Field Guide"
}
---



In our previous chapter, we were able to use element reference to gain access to underlying DOM node APIs. Using this, we were able to hook into the `getBoundingClientRect` method in order to get the positional data from another element for a home-grown context menu.

While the context menu we wrote worked, it lacked a key feature: The ability to close itself when a user clicks outside of the context menu.

Let's add this functionality into our context menu component:

<!-- tabs:start -->

# React

```jsx {31-40,51}
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

  function onContextMenu(e) {
    e.preventDefault();
    setIsOpen(true);
  }

  const [contextMenu, setContextMenu] = React.useState<HTMLElement>();

  React.useEffect(() => {
    if (contextMenu) {
      contextMenu.focus();
    }
  }, [contextMenu]);
    
  React.useEffect(() => {
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
    <React.Fragment>
      <div style={{ marginTop: '5rem', marginLeft: '5rem' }}>
        <div ref={ref} onContextMenu={onContextMenu}>
          Right click on me!
        </div>
      </div>
      {isOpen && (
        <div
          ref={(el) => setContextMenu(el)}
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

# Angular

```typescript {45-51}
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

  resizeListener = () => {
    this.bounds = this.contextOrigin.nativeElement.getBoundingClientRect();
  };

  closeIfOutsideOfContext = (e: MouseEvent) => {
    const contextMenuEl = this?.contextMenu?.first?.nativeElement;
    if (!contextMenuEl) return;
    const isClickInside = contextMenuEl.contains(e.target as HTMLElement);
    if (isClickInside) return;
    this.isOpen = false;
  };

  ngAfterViewInit() {
    this.bounds = this.contextOrigin.nativeElement.getBoundingClientRect();

    window.addEventListener('resize', this.resizeListener);

    document.addEventListener('click', this.closeIfOutsideOfContext);

    this.contextMenu.changes.forEach(() => {
      const isLoaded = this?.contextMenu?.first?.nativeElement;
      if (!isLoaded) return;
      this.contextMenu.first.nativeElement.focus();
    });
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeListener);
    document.removeEventListener('click', this.closeIfOutsideOfContext);
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



# Vue

```javascript
const App = {
  template: `
  <div :style="{ marginTop: '5rem', marginLeft: '5rem' }">
    <div ref="contextOrigin" @contextmenu="open($event)">
      Right click on me!
    </div>
  </div>
  <div
    v-if="isOpen"
    :ref="el => focusOnOpen(el)"
    tabIndex="0"
    :style="{
      position: 'fixed',
      top: bounds.y + 20,
      left: bounds.x + 20,
      background: 'white',
      border: '1px solid black',
      borderRadius: 16,
      padding: '1rem'
    }"
  >
    <button @click="close()">X</button>
    This is a context menu
  </div>
`,
  data() {
    return {
      isOpen: false,
      bounds: {
        height: 0,
        width: 0,
        x: 0,
        y: 0,
      },
      contextMenuRef: null,
      resizeListenerBound: this.resizeListener.bind(this),
      closeIfOutsideOfContext: this.closeIfOutside.bind(this),
    };
  },
  mounted() {
    this.resizeListenerBound();

    window.addEventListener('resize', this.resizeListenerBound);
    document.addEventListener('click', this.closeIfOutsideOfContext);
  },
  unmounted() {
    window.removeEventListener('resize', this.resizeListenerBound);
    document.removeEventListener('click', this.closeIfOutsideOfContext);
  },
  methods: {
    resizeListener() {
      if (!this.$refs.contextOrigin) return;
      this.bounds = this.$refs.contextOrigin.getBoundingClientRect();
    },
    closeIfOutside(e) {
      const contextMenuEl = this.contextMenuRef;
      if (!contextMenuEl) return;
      const isClickInside = contextMenuEl.contains(e.target);
      if (isClickInside) return;
      this.isOpen = false;
    },
    close() {
      this.isOpen = false;
    },
    open(e) {
      e.preventDefault();
      this.isOpen = true;
    },
    focusOnOpen(el) {
      this.contextMenuRef = el;
      if (!el) return;
      el.focus();
    },
  },
};
```



<!-- tabs:end -->



This code is _functional_, but this code is getting a bit out of hand, let's move our context menu code into it's own component.

<!-- tabs:start -->

# React

```jsx {0-12}
const ContextMenu = ({ x, y, onClose }) => {
  const [contextMenu, setContextMenu] = React.useState<HTMLElement>();

  React.useEffect(() => {
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

  // An addEventListener is easier to tackle when inside of the conditional render
  // Add that as an exploration for `useImperativeHandle`
  const [isOpen, setIsOpen] = React.useState(false);

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
        <ContextMenu
          x={bounds.x}
          y={bounds.y}
          onClose={() => setIsOpen(false)}
        />
      )}
    </React.Fragment>
  );
}
```

# Angular

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

# Vue

```javascript
const ContextMenu = {
  template: `
  <div
    tabIndex="0"
    ref="contextMenuRef"
    :style="{
      position: 'fixed',
      top: y + 20,
      left: x + 20,
      background: 'white',
      border: '1px solid black',
      borderRadius: 16,
      padding: '1rem'
    }"
  >
    <button @click="$emit('close')">X</button>
    This is a context menu
  </div>
  `,
  props: ['x', 'y'],
  emits: ['close'],
  data() {
    return {
      closeIfOutsideOfContext: this.closeIfOutside.bind(this),
    };
  },
  mounted() {
    document.addEventListener('click', this.closeIfOutsideOfContext);
  },
  unmounted() {
    document.removeEventListener('click', this.closeIfOutsideOfContext);
  },
  methods: {
    closeIfOutside(e) {
      const contextMenuEl = this.$refs.contextMenuRef;
      if (!contextMenuEl) return;
      const isClickInside = contextMenuEl.contains(e.target);
      if (isClickInside) return;
      this.$emit('close');
    },
  },
};

const App = {
  template: `
  <div :style="{ marginTop: '5rem', marginLeft: '5rem' }">
    <div ref="contextOrigin" @contextmenu="open($event)">
      Right click on me!
    </div>
  </div>
  <context-menu v-if="isOpen" :x="bounds.x" :y="bounds.y" @close="close()"></context-menu>
`,
  components: {
    ContextMenu,
  },
  data() {
    return {
      isOpen: false,
      bounds: {
        height: 0,
        width: 0,
        x: 0,
        y: 0,
      },
      resizeListenerBound: this.resizeListener.bind(this),
    };
  },
  mounted() {
    this.resizeListenerBound();

    window.addEventListener('resize', this.resizeListenerBound);
  },
  unmounted() {
    window.removeEventListener('resize', this.resizeListenerBound);
  },
  methods: {
    resizeListener() {
      if (!this.$refs.contextOrigin) return;
      this.bounds = this.$refs.contextOrigin.getBoundingClientRect();
    },
    close() {
      this.isOpen = false;
    },
    open(e) {
      e.preventDefault();
      this.isOpen = true;
    },
  },
};
```

<!-- tabs:end -->







--------------






But now a new problem has arose - how do we `focus` the context menu from `App` when we aren't able to pass a `ref` directly to the child `div`?



# Introducing Element Reference 

<!-- tabs:start -->

## React

```jsx {0-7,22,62,81}
const ContextMenu = React.forwardRef(({ x, y, onClose }, ref) => {
  const divRef = React.useRef();

  React.useImperativeHandle(ref, () => ({
    focus: () => divRef.current && divRef.current.focus(),
  }));

  const [contextMenu, setContextMenu] = React.useState<HTMLElement>();

  React.useEffect(() => {
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

```javascript
const ContextMenu = {
  template: `
  <div
    tabIndex="0"
    ref="contextMenuRef"
    :style="{
      position: 'fixed',
      top: y + 20,
      left: x + 20,
      background: 'white',
      border: '1px solid black',
      borderRadius: 16,
      padding: '1rem'
    }"
  >
    <button @click="$emit('close')">X</button>
    This is a context menu
  </div>
  `,
  props: ['x', 'y'],
  emits: ['close'],
  data() {
    return {
      closeIfOutsideOfContext: this.closeIfOutside.bind(this),
    };
  },
  mounted() {
    document.addEventListener('click', this.closeIfOutsideOfContext);
  },
  unmounted() {
    document.removeEventListener('click', this.closeIfOutsideOfContext);
  },
  methods: {
    focusMenu() {
      this.$refs.contextMenuRef.focus();
    },
    closeIfOutside(e) {
      const contextMenuEl = this.$refs.contextMenuRef;
      if (!contextMenuEl) return;
      const isClickInside = contextMenuEl.contains(e.target);
      if (isClickInside) return;
      this.$emit('close');
    },
  },
};

const App = {
  template: `
  <div :style="{ marginTop: '5rem', marginLeft: '5rem' }">
    <div ref="contextOrigin" @contextmenu="open($event)">
      Right click on me!
    </div>
  </div>
  <context-menu ref="contextMenu" v-if="isOpen" :x="bounds.x" :y="bounds.y" @close="close()"></context-menu>
`,
  components: {
    ContextMenu,
  },
  data() {
    return {
      isOpen: false,
      bounds: {
        height: 0,
        width: 0,
        x: 0,
        y: 0,
      },
      resizeListenerBound: this.resizeListener.bind(this),
    };
  },
  mounted() {
    this.resizeListenerBound();

    window.addEventListener('resize', this.resizeListenerBound);
  },
  unmounted() {
    window.removeEventListener('resize', this.resizeListenerBound);
  },
  methods: {
    resizeListener() {
      if (!this.$refs.contextOrigin) return;
      this.bounds = this.$refs.contextOrigin.getBoundingClientRect();
    },
    close() {
      this.isOpen = false;
    },
    open(e) {
      e.preventDefault();
      this.isOpen = true;
      setTimeout(() => {
        this.$refs.contextMenu.focusMenu();
      }, 0);
    },
  },
};
```




<!-- tabs:end -->














































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

  const onMouseMove = React.useMemo(
    () =>
      debounce((e) => {
        if (!elRef.current) return;
        const boundingBox = elRef.current.getBoundingClientRect();
        const relativeX = e.clientX - boundingBox.x;
        moveX(relativeX);
      }, 1),
    [elRef]
  );

  const onMouseUp = React.useCallback(() => {
    document.removeEventListener('mousemove', onMouseMove);
  }, [onMouseMove]);

  React.useEffect(() => {
    return () => document.removeEventListener('mousemove', onMouseMove);
  }, [onMouseMove]);

  React.useEffect(() => {
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
