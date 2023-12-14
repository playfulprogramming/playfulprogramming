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

# What is Reactivity?

> This article is intended for newcomers to HTML and JavaScript programming. However, it's suggested that you read [this article explaining what the DOM is](/posts/understanding-the-dom) first.

As an experienced frontend engineer, I'm often asked:

> "Why would you want to use a modern frontend framework like React, Angular, or Vue?"

While [I have a whole (free) book on the topic](https://framework.guide), my short answer is typically "Reactivity". The follow-up response I usually get from this is:

> "What is reactivity?"

In short, **Reactivity is the ability to reflect what's in your JavaScript application's memory on the DOM as HTML**.

See, when you're building a website using only static HTML, the output to the DOM is straightforward.

```html
<!-- index.html -->
<main id="a">
	<ul id="b">
		<li id="c">Item 1</li>
		<li id="d">Item 2</li>
	</ul>
	<p id="e">Text here</p>
</main>
```



![// TODO: Write alt](../understanding-the-dom/dom_tree.svg)



The problems start when we want to introduce interactivity into our output. 

Let's build a small-scale application that:

- Has a button with a counter inside of it
- Start the counter at `0`
- Every time the button is clicked, add one to the counter

![// TODO: Write alt](./step_1.svg)

To do this, let's start with some HTML:

```html
<main>
  <button id="add-button">Count: 0</button>
</main>
```

Then we can add in the required JavaScript to make the button functional:

```html
<script>
  let count = 0;

  const addBtn = document.querySelector('#add-button');
  addBtn.addEventListener('click', () => {
    count++;
    addBtn.innerText = `Count: ${count}`;
  });
</script>
```

<iframe data-frame-title="Example #1 - StackBlitz" src="uu-code:./step1-code?template=node&embed=1&file=index.html" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Adding a List

Not too bad, let's increase the difficulty a bit by:

- Adding an unordered list (`<ul>`)
- Every time `count` is increased, add a new `<li>` with a unique string inside

![// TODO: Write](./step_2.svg)



That might look something like this:

```html
<main>
  <button id="add-button">Count: 0</button>
  <ul id="list"></ul>
</main>
<script>
  let count = 0;

  const listEl = document.querySelector('#list');

  function makeListItem(innerText) {
    const li = document.createElement('li');
    li.innerText = innerText;
    listEl.append(li);
  }

  const addBtn = document.querySelector('#add-button');
  addBtn.addEventListener('click', () => {
    count++;
    addBtn.innerText = `Count: ${count}`;
    makeListItem(`List item: ${count}`);
  });
</script>
```

<iframe data-frame-title="Example #2 - StackBlitz" src="uu-code:./step2-code?template=node&embed=1&file=index.html" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Removing items from the list

Okay! Things are heating up! For one last exercise, let's:

- Add a button that removes `1` from `count`
- When this button is pressed, remove the last element from the list

![// TODO: Write alt](./step_3.svg)

> Notice how complex our logic tree is getting?

```html
<main>
  <button id="add-button">Add one to: 0</button>
  <button id="remove-button">Remove one from: 0</button>
  <ul id="list"></ul>
</main>
<script>
  let count = 0;

  const listEl = document.querySelector('#list');

  function makeListItem(innerText) {
    const li = document.createElement('li');
    li.innerText = innerText;
    listEl.append(li);
  }

  function removeListItem() {
    listEl.lastChild.remove();
  }

  const addBtn = document.querySelector('#add-button');
  const removeBtn = document.querySelector('#remove-button');

  function updateBtnTexts() {
    addBtn.innerText = `Add one to: ${count}`;
    removeBtn.innerText = `Remove one from: ${count}`;
  }

  addBtn.addEventListener('click', () => {
    count++;
    updateBtnTexts();
    makeListItem(`List item: ${count}`);
  });

  removeBtn.addEventListener('click', () => {
    count--;
    updateBtnTexts();
    removeListItem();
  });
</script>
```

<iframe data-frame-title="Example #3 - StackBlitz" src="uu-code:./step3-code?template=node&embed=1&file=index.html" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

> Wow! That got complex, quick, didn't it?!

Exactly... That leads me to the question:

## Shouldn't it be simpler?

Notice how each time we added another item that depended on `count`, our data didn't change. Instead, we had to add ever increasing levels of complexity to our codebase to glue our JavaScript state to the DOM representation of said state.

If we strip away all of this glue, we're left with a drastically simplified codebase:

```html
<main>
  <button id="add-button">Add one to: 0</button>
  <button id="remove-button">Remove one from: 0</button>
  <ul id="list"></ul>
</main>
<script>
  // Magical land where `count` changes auto-update the DOM
  let count = 0;

  addBtn.addEventListener('click', () => {
    count++;
  });

  removeBtn.addEventListener('click', () => {
    count--;
  });
</script>
```



![// TODO: Write alt](./step_3_simplified.svg)

> Look at how many lines disappeared!

Not only is this nicer method of writing code theoretically possible, it's widely adopted by millions of developers via a frontend framework.

Some examples of frontend frameworks include:

- [React](https://react.dev/)
- [Angular](https://angular.dev/)
- [Vue](https://vuejs.org/)

These frameworks allow you to write code that focused on the data in JavaScript, rather than how it will be bound to the DOM:

<!-- tabs:start -->

### React

```jsx
const App = () => {
	const [count, setCount] = useState(0);

	return (
		<div>
			<button onClick={() => setCount(count + 1)}>Add one to: {count}</button>
			<button onClick={() => setCount(count - 1)}>
				Remove one from: {count}
			</button>
			<ul>
				{Array.from({ length: count }).map((_, i) => (
					<li>List item {i}</li>
				))}
			</ul>
		</div>
	);
};
```

<iframe data-frame-title="React Reactivity - StackBlitz" src="uu-code:./react-reactivity?template=node&embed=1&file=&file=src%2Fmain.jsx" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

### Angular

```typescript
@Component({
	selector: "app-root",
	standalone: true,
	imports: [NgFor],
	template: `
		<button (click)="count = count + 1">Add one to: {{ count }}</button>
		<button (click)="count = count - 1">Remove one from: {{ count }}</button>
		<ul>
			<li *ngFor="let item of [].constructor(count); let i = index">
				List item {{ i }}
			</li>
		</ul>
	`,
})
export class AppComponent {
	count = 0;
}
```

<iframe data-frame-title="Angular Reactivity - StackBlitz" src="uu-code:./angular-reactivity?template=node&embed=1&file=src%2Fmain.ts" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

### Vue

```vue
<script setup>
import { ref } from "vue";

const count = ref(0);
</script>

<template>
	<button @click="count++">Add one to: {{ count }}</button>
	<button @click="count--">Remove one from: {{ count }}</button>
	<ul id="list">
		<li v-for="(_, i) of [].constructor(count)">List item {{ i }}</li>
	</ul>
</template>
```

<iframe data-frame-title="Vue Reactivity - StackBlitz" src="uu-code:./vue-reactivity?template=node&embed=1&file=src%2FApp.vue" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<!-- tabs:end -->









# What is Reconciliation?

OK now "reconciliation" 

Eventually React needs to know what needs rendering and what doesn't

So, for example, say you have:

```
- List item 1
- List item 2
```

And want to add an item to the list. You ideally don't want React to have to re-render items 1&2, because it's expensive

By default, it will do that

But, if you add a `key` in a list, React is able to figure out what elements associate with what keys and prevent a re-render

![](https://media.discordapp.net/attachments/609441345223917590/1166186746149617794/image.png?ex=658a2c8a&is=6577b78a&hm=db491f9296ee74611891edbcb4af7c4be585a737ef7a62e93a9fd15255f71077&=&format=webp&quality=lossless&width=2879&height=1003)

-----------------------------------------------------------------

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
