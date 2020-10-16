---
{
	title: "React Refs: The Complete Story",
	description: "",
	published: '2020-10-24T05:12:03.284Z',
	authors: ['crutchcorn'],
	tags: ['react', 'javascript'],
	attached: [],
	license: 'cc-by-nc-sa-4'
}
---

Programming terminology can be rather confusing. The first time I'd heard about "React Refs", it was in the context of [getting a reference to a DOM node](#dom-ref). However, with the introduction of hooks, the `useRef` hook has expanded the definition of "refs".

Today, we'll be walking through two definitions of refs:

- A [mutable data property](#use-ref-mutate) to persist data across renders

- A [reference to DOM elements](#dom-ref)

We'll also be exploring additional functionality to each of those two defintions, such as [component refs](#forward-ref), [adding more properties to a ref](#use-imperative-handle), and even exploring [common code gotchas associated with using `useRef`](#refs-in-use-effect). 

> As most of this content relies on the `useRef` hook, we'll be using functional components for all of our examples. However, there are APIs such as [`React.createRef`](https://reactjs.org/docs/refs-and-the-dom.html#creating-refs) and [class instance variables](https://www.seanmcp.com/articles/storing-data-in-state-vs-class-variable/) that can be used to recreate `React.useRef` functionality with classes.

# Mutable Data Storage {#use-ref-mutate}

While `useState` is the most commonly known hook for data storage, it's not the only one on the block. React's `useRef`  hook functions differently from `useState`, but they're both used for persisting data across renders.

```jsx
const ref = React.useRef();

ref.current = "Hello!";
```

In this example, `ref.current` will contain `"Hello!"` after the intial render. The returned value from `useRef` is an object that contains a single key: `current`.

If you were to run the following code:

```jsx
const ref = React.useRef();

console.log(ref)
```

You'd find a `{current: undefined}` printed to the console. This is the shape of all React Refs. If you look at the TypeScript definition for the hooks, you'll see something like this:

```typescript
// React.d.ts

interface MutableRefObject {
	current: any;
}

function useRef(): MutableRefObject;
```

Why does `useRef` rely on storing data inside of a `current` property? It's so that you can utilize JavaScript's "pass-by-reference" functionality in order to avoid renders.

Now, you might think that the `useRef` hook is implemented something like the following:

```jsx
// This is NOT how it's implemented
function useRef(initial) {
  const [value, setValue] = useState(initial);
  const [ref, setRef] = useState({ current: initial });

  useEffect(() => {
    setRef({
      get current() {
        return value;
      },

      set current(next) {
        setValue(next);
      }
    });
  }, [value]);
  
  return ref;
}
```

However, that's not the case. [To quote Dan Apromov](https://github.com/facebook/react/issues/14387#issuecomment-493676850):

> ... `useRef` works more like this:
>
> ```jsx
> function useRef(initialValue) {
>   const [ref, ignored] = useState({ current: initialValue })
>   return ref
> }
> ```



Because of this implementation, when you mutate the `current` value it will not cause a re-render. 

Thanks to the lack of rendering on data storage, it's particularly useful for storing data that you need to keep a reference to, but don't need to render on-screen. One such example of this would be a timer:

```jsx
  const dataRef = React.useRef();

  const clearTimer = () => {
    clearInterval(dataRef.current);
  };

  React.useEffect(() => {
    dataRef.current = setInterval(() => {
      console.log("I am here still");
    }, 500);

    return () => clearTimer();
  }, [dataRef]);
```

<iframe src="https://stackblitz.com/edit/react-use-ref-mutable-data?ctl=1&embed=1" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

# Visual Timer with Refs {#visual-timers}

While there are usages for timers without rendered values, what were to happen if we made the timer render a value in state?

Let's take the example from before, but inside of the `setInterval`, we update a `useState` that contains a number to add one to it's state.

```jsx
 const dataRef = React.useRef();

  const [timerVal, setTimerVal] = React.useState(0);

  const clearTimer = () => {
    clearInterval(dataRef.current);
  }

  React.useEffect(() => {
    dataRef.current = setInterval(() => {
      setTimerVal(timerVal + 1);
    }, 500)

    return () => clearInterval(dataRef.current);
  }, [dataRef])

  return (
      <p>{timerVal}</p>
  );
```

Now, we'd expect to see the timer update from `1` to `2` (and beyond) as the timer continues to render. However, if we look at the app while it runs, we'll see some behavior we might not expect:

<iframe src="https://stackblitz.com/edit/react-use-ref-mutable-buggy-code?ctl=1&embed=1" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

This is because [the closure](https://whatthefuck.is/closure) that's passed to the `setInterval` has grown stale. This is a common problem when using React Hooks. While there's a simple solution hidden in `useState`'s API, let's solve this problem using mutations and `useRef`. 

Because `useRef` relies on passing by reference and mutating that reference, if we simply introduce a second `useRef` and mutate it on every render to match the `useState` value, we can work around the limitations with the stale closure.

```jsx
  const dataRef = React.useRef();

  const [timerVal, setTimerVal] = React.useState(0);
  const timerBackup = React.useRef();
  timerBackup.current = timerVal;

  const clearTimer = () => {
    clearInterval(dataRef.current);
  };

  React.useEffect(() => {
    dataRef.current = setInterval(() => {
      setTimerVal(timerBackup.current + 1);
    }, 500);

    return () => clearInterval(dataRef.current);
  }, [dataRef]);
```

<iframe src="https://stackblitz.com/edit/react-use-ref-mutable-fixed-code?ctl=1&embed=1" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

> * I would not solve it this way in production. `useState` accepts a callback which you can use as an alternative (much more recommended) route:
>
> ```jsx
>   const dataRef = React.useRef();
> 
>   const [timerVal, setTimerVal] = React.useState(0);
> 
>   const clearTimer = () => {
>     clearInterval(dataRef.current);
>   };
> 
>   React.useEffect(() => {
>     dataRef.current = setInterval(() => {
>       setTimerVal(tVal => tVal + 1);
>     }, 500);
> 
>     return () => clearInterval(dataRef.current);
>   }, [dataRef]);
> ```
> We're simply using a `useRef` to outline one of the important properties about refs: mutation.

# DOM Element References {#dom-ref}

- Stored using "ref" attribute
- HTMLDivElement stored in "current"

```jsx
  const elRef = React.useRef();

  React.useEffect(() => {
    console.log(elRef);
  }, [elRef]);

  return (
    <div ref={elRef}/>
  )
```

https://stackblitz.com/edit/react-use-ref-effect

- Full "Element.prototype" JS API available
	- Can be used to style the element

```jsx
  const elRef = React.useRef();

  React.useEffect(() => {
    elRef.current.style.background = 'lightblue';
  }, [elRef]);

  return (
    <div ref={elRef}/>
  )
```

https://stackblitz.com/edit/react-use-ref-effect-style

Ref attribute accepts functional API

```jsx
  const elRef = React.useRef();

  React.useEffect(() => {
    elRef.current.style.background = 'lightblue';
  }, [elRef]);

  return (
    <div ref={ref => elRef.current = ref}/>
  )
```

https://stackblitz.com/edit/react-use-ref-effect-style-callback

# Component References {#forward-ref}

- Can pass "ref" to components
- Property must not be called "ref"*

```jsx
const Container = ({children, divRef}) => {
  return <div ref={divRef}/>
}

const App = () => {
  const elRef = React.useRef();

  React.useEffect(() => {
    console.log(elRef);
   elRef.current.style.background = 'lightblue';
  }, [elRef])

  return (
    <Container divRef={elRef}/>
  );
```

https://stackblitz.com/edit/react-use-ref-effect-style-forward-ref-wrong-kinda

However, what happens if we try to switch to use the "ref" property name?
> This code does not function

```jsx
const Container = ({children, ref}) => {
  return <div ref={ref}/>
}

const App = () => {
  const elRef = React.useRef();

  React.useEffect(() => {
    console.log(elRef);
    // The following line will throw an error:
    // "Cannot read property 'style' of undefined"
   elRef.current.style.background = 'lightblue';
  }, [elRef])

  return (
    <Container ref={elRef}/>
  );
```

https://stackblitz.com/edit/react-use-ref-effect-style-forward-ref-wrong


- *Can get it to use the "ref" property
- Must use "forwardRef" API
- Props can still be accessed using the first property

```jsx
const Container = React.forwardRef(({children}, ref) => {
  return <div ref={ref}/>
})

const App = () => {
  const elRef = React.useRef();

  React.useEffect(() => {
    console.log(elRef);
   elRef.current.style.background = 'lightblue';
  }, [elRef])

  return (
    <Container ref={elRef}/>
  );
```

https://stackblitz.com/edit/react-use-ref-effect-style-forward-ref



# Add Data to Ref {#use-imperative-handle}

```jsx
import React from "react";
import "./style.css";

const Container = React.forwardRef(({children}, ref) => {
  return <div ref={ref} tabIndex="1">
    {children}
  </div>
})

export default function App() {
  const elRef = React.useRef();

  React.useEffect(() => {
    elRef.current.focus();
  }, [elRef])

  return (
    <Container ref={elRef}>
      <h1>Hello StackBlitz!</h1>
      <p>Start editing to see some magic happen :)</p>
    </Container>
  );
}
```

https://stackblitz.com/edit/react-use-imperative-handle-demo-pre


- useImperativeHandle hook allows properties to be added to ref
- Can be used in combination with forwardRef
- Only properties returned in second param are set to ref

```jsx
import React from "react";
import "./style.css";

const Container = React.forwardRef(({children}, ref) => {
  const divRef = React.useRef();

  React.useImperativeHandle(ref, () => ({
    focus: () => {
      divRef.current.focus();
      console.log("I have now focused");
    }
  }))

  return <div ref={divRef} tabIndex="1">
    {children}
  </div>
})

export default function App() {
  const elRef = React.useRef();

  React.useEffect(() => {
    elRef.current.focus();
  }, [elRef])

  return (
    <Container ref={elRef}>
      <h1>Hello StackBlitz!</h1>
      <p>Start editing to see some magic happen :)</p>
    </Container>
  );
}
```

https://stackblitz.com/edit/react-use-imperative-handle-demo-post

> Be cautious about using this in production. It breaks unidirectional data binding

```jsx
  React.useEffect(() => {
    elRef.current.konami();
  }, [elRef])
```

https://stackblitz.com/edit/react-use-imperative-handle-demo-useful

# React Refs in `useEffect ` {#refs-in-use-effect}

- `useEffect` only does the array check on re-render
- Ref's current property set doesn't trigger a re-render

```jsx
export default function App() {
  const elRef = React.useRef();

  React.useEffect(() => {
    elRef.current.style.background = "lightblue";
  }, [elRef]);

  return (
    <div ref={elRef}>
      <h1>Hello StackBlitz!</h1>
      <p>Start editing to see some magic happen :)</p>
    </div>
  );
}
```

https://stackblitz.com/edit/react-use-ref-effect-style

However, what happens when you make the `div` render happen _after_ the initial render. What do you think will happen here?

```jsx
export default function App() {
  const elRef = React.useRef();
  const [shouldRender, setRender] = React.useState(false);

  React.useEffect(() => {
    if (!elRef.current) return;
    elRef.current.style.background = 'lightblue';
  }, [elRef.current])

  React.useEffect(() => {
    setTimeout(() => {
      setRender(true);
    }, 100);
  }, []);

  return !shouldRender ? null : ( 
    <div ref={elRef}>
      <h1>Hello StackBlitz!</h1>
      <p>Start editing to see some magic happen :)</p>
    </div>
  );
}
```

https://stackblitz.com/edit/react-use-ref-effect-bug-effect

```jsx
  const [minus, setMinus] = React.useState(0);
  const ref = React.useRef(0);

  const addState = () => {
    setMinus(minus + 1);
  };

  const addRef = () => {
    ref.current = ref.current + 1;
  };

  React.useEffect(() => {
    console.log(`ref.current:`, ref.current);
  }, [ref.current]);

  React.useEffect(() => {
    console.log(`minus:`, minus);
  }, [minus]);
```

https://stackblitz.com/edit/react-use-ref-not-updating



Here are some comments from Dan Apromov, of the React Core team:

https://github.com/facebook/react/issues/14387#issuecomment-503616820

https://twitter.com/dan_abramov/status/1093497348913803265

https://github.com/facebook/react/issues/14387#issuecomment-493677168



But what does Dan mean by "callback ref"?

# Callback Refs {#callback-refs}

- Remember, "ref" property accepts a function to access the node
- Because it's not using "useEffect", code can execute in proper timing

```jsx
  const elRefCB = React.useCallback(node => {
    if (node !== null) {
      node.style.background = "lightblue";
    }
  }, []);

  return !shouldRender ? null : (
    <div ref={elRefCB}>
      <h1>Hello StackBlitz!</h1>
      <p>Start editing to see some magic happen :)</p>
    </div>
  );
```

https://stackblitz.com/edit/react-use-ref-callback-styling

- Can still keep a traditional "useRef" reference

```jsx
  const elRef = React.useRef();

  console.log("I am rendering");

  const elRefCB = React.useCallback(node => {
    if (node !== null) {
      node.style.background = "lightblue";
      elRef.current = node;
    }
  }, []);

  React.useEffect(() => {
    console.log(elRef.current);
  }, [elRef, shouldRender]);
```

https://stackblitz.com/edit/react-use-ref-callback-and-effect

# `useState` Refs {#usestate-refs}

- Combining useState and Callback Refs
- Will trigger a re-render
- Works in useEffect

```jsx
  const [elRef, setElRef] = React.useState();

  console.log('I am rendering');

  const elRefCB = React.useCallback(node => {
    if (node !== null) {
      setElRef(node);
    }
  }, []);

  React.useEffect(() => {
    console.log(elRef);
  }, [elRef])
```

https://stackblitz.com/edit/react-use-ref-callback-and-use-state

- Can be used to impact reference using useEffect instead of inside of callback

```jsx
 const [elNode, setElNode] = React.useState();

  const elRefCB = React.useCallback(node => {
    if (node !== null) {
      setElNode(node);
    }
  }, []);

  React.useEffect(() => {
    if (!elNode) return;
    elNode.style.background = 'lightblue';
  }, [elNode])
```

https://stackblitz.com/edit/react-use-ref-callback-and-state-effect

# Conclusion