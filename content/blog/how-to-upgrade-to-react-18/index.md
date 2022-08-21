---
{
    title: "How to Upgrade to React 18",
    description: "React 18 introduces some awesome features that I'm sure you can't wait to try! Here's how you can get started with React 18 today!",
    published: '2022-01-07T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['react', 'webdev'],
    attached: [],
    license: 'coderpad',
    originalLink: 'https://coderpad.io/blog/how-to-upgrade-to-react-18/'
}
---

React 18 is the latest in a long line of major releases of React. With it you gain access to: [new features for Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html), new [useId](https://github.com/reactwg/react-18/discussions/111), [useSyncExternalStore](https://github.com/reactwg/react-18/discussions/86), and [useDeferredValue](https://github.com/reactwg/react-18/discussions/100) hooks, as well as the new [startTransition](https://github.com/reactwg/react-18/discussions/100) API.

While React 18 is not yet a stable release, testing out your application can be useful.

Like with previous major releases of React, React 18 is a fairly easy migration for most apps.

While [Strict Mode has received some changes](https://github.com/reactwg/react-18/discussions/19) that may impact your app, and [automatic batching](https://github.com/reactwg/react-18/discussions/21) may introduce some new edge cases, they only impact apps that don’t [follow the Rules of React properly](https://reactjs.org/docs/hooks-rules.html).

Outside of those considerations, let’s upgrade!

## Installation

First, start by installing React 18:

```
npm i react@18.0.0-rc.0 react-dom@18.0.0-rc.0
```

Or, if you use `yarn`:

```
yarn add react@18.0.0-rc.0 react-dom@18.0.0-rc.0
```

If you’re using Create React App, you may also want to [upgrade to the newest v5](https://github.com/facebook/create-react-app/releases/tag/v5.0.0) as well using:

```
npm i react-scripts@5
```

Or

```
yarn add react-scripts@5
```

Then, make sure to upgrade any dependencies that might rely on React.

For example, upgrade [React Redux to v8](https://github.com/reduxjs/react-redux/releases/tag/v8.0.0-beta.2) or [SWR to 1.1.0](https://github.com/vercel/swr/releases/tag/1.1.0)

## Update `render` method

After you install React 18, you may receive an error when your app is running:

> Warning: ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more:[ https://reactjs.org/link/switch-to-createroot](https://reactjs.org/link/switch-to-createroot)

This is because previously, in React 17 and before, you’d have a file - usually called `index.js` or `index.ts` - that included the following code:

```
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

While this code will continue to function for this release, it will not allow you to leverage most of the new features of React 18. Further, it’ll be removed in a future release of React.

To fix this issue, replace this code with the following:

```
const rootElement = document.getElementById("root");
ReactDOM.createRoot(rootElement).render(
  <App />
);
```

When finished, you should be able to verify the version of React you’re using with `{React.version}`

<iframe src="https://app.coderpad.io/sandbox?question_id=200107" loading="lazy"></iframe>

## Conclusion

As promised, the update to React 18 is fairly straightforward! Most applications should be able to upgrade without too many problems.

If you run into issues during your migration and you’re using `StrictMode`, try temporarily removing it to see if you run into any issues. [React 18 introduced some changes that may impact some apps.](https://github.com/reactwg/react-18/discussions/19)

We hope you enjoy the new [React concurrent features](https://github.com/reactwg/react-18/discussions/4) and happy hacking!
