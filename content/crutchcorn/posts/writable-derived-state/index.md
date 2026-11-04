---
{
  title: "Writable Derived State: Stop Synchronizing State",
  description: "Stop syncing server data into React state. Learn how writable derived state keeps server defaults current while preserving user edits until they're reset.",
  published: "2026-11-03T21:52:59.284Z",
  tags: ["react", "javascript", "webdev"],
  license: "cc-by-4",
}
---

> **Using an agent?:**
> I've [added a skill to my personal skill collection to help fetch and sync data with the server better.](https://github.com/crutchcorn/skills)
> It follows the outline of this article, but adds more than just this to your agent's capabilities.

Applications regularly find themselves needing to implement a common problem: Provide the user with a default value from the server, but allow them to overwrite the defaults.

The intuitive code sample many picture in their mind often looks something like this:

```tsx
const userData = useServerState();

onServerUpdate(() => {
	userData.reset()
})
```

And is often implemented something like this:

```tsx
import { useState, useEffect, useCallback } from "react";
import { getTodos, updateTodos, type Todo } from "./services";

// Enums to avoid problems outlined by TkDodo here: https://tkdodo.eu/blog/why-you-want-react-query
type GetServerState<T> = {status: "loading"} | {status: "data", payload: T} | {status: "error", error: Error}

function App() {
	const [serverState, setServerState] = useState({status: "loading"} as GetServerState<Todo[]>);
	const [todos, setTodos] = useState([] as Todo[]);

	// The most problematic part of this code sample
	useEffect(() => {
		if (serverState.status === "data") {
			setTodos(serverState.payload)
		}
	}, [serverState])

	const fetchServerData = useCallback((signal?: AbortSignal) => {
		setServerState({status: "loading"});
		 getTodos({signal: signal})
		 	.then(data => setServerState({status: "data", payload: data}))
			.catch(err => setServerState({status: "error", error: err}))
	}, []);

	useEffect(() => {
		const controller = new AbortController();
		fetchServerData(controller.signal);
		return () => controller.abort();
	}, [fetchServerData])

    // ...
}
```

This works out pretty well at first glance. Let's now implement a "refresh server data when the user revisits the tab":

```tsx
function useOnRevisit(fn: () => void) {
	useEffect(() => {
		function onVisibilityChange() {
			if (!document.hidden) {
				// User returned to the tab
				fn();
			}
		}
		document.addEventListener("visibilitychange", onVisibilityChange);
		return () => document.removeEventListener("visibilitychange", onVisibilityChange);
	}, [])
}

function App() {
	// ...

	useOnRevisit(() => fetchServerData());

	// ...
}
```

But "oh no!", once we refresh the page it reset the user data; why?

<iframe data-frame-title="Refresh Fail" src="pfp-code:./refresh-fail-1?template=node&embed=1&file=src%2FApp.tsx" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Well, it's because when we refresh the server data, we have few/no controls to retain the user data. This is the problem with "syncing" client data from the server: We're explicitly saying that the server's state should win all updates.

What if I told you that we could swap a few small lines of code to fix this bug?

```tsx
// Before
const [serverState, setServerState] = useState({status: "loading"} as GetServerState<Todo[]>);
const [todos, setTodos] = useState([] as Todo[]);

useEffect(() => {
    if (serverState.status === "data") {
        setTodos(serverState.payload)
    }
}, [serverState])
```

```tsx
// After
const [serverState, setServerState] = useState({status: "loading"} as GetServerState<Todo[]>);
const [userTodos, setTodos] = useState(null as Todo[]);
const todos = userTodos ?? (serverState.status === "data" ? serverState.payload : []);
```

As it turns out, the mental model of "sync client data from the server state" can be more accurately reflected by "use server data when the client's data is missing"

This approach even works for TanStack Query data fetching:

```tsx
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getTodos, updateTodos, type Todo } from "#/services";

function App() {
    const { data: serverTodos, error, isLoading, refetch } = useQuery({
        queryKey: ['data'],
        queryFn: async ({signal}) => {
            return getTodos({signal});
        }
    })

    const [manualTodos, setTodos] = useState<Todo[] | null>(null);
    const todos = manualTodos ?? serverTodos ?? [];

    const saveTodos = useMutation({
        mutationFn: async (todos: Todo[]) => {
            await updateTodos(todos)
        },
        onSuccess: () => {
            refetch().then((result) => result.isSuccess && setTodos(null));
        }
    });

    return (
        <div>
            {isLoading && <p>Loading...</p>}
            {error && <p>Error loading todos</p>}
            <ul>
                {todos.map(todo => (
                    <li key={todo.id}>
                        {todo.title} {todo.completed ? "(Completed)" : "(Pending)"}
                    </li>
                ))}
            </ul>
            <button onClick={() => setTodos([...todos, { id: Date.now(), title: 'New Todo', completed: false }])}>
                Add Todo
            </button>
            <button
                disabled={saveTodos.isPending}
                onClick={() => saveTodos.mutate(todos)}
            >
                Save Todos
            </button>
            {saveTodos.isPending && <p>Saving...</p>}
            {saveTodos.error && <p>Error saving todos</p>}
            {saveTodos.isSuccess && <p>Todos saved successfully</p>}
        </div>
    );
}
```

In fact, this guidance allows us to remove a `useEffect` in both code samples; in line with [React's official "You Might Not Need an Effect" documentation page](https://react.dev/learn/you-might-not-need-an-effect).

Hopefully, this approach clarifies how to manage client and server state in a more predictable and efficient manner, reducing the need for unnecessary effects and keeping your components simpler and easier to reason about.
