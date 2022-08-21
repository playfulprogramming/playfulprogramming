---
{
	title: "React Refs: The Complete Story",
	description: "React Refs are an immensely powerful, yet often misunderstood API. Let's learn what they're capable of, and how they're usually misused.",
	published: '2020-12-01T05:12:03.284Z',
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

We'll also be exploring additional functionality to each of those two definitions, such as [component refs](#forward-ref), [adding more properties to a ref](#use-imperative-handle), and even exploring [common code gotchas associated with using `useRef`](#refs-in-use-effect).

> As most of this content relies on the `useRef` hook, we'll be using functional components for all of our examples. However, there are APIs such as [`React.createRef`](https://reactjs.org/docs/refs-and-the-dom.html#creating-refs) and [class instance variables](https://www.seanmcp.com/articles/storing-data-in-state-vs-class-variable/) that can be used to recreate `React.useRef` functionality with classes.

# Mutable Data Storage {#use-ref-mutate}

While `useState` is the most commonly known hook for data storage, it's not the only one on the block. React's `useRef`  hook functions differently from `useState`, but they're both used for persisting data across renders.

```jsx
const ref = React.useRef();

ref.current = "Hello!";
```

In this example, `ref.current` will contain `"Hello!"` after the initial render. The returned value from `useRef` is an object that contains a single key: `current`.

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

However, that's not the case. [To quote Dan Abramov](https://github.com/facebook/react/issues/14387#issuecomment-493676850):

> ... `useRef` works more like this:
>
> ```jsx
> function useRef(initialValue) {
>   const [ref, ignored] = useState({ current: initialValue })
>   return ref
> }
> ```

Because of this implementation, when you mutate the `current` value, it will not cause a re-render.

Thanks to the lack of rendering on data storage, it's particularly useful for storing data that you need to keep a reference to but don't need to render on-screen. One such example of this would be a timer:

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

<iframe src="https://stackblitz.com/edit/react-use-ref-mutable-data?ctl=1&embed=1" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

# Visual Timer with Refs {#visual-timers}

While there are usages for timers without rendered values, what would happen if we made the timer render a value in state?

Let's take the example from before, but inside of the `setInterval`, we update a `useState` that contains a number to add one to its state.

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

<iframe src="https://stackblitz.com/edit/react-use-ref-mutable-buggy-code?ctl=1&embed=1" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

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

<iframe src="https://stackblitz.com/edit/react-use-ref-mutable-fixed-code?ctl=1&embed=1" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

> - I would not solve it this way in production. `useState` accepts a callback which you can use as an alternative (much more recommended) route:
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
>
> We're simply using a `useRef` to outline one of the important properties about refs: mutation.

# DOM Element References {#dom-ref}

At the start of this article, I mentioned that `ref`s are not just a mutable data storage method but a way to reference DOM nodes from inside of React. The easiest of the methods to track a DOM node is by storing it in a `useRef` hook using any element's `ref` property:

```jsx
  const elRef = React.useRef();

  React.useEffect(() => {
    console.log(elRef);
  }, [elRef]);

  return (
    <div ref={elRef}/>
  )
```

> Keep in mind, the `ref` attribute is added and handled by React on any HTML Element. This example uses a `div`, but this applies to `span`s and `header`s and beyond, "oh my".

In this example, if we took a look at the `console.log` in the `useEffect`, we'd find [an `HTMLDivElement` instance](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDivElement) in the `current` property. Open the following StackBlitz and look at the console value to confirm:

<iframe src="https://stackblitz.com/edit/react-use-ref-effect?ctl=1&embed=1" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Because `elRef.current` is now a `HTMLDivElement`, it means we now have access to [the entire `Element.prototype` JavaScript API](https://developer.mozilla.org/en-US/docs/Web/API/Element#Properties). As such, this `elRef` can be used to style the underlying HTML node:

```jsx
  const elRef = React.useRef();

  React.useEffect(() => {
    elRef.current.style.background = 'lightblue';
  }, [elRef]);

  return (
    <div ref={elRef}/>
  )
```

<iframe src="https://stackblitz.com/edit/react-use-ref-effect-style?ctl=1&embed=1" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Alternative Syntax {#ref-function}

It's worth noting that the `ref` attribute also accepts a function. While [we'll touch on the implications of this more in the future](#callback-refs), just note that this code example does exactly the same thing as `ref={elRef}`:

```jsx
  const elRef = React.useRef();

  React.useEffect(() => {
    elRef.current.style.background = 'lightblue';
  }, [elRef]);

  return (
    <div ref={ref => elRef.current = ref}/>
  )
```

# Component References {#forward-ref}

HTML elements are a great use-case for `ref`s. However, there are many instances where you need a ref for an element that's part of a child's render process. How are we able to pass a ref from a parent component to a child component?

By passing a property from the parent to the child, you can pass a ref to a child component. Take an example like this:

```jsx
const Container = ({children, divRef}) => {
  return <div ref={divRef}/>
}

const App = () => {
  const elRef = React.useRef();

  React.useEffect(() => {
    if (!elRef.current) return;
   elRef.current.style.background = 'lightblue';
  }, [elRef])

  return (
    <Container divRef={elRef}/>
  );
```

<iframe src="https://stackblitz.com/edit/react-use-ref-effect-style-forward-ref-wrong-kinda?ctl=1&embed=1" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

You might be wondering why I didn't call that property `ref` instead of `divRef`. This is because of a limitation with React. If we try to switch the property's name to `ref`, we find ourselves with some unintended consequences.

```jsx
// This code does not function as intended
const Container = ({children, ref}) => {
  return <div ref={ref}/>
}

const App = () => {
  const elRef = React.useRef();

  React.useEffect(() => {
    if (!elRef.current) return;
    // If the early return was not present, this line would throw an error:
    // "Cannot read property 'style' of undefined"
   elRef.current.style.background = 'lightblue';
  }, [elRef])

  return (
    <Container ref={elRef}/>
  );
```

<iframe src="https://stackblitz.com/edit/react-use-ref-effect-style-forward-ref-wrong?ctl=1&embed=1" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

You'll notice that the `Container` `div` is not styled to have a `lightblue` background. This is because `elRef.current` is never set to contain the `HTMLElement` ref. As such, for simple ref forwarding, you cannot use the `ref` property name.

How do you get the `ref` property name to work as expected with functional components?

You can use the `ref` property name to forward refs by using the `forwardRef` API. When defining a functional component, instead of simply being an arrow function like you would otherwise, you assign the component to a `forwardRef` with the arrow function as it's first property. From there, you can access `ref` from the second property of the inner arrow function.

```jsx
const Container = React.forwardRef((props, ref) => {
  return <div ref={ref}>{props.children}</div>
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

Now that we are using `forwardRef`, we can use the `ref` property name on the parent component to get access to the `elRef` once again.

<iframe src="https://stackblitz.com/edit/react-use-ref-effect-style-forward-ref?ctl=1&embed=1" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

# Class Component References {#class-ref}

While I mentioned that we'll be using functional components and hooks for a majority of this article, I think it's important that I cover how class components handle the `ref` property. Take the following class component:

```jsx
class Container extends React.Component {
  render() {
    return <div>{this.props.children}</div>;
  }
}
```

What do you think will happen if we try to pass a `ref` attribute?

```jsx
const App = () => {
  const compRef = React.useRef();

  React.useEffect(() => {
    console.log(compRef.current);
  });

  return (
    <Container ref={container}>
      <h1>Hello StackBlitz!</h1>
      <p>Start editing to see some magic happen :)</p>
    </Container>
  );
}
```

> If you'd rather, you can also write `App` as a class component:
>
> ```jsx
> class App extends React.Component {
>   compRef = React.createRef();
>
>   componentDidMount() {
>     console.log(this.compRef.current);
>   }
>
>   render() {
>     return (
>       <Container ref={this.compRef}>
>         <h1>Hello StackBlitz!</h1>
>         <p>Start editing to see some magic happen :)</p>
>       </Container>
>     );
>   }
> }
> ```

<iframe src="https://stackblitz.com/edit/react-class-ref-instance?ctl=1&embed=1" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

If you look at the `console.log` statement, you'll notice that it prints something like this:

```
Container {props: {…}, context: {…}, refs: {…}, updater: {…}…}
context: Object
props: Object
refs: Object
state: null
updater: Object
_reactInternalInstance: Object
_reactInternals: FiberNode
__proto__: Container
```

You'll notice that it prints out the value of a `Container` instance. In fact, if we run the following code, we can confirm that the `ref.current` value is an instance of the `Container` class:

```jsx
console.log(container.current instanceof Container); // true
```

However, what _is_ this class? Where are those props coming from? Well, if you're familiar with [class inheritance](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance), it's the properties coming from `React.Component` that's being extended. If we take a look at the [TypeScript definition for the `React.Component` class](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts#L436), we can see some pretty familiar properties in that class:

```jsx
// This is an incomplete and inaccurate type definition shown for educational purposes - DO NOT USE IN PROD
class Component {
  render(): ReactNode;
  context: any;
  readonly props: Object;
  refs: any;
  state: Readonly<any>;
}
```

Not only do the `refs`, `state`, `props`, and `context` line up with what we're seeing in our `console.log`, but methods that are part of the class (like `render`) are present as well:

```jsx
console.log(this.container.current.render);
```

```
ƒ render()
```

## Custom Properties and Methods {#class-ref-methods-props}

Not only are React Component built-ins (like `render` and `props`) accessible from a class ref, but you can access data that you attach to that class as well. Because the `container.current` is an instance of the `Container` class, when you add custom properties and methods, they're visible from the ref!

So, if you change the class definition to look like this:

```jsx
class Container extends React.Component {
  welcomeMsg = "Hello"

  sayHello() {
    console.log("I am saying: ", this.welcomeMsg)
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}
```

You can then reference the `welcomeMsg` property and `sayHello` method:

```jsx
function App() {
  const container = React.useRef();

  React.useEffect(() => {
    console.log(container.current.welcomeMsg); // Hello
    container.current.sayHello(); // I am saying: Hello
  });

  return (
    <Container ref={container}>
      <h1>Hello StackBlitz!</h1>
      <p>Start editing to see some magic happen :)</p>
    </Container>
  );
}
```

<iframe src="https://stackblitz.com/edit/react-class-ref-instance-custom-props?ctl=1&embed=1" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

# Unidirectional Flow {#unidirectional-flow}

While the concept of "universal directional flow" is a broader subject than what I originally wanted to cover with this article, I think it's important to understand why you shouldn't utilize the pattern outlined above. One of the reasons refs are so useful is one of the reasons they're so dangerous as a concept: They break unidirectional data flow.

Typically, in a React app, you want your data to go one way at a time.

![A circle going from state, to view, to action, then back to state](./unidirectional_flow.svg)

Let's take a look at a code sample that follows this unidirectionality:

```jsx
import React from "react";

class SimpleForm extends React.Component {
  render() {
    return (
      <div>
        <label>
          <div>Username</div>
          <input
            onChange={e => this.props.onChange(e.target.value)}
            value={this.props.value}
          />
        </label>
        <button onClick={this.props.onDone}>Submit</button>
      </div>
    );
  }
}

export default function App() {
  const [inputTxt, setInputTxt] = React.useState("");
  const [displayTxt, setDisplayTxt] = React.useState("");

  const onDone = () => {
    setDisplayTxt(inputTxt);
  };

  return (
    <div>
      <SimpleForm
        onDone={onDone}
        onChange={v => setInputTxt(v)}
        value={inputTxt}
      />
      <p>{displayTxt}</p>
    </div>
  );
}
```

In this example, because both the `onChange` property and `value` property are being passed into the `SimpleForm` component, you're able to keep all of the relevant data in one place. You'll notice that none of the actual logic happens inside of the `SimpleForm` component itself. As such, this component is called a "dumb" component. It's utilized for styling and composability, but not for the logic itself.

This is what a proper React component _should_ look like. This pattern of raising state out of the component itself and leaving "dumb" component comes from the guidance of the React team itself. This pattern is called ["lifting state up"](https://reactjs.org/docs/lifting-state-up.html).

Now that we have a better understanding of the patterns to follow let's take a look at the wrong way to do things.

## Breaking from Suggested Patterns {#bidirectionality-example}

Doing the inverse of "lifting state," let's lower that state back into the `SimpleForm` component. Then, to access that data from `App`, we can use the `ref` property to access that data from the parent.

```jsx
import React from "react";

class SimpleForm extends React.Component {
  // State is now a part of the SimpleForm component
  state = {
    input: ""
  };

  onChange(e) {
    this.setState({
      input: e.target.value
    });
  }

  render() {
    return (
      <div>
        <label>
          <div>Username</div>
          <input onChange={this.onChange.bind(this)} value={this.state.input} />
        </label>
        <button onClick={this.props.onDone}>Submit</button>
      </div>
    );
  }
}

export default function App() {
  const simpleRef = React.useRef();
  const [displayTxt, setDisplayTxt] = React.useState("");

  const onDone = () => {
    // Reach into the Ref to access the state of the component instance
    setDisplayTxt(simpleRef.current.state.input);
  };

  return (
    <div>
      <SimpleForm 
        onDone={onDone} 
        ref={simpleRef} 
      />
      <p>{displayTxt}</p>
    </div>
  );
}
```

However, the problem is that when you look to start expanding, you'll find managing this dual-state behavior more difficult. Even following the application logic is more difficult. Let's start taking a look at what these two components' lifecycle look like visually.

First, let's start by taking a look at the `simpleRef` component, where the state is "lowered down" in the `SimpleForm` component:

![Arrows pointing back and forth from App and SimpleForm to demonstrate the data going both directions](./two_way_flow.svg)

In this example, the flow of the application state is as follows:

- `App` (and it's children, `SimpleForm`) render
- The user makes changes to the data as stored in `SimpleForm`
- The user triggers the `onDone` action, which triggers a function in `App`
- The `App` `onDone` method inspects the data from `SimpleForm`
- Once the data is returned to `App`, it changes it's own data, thus triggering a re-render of `App` and `SimpleForm` both

As you can see from the chart above and the outline of the data flow, you're keeping your data separated across two different locations. As such, the mental model to modify this code can get confusing and disjointed. This code sample gets even more complex when `onDone` is expected to change the state in `SimpleForm`.

Now, let's contrast that to the mental model needed to work with unidirectionality enforced.

![Arrows pointing in a single circular direction from App to SimpleForm to demonstrate data going one-way](./one_way_flow.svg)

- `App` (and it's children, `SimpleForm`) render
- The user makes changes in `SimpleForm`, the state is raised up to `App` through callbacks
- The user triggers the `onDone` action, which triggers a function in `App`
- The `App` `onDone` method already contains all of the data it needs in it's own component, so it simply re-renders `App` and `SimpleForm` without any additional logic overhead

As you can see, while the number of steps is similar between these methods (and may not be in a less trivial example), the unidirectional flow is much more streamlined and easier to follow.

This is why the React core team (and the community at large) highly suggests you use unidirectionality and rightfully shuns breaking away from that pattern when it's not required.

# Add Data to Ref {#use-imperative-handle}

If you've never heard of the `useImperativeHandle` hook before, this is why. It enables you to add methods and properties to a `ref` forwarded/passed into a component. By doing this, you're able to access data from the child directly within the parent, rather than forcing you to raise state up, which can break unidirectionality.

Let's look at a component that we could extend using `useImperativeHandle`:

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

<iframe src="https://stackblitz.com/edit/react-use-imperative-handle-demo-pre?ctl=1&embed=1" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

As you can witness from the embedded demo it will focus you on the `Container` `div` when the application renders. This example does not use the `useImperativeHandle` hook but instead relies on the timing of `useEffect` to have the `ref`'s `current` already defined.

Let's say that we wanted to keep track of every time the `Container` `div` was focused programmatically. How would you go about doing that? There are many options to enable that functionality, but one way that wouldn't require any modification of `App` (or other `Container` consumers) would be to utilize `useImperativeHandle`.

Not only does `useImperativeHandle` allow properties to be added to ref, but you can provide an alternative implementation of native APIs by returning a function of the same name.

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

<iframe src="https://stackblitz.com/edit/react-use-imperative-handle-demo-post?ctl=1&embed=1" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

> If you look in the console, you'll find the `console.log` has run when `focus()` ran!

As you can, `useImperativeHandle` can be used in combination with `forwardRef` to maximize the natural look-and-feel of the component's API.

However, be warned that if you look to supplement the native APIs with your own, only properties and methods returned in the second param are set to ref. That means that if you now run:

```jsx
  React.useEffect(() => {
    elRef.current.style.background = 'lightblue';
  }, [elRef])
```

In `App`, you will face an error, as `style` is not defined on `elRef.current` anymore.

That said, you're not limited to simply the names of native APIs. What do you think this code sample in a different `App` component might do?

```jsx
  React.useEffect(() => {
    elRef.current.konami();
  }, [elRef])
```

<iframe src="https://stackblitz.com/edit/react-use-imperative-handle-demo-useful?ctl=1&embed=1" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

> When your focus is set to the `Container` element, try typing in the ["Konami code"](https://en.wikipedia.org/wiki/Konami_Code) using your arrow keys. What does it do when that's done?

# React Refs in `useEffect ` {#refs-in-use-effect}

I have to make a confession: I've been lying to you. Not maliciously, but I've repeatedly used code in the previous samples that should not ever be used in production. This is because without hand-waving a bit, teaching these things can be tricky.

What's the offending code?

```jsx
React.useEffect(() => {
  elRef.current.anything.here.is.bad();
}, [elRef])
```

> What?

That's right! You shouldn't be placing `elRef.current` inside of any `useEffect` (unless you _really_ **really** _**really**_ know what you're doing).

> Why's that?

Before we answer that fully, let's take a look at how `useEffect` works.

Assume we have a simple component that looks like this:

```jsx
const App = () => {
  const [num, setNum] = React.useState(0);

  React.useEffect(() => {
    console.log("Num has ran");
  }, [num])

  return (
    // ...
  )
}
```

You might expect that when `num` updates, the dependency array "listens" for changes to `num`, and when the data updates, it will trigger the side-effect. This line of thinking is such that "useEffect actively listens for data updates and runs side effects when data is changed". This mental model is inaccurate and can be dangerous when combined with `ref` usage. Even I didn't realize this was wrong until I had already started writing this article!

Under non-ref (`useState`/props) dependency array tracking, this line of reasoning typically does not introduce bugs into the codebase, but when `ref`s are added, it opens a can of worms due to the misunderstanding.

The way `useEffect` _actually_ works is much more passive. During a render, `useEffect` will do a check against the values in the dependency array. If any of the values' memory addresses have changed (_this means that object mutations are ignored_), it will run the side effect. This might seem similar to the previously outlined understanding, but it's a difference of "push" vs. "pull". `useEffect` does not listen to anything and does not trigger a render in itself, but instead, the render triggers `useEffect`'s listening and comparison of values. **This means that if there is not a render, `useEffect` cannot run a side effect, even if the memory addresses in the array have changed.**

Why does this come into play when `ref`s are used? Well, there are two things to keep in mind:

- Refs rely on object mutation rather than reassignment

- When a `ref` is mutated, it does not trigger a re-render

- `useEffect` only does the array check on re-render

- Ref's current property set doesn't trigger a re-render ([remember how `useRef` is _actually_ implemented](#use-ref-mutate))

Knowing this, let's take a look at an offending example once more:

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

<iframe src="https://stackblitz.com/edit/react-use-ref-effect-style?ctl=1&embed=1" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

This code behaves as we might initially expect, not because we've done things properly, but instead, thanks to the nature of React's `useEffect` hook's timing.

Because `useEffect` happens _after_ the first render, `elRef` is already assigned by the time `elRef.current.style` has its new value assigned to it. However, if we somehow broke that timing expectancy, we'd see different behavior.

What do you think will happen if you make the `div` render happen _after_ the initial render?

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

<iframe src="https://stackblitz.com/edit/react-use-ref-effect-bug-effect?ctl=1&embed=1" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Oh no! The background is no longer `'lightblue'`! Because we delay the rendering of the `div`, `elRef` is _not_ assigned for the initial render. Then, once it _is_ rendered, it mutates the `.current` property of `elRef` to assign the ref. Because mutations do not trigger a re-render (and `useEffect` only runs during renders), `useEffect` does not have a chance to "compare" the differences in value and, therefore, run the side-effect.

Confused? That's okay! So was I at first. I made a playground of sorts to help us kinesthetic learners!

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

<iframe src="https://stackblitz.com/edit/react-use-ref-not-updating?ctl=1&embed=1" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

> Open your console and take notes of what `console.log` runs when you change the respective values!

How do you use this example? Great question!

First, start by clicking the button under the `useState` header. You'll notice that each time you click the button, it promptly triggers a re-render, and your value displayed in the UI is immediately updated. Thus, it enables the `useEffect` (with `num` as a dep) to compare the previous value to the current one - they don't match up - and run the `console.log` side effect.

Now, once you've triggered the `useState` "add" button, do the same with the `useRef` button. Click it as many times as you'd like, but it (alone) will never trigger a re-render. Because `useRef` mutations do not re-render the DOM, neither `useEffect` is able to make a comparison of values, and therefore neither `useEffect` will run. However, the values in `.current` _are_ updating - they're just not showing up in the UI (because the component is not re-rendering). Once you trigger a re-render (by pressing the `useState` "add" button again), it will update the UI to match the internal memory value of `.current`.

[TL;DR](https://www.dictionary.com/browse/tldr) - Try pressing `useState` "add" twice. The value on-screen will be 2. Then, try pressing the `useRef` "add" button thrice. The value on-screen will be 0. Press `useState`'s button once again and et voilà - both values are 3 again!

## Comments from Core Team {#core-team-comments}

Because of the unintended effects of tracking a `ref` in a `useEffect`, the core team has explicitly suggested avoiding doing so.

[Dan Abramov Said on GitHub:](https://github.com/facebook/react/issues/14387#issuecomment-503616820)

> As I mentioned earlier, if you put \[ref.current] in dependencies, you're likely making a mistake. Refs are for values whose changes don't need to trigger a re-render.
>
> If you want to re-run effect when a ref changes, you probably want a callback ref instead.

[... twice:](https://github.com/facebook/react/issues/14387#issuecomment-493677168)

> When you try to put `ref.current` in dependencies, you usually want a callback ref instead

[An even again on Twitter:](https://twitter.com/dan_abramov/status/1093497348913803265)

> I think you want callback ref for that. You can’t have component magically react to ref changes because ref can go deep down and have independent lifecycle of the owner component.

These are great points... But what does Dan mean by a "callback ref"?

# Callback Refs {#callback-refs}

Towards the start of this article, we mentioned an alternative way to assign refs. Instead of:

```jsx
<div ref={elRef}>
```

There's the valid (and slightly more verbose):

```jsx
<div ref={node => elRef.current = node}>
```

This is because `ref` can accept callback functions. These functions are called with the element's node itself. This means that if you wanted to, you could inline the `.style` assignment we've been using multiple times throughout this article:

```jsx
<div ref={node => node.style.background = "lightblue"}>
```

But, you're probably thinking that if it accepts a function, we could pass a callback declared earlier in the component. That's correct!

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

<iframe src="https://stackblitz.com/edit/react-use-ref-callback-styling?ctl=1&embed=1" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

> But hey! Wait a minute! Even though the `shouldRender` timing mismatch is still there, the background is being applied all the same! Why is the `useEffect` timing mismatch not causing the bug we were experiencing before?

Well, that's because we eliminated the usage of `useEffect` entirely in this example! Because the callback function is running only once `ref` is available, we can know for certain that `.current` _will_ be present, and because of that, we can assign property values and more inside said callback!

> But I also need to pass that `ref` to other parts of the codebase! I can't pass the function itself; that's just a function - not a ref!

That's true. However, you _can_ combine the two behaviors to make a callback that _also_ stores its data inside a `useRef` (so you can use that reference later).

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

<iframe src="https://stackblitz.com/edit/react-use-ref-callback-and-effect?ctl=1&embed=1" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

# `useState` Refs {#usestate-refs}

Sometimes the combination of `useRef` and callback refs is not enough. There are the rare instances where you need to re-render whenever you get a new value in `.current.`. The problem is that the inherent nature of `.current` prevents re-rendering. How do we get around that? Eliminate `.current` entirely by switching your `useRef` out for a `useState`.

You can do this relatively trivially using callback refs to assign to a `useState` hook.

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

<iframe src="https://stackblitz.com/edit/react-use-ref-callback-and-use-state?ctl=1&embed=1" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Now that the `ref` update causes a re-render, you can now _**safely**_ use the `ref` in `useEffect`'s dependency array.

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

<iframe src="https://stackblitz.com/edit/react-use-ref-callback-and-state-effect?ctl=1&embed=1" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

However, this comes at an offset cost of performance. Because you're causing a re-render, it will inherently be slower than if you were not triggering a re-render. There are valid uses for this, however. You just have to be mindful of your decisions and your code's usage of them.

# Conclusion

As with most engineering work, knowing an API's limitations, strengths, and workarounds can increase performance, cause fewer bugs in production, and make the organization of code more readily available. Now that you know the whole story surrounding refs, what will you do with that knowledge? We'd love to hear from you! Drop a comment down below or [join us in our community Discord](https://discord.gg/FMcvc6T)!
