---
{
  title: "Week 8 - Tier 3 Homework",
  published: "2026-02-24T21:00:00.000Z",
  order: 8,
  authors: ["whatade"],
  noindex: true
}
---

# Let Users Create Their Own Cards

This homework **builds on Week 8, Tier 2** (flash cards rendered with `.map`). Use that as your starting point.

**Goal**: Add a **form** so users can create new flash cards. New cards should appear in the list and work like the existing ones (click to show/hide the answer).

---

## 1. Move Your Card Data into State

Replace the plain `const cards = [...]` with **React state** in `App`:

```jsx
const initialCards = [
  {
    id: 1,
    question: "What is React?",
    answer: "A JavaScript library for building user interfaces.",
  },
  {
    id: 2,
    question: "What is JSX?",
    answer: "A syntax that looks like HTML but works inside JavaScript.",
  },
  {
    id: 3,
    question: "What is useState?",
    answer: "A React hook that lets you store and update state.",
  },
];

const [cards, setCards] = useState(initialCards);
```

Use this state in your `.map` so the list reflects the current `cards` array.

---

## 2. Add a Form for New Cards

Below your `<h1>`, add a form with:

- An input for the **question**
- An input for the **answer**
- A **button** to add the card (e.g. "Add card")

Add two more state variables in `App`:

- `newQuestion`
- `newAnswer`

Use **controlled inputs**: set `value={newQuestion}` and `value={newAnswer}` and update state in `onChange` so typing updates `newQuestion` and `newAnswer`.

---

## 3. Handle Submitting the Form

When the user submits (clicks the button or presses Enter):

1. Call `event.preventDefault()` so the page doesn’t refresh.
2. Create a new card object, e.g. `{ id: Date.now(), question: newQuestion, answer: newAnswer }`.
3. Add it to the list: `setCards([...cards, newCard])`.
4. Clear the inputs: `setNewQuestion("")` and `setNewAnswer("")`.

Use a unique `id` for each new card (e.g. `Date.now()` or `cards.length + 1`).

---

## Checklist

- `App` stores the card list in state with `useState`
- A form has inputs for question and answer and a submit button
- Submitting adds a new card **without a page refresh**
- New cards show up in the list and work like the others (click to reveal/hide the answer)

<details>
<summary>Full Code</summary>

```jsx
import { useState } from "react";
import "./App.css";

const initialCards = [
  { id: 1, question: "What is React?", answer: "A JavaScript library for building user interfaces." },
  { id: 2, question: "What is JSX?", answer: "A syntax that looks like HTML but works inside JavaScript." },
  { id: 3, question: "What is useState?", answer: "A React hook that lets you store and update state." },
];

function App() {
  const [cards, setCards] = useState(initialCards);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    setCards([
      ...cards,
      { id: Date.now(), question: newQuestion.trim(), answer: newAnswer.trim() },
    ]);
    setNewQuestion("");
    setNewAnswer("");
  }

  return (
    <div className="app">
      <h1>Flash Cards</h1>

      <form onSubmit={handleSubmit} className="add-card-form">
        <input
          type="text"
          placeholder="Question"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
        <input
          type="text"
          placeholder="Answer"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
        />
        <button type="submit">Add card</button>
      </form>

      {cards.map((card) => (
        <FlashCard
          key={card.id}
          question={card.question}
          answer={card.answer}
        />
      ))}
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
