---
{
  title: "Week 11 - Tier 1 Homework",
  published: "2026-03-18T21:00:00.000Z",
  order: 14,
  noindex: true
}
---

# Creating a Route

For this homework, you should start from a blank React template. Revisit the [week 7 homework](/posts/pfp-bootcamp-2026-wk7-hw1/) to create a new project (using `npm create vite@latest`).

In this project, we will use [react-router](https://reactrouter.com/start/declarative/installation) to allow navigation between multiple pages of our app. We'll be building a blogging site that has a separate "home" page and an "about" page.

## Setting up react-router

First, in your new project, run `npm install react-router`.

In your package.json, you should see the following line appear in the "dependencies" section:

```diff
{
  ...
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
+   "react-router": "^7.13.1"
  }
  ...
}
```

Then, you can open your `main.jsx` and import the "BrowserRouter" component from react-router. Add this component within the `<StrictMode>`, surrounding your `<App />`:

```jsx
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

## Create a home page and an about page

Next, create two separate components for your "home page" and "about page". Make sure that both of these are exported from your JSX file. You can remove the `App()` function.

```jsx
export function HomePage() {
  // add some home page elements here
  return <>
    <h1>Home Page</h1>
  </>;
}

export function AboutPage() {
  // add some about page elements here
  return <>
    <h1>About Page</h1>
  </>;
}
```

## Declare routes for each page

The [Routing] documentation tells you that you can declare a route in your app as follows:

```jsx
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
    </Routes>
  </BrowserRouter>
```

Import the `Routes` and `Route` component from react-router. Then, import the `HomePage` and `AboutPage` components you just created.

Declare one route with the `/` path that renders the `<HomePage />` element, and a second route with the `/about` path that renders the `<AboutPage />` element.

<details>
<summary>Hint</summary>

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { HomePage, AboutPage } from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
```

</details>

When you open your site, you should now see your HomePage component displayed. If you navigate to `http://localhost:5173/about`, then you should see the about page.

## Link between the pages

React router's [Navigating](https://reactrouter.com/start/declarative/navigating) guide tells us to use the "NavLink" component to create links between pages.

```jsx
<NavLink to="/account">Account</NavLink>
```

Import "NavLink" from react-router, and create a link to the about page on your home page (and vice versa).

When complete, you should be able to click between the home and about pages on your site!

<details>
<summary>Full Code</summary>

<iframe data-frame-title="Blog Site" src="pfp-code:./project?file=src/App.jsx"></iframe>

</details>

