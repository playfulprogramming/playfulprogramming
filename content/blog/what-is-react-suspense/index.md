---
{
    title: "What is React Suspense?",
    description: "",
    published: '2023-12-17T21:52:59.284Z',
    authors: ['crutchcorn'],
    tags: ['react', 'webdev'],
    attached: [],
    license: 'cc-by-4',
    collection: "react-beyond-the-render",
    order: 5
}
---

In our last article, I introduced React Server Components (RSC) as a primitive to enable more efficient server-side React usage.

I also hinted in the conclusion of that article that due to the nature of RSCs we'd be able to add on to our knowledge and utilize data fetching.

Let's talk about data fetching, first by putting server-side behavior to the side, then we'll reintroduce the server-APIs soon after.

To do this, I want to introduce you to two new APIs: the `use` Hook and `<Suspense>` component.

# What is the React `use` Hook?

The React `use` Hook enables you to load data asynchronously in your components where data fetching is mission-critical.

Let's say that you're in a traditional [client-side rendered](/posts/what-is-ssr-and-ssg#csr) app and want to fetch data from the server. If you're not using a library like [TanStack Query](https://tanstack.com/query/latest) (which you should be), you might have something like this:

```jsx
const [data, setData] = useState({
    loading: true,
    result: null,
    error: null,
});

// Please use TanStack Query
useEffect(() => {
    fetchUser()
        .then((serverData) => {
            setData({ error: null, loading: false, result: serverData });
        })
        .catch((err) => {
            setData({ error: err, loading: false, result: null });
        });
}, []);
```

<!-- TODO: Add embed -->

While this works and `useEffect` _can_ be used this way, `useEffect` is not a built-in mechanism for asynchronous data loading. 

Instead, React 18.3 (in canary release at the time of writing) introduces a new Hook: [`use`](https://react.dev/reference/react/use).

This hook allows you to pass a promise to it to load data:

```jsx
const UserDisplay = ({promise}) => {
	const result = use(promise);

	return <p>Hello {result.name}</p>;
};
```

We then need to pass the `UserDisplay` component to a `<Suspense>` component.

> If your only objective is to load data on the client, I'd still highly suggest using [TanStack Query](https://tanstack.com/query/latest) or something similar. After all, even with `use` you likely want to take into consideration the following:
>
> - Caching results
> - Refetching with new inputs
> - Abort signals to avoid timing issues

# What is the `<Suspense>` component?

The React `<Suspense>` component allows you to display data and loading indicators from the new `use` Hook.

Take the `<UserDisplay>` component from before. If we use it in `<App>` as-is, nothing shows up:

```jsx
function App() {
	// Placed in a memo to avoid re-fetching on every render
	const promise = useMemo(() => fetchUser(), []);

	return (
    	<UserDisplay promise={promise} />
	);
}
```

<!-- TODO: Add embed -->

To solve this, we need to add a `<Suspense>` to wrap our `<UserDisplay>` component:

```jsx
function App() {
	// Placed in a memo to avoid re-fetching on every render
	const promise = useMemo(() => fetchUser(), []);

	return (
        <Suspense>
            <UserDisplay promise={promise} />
        </Suspense>
	);
}
```

<!-- TODO: Add embed -->

> Notice how `promise` is being passed to `<UserDisplay>`. We're doing this for two reasons:
>
> 1) React's `<Suspense>` component doesn't behave as-expected when assigning the promise inside of a `Suspense` block.
> 2) You often want to load your data at a higher-level than you might originally suspect. We'll show later how you can use this to your advantage and load multiple async components using a single loading indicator rather than multiple. This leads to better UX for your users. 

## How do I add a loading indicator to `<Suspense>`?

You'll notice that while data is loading, there's no indication that the user that data is being fetched. To add a loading indicator to the `<Suspense>` component, add a `fallback={}` property to the `<Suspense>` component:

```jsx
function App() {
	// Placed in a memo to avoid re-fetching on every render
	const promise = useMemo(() => fetchUser(), []);

	return (
        <Suspense fallback={<p>Loading...</p>}>
            <UserDisplay promise={promise} />
        </Suspense>
	);
}
```

