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

But wait, there's more!

# What is the React `use` Hook?

Let's talk about Suspense and data fetching

Let's say that you're in a traditional CSR app and want to fetch data from the server. You might have something like this:

```tsx
const [data, setData] = useState(null);
// Please use TanStack Query
useEffect(() => fetchData().then(serverData => setData(serverData), []);
```

But now let's say that you wanna add a loading screen while your user waits

You might have:

```tsx
const [loading, setLoading] = useState(true);
const [data, setData] = useState(null);
// Still plz uze TanStack Query
useEffect(() => {
     setLoading(true);
     fetchData().then(serverData => {
          setData(serverData)
          setLoading(false);
     }
}, []);
```

Well, this is where the `use` hook comes into play:

```jsx
const Comp = () => {
    const data = use(fetchData())
}
```

# What is the React Suspense?

Notice there's no `loading`? That's because in the parent you now use:

```tsx
const Parent = () => {
    return (<Suspense fallback={<Loading />}>
        <Comp/>
    </Suspense>)
}
```

And Suspense will automatically show the `fallback` or not, depending on the `fetchData` promise being resolved or not

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
