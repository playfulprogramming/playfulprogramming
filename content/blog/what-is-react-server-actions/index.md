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
