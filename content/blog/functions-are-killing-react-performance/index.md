---
{
    title: "Functions Are Killing Your React App's Performance",
    description: "",
    published: '2023-04-14T21:52:59.284Z',
    authors: ['crutchcorn'],
    tags: ['react'],
    attached: [],
    license: 'cc-by-4'
}
---

Functions are an integral part of all JavaScript applications; React apps included. [While I've written about how peculiar their usage can be, thanks to the fact that all functions are values](https://unicorn-utterances.com/posts/javascript-functions-are-values), they help split up the monotony of your codebase by splitting similar code into logical segments.

This knowledge that functions are values can assist you when working on improving your React apps' performance.

Let's look at some of the ways that functions often slow down React applications, why they do so, and how to combat them in our own apps.

In this adventure, we'll see how to:

- [Memoize return values with `useMemo`](#use-memo)
- Create function stability with `useCallback`
- Remove costly render functions with component extraction
- Handle mandatory children functions performantly

# Memoizing Return Values with `useMemo` {#use-memo}

Let's say that we're building an ecommerce application and want to calculate the sum of all items in the cart:

```jsx
const ShoppingCart = ({items}) => {
    const getCost = () => {
        return items.reduce((total, item) => {
            return total + item.price;
        }, 0);
    }

    return (
        <div>
            <h1>Shopping Cart</h1>
            <ul>
                {items.map(item => <li>{item.name}</li>)}
            </ul>
            <p>Total: ${getCost()}</p>
        </div>
    )
}
```

This should show all items and the total cost, but this may cause headaches when `ShoppingCart` re-renders.

After all, a React functional component is a normal function, after all, and will be ran like any other; where `getCost` is recalculated on subsequent renders when you don't memoize the value.

This `getCost` function may not be overly expensive when there's only one or two items in the cart, but this can easily become a costly computation when there are 50 items or more in the cart.

The fix? Memoize the function call using `useMemo` so that it only re-runs when the `items` array changes:

```jsx
const ShoppingCart = ({items}) => {
    const totalCost = useMemo(() => {
        return items.reduce((total, item) => {
            return total + item.price;
        }, 0);
    }, [items]);

    return (
        <div>
            <h1>Shopping Cart</h1>
            <ul>
                {items.map(item => <li>{item.name}</li>)}
            </ul>
            <p>Total: ${totalCost}</p>
        </div>
    )
}
```

 # Function Instability Causes Re-renders

Let's expand this shopping cart example by adding in the ability to add new items to the shopping cart.

```jsx
import {useState, useMemo} from 'react';
import {v4 as uuid} from 'uuid';

const ShoppingItem = ({item, addToCart}) => {
  return (
    <div>
      <div>{item.name}</div>
      <div>{item.price}</div>
      <button onClick={() => addToCart(item)}>Add to cart</button>
    </div>
  )
}

const items = [
  { id: 1, name: 'Milk', price: 2.5 },
  { id: 2, name: 'Bread', price: 3.5 },
  { id: 3, name: 'Eggs', price: 4.5 },
  { id: 4, name: 'Cheese', price: 5.5 },
  { id: 5, name: 'Butter', price: 6.5 }
]

export default function App() {
  const [cart, setCart] = useState([])

  const addToCart = (item) => {
    setCart(v => [...v, {...item, id: uuid()}])
  }

  const totalCost = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price, 0)
  }, [cart]);

  return (
    <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'nowrap'}}>
      <div style={{padding: '1rem'}}>
        <h1>Shopping Cart</h1>
        {items.map((item) => (
          <ShoppingItem key={item.id} item={item} addToCart={addToCart} />
        ))}
      </div>
      <div style={{padding: '1rem'}}>
        <h2>Cart</h2>
        <div>
          Total: ${totalCost}
        </div>
        <div>
          {cart.map((item) => (
            <div key={item.id}>{item.name}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

If I now click any of the items' `Add to cart` buttons, it will:

1) Trigger the `addToCart` function
2) Update the `cart` array using `setCart`
   1) Generating [a new UUIDv4](https://unicorn-utterances.com/posts/what-are-uuids) for the item in the cart
3) Cause the `App` component to re-render
4) Update the displayed items in the cart
5) Re-run the `totalCost` `useMemo` calculation

This is exactly what we'd expect to see in this application. However, if we open [the React Developer Tools](https://beta.reactjs.org/learn/react-developer-tools), and inspect [our Flame Chart](https://reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html#flame-chart), we'll see that all `ShoppingItem` components are re-rendering, despite none of the passed `item`s changing.

![`ShoppingItem key="1"` re-rendered because "Props changed: `addToCart`"](./why_rerender.png)

The reason these components are re-rendering is because our `addToCart` property is changing.

> That's not right! We're always passing the same `addToCart` function on each render!

While this may seem true at a cursory glance, we can check this with some additional logic:

```jsx
// This is not good production code, but is used to demonstrate a function's reference changing
export default function App() {
  const [cart, setCart] = useState([])

  const addToCart = (item) => {
    setCart(v => [...v, {...item, id: uuid()}])
  }

  useLayoutEffect(() => {
    if (window.addToCart) {
      console.log("addToCart is the same as the last render?", window.addToCart === addToCart);
    }

    window.addToCart = addToCart;
  });

  // ...
}
```

This code:

- Sets up `addToCart` function inside of the `App`
- Runs [a layout effect](https://beta.reactjs.org/reference/react/useLayoutffect) on every render to:
  - Assign `addToCart` to `window.addToCart` 
  - Checks if the old `window.addToCart` is the same as the new one

With this code, we would expect to see `true` if the function is not reassigned between renders. However, we instead see:

> addToCart is the same as the last render? false

This is because, despite having the same name between renders, a new function _reference_ is created for each component render.

Think of it this way: Under-the-hood, React calls each (functional) component as just that - a function.

Imagine we're React for a moment and have this component:

```js
// This is not a real React component, but is a function we're using in place of a functional component
const component = ({items}) => {	
  const addToCart = (item) => {
    setCart(v => [...v, {...item, id: uuid()}])
  }

  return {addToCart};
}
```

If we, acting as React, call this `component` multiple times:

```js
// First "render"
const firstAddToCart = component().addToCart;
// Second "render"
const secondAddToCart = component().addToCart;

// `false`
console.log(firstAddToCart === secondAddToCart);
```

We can see a bit more clearly why `addToCart` is not the same between renders; it's a new function defined inside of the scope of another function.

## Create function stability with `useCallback` {#use-callback}

So, if our `ShoppingItem` is re-rendering because our `addToCart` function is changing, how do we fix this?

Well, we know [from the previous section that we can use `useMemo` to cache a function's return between component renders](#use-memo); what if used that here as well?

```jsx
export default function App() {
  const [cart, setCart] = useState([])

  const addToCart = useMemo(() => {
    return (item) => {
      setCart(v => [...v, {...item, id: uuid()}])
    }
  }, []);

  // ...

  return (
    <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'nowrap'}}>
      <div style={{padding: '1rem'}}>
        <h1>Shopping Cart</h1>
        {items.map((item) => (
          <ShoppingItem key={item.id} item={item} addToCart={addToCart} />
        ))}
      </div>
      {/* ... */}
    </div>
  )
}
```

Here, we're telling React never to re-initialize the `addToCart` function by memoizing the logic inside of a `useMemo`.

We can validate this by looking at our flame chart in the React DevTools again:

![App is the only component that re-renders thanks to "Hook 1 changed"](./app_rerender.png) 

And re-checking the function reference stability using our `window` trick:

```jsx
// ...

