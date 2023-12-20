---
{
    title: "What are React Server Actions?",
    description: "",
    published: '2023-12-19T21:52:59.284Z',
    authors: ['crutchcorn'],
    tags: ['react', 'webdev'],
    attached: [],
    license: 'cc-by-4',
    collection: "react-beyond-the-render",
    order: 6
}
---

In our last article, we talked about [React's `use` hook and Async Server Components](/posts/what-is-react-suspense-and-async-rendering); both means to handle async operations to display in a render.

In the conclusion of that article, I hinted that there was going to be more to the Server Components story. Well, sure enough there is in the form of React Server Actions.

First though, let's talk about the client-side once again.

# What are React `<form>` actions?

Let's say that we're building a todo list application:

```jsx
function App() {
	const id = useRef(0);
	const [todos, setTodos] = useState([]);
	const [todoInput, setTodoInput] = useState("");

	function addTodo(e) {
		e.preventDefault();
		setTodos([...todos, { value: todoInput, id: ++id.current }]);
	}

	return (
		<>
			<ul>
				{todos.map((todo) => {
					return <li key={todo.id}>{todo.value}</li>;
				})}
			</ul>
			<form onSubmit={addTodo}>
				<input
					name="todo"
					value={todoInput}
					onChange={(e) => setTodoInput(e.target.value)}
				/>
				<button type="submit">Add Todo</button>
			</form>
		</>
	);
}
```

<!-- TODO: embed react-classic-todo -->

This works, but notice how we're having to `preventDefault` here. This is because we're sidestepping [`<form>`'s native `submit` event's behavior](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event); [submitting a form using the `action` property](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/action).

Luckily, the React core team has noticed this and introduced a means to passing a function in the `action` property in our client-side React applications:

```jsx
function App() {
	const id = useRef(0);
	const [todos, setTodos] = useState([]);

	async function addTodo(formData) {
		const todo = formData.get("todo");
		setTodos([...todos, { value: todo, id: ++id.current }]);
	}

	return (
		<>
			<ul>
				{todos.map((todo) => {
					return <li key={todo.id}>{todo.value}</li>;
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

<!-- TODO: embed react-form-action -->

> **A note on API versioning:**
>
> This feature is only currently available in [React Canary releases](https://react.dev/community/versioning-policy#canary-channel). This won't work with the current stable release.

This allows us to write less code and focus less on default DOM behavior and shift our efforts to shipping code.

Now that we've seen how `<form>` actions work on the client, let's move back to the server and look at React server actions:

# What are React Server Actions?

In short; React Server Actions are a way to call server-side code in React's client-side rendering. If asynchronous server components with `await` in them allow you to pass server data to the client, server actions enable you to pass data back from the client to the server.

![// TODO: Write alt](back-and-forth-server-actions.svg)

However, to pass a function from a server component down to the client we must designate our functions we want to pass with a special boundary string.

# What is `"use server"`?

`"use server"` is the boundary string in React server apps that allows us to mark a function as "ready to pass to the client".

Let's take our previous todo list and migrate the state to the server. This way all of our friends can see our shopping list!

We'll start by using [async server components](/posts/what-is-react-suspense-and-async-rendering#What-are-React-Async-Server-Components) to pass our todo list in from the server's database:

```jsx
// Theoretical API from a database wrapper
import { getTodos } from "./todos";

export default async function Todo() {
	const todos = await getTodos();
	return (
		<>
			<ul>
				{todos.map((todo) => {
					return <li key={todo.id}>{todo.value}</li>;
				})}
			</ul>
        	<!-- This form doesn't work yet -->
			<form>
				<input name="todo" />
				<button type="submit">Add Todo</button>
			</form>
		</>
	);
}
```

Now we have a way to pass data to the client, but not a way to get the user's input back. Let's fix that by passing a server action to the client and using `<form action={}/>` to call this function for us:

```jsx
import { addTodoToDatabase, getTodos } from "./todos";
import { redirect } from "next/navigation";

export default async function Todo() {
	const todos = await getTodos();
	async function addTodo(formData) {
		"use server";
		const todo = formData.get("todo");
		await addTodoToDatabase(todo);
		// Refresh the page to see the new todo
		redirect("/");
	}
	return (
		<>
			<ul>
				{todos.map((todo) => {
					return <li key={todo.id}>{todo.value}</li>;
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

<!-- Add embed: nextjs-server-actions-server-comps -->

Now if we:

- Type something in the `<input/>`
- Click "Add Todo"
- Wait a moment

We'll see the todo we typed show up for all of our users on the page.

> Keep in mind, this is using REST APIs, so it won't auto-refresh the page for all users, just the user who added the todo.

## Adding in client-side components

Notice that we're only exclusively using a server-component in the example above. Because of this, we don't have any loading indicator for the time the server is adding our todo.

Let's add a `useState` in our client-component to solve this user experience problem:

```jsx
import { Todo } from "./client";
import { addTodoToDatabase, getTodos } from "./todos";

export default async function Home() {
	const todos = await getTodos();

	async function addTodo(formData) {
		"use server";
		const todo = formData.get("todo");
		await addTodoToDatabase(todo);
	}

	return <Todo todos={todos} addTodo={addTodo} />;
}
```

```jsx
// client.jsx
"use client";

import { useCallback, useState } from "react";

export function Todo({ todos, addTodo }) {
	const [isLoading, setIsLoading] = useState(false);

	const addTodoAndRefresh = useCallback(async (formData) => {
		await addTodo(formData);
		window.location.reload();
	}, []);

	return (
		<>
			{isLoading && <p>Adding todo...</p>}
			<ul>
				{todos.map((todo) => {
					return <li key={todo.id}>{todo.value}</li>;
				})}
			</ul>
			<form
				action={addTodoAndRefresh}
				onSubmit={() => {
					// We're using onSubmit so that we don't have to wait for the server
					// to get the request before we set isLoading to true
					setIsLoading(true);
				}}
			>
				<input disabled={isLoading} name="todo" />
				<button disabled={isLoading} type="submit">
					Add Todo
				</button>
			</form>
		</>
	);
}
```

<!-- Embed: nextjs-server-actions-client-comps -->

Instead of passing a server action from a server component, we could also mark a whole file as `"use server"` and import it from there;

```jsx
// server-actions.js
"use server";

import { addTodoToDatabase } from "./todos";

export async function addTodo(formData) {
    const todo = formData.get("todo");
    await addTodoToDatabase(todo);
}
```

```jsx
// client.jsx
"use client";

import { addTodo } from "./server-actions";
import { useCallback, useState } from "react";

export function Todo({ todos, addTodo }) {
	const [isLoading, setIsLoading] = useState(false);

	const addTodoAndRefresh = useCallback(async (formData) => {
		await addTodo(formData);
		window.location.reload();
	}, []);

	return (
		// ...
	);
}
```

> **Be careful what you export:**
>
> Don't mark your whole database API file as `"use server"`, otherwise it makes it easier to accidentally cause a security issue by exposing functions you might not wanted to've done otherwise.

## What happens if you don't mark a function with `"use server"`?

If you forget to mark your server action with the `"use server"` string, like so;

```jsx
// Server component
import { Todo } from "./client";
import { getTodos } from "./todos";

export default async function Home() {
	const todos = await getTodos();
	const addTodo = () => {
		// ...
	};
	return <Todo todos={todos} addTodo={addTodo} />;
}
```

You get the following error, reminding you to explicitly mark your function as being ready to pass to the client:

```
⨯ Error: Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server".
<... todos={[...]} addTodo={function}>
^^^^^^^^^^
```

This is a safety feature so you don't end up enabling the client to call functions that aren't allowed.

## Are synchronous functions allows in React server actions? 

No. Only `async` functions are allowed in server actions. If you forget to mark your action as `async`;

```jsx
// Server component
import { Todo } from "./client";
import { getTodos } from "./todos";

export default async function Home() {
	const todos = await getTodos();
	const addTodo = () => {
        "use server"
		console.log("Testing");
	};
	return <Todo todos={todos} addTodo={addTodo} />;
}
```

You'll receive the following error:

```
Error:
  × Server actions must be async functions
```

## Can you define server actions in a client component file?

No. You cannot mix-and-match server action definitions within your client component files. If you do the following:

```jsx
"use client"

export function Todo({ todos }) {
  // ...
  
  export async function addTodo(formData) {
    "use server";
    // ...
  }
  
  return (
    <>
      {/* ... */}
      <form
        action={addTodo}
      >
        {/* ... */}
      </form>
    </>
  );
}
```

You'll see an error that looks like:

```
Error:
  × It is not allowed to define inline "use server" annotated Server Actions in Client Components.
  │ To use Server Actions in a Client Component, you can either export them from a separate file with "use server" at the top, or pass them down through props from a Server Component.
  │
  │ Read more: https://nextjs.org/docs/app/api-reference/functions/server-actions#with-client-components
```

> **Remember where to place your server actions:**
> Server actions can only be defined in a file with `"use server"` at the top or passed in via a server component marked with `"use server"` at the top of the function definition.

# Conclusion



