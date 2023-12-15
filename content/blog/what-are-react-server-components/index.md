---
{
    title: "What are React Server Components?",
    description: "",
    published: '2023-12-14T21:52:59.284Z',
    authors: ['crutchcorn'],
    tags: ['react', 'webdev'],
    attached: [],
    license: 'cc-by-4',
    collection: "React Beyond the Render",
    order: 1
}
---

# What is SSR?

// Done

OK so now for SSR

By default (CSR), React renders on your user's machine

![](https://unicorn-utterances.com/content/blog/what-is-ssr-and-ssg/csr.svg)(image from my blog post:

https://unicorn-utterances.com/posts/what-is-ssr-and-ssg)



But here's a problem: By doing this the user is met with an empty screen until the JavaScript has downloaded and executed

So - SSR moves the initial content rendering away from the user's machine and into a server



![](https://unicorn-utterances.com/content/blog/what-is-ssr-and-ssg/ssr.svg)



THis works, and now you can turn off JS on the browser to see the initial HTML

But then React has to know what to render and what not to

So the "traditional" (before today) solution was to render the UI on the server, have it generate the HTML, then re-render on the client and have it replace the server-generated HTML

![](https://unicorn-utterances.com/content/blog/what-is-ssr-and-ssg/ssg_slowdown.svg)

-------------------------------------------------------------

# What are React Server Components (RSC)?

So! Instead, what React did is introduce "Server Components", where you can do a few things:

- Not re-render on the client
- Fetch data on the server and return it to the client 🤫 (spoilers for what I'm _gonna_ write)

So instead of:

```tsx
<Layout>
  <Header/>
  <Content/>
  <Footer/>
</Layout>
```

And having React render 4 components on the server, then re-render 4 components on the client - you might have:

```tsx
<ServerLayout>
  <ServerHeader/>
  <ClientContent/>
  <ServerFooter/>
</ServerLayout>
```

And keep the first 4 component renders on the server, but _only_ re-render `ClientContent` on the client, saving the amount of JS needed and the speed in parsing

So that's the RSC (React Server Component) story

----------------------------------------

# What is React Suspense?

But wait, there's more!

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

```
const Comp = () => {
    const data = use(fetchData())
}
```

Notice there's no `loading`? That's because in the parent you now use:

```tsx
const Parent = () => {
    return (<Suspense fallback={<Loading />}>
        <Comp/>
    </Suspense>)
}
```

And Suspense will automatically show the `fallback` or not, depending on the `fetchData` promise being resolved or not

-----------------------------------------------------

# What is the React `use` Hook?

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

---------------------------------------------------

# What are React Server Actions?

Now this is great for loading data, but what about actions? Not everything happens at load and we may want to find ourselves listening for a user submitting a form

Well, this is where the React Actions come into play. Let's again move back to client land and see how we can listen for a form submission and add an item to a todo:

```tsx
import { useState } from "react";

export default function Todo() {
  const [todos, setTodos] = useState([]);
  async function addTodo(formData) {
    const todo = formData.get("todo");
    setTodos([...todos, todo]);
  }
  return (
    <>
      <ul>
        {todos.map((todo) => {
          return <li>{todo}</li>;
        })}
      </ul>
      <form action={addTodo}>
        <input name="todo" />
        <button type="submit">Add Todo</button>
      </form>
    </>
  );
}
```

Annnnd of course this works on the server as well:

```tsx
import { useState } from "react";

export default function Todo() {
  const [todos, setTodos] = useState([]);
  async function addTodo(formData) {
    "use server"
    const todo = formData.get("todo");
    addTodoToDatabase(todo);
  }
  return (
    <>
      <ul>
        {todos.map((todo) => {
          return <li>{todo}</li>;
        })}
      </ul>
      <form action={addTodo}>
        <input name="todo" />
        <button type="submit">Add Todo</button>
      </form>
    </>
  );
}
```

--------------------------------------

# What is the React `useFormState` Hook? 

Now this works well if you need to pass data to the server and have it refresh the page

But what happens if you need to display data passed from the server to the client once you do a server action?

Welllllll

Turns out you can do that too:

```tsx
// form.ts
"use client";
import {
    experimental_useFormState as useFormState,
    experimental_useFormStatus as useFormStatus,
} from "react-dom";

import { action } from "./_action";

export default function MyForm() {
    const [state, dispatch] = useFormState(action, {
        message: null,
        type: undefined,
    });

    return (
        <main>
            <h2 >useFormState demo</h2>
            <h1>Disable JavaScript to test with Progressive Enhancement</h1>

            {state?.type === "success" && <Alert>{state.message}</Alert>}

            <form action={dispatch}>
                <label htmlFor="name">Your Name</label>
                <input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    aria-describedby={`name-error`}
                    className={`border rounded-md p-2 ${
                        state?.type === "error" && state?.errors?.name
                            ? "accent-red-400"
                            : ""
                    }`}
                />

                {state?.type === "error" && state?.errors?.name && (
                    <span id="name-error" className="text-red-400">
                        {state.errors.name.join(",")}
                    </span>
                )}

                <label htmlFor="message">Your Message</label>
                <textarea
                    id="message"
                    style={{
                        width: "100%",
                    }}
                    name="message"
                    placeholder="I love cheese"
                    aria-describedby={`message-error`}
                    className={`border rounded-md p-2 ${
                        state?.type === "error" && state?.errors?.message
                            ? "accent-red-400"
                            : ""
                    }`}
                />

                {state?.type === "error" && state?.errors?.message && (
                    <span id="message-error" className="text-red-400">
                        {state.errors.message.join(",")}
                    </span>
                )}

                <SubmitButton />
            </form>
        </main>
    );
}

function SubmitButton() {
    const status = useFormStatus();
    return (
        <button
            aria-disabled={status.pending}
            onClick={(e) => {
                // prevent multiple submits
                if (status.pending) e.preventDefault();
            }}
            className={`rounded-md text-white px-4 py-2 ${
                status.pending ? "bg-blue-300" : "bg-blue-400"
            }`}
        >
            {status.pending ? "Submiting..." : "Submit"}
        </button>
    );
}
```

(courtesy of @fredkisss)
