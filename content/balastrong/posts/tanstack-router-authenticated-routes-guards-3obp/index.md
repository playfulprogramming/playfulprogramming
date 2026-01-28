---
{
title: "TanStack Router: Authenticated routes & Guards",
published: "2024-03-12T14:50:42Z",
tags: ["typescript", "react", "tutorial", "webdev"],
description: "Welcome to the fourth article of a series where we will explore TanStack Router, the new typesafe...",
originalLink: "https://leonardomontini.dev/tanstack-router-authenticated-guards",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "TanStack Router",
order: 4
}
---

Welcome to the fourth article of a series where we will explore TanStack Router, the new typesafe routing library for React.

In this article, we'll learn how to protect some routes (pages) of your application with a guard. In this specific example, we're going to redirect unauthorized users to the login page.

## Define a Guard

If you're following the series you already know there's always a video version showing the full walkthrough. You can find here Chapter 4 or you can keep reading for a collection of the highlights.

<iframe src="https://www.youtube.com/watch?v=O6dS0_IvvK0"></iframe>

### Create a login page

In this example we're going to protect the `/profile` page, showing it only to logged in users. Let's begin by creating a basic login page.

```tsx
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { isAuthenticated, signIn, signOut } from '../utils/auth';

export const Route = createFileRoute('/login')({
  component: Login,
});

function Login() {
  const router = useRouter();

  return (
    <>
      <h2>Login</h2>
      {isAuthenticated() ? (
        <>
          <p>Hello user!</p>
          <button
            onClick={async () => {
              signOut();
              router.invalidate();
            }}
          >
            Sign out
          </button>
        </>
      ) : (
        <button
          onClick={async () => {
            signIn();
            router.invalidate();
          }}
        >
          Sign in
        </button>
      )}
    </>
  );
}
```

For the sake of the example, I already defined a draft implementation of the auth functions used in this snippet. If you want to follow along with your app, here you are:

```ts
export function isAuthenticated() {
  return localStorage.getItem('isAuthenticated') === 'true';
}

export async function signIn() {
  localStorage.setItem('isAuthenticated', 'true');
}

export async function signOut() {
  localStorage.removeItem('isAuthenticated');
}
```

### Protect a route

Until now it was just preparation, if you already have the logic in place for your app here's where the interesting part begins.

The `createFileRoute` function takes an extra parameter called `beforeLoad` and that's what we're gonna use.

```ts
export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' });
    }
  },
  component: Login,
});
```

With this simple snippet, you already have a working demo, but we're not done yet.

This was an oversimplified example but most likely on React you're getting the authenticated boolean from a hook... and if you try to use a hook inside the beforeLoad function, React will tell you that you cannot.

So... let's see how to deal with that!

## Using data from a hook (TanStack Router Context)

In a more likely example, you might have a hook like this (well, hopefully not storing on localStorage but with data coming from/to an API).

```ts
export const useAuth = () => {
  const signIn = () => {
    localStorage.setItem('isAuthenticated', 'true');
  };

  const signOut = () => {
    localStorage.removeItem('isAuthenticated');
  };

  const isLogged = () => localStorage.getItem('isAuthenticated') === 'true';

  return { signIn, signOut, isLogged };
};

export type AuthContext = ReturnType<typeof useAuth>;
```

We now need to inform TanStack Router about this information, using its context.

### Defining the context

The first step to define the context is obviously defining its type. See the last line in the previous snippet? We can use that!

```ts
type RouterContext = {
  authentication: AuthContext;
};
```

You can define it in a dedicated file, or directly in your `___root.tsx` as it's the file where you're gonna use it.

You probably are already using `createRootRoute`, you can replace it with `createRootRouteWithContext` like so:

```ts
export const Route = createRootRouteWithContext<RouterContext>()({
```

Don't forget to add the extra `()` at the end.

### Updating the RouterProvider

You should now see an error in the file where you defined your RouterProvider, since you need to pass the newly defined context.

```tsx
const router = createRouter({
  routeTree,
  context: { authentication: undefined! },
});
```

Now your router knows about a context, but it is empty... let's fill it!

```tsx
function App() {
  const authentication = useAuth();
  return <RouterProvider router={router} context={{ authentication }} />;
}
```

And... that's it!

### Reading the context

You can now update the protected page like so:

```tsx
export const Route = createFileRoute('/profile')({
  beforeLoad: async ({ context }) => {
    const { isLogged } = context.authentication;
    if (!isLogged()) {
      throw redirect({ to: '/login' });
    }
  },
  component: Profile,
});
```

The difference is that you can now read `{ context }` where you will find data from your hook(s).

## Protecting multiple routes at once

A straightforward way to protect multiple routes in a folder, is by creating a file with the same name, defining just the `beforeLoad` function.

Let's create a couple of routes we want to protect:

```
src/
  routes/
    authenticated/
      dashboard.tsx
      profile.tsx
```

Now, create a file in `src/routes/authenticated.ts` with the following content:

```tsx
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    const { isLogged } = context.authentication;
    if (!isLogged()) {
      throw redirect({ to: '/login' });
    }
  },
});
```

And that's it! All files inside the `/authenticated` folder will be protected.

## Removing /authenticated from the URL

You most likely do not want to see the parent route in the URL, which is reasonable. It's as easy as adding an underscore `_` in the route, renaming it to `_authenticated`.

You can now navigate to `https://localhost:5173/dashboard` and if you're logged in, you can access the page!

\## Conclusion

We can now protect a single route or a tree of routes, and group some routes in folders that are not shown in the URL.

If a user navigates to one of the protected routes, we can redirect them to a login page.

---

Watch the full playlist on YouTube: [TanStack Router](https://www.youtube.com/playlist?list=PLOQjd5dsGSxJilh0lBofeY8Qib98kzmF5)

---

You can find the full code on [this repository](https://github.com/Balastrong/tanstack-router-demo/) on the [04-authenticated-routes](https://github.com/Balastrong/tanstack-router-demo/tree/04-authenticated-routes). Leave a ⭐️ if you found the demo code useful!

---

Thanks for reading this article, I hope you found it interesting!

I recently launched a GitHub Community! We create Open Source projects with the goal of learning Web Development together!

Join us: https://github.com/DevLeonardoCommunity

Do you like my content? You might consider subscribing to my YouTube channel! It means a lot to me ❤️
You can find it here:
[![YouTube](https://img.shields.io/badge/YouTube:%20Dev%20Leonardo-FF0000?style=for-the-badge\&logo=youtube\&logoColor=white)](https://www.youtube.com/c/@DevLeonardo?sub_confirmation=1)

Feel free to follow me to get notified when new articles are out ;)

<!-- ::user id="balastrong" -->
