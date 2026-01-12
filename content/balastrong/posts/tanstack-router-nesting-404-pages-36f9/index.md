---
{
title: "TanStack Router: Nesting & 404 pages",
published: "2024-04-09T17:27:47Z",
edited: "2024-04-23T10:53:46Z",
tags: ["typescript", "react", "tutorial", "codenewbie"],
description: "Welcome to the fifth article of a series where we will explore TanStack Router, the new typesafe...",
originalLink: "https://leonardomontini.dev/tanstack-nesting-404/",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "TanStack Router",
order: 5
}
---

Welcome to the fifth article of a series where we will explore TanStack Router, the new typesafe routing library (and state manager, in some cases) for React.

Today's topic is a few tips and tricks for nesting and managing routes.

## Nesting Routes

We saw that in the file-based approach, nesting a page inside some folders will automatically create a nested route. This is a great feature that allows you to organize your project in a more structured way.

For example a file that is inside `src/routes/admin/dashboard.tsx` will be accessible at `/admin/dashboard`.

However, in some cases you might have some folders you don't want to be part of the URL. Let's see what you can do

### Hidden path

This is the simplest way, assuming you only want to group some pages together but you don't want to expose the folder name in the URL: make sure to rename your folder enclosing it in parentheses.

For example, if you have a folder `src/routes/(admin)/dashboard.tsx`, the route will be `/dashboard`.

### Common layout (visible)

In some cases, having routes grouped inside a folder is not only to organize the code but also to wrap all of them inside a common layout, for example a navigation bar or some kind of framing.

Let's take this example:

```tsx
// src/routes/(hidden-folder)/layouts/visibleLayout.tsx
export const Route = createFileRoute('/(hidden-folder)/layouts/visibleLayout')({
  component: () => (
    <div>
      <p>This layout is visible in the URL 👀</p>
      <Link to="/layouts/visibleLayout/foo">Foo</Link> <Link to="/layouts/visibleLayout/bar">Bar</Link>
      <hr />
      <Outlet />
    </div>
  ),
});
```

This is the layout that will be visible in the URL, and it will wrap the children routes.

```tsx
// src/routes/(hidden-folder)/layouts/visibleLayout/foo.tsx
export const Route = createFileRoute('/(hidden-folder)/layouts/visibleLayout/foo')({
  component: () => <div>Hello /(hidden-folder)/layouts/visibleLayout/foo!</div>,
});
```

```tsx
// src/routes/(hidden-folder)/layouts/visibleLayout/bar.tsx
export const Route = createFileRoute('/(hidden-folder)/layouts/visibleLayout/bar')({
  component: () => <div>Hello /(hidden-folder)/layouts/visibleLayout/bar!</div>,
});
```

In this case, the routes will be `/layouts/visibleLayout/foo` and `/layouts/visibleLayout/bar` and they will share the two links to navigate between them.

### Common layout (hidden)

If you want to have a common layout but you don't want it to be visible in the URL, you can use the same approach as before but make sure to add an underscore `_` before the folder name and the layout name.

```
src/routes/(hidden-folder)/layouts/_hiddenLayout.tsx
src/routes/(hidden-folder)/layouts/_hiddenLayout/foo.tsx
src/routes/(hidden-folder)/layouts/_hiddenLayout/bar.tsx
```

In this case, the routes will be `layouts/foo` and `layouts/bar`.

### Dot notation

Having all routes nested inside folder is handy for someone, but might be confusing if you have multiple levels of nesting that are only there to have a certain url.

For example, you might want to achieve a route that is `/admin/new/dashboard/overview` but you don't want to have all these folders in your project structure.

Your filename can be:

```
src/routes/admin.new.dashboard.overview.tsx
```

And the great news is that you don't have to choose between having a flat structure or a nested one, you can mix them as you like.

## 404 pages

Grouping and nesting pages is cool, but what happens if the user hits an url that is not mapped to any route? You can customize the 404 page!

One of the properties of the `createRouter` function you're probably using in `App.tsx` to create your router `defaultNotFoundComponent`.

As the name suggests, you can pass here a component that will be rendered when the user visits a route that cannot be mapped to any of the existing ones.

### Dedicated 404 pages

The one we just saw is a global 404 page, but you can also have dedicated 404 pages for specific routes. In our layout example, let's say we want a custom 404 page if the user goes on `/layouts/visibleLayout/unknown`.

```tsx
// src/routes/(hidden-folder)/layouts/visibleLayout.tsx
export const Route = createFileRoute('/(hidden-folder)/layouts/visibleLayout')({
  component: () => (
    <div>
      <p>This layout is visible in the URL 👀</p>
      <Link to="/layouts/visibleLayout/foo">Foo</Link> <Link to="/layouts/visibleLayout/bar">Bar</Link>
      <hr />
      <Outlet />
    </div>
  ),
  notFoundComponent: () => <div>I'm the Not found page, inside /visibleLayout</div>,
});
```

By adding a `notFoundComponent` property to the route you have to job done!

Going to `/non-existent-page` will render the `defaultNotFoundComponent` you defined in the `createRouter` function, while going to `/layouts/visibleLayout/non-existing-page` will render the custom 404 page you defined here above.

## Demo time!

You can see all these features in action in the video I published on my YouTube channel:

{% youtube 48JS96u6GDc %}

I hope you found this article helpful! We've seen how to nest routes and how to handle 404 pages in TanStack Router by controlling the nesting of files and folder... but... what if you wanted to achieve all of that without having to rely on the filesystem?

Stay tuned for the next article where we'll see how to use the code-based approach to define your routes!

---

Watch the full playlist on YouTube: [TanStack Router](https://www.youtube.com/playlist?list=PLOQjd5dsGSxJilh0lBofeY8Qib98kzmF5)

---

You can find the full code on [this repository](https://github.com/Balastrong/tanstack-router-demo/) on the [05-nested-routes](https://github.com/Balastrong/tanstack-router-demo/tree/05-nested-routes). Leave a ⭐️ if you found the demo code useful!

---

---

Thanks for reading this article, I hope you found it interesting!

I recently launched a GitHub Community! We create Open Source projects with the goal of learning Web Development together!

Join us: https://github.com/DevLeonardoCommunity

Do you like my content? You might consider subscribing to my YouTube channel! It means a lot to me ❤️
You can find it here:
[![YouTube](https://img.shields.io/badge/YouTube:%20Dev%20Leonardo-FF0000?style=for-the-badge\&logo=youtube\&logoColor=white)](https://www.youtube.com/c/@DevLeonardo?sub_confirmation=1)

Feel free to follow me to get notified when new articles are out ;)
{% embed https://dev.to/balastrong %}
