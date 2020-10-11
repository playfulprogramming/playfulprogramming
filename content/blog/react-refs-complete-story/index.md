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

# What is a React Ref?

- Two distinct things
	- A "useRef" hook for mutable data properties
		- Can be only used in functional components
		- Does the same thing as "class instance variables" in class components
	- A method of referencing DOM Elements
		- Handled with "useRef" hook in functional components
		- Use "React.createRef" for class components



# Mutable Data Storage

- Exposed by "useRef" hook
- Utilizes "current" property to store data
- Utilizes "pass-by-reference"

```jsx
const ref = React.useRef();

ref.current = "Hello!";
```

```typescript
// React.d.ts

interface MutableRefObject {
	current: any;
}

function useRef(): MutableRefObject;
```

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

- Don't cause re-renders on data change


https://github.com/facebook/react/issues/14387#issuecomment-493676850 (screenshot this comment)



- Useful for non-rendered data
	- EG: Timers, animations

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


https://stackblitz.com/edit/react-use-ref-mutable-data

# Visual Timer with Refs

- Use timer to set state
- Assign timer to ref
- Render the timer value

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

https://stackblitz.com/edit/react-use-ref-mutable-buggy-code

- Closures can get stale
- Solved by "passing by reference"*

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

https://stackblitz.com/edit/react-use-ref-mutable-fixed-code

> * I would not solve it this way in production. `useState` accepts a callback which...

# DOM Element References

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

# Component References

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