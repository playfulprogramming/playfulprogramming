---
{
title: "TanStack Router: How to protect routes with an authentication guard",
published: "2025-06-22T14:49:00Z",
edited: "2025-06-21T13:58:40Z",
tags: ["react", "typescript", "tanstack"],
description: "Some routes in your application require authentication or other conditions to be met before users can...",
originalLink: "https://leonardomontini.dev/tanstack-router-guard/",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

Some routes in your application require authentication or other conditions to be met before users can access them. TanStack Router provides a powerful guard mechanism to handle these scenarios through the `beforeLoad` function, which allows you to intercept route navigation and enforce access control rules before any components are rendered.

## Protecting a route

When you define a route with `createFileRoute` you have can specify a function in the `beforeLoad` property. This function will be called before the route is loaded, allowing you to perform checks and potentially redirect the user if they don't meet the required conditions.

An example:

```tsx
import { redirect, createFileRoute } from '@tanstack/react-router';
import { isAuthenticated } from '../utils/auth';

export const Route = createFileRoute('/profile')({
  component: RouteComponent,
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/' });
    }
  },
});
```

With this setup, the page will not be loaded at all if the user is not authenticated (e.g. the component will not be rendered). Instead, the user will be redirected to the home page.

## Protecting multiple routes

With the previous example you're already protecting the `/profile` route, and potentialy every other child route as each `beforeLoad` function is called when traversing the route tree.

However, in some cases you might not have a single route (and its children) to protect, but a series of sibling routes. While you can indeed replicate the same logic in each route's `beforeLoad`, there are better ways to handle this.

An approach is to follow the same pattern you would do to create shared layouts and add the guard logic in there. For example, your route tree could look like this:

```tsx
src/
├── routes/
│   ├── __root.tsx
│   ├── index.tsx
│   ├── login.tsx
│   └── (authenticated)/
│       ├── route.tsx
│       ├── profile.tsx
│       ├── settings.tsx
│       └── dashboard.tsx
```

Inside the `(authenticated)` folder you can find three "regular" routes, but also a `route.tsx` file, a special name that will not define a specific route but will be used as common layout for all the routes inside the folder. This is where you can add the guard logic:

```tsx
import { createFileRoute, redirect } from '@tanstack/react-router';
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/' });
    }
  },
});
```

### Shared layouts - optional

Notice how this route doesn't have a `component` property. This is optional as we're using the route only to group the authentication logic (so we don't need it on each sibling route) and not to render a specific component.

Once you have this setup though, this would be the first step to have a common layout (not part of this article) but all you really need is to define a `component` and make sure to add the `<Outlet />` component inside it (imported from ), so the child routes can be rendered.

```tsx
  component: () => (
    <>
      This text will show on all sibling and child routes
      <Outlet />
    </>
  ),
```

### Pathless route (folder)

Also notice how the authenticated routes are grouped in a folder named `(authenticated)` with its name enclosed in parentheses. This is a convention in TanStack Router to indicate that this folder will not appear in the URL, this is optional but often used so you can have `your-site-com/profile` instead of `your-site-com/authenticated/profile`.

## More on guards and authentication

This was just a short extract with the core concepts, you can find an extensive and step by step guide on the following video.

The video includes how to integrate with a real authentication service and how to use hooks through Router's context to access the authentication state in your routes and components.

{% youtube O6dS0_IvvK0 %}

---

Thanks for reading this article, I hope you found it interesting!

Let's connect more: https://leonardomontini.dev/newsletter

Do you like my content? You might consider subscribing to my YouTube channel! It means a lot to me ❤️
You can find it here:
[![YouTube](https://img.shields.io/badge/YouTube:%20Dev%20Leonardo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/c/@DevLeonardo?sub_confirmation=1)

Feel free to follow me to get notified when new articles are out ;)
{% embed https://dev.to/balastrong %}