---
{
    title: "Why React 18 Broke Your App",
    description: "React 18's internal changes improved a lot, but may have broken your app in the process. Here's why and how you can fix it",
    published: '2022-01-27T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['react', 'webdev'],
    attached: [],
    license: 'coderpad',
    originalLink: 'https://coderpad.io/blog/development/why-react-18-broke-your-app/'
}
---

You’ve just gotten done with [your React 18 upgrade](https://coderpad.io/blog/how-to-upgrade-to-react-18/), and, after some light QA testing, don’t find anything. “An easy upgrade,” you think.

Unfortunately, down the road, you receive some internal bug reports from other developers that make it sound like your debounce hook isn’t working quite right. You decide to make a minimal reproduction and create a demo of said hook.

You expect it to throw an “alert” dialog after a second of waiting, but weirdly, the dialog never runs at all.

<iframe src="https://app.coderpad.io/sandbox?question_id=200065"  loading="lazy"></iframe>

This is strange because it was working just last week on your machine! Why did this happen? What changed?

**The reason your app broke in React 18 is that you’re using `StrictMode`.**

Simply go into your `index.js` (or `index.ts`) file, and change this bit of code:

```jsx
render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

To read like this:

```jsx
render(
    <App />
);
```

All of the bugs that were seemingly introduced within your app in React 18 are suddenly gone.

Only one problem: These bugs are real and existed in your codebase before React 18 - you just didn’t realize it.

## Proof of broken component

Looking at our example from before, we’re using [React 18’s `createRoot` API](https://coderpad.io/blog/how-to-upgrade-to-react-18/) to render our `App` inside of a `StrictMode` wrapper in lines 56 - 60.

<iframe src="https://app.coderpad.io/sandbox?question_id=200065"  loading="lazy"></iframe>

Currently, when you press the button, it doesn’t do anything. However, if you remove the

`StrictMode` and reload the page, you can see an `Alert` after a second of being debounced.

Looking through the code, let’s add some `console.log`s into our `useDebounce`, since that’s where our function is supposed to be called.

```jsx
function useDebounce(cb, delay) {
  const inputsRef = React.useRef({ cb, delay });
  const isMounted = useIsMounted();
  React.useEffect(() => {
    inputsRef.current = { cb, delay };
  });
  return React.useCallback(
    _.debounce((...args) => {
        console.log("Before function is called", {inputsRef, delay, isMounted: isMounted()});
          if (inputsRef.current.delay === delay && isMounted())
                      console.log("After function is called");
                  inputsRef.current.cb(...args);
        }, delay),
    [delay]
  );
}
```

> ```
> Before function is called Object { inputsRef: {…}, delay: 1000, isMounted: false }
> ```

Oh! It seems like `isMounted` is never being set to true, and therefore the `inputsRef.current` callback is not being called: that’s our function we wanted to be debounced.

Let’s take a look at the `useIsMounted()` codebase:

```jsx
function useIsMounted() {
  const isMountedRef = React.useRef(true);
  React.useEffect(() => {
    return () => {
          isMountedRef.current = false;
    };
  }, []);
  return () => isMountedRef.current;
}
```

This code, at first glance, makes sense. After all, while we’re doing a cleanup in the return function of `useEffect` to remove it at first render, `useRef`'s initial setter runs at the start of each render, right?

Well, not quite.

## What changed in React 18?

In older versions of React, you would mount a component once and that would be it. As a result, the initial value of `useRef` and `useState` could almost be treated as if they were set once and then forgotten about.

In React 18, the React developer team decided to change this behavior and [re-mount each component more than once in strict mode](https://github.com/reactwg/react-18/discussions/19). This is in strong part due to the fact that a potential future React feature will have exactly that behavior.

See, one of the features that the React team is hoping to add in a future release utilizes a concept of “[reusable state](https://reactjs.org/docs/strict-mode.html#ensuring-reusable-state)”. The general idea behind reusable state is such that if you have a tab that’s un-mounted (say when the user tabs away), then re-mounted (when the user tabs back), React will recover the data that was assigned to said tab component. This data being immediately available allows you to render the respective component immediately without hesitation.

Because of this, while data inside of, say, `useState` may be persisted, it’s imperative that effects are properly cleaned up and handled properly. [To quote the React docs](https://reactjs.org/docs/strict-mode.html#ensuring-reusable-state):

> This feature will give React better performance out-of-the-box but requires components to be resilient to effects being mounted and destroyed multiple times.

However, this behavior shift in Strict Mode within React 18 isn’t just protective future-proofing from the React team: it’s also a reminder to follow React’s rules properly and to clean up your actions as expected.

After all, the [React team themselves have been warning that an empty dependent array](https://reactjs.org/docs/hooks-reference.html#usememo) (`[]` as the second argument) should not guarantee that it only runs once for ages now.

In fact, this article may be a bit of a misnomer - [the React team says they’ve upgraded thousands of components in Facebook’s core codebase without significant issues](https://github.com/reactwg/react-18/discussions/19#discussioncomment-796197=). More than likely, a majority of applications out there will be able to upgrade to the newest version of React without any problems.

All that said, these React missteps crawl their way into our applications regardless. While the React team may not anticipate many breaking apps, these errors seem relatively common enough to warrant an explanation.

## How to fix the remounting bug

The code I linked before was written by me in a production application and it's wrong. Instead of relying on `useRef` to initialize the value once, we need to ensure the initialization runs on every instance of `useEffect`.

```jsx
function useIsMounted() {
  const isMountedRef = React.useRef(true);
  React.useEffect(() => {
  isMountedRef.current = true; // Added this line  
  return () => {
      isMountedRef.current = false;
    };
  }, []);
  return () => isMountedRef.current;
}
```

This is true for the inverse as well! We need to make sure to run cleanup on any components that we may have forgotten about before.

Many ignore this rule for `App` and other root elements that they don’t intend to re-mount, but with new strict mode behaviors, that guarantee is no longer a safe bet.

To solve this application across your app, look for the following signs:

- Side effects with cleanup but no setup (like our example)
- A side effect without proper cleanup
- Utilizing `[]` in `useMemo` and `useEffect` to assume that said code will only run once

One this code is eliminated, you should be back to a fully functioning application and can re-enable StrictMode in your application!

## Conclusion

React 18 brings many amazing features to the table, such as [new suspense features](https://reactjs.org/docs/concurrent-mode-suspense.html), [the new useId hook](https://github.com/reactwg/react-18/discussions/111), [automatic batching](https://github.com/reactwg/react-18/discussions/21), and more. While refactor work to support these features may be frustrating at times, it’s important to remember that they a serve real-world benefit to the user.

For example, React 18 also introduces some functionality to debounce renders in order to create a much nicer experience when rapid user input needs to be processed.

For more on the React 18 upgrade process, take a look at [our instruction guide on how to upgrade to React 18](https://coderpad.io/blog/how-to-upgrade-to-react-18/)
