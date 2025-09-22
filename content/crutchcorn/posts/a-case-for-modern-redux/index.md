---
{
	title: "A Case for Redux in Modern React",
	description: "",
	published: '2025-12-28T13:45:00.284Z',
	tags: ['react', 'webdev', 'javascript'],
	license: 'cc-by-nc-sa-4'
}
---

If you're unfamiliar with [Redux](https://redux.js.org/), one _might_ introduce it as:

> A global state manager for Redux. It's been around for almost as long as React itself and was originally written by [Dan Abramov](https://react.dev/community/team#dan-abramov), one of the core React developers.

It's a very widely used tool in the React ecosystem; [over 1/3 React projects seemingly uses Redux today.](https://tanstack.com/stats/npm?packageGroups=%5B%7B%22packages%22%3A%5B%7B%22name%22%3A%22redux%22%7D%5D%7D%2C%7B%22packages%22%3A%5B%7B%22name%22%3A%22react%22%7D%5D%7D%5D)

Despite this, however, you might hear one of the following immediately following your introduction to the tool:

> Redux has too much boilerplate.

> Signals are better for reactivity anyway.

> Providing a store through context isn't needed.

> You can just use React `useReducer` instead of Redux.

> Redux is legacy software.

And I get it; I used to dislike Redux myself... Before I learned the nuances behind it.

Once I got to understand Redux for what it was (and what it wasn't), I grew deep appreciation for it. So much so that I am now a maintainer of Redux — officially porting it to [Angular](https://angular-redux.js.org/) and [Vue](https://vue-redux.js.org/) to use in projects beyond the scope of React.

But my perspective isn't simply one of a maintainer of a misunderstood tool; I also maintain a range of tools from [the TanStack ecosystem](https://tanstack.com/), some of the most broadly adopted and praised tools in a modern React developer's toolbox.

As such, I'd like to share my perspective on Redux; how it differs from other tools in the ecosystem, where the myths mentioned above came from, and **why you should continue to use it in your new projects today**.

# Reaching a boiling point

Let's compare and contrast modern Redux (using Toolkit) and a modern signals-based library, Jotai.

**Jotai**:

```tsx
/* Create store */
import { atom } from 'jotai'

const countAtom = atom(0)

/* Use the store */
function App() {
  const [count, setCount] = useAtom(countAtom)

  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => setCount(count + 1)}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => setCount(count - 1)}
        >
          Decrement
        </button>
      </div>
    </div>
  )
}

/* Render the app */
import React from 'react'
import { createRoot } from 'react-dom/client'

const container = document.getElementById('root')!
const root = createRoot(container)

root.render(
    <App />
)
```



**Redux**:

```tsx
/* Create store */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: 0,
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
  },
})

const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
})

type RootState = ReturnType<typeof store.getState>

/* Use the reducer */
import { useSelector, useDispatch } from 'react-redux'

function App() {
  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(counterSlice.actions.increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(counterSlice.actions.decrement())}
        >
          Decrement
        </button>
      </div>
    </div>
  )
}

/* Render the app */
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

const container = document.getElementById('root')!
const root = createRoot(container)

root.render(
  <Provider store={store}>
    <App />
  </Provider>,
)
```



1) Showing Redux boilerplate in comparison to Jotai :scream:
2) Going "Oh wait, composition is good, actually" and showing how Jotai struggles with this compared to Redux or Zustand. Especially with devtools integration and such
3) Showing how Zustand falls short in providing a context for tests and other usages
4) Showing how React's primitives lead to performance problems at scale
5) Showing the team's highlights as amazing OSS developers
