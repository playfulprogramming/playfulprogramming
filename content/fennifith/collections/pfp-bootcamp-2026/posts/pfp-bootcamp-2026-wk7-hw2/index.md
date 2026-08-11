---
{
  title: "Week 7 - Tier 2 Homework",
  published: "2026-02-18T21:00:00.000Z",
  order: 4,
  authors: ['whatade'],
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

# Expected Result

When finished:

- You see multiple flash cards
- Each card shows the question and answer
- Cards are styled using CSS
- Everything is built using:
    - Components
    - JSX
    - Props
    - CSS import

<details>
<summary>Full Code</summary>

<iframe data-frame-title="Flash Card App" src="pfp-code:./pfp-wk7-hw2-project?file=src/App.jsx"></iframe>

</details>

You have now built a React flash card app using core fundamentals.
