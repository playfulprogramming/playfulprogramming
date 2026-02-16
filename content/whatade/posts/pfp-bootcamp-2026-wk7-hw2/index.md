---
{
  title: "Week 7 - Tier 2 Homework",
  published: "2026-02-18T21:00:00.000Z",
  order: 2,
  noindex: true
}
---

# Build a Flash Card App

Let's build a Flash Card App using React.

# 1. Components

A component is a reusable piece of UI that can contain:

- Structure (JSX)
- Styling (CSS)
- Behavior (JavaScript)

In this assignment, you will create:

- A root component called `App`
- A reusable component called `FlashCard`

---

## Create the Root Component

Create a file called `App.jsx`.

Start with this:

```jsx
import { useState } from "react";
import "./App.css";

function App() {
  return (
    <div className="app">
      <h1>Flash Cards</h1>

      <FlashCard
        question="What is React?"
        answer="A JavaScript library for building user interfaces."
      />

      <FlashCard
        question="What is JSX?"
        answer="A syntax that looks like HTML but works inside JavaScript."
      />

      <FlashCard
        question="What is useState?"
        answer="A React hook that lets you store and update state."
      />
    </div>
  );
}

export default App;
```

Notice:

- `App` returns JSX, (which looks a lot like HTML)
- It renders multiple `FlashCard` components
- It passes some data to each one
- But at this point `FlashCard` doesn't exist yet, so let's build it!

---

## Create the FlashCard Component

In the same file (below `App`), create:

```jsx
function FlashCard(props) {
  return (
    <div className="card">
      <h2>{props.question}</h2>
      <p>{props.answer}</p>
    </div>
  );
}
```

You have now created a reusable component.

---

# 2. JSX

JSX:

- Looks like HTML
- Must use `className` instead of `class`
- Allows JavaScript inside `{}`

Example:

```jsx
<h2>{props.question}</h2>
```

The curly braces allow JavaScript inside JSX.

---

# 3. CSS with JSX

Create a file called:

`App.css`

Import it at the top of `App.jsx`:

```jsx
import "./App.css";
```

Now style your components.

Example:

```css
.app {
  padding: 40px;
  font-family: Arial, sans-serif;
}

.card {
  border: 1px solid #ddd;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  cursor: pointer;
}

.card h2 {
  margin: 0 0 10px 0;
}
```

Important:

- Use `className` in JSX
- CSS works normally in the CSS file

---

# 4. Props

Props allow the parent to pass data to the child.

App (parent) → FlashCard (child)

In `App`:

```jsx
<FlashCard
  question="What is React?"
  answer="A JavaScript library for building user interfaces."
/>
```

In `FlashCard`:

```jsx
function FlashCard(props) {
  return (
    <div className="card">
      <h2>{props.question}</h2>
      <p>{props.answer}</p>
    </div>
  );
}
```

Access props using:

```
props.question
props.answer
```

---

# 5. useState

Now we add behavior.

We want:

- The answer hidden by default
- Clicking the card reveals it
- Clicking again hides it

---

## Add useState

Update the `FlashCard` component:

```jsx
function FlashCard(props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="card">
      <h2>{props.question}</h2>

      <p hidden={!open}>{props.answer}</p>
    </div>
  );
}
```

What is happening?

- `open` is a boolean
- It starts as `false`
- `hidden={!open}` on the paragraph means:
    - Hide the answer when `open` is false, show it when `open` is true

---

# 6. Event Bindings

In normal JavaScript, you would use:

```js
element.addEventListener("click", ...)
```

In React, we use:

```
onClick
```

Update your `FlashCard`:

```jsx
function FlashCard(props) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="card"
      onClick={() => setOpen(!open)}
    >
      <h2>{props.question}</h2>

      <p hidden={!open}>{props.answer}</p>
    </div>
  );
}
```

Now:

- Clicking the card calls `setOpen`
- `!open` toggles between true and false
- React re-renders automatically

---

# Full Code (App.jsx)

```jsx
import { useState } from "react";
import "./App.css";

function App() {
  return (
    <div className="app">
      <h1>Flash Cards</h1>

      <FlashCard
        question="What is React?"
        answer="A JavaScript library for building user interfaces."
      />

      <FlashCard
        question="What is JSX?"
        answer="A syntax that looks like HTML but works inside JavaScript."
      />

      <FlashCard
        question="What is useState?"
        answer="A React hook that lets you store and update state."
      />
    </div>
  );
}

function FlashCard(props) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="card"
      onClick={() => setOpen(!open)}
    >
      <h2>{props.question}</h2>
      <p hidden={!open}>{props.answer}</p>
    </div>
  );
}

export default App;
```

---

# Expected Result

When finished:

- You see multiple flash cards
- Only the question is visible at first
- Clicking a card reveals the answer
- Clicking again hides it
- Cards are styled using CSS
- Everything is built using:
    - Components
    - JSX
    - Props
    - useState
    - Event bindings
    - CSS import

You have now built an interactive React app using core fundamentals.
