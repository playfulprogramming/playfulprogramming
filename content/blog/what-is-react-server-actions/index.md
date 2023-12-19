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
"use client"
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

Just as "use client" is used to denote a client component in an otherwise fully-server environment; "use server" is used to mark a function as running on the server rather than the client.

# List of errors to mention in blog post

Here's a list of errors I want to mention in the blog post:

## "use server" is not allowed in client components

When using the following:

```jsx
"use client"
import { useCallback, useState } from "react";

export function Todo({ todos }) {
  // ...
  
  export async function addTodo(formData) {
    "use server";
    const todo = formData.get("todo");
    await addTodoToDatabase(todo);
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

The error looks like:

```
Error:
  × It is not allowed to define inline "use server" annotated Server Actions in Client Components.
  │ To use Server Actions in a Client Component, you can either export them from a separate file with "use server" at the top, or pass them down through props from a Server Component.
  │
  │ Read more: https://nextjs.org/docs/app/api-reference/functions/server-actions#with-client-components
```

## Cannot pass non-server action function to client component

When trying to do something like this:

```jsx
// Server component
import { Todo } from "./client";
import { getTodos } from "./todos";

export default async function Home() {
	const todos = await getTodos();
	const addTodo = () => {
		console.log("Testing");
	};
	return <Todo todos={todos} addTodo={addTodo} />;
}
```

You get the following error:

```
⨯ Error: Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server".
<... todos={[...]} addTodo={function}>
^^^^^^^^^^
```

## Server functions must be async

When trying to do something like this:

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

You get the following error:

```
Error:
  × Server actions must be async functions
```
