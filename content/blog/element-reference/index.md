---
{
    title: "Element Reference",
    description: "",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 10,
    series: "The Framework Field Guide"
}

---



<!-- tabs:start -->

# React

```jsx
const RenderParagraph = () => {
    // el is HTMLElement
	return <p ref={el => console.log({el: el})}></p>
}
```

// TODO: Add more

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

## `useState` `ref`s

However, this is a problem because our `addEventListener` is never cleaned up! Remember, this is part of the API that `useEffect` provides.

As a result, let's store the value of `el` into a `useState`, then pass that value into a `useEffect`, which will then add the event listener

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

// TODO: Explain closures (or link out to curse-free mirror of https://whatthefuck.is/closure)

> You should be using `onClick` to bind a method, this is only to demonstrate how element `ref`s work

// TODO: Add transition sentence

However, if you look through the [React Hooks API documentation](// TODO: Link), you'll notice something called `useRef`. Sensibly, based on the name, it's very commonly used with an element's `ref` property. But why aren't we using it here? What is it?

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

[I wrote more about why we shouldn't use `useRef` in `useEffect`s and when and where they're more useful in another article linked here](https://unicorn-utterances.com/posts/react-refs-complete-story)

# Angular

// TODO

# Vue

// TODO

<!-- tabs:end -->







-------





- Component reference
  - `ref`/`forwardRef` / `useImperativeHandle` React
    - Array of refs
  - ViewChild/Angular
    - `ViewChildren`
  - `ref` / Vue
    - Array of refs
  - Element reference
  - Component reference



Element reference first, introduce alternative to `onClick` using `document.addEventListener()`

`element.focus()` example



Then, move to component reference to introduce calling component method/data.

https://stackblitz.com/edit/react-ts-gpjzsm?file=index.tsx

