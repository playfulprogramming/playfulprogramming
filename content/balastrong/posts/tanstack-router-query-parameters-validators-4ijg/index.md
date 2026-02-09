---
{
title: "TanStack Router: Query Parameters & Validators",
published: "2024-03-07T12:24:30Z",
tags: ["typescript", "react", "javascript", "tutorial"],
description: "Welcome to the third article of a series where we will explore TanStack Router, the new typesafe...",
originalLink: "https://leonardomontini.dev/tanstack-router-query-params",
coverImg: "cover-image.png",
socialImg: "social-image.png",
collection: "TanStack Router",
order: 3
}
---

Welcome to the third article of a series where we will explore TanStack Router, the new typesafe routing library (and state manager, in some cases) for React.

In the [first article](https://https://dev.to/playfulprogramming/tanstack-router-setup-routing-in-react-4gf7) we saw how to set up a new project with TanStack Router and how to create a couple of routes.

In the [second article](https://https://dev.to/playfulprogramming/tanstack-router-setup-routing-in-react-4gf7) instead, the focus was on path parameters and loaders.

In this article, we'll see how you can properly parse and handle query parameters (aka search parameters) and how they can be effectively used as a state manager. Besides, imagine being able to share your state by just passing the URL, how convenient!

## Define & Validate your Query Parameters

Here's a demo of what you're going to learn in this article. For written instructions, keep reading below.

<iframe src="https://www.youtube.com/watch?v=fE0CeXZF7CY"></iframe>

Imagine having a search page or a table with a lot of inputs for filtering the data, or maybe a dashboard with many configurable widgets. You can build your own customized view by setting those filters but as soon as you refresh the page, they're gone.

Ok, you can save them on localStorage or somewhere in the browser but... what if you want to send your exact same configuration to someone else? A friend? A colleague? Having your settings directly as query parameters in the URL is probably the easiest way, but handling them manually is far from being an easy task.

TanStack Router is designed with this scenario in mind, giving you great control over query params (aka search params). Let's see how!

**Note**: I'm assuming you already have the library set up, if not you can check my [setup video](https://youtu.be/4sslBg8LprE).

### Create your route

Let's begin with a `/search.tsx` empty page and add the link to it in your `__root.tsx`.

```tsx
<Link to="/search" activeProps={activeProps}>
  Search
</Link>
```

### Define the type

Now if we want typescript to help us enforcing and validating the correct types, we need to create them.

```ts
type ItemFilters = {
  query: string;
  hasDiscount: boolean;
  categories: Category[];
};

type Category = 'electronics' | 'clothing' | 'books' | 'toys';
```

### Write the validating function

With that defined, we should tell TanStack Router that our `/search` route has those params. We can do that by implementing and typing the `validateSearch` function.

Your `search.tsx` file at this point should look like this:

```tsx
export const Route = createFileRoute("/search")({
  component: Search
  validateSearch: (search: Record<string, unknown>): ItemFilters => {
    return {
      query: search.query as string,
      hasDiscount: search.hasDiscount === 'true',
      categories: search.categories as Category[],
    };
  },
});

function Search() {
    return (<div>Hello /search!</div>);
}
```

## Read the params

Ok cool, now you want to read them I suppose. If you followed the previous chapters, you probably already know that you can use the `Route` object in your component and get some hooks from there. `useSearchParams` is the answer.

Update your Search component to look like this:

```tsx
function Search() {
  const { query, hasDiscount, categories } = Route.useSearch();

  return <pre>{JSON.stringify({ query, hasDiscount, categories }, null, 2)}</pre>;
}
```

### Navigate with the params

Now if you noticed, there should be an error on `___root.tsx` exactly at the Link we created a few steps ago. This is a good sign! TanStack Router is informing us that our path has some required parameters you must provide. Let's do it.

```tsx
<Link
  to="/search"
  activeProps={activeProps}
  search={{
    query: 'hello',
    hasDiscount: true,
    categories: ['electronics', 'clothing'],
  }}
>
  Search
</Link>
```

The error is gone! It's time to go on your browser and click the link. You can now see a page with your params rendered as JSON.

\## Validation with a validating library

That kind of validator function we defined works, but we can do something better by using an existing validating library such as zod or valibot. Let's see the latter in an example.

```
npm i valibot
```

### Define your schema

You can now replace your type with the valibot schema.

```ts
import * as v from 'valibot';

const Category = v.union([v.literal('electronics'), v.literal('clothing'), v.literal('books'), v.literal('toys')]);

const ItemFilters = v.object({
  query: v.optional(v.string()),
  hasDiscount: v.optional(v.boolean()),
  categories: v.optional(v.array(Category)),
});

type ItemFilters = v.Output<typeof ItemFilters>;
type Category = v.Output<typeof Category>;
```

With that, your validation function will be as easy as this:

```ts
validateSearch: (search) => v.parse(ItemFilters, search),
```

## Query params as application state

The last cool feature we're gonna see today is how you can in fact use the query params as your application state. Until now we are only able to read them, but you can indeed write them in your app and see them updated real time in the URL.

The trick is to use the `navigate` function to set our params to the new state, in sync with our input.

In the video I build this step by step and the final result is as follows:

```tsx
function Search() {
  const { query, hasDiscount, categories } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const updateFilters = (name: keyof ItemFilters, value: unknown) => {
    navigate({ search: (prev) => ({ ...prev, [name]: value }) });
  };

  return (
    <div>
      <h2>Search</h2>
      You searched for: <input
        value={query}
        onChange={(e) => {
          updateFilters('query', e.target.value);
        }}
      />
      <input type="checkbox" checked={hasDiscount} onChange={(e) => updateFilters('hasDiscount', e.target.checked)} />
      <select
        multiple
        onChange={(e) => {
          updateFilters(
            'categories',
            Array.from(e.target.selectedOptions, (option) => option.value)
          );
        }}
        value={categories}
      >
        {['electronics', 'clothing', 'books', 'toys'].map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <pre>{JSON.stringify({ query, hasDiscount, categories }, null, 2)}</pre>
    </div>
  );
}
```

We can now edit all query params, see the changes in the URL and easily share the state with anyone else by just... sending them the link!

## Conclusion

We now have a state manager perfectly in sync with our URL, easy to share and validated with Typescript to ensure our params are always correct, with no unnecessary or missing values.

Wow, this library is so powerful! I hope you’re enjoying this series on TanStack!

The next chapter will be about authenticated routes, basically some pages that can only be accessed if a condition is met, for example the user is logged in. Stay tuned

---

Watch the full playlist on YouTube: [TanStack Router](https://www.youtube.com/playlist?list=PLOQjd5dsGSxJilh0lBofeY8Qib98kzmF5)

---

Thanks for reading this article, I hope you found it interesting!

I recently launched a GitHub Community! We create Open Source projects with the goal of learning Web Development together!

Join us: https://github.com/DevLeonardoCommunity

Do you like my content? You might consider subscribing to my YouTube channel! It means a lot to me ❤️
You can find it here:
[![YouTube](https://img.shields.io/badge/YouTube:%20Dev%20Leonardo-FF0000?style=for-the-badge\&logo=youtube\&logoColor=white)](https://www.youtube.com/c/@DevLeonardo?sub_confirmation=1)

Feel free to follow me to get notified when new articles are out ;)

<!-- ::user id="balastrong" -->