const addToCart = useMemo(() => {
  return (item) => {
    setCart(v => [...v, {...item, id: uuid()}])
  }
}, []);

useLayoutEffect(() => {
  if (window.addToCart) {
    console.log("addToCart is the same as the last render?", window.addToCart === addToCart);
  }

  window.addToCart = addToCart;
});

// ...
```

> addToCart is the same as the last render? true

This use-case of memoizing an inner function is so common that it even has a shortform helper called `useCallback`:

```jsx
const addToCart = useMemo(() => {
  return (item) => {
    setCart(v => [...v, {...item, id: uuid()}])
  }
}, []);

// These two are equivilant to one another

const addToCart = useCallback((item) => {
  setCart(v => [...v, {...item, id: uuid()}])
}, []);
```











```jsx
<p>{someFn()}</p>
```

This is bad because `someFn` is expensive.

```jsx
<p>{renderSomeUI()}</p>
```















```jsx
const Comp = ({bool}) => {
    const renderContents = () => {
        return bool ? <div/> : <p/>
    }

    return <div>
        {renderContents()}
    </div>
}

const Comp2 = () => {
    return React.createElement("div", {}, [
        renderContents()
    ])
}

const Contents = () => {
    return bool ? <div/> : <p/>
}

const Comp3 = ({bool}) => {

    return <div>
        <Contents bool={bool}/>
    </div>
}

const Comp4 = ({bool}) => {
    return React.createElement("div", {}, [
        React.createElement(Contents, {bool}, [])
    ])
}
```