<!-- TODO: Add embed -->

## Reusing Loading Indicators

Loading indicators may be important to show in-progress data fetching, but users don't often like seeing a dashboard with 30 different loading spinners. 

Because of this, React has made handling multiple data sources easy using `<Suspense>`; just wrap multiple `use` Hook components inside of a single `<Suspense>` component:

```jsx
function App() {
	const promiseOne = useMemo(() => fetchUser({ timeout: 1500 }), []);
	const promiseTwo = useMemo(() => fetchUser({ timeout: 3000 }), []);

	return (
		<ErrorBoundary>
            {/* Will show "Loading..." for 3 seconds while
                waiting for BOTH promises to resolve */}
			<Suspense fallback={<p>Loading...</p>}>
				<UserDisplay promise={promiseOne} />
				<UserDisplay promise={promiseTwo} />
			</Suspense>
		</ErrorBoundary>
	);
}
```

<!-- TODO: Add embed -->

To sidestep this behavior, wrap each `<UserDisplay>` in their own `<Suspense>`:

``` jsx
function App() {
	const promiseOne = useMemo(() => fetchUser({ timeout: 1500 }), []);
	const promiseTwo = useMemo(() => fetchUser({ timeout: 3000 }), []);

	return (
		<ErrorBoundary>
            {/* Will show "Loading..." for 3 seconds while
                waiting for BOTH promises to resolve */}
			<Suspense fallback={<p>Loading...</p>}>
				<UserDisplay promise={promiseOne} />
			</Suspense>
            <Suspense fallback={<p>Loading...</p>}>
            	<UserDisplay promise={promiseTwo} />
			</Suspense>
		</ErrorBoundary>
	);
}
```

<!-- TODO: Add embed -->

## How do I handle rejected promises in `<Suspense>`?

While `use` and `<Suspense>` handle resolved promises just fine, they alone will not handle rejected promises passed to the `use` Hook.

To handle rejected promises in Suspense, you'll need to use an `<ErrorBoundary>` class-based component which utilizes the `getDerivedStateFromError` lifecycle method. 

Let's see how we can do this ourselves:

```jsx
const UserDisplay = ({ promise }) => {
	const result = use(promise);

	return <p>Hello {result.name}</p>;
};

function App() {
	// Placed in a memo to avoid re-fetching on every render
	const promise = useMemo(() => fetchUser(), []);

	return (
		<ErrorBoundary>
			<Suspense fallback={<p>Loading...</p>}>
				<UserDisplay promise={promise} />
			</Suspense>
		</ErrorBoundary>
	);
}

class ErrorBoundary extends Component {
	state = { error: null };

	static getDerivedStateFromError(error) {
		return { error };
	}

	render() {
		if (this.state.error) {
			return <p>There was an error: {JSON.stringify(this.state.error)}</p>;
		}

		return this.props.children;
	}
}
```

<!-- TODO: Add embed -->

----------------------------

----------------------------

----------------------------

----------------------------

----------------------------

----------------------------

----------------------------

----------------------------

----------------------------

----------------------------

----------------------------

----------------------------

----------------------------

# How do I use Suspense with React Server Components?

Now let's move back to server-land

We know that we can make server-only components, that don't reinitialize on the client, right? Now what if we could load the data on the server and not have it passed to the client either?

Well, luckily for us - we already have a mechanism for loading data in React that's async

```tsx
const ServerComp = () => {
    const data = use(fetchData())

    return <ChildComp data={data}/>
}

const Parent = () => {
    return (<Suspense fallback={<Loading />}>
        <ServerComp/>
    </Suspense>)
}
```

Here, we're seeing the imaginary `ChildComp` rendered with data passed from the server (never fetched on the client)

Because `ServerComp` only runs once thanks to RSC

But wait a moment - we're on the server. `use` accepts any promise... What if... What if we just polled our database directly?

```tsx
const ServerComp = () => {
    const data = use(fetchOurUsersFromTheDatabase())

    return <ChildComp data={data}/>
}
```

This works!

https://react.dev/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content
