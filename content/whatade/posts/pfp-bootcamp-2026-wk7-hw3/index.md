---
{
  title: "Week 7 - Tier 3 Homework",
  published: "2026-02-18T21:00:00.000Z",
  order: 3,
  noindex: true
}
---

# Add a Conditional Hidden Prop to Your Flash Cards

Take what you already have from **Tier 2** and add interactivity: the answer hidden by default, and clicking the card toggles it.

You will use:

- `useState` to track whether each card is open or closed
- The `hidden` attribute to show or hide the answer
- `onClick` to toggle when the user clicks the card

---

# 1. Add useState

Import `useState` at the top of `App.jsx`:

```jsx
import { useState } from "react";
import "./App.css";
```

Update the `FlashCard` component to track whether the answer is visible:

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

- `open` is a boolean; it starts as `false`
- `hidden={!open}` on the paragraph: when `open` is false the answer is hidden, when `open` is true it is shown

---

# 2. Event Bindings

In normal JavaScript you might use `element.addEventListener("click", ...)`. In React we use `onClick`.

Add a click handler to the card so that clicking toggles `open`:

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

- Clicking the card calls `setOpen(!open)`
- That toggles between true and false
- React re-renders and the answer shows or hides

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

- You see multiple flash cards (same as T2)
- Only the question is visible at first
- Clicking a card reveals the answer
- Clicking again hides it
- You have added:
  - `useState` for open/closed state
  - A conditional `hidden` prop on the answer
  - `onClick` to toggle the card

You have now built an interactive flash card app that builds on your T2 work.
