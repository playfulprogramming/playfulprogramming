---
{
  title: "Week 11 - Tier 2 Homework",
  published: "2026-03-18T21:00:00.000Z",
  order: 15,
  noindex: true
}
---

# Using Route Parameters

This homework continues from the [Tier 1 project](/posts/pfp-bootcamp-2026-wk11-hw1).

We want our site to display a list of blog posts. Each post should have its own page where the full content is displayed, while the homepage should list the title of each post.

Start by defining some post data in a `posts.js`:

```js
export const posts = [
  {
    id: "first-post",
    title: "My First Post",
    content: "This is the first post on my new blog."
  },
  {
    id: "react-is-cool",
    title: "React is Cool",
    content: "Did you know that this website was built with React?"
  },
  {
    id: "ten-web-frameworks-of-2026",
    title: "Top 10 frameworks of 2026",
    content: "These are 10 of the web frameworks you'll see in 2026: React, React, React, React, React, React, React, React, React, React."
  }
];
```

## Creating parameterized route

Read through React router's documentation on [URL Values](https://reactrouter.com/start/declarative/url-values).

You can define path parameters by prefixing a ":" character before a piece of the path.

Let's create a new "BlogPage" component, and add a route for the `/blog/:id` path.

This route should match any URL in the format of `/blog/some-post-id`, and render the BlogPage component.

Inside of your BlogPage component, use the `useParams()` hook to get the "id" from the URL and display it on the page.

<details>
<summary>Hint</summary>

```jsx
export function BlogPage() {
  const { id } = useParams();

  return <>
    <h1>Blog Page</h1>
    <p>id = {id}</p>
  </>;
}
```

</details>

If you visit `http://localhost:5173/blog/some-post-id`, you should see "id = some-post-id" displayed on the page.

## Displaying the post

Next, let's use the `id` to find the post from our `posts` array to display.

Recall how `useMemo` works - we can place this logic inside of a useMemo call to avoid unnecessary computation.

Once you have the post, replace the `<h1>` tag content with `{post.title}`, and the `<p>` tag with `{post.content}`.

<details>
<summary>Hint</summary>

```jsx
export function BlogPage() {
  const { id } = useParams();

  const post = useMemo(() => {
    for (const post of posts) {
      if (post.id === id) return post;
    }
  }, [id]);

  return <>
    <h1>{post.title}</h1>
    <p>{post.content}</p>
  </>;
}
```

</details>

Now, if you visit `http://localhost:5173/blog/first-post`, you should see the post title ("My First Post") and content on the page.

However, if you visit the URL for a post that doesn't exist, the page fails to render. That's because, when the `post` variable is undefined, trying to read the `post.title` value results in an error.

Instead, you can wrap the `return` in an if statement, and render a "Not Found" page if the post does not exist.


<details>
<summary>Hint</summary>

```jsx
export function BlogPage() {
  const { id } = useParams();

  const post = useMemo(() => {
    for (const post of posts) {
      if (post.id === id) return post;
    }
  }, [id]);

  if (post) {
    return <>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </>;
  } else {
    return <p>I couldn't find any post with the id '{id}'.</p>;
  }
}
```

</details>

## Creating a list of posts

Now that we have our post pages working, we should add links to each post on the homepage.

Add a `<ul>` (unordered list) element that contains an `<li>` for each post. Inside each list item, create a NavLink to the `"/blog/" + id` route for the post.

Once done, you should see the three posts listed on the homepage. If you click on a link, it should open the post content!

<details>
<summary>Full Code</summary>

<iframe data-frame-title="Blog Site" src="pfp-code:./project?file=src/App.jsx"></iframe>

</details>

