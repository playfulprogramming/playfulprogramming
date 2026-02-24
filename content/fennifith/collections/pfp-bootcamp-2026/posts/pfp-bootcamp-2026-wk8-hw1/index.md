---
{
  title: "Week 8 - Tier 1 Homework",
  published: "2026-02-24T21:00:00.000Z",
  order: 6,
  authors: ["whatade"],
  noindex: true
}
---

# Refactor the Card to Use Conditional Rendering

This homework **builds on your Week 7, Tier 3** flash card app (the version where clicking a card shows or hides the answer using the `hidden` attribute).

**Goal**: Refactor your `FlashCard` component so it uses **conditional rendering** instead of the `hidden` attribute.

---

## Starting Point

Your `FlashCard` probably looks something like:

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

---

## What to Change

Instead of always rendering the `<p>` and hiding it with `hidden={!open}`, **only render the answer when the card is open**:

- Use `{open && <p>{props.answer}</p>}` or a ternary: `open ? <p>{props.answer}</p> : null`
- Remove the `hidden` attribute entirely

The card should still toggle when clicked; only the **mechanism** for showing/hiding changes (conditional rendering instead of the `hidden` attribute).

---

## Checklist

- `FlashCard` still tracks `open` with `useState`
- Clicking the card still toggles the answer
- The `<p>` for the answer is only in the DOM when `open` is `true` (no `hidden` prop)

<details>
<summary>Full Code</summary>

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
      {open && <p>{props.answer}</p>}
    </div>
  );
}

export default App;
```

</details>
