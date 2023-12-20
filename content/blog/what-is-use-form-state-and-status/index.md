---
{
    title: "What is React's useFormState and useFormStatus?",
    description: "",
    published: '2023-12-20T21:52:59.284Z',
    authors: ['crutchcorn'],
    tags: ['react', 'webdev', 'javascript'],
    attached: [],
    license: 'cc-by-4',
    collection: "react-beyond-the-render",
    order: 7
}
---

Thus far in our article series, we've taken a look at how React handles reactivity, server rendering, and how to send data back and forth between our React-based server and our client.

In particular, our last article outlined how we can send data from the server down to the client and back:

![The server passes down data via async server components and is passed back data via server actions](../what-are-react-server-actions/back-and-forth-server-actions.svg)

This is a great _almost_ bi-directional communication.

> Why do you say "almost"? What's missing?

Well, once you send an action back to the server, how do you get a response back from the server? What happens if the server action needs to inform you of some status?

Well, this is where `useFormStatus` and `useFormState` come into play:

![Async data sends info to the client, server actions send it back to the server, useFormState listens for returned data from the server action](./back-and-forth-use-form-state.svg)



# What is `useFormStatus`?

`useFormStatus` allows developers to listen for state changes on their React Server Actions. IE: When a server action is pending or not.

While `useFormStatus` isn't directly a way to listen for changes from the server (instead it relies on the information on the client to show its metadata) it allows us to make a nicer user experience by showing a loading indicator while the server is taking its action.

------------------------------------------
---------------------
---------------------
---------------------
---------------------
---------------------
---------------------
---------------------
---------------------
---------------------
---------------------
---------------------
---------------------



- It works on the client

```jsx
import { useFormStatus } from 'react-dom';

function Submit() {
  const status = useFormStatus();
  return (
    <button disabled={status.pending}>
      {status.pending ? 'Sending...' : 'Send'}
    </button>
  );
}

function App() {
  async function waitASecond() {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }

  return (
    <form action={waitASecond}>
      <Submit />
    </form>
  );
}
```

> **A note about `useFormStatus`:**
> You might be wondering why I've extracted the `Submit` component into its own function. This is because `useFormStatus` is a hook that implicitly gathers its state from the parent `<form>` element.
> 
> If you were to use `useFormStatus` inside of the `App` component, it would not work as expected. This is because the `App` component is not a child of the `<form>` element.
> 
> For example, the following code would not work as expected:
> ```jsx
> // This code does not work, as `useFormStatus` is not a child of the <form> element
> function App() {
>   async function waitASecond() {
>     await new Promise((resolve) => {
>       setTimeout(() => {
>         resolve();
>       }, 1000);
>     });
>   }
>   
>   const status = useFormStatus();
> 
>   return (
>     <form action={waitASecond}>
>       <button disabled={status.pending}>
>        {status.pending ? 'Sending...' : 'Send'}
>       </button>
>     </form>
>   );
> }
> ```


## `useFormStatus` usage with server actions

But of course it works with server actions as well:

```jsx
// TODO: Write real world example
```

# What is `useFormState`?

It works on the client:

```jsx
function App() {
  async function sayHi() {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
    return 'Value from the action';
  }

  const [state, action] = useFormState(sayHi, 'Initial value');

  return (
    <form action={action}>
      <p>{state}</p>
      <button>Submit</button>
    </form>
  );
}
```

## `useFormState` usage with server actions

But of course it works with server actions as well:

```jsx
// TODO: Write real world example
```

## `useFormState` usage without client-side JavaScript

Because `useFormState` utilizes the `<form>` element's native `action` attribute under-the-hood, it works even without JavaScript enabled.

Assume you have the above sample code, but you have JavaScript disabled. When you click the submit button, the form will submit to the `action` attribute, and the page will refresh with the new information for the user.

<!-- TODO: Include video to showcase -->

> Keep in mind that any client-side React code will not run if JavaScript is disabled. This includes the `useEffect` Hook among others.

# Use `useFormState` and `useFormStatus` together

```jsx
function Submit() {
  const status = useFormStatus();
  return (
    <button disabled={status.pending}>
      {status.pending ? 'Sending...' : 'Send'}
    </button>
  );
}

function App() {
  async function sayHi() {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
    return 'Value from the action';
  }

  const [state, action] = useFormState(sayHi, 'Initial value');

  return (
    <form action={action}>
      <p>{state}</p>
      <Submit />
    </form>
  );
}
```

We can even expand this into our real world example:

```jsx
// TODO: Write real world example
```

# Conclusion

// TODO: Write
