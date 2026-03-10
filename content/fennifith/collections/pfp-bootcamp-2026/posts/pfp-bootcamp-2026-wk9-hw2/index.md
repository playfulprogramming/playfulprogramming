---
{
  title: "Week 9 - Tier 2 Homework",
  published: "2026-03-04T21:00:00.000Z",
  order: 10,
  noindex: true
}
---

# Allow users to pick an answer, and keep track of their score

This homework **builds on Week 9, Tier 1** (fetching trivia questions from an API). Use your finished code from that homework as the starting point.  
If you need to refer back, see **Week 9 - Tier 1** (`pfp-bootcamp-2026-wk9-hw1`) for the version that:

- Fetches trivia questions with `useEffect`
- Stores them in `cards` state
- Renders a `FlashCard` for each question

---

## 1. Start from your Tier 1 `App.jsx`

Your `App.jsx` from Tier 1 should already look roughly like this:

```jsx
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetch("https://quiet-wildflower-c370.18jafenn90.workers.dev/")
      .then(res => res.json())
      .then(body => setCards(body.results));
  }, []);

  return (
    <div className="app">
      <h1>Flash Cards</h1>

      {cards.map((card) => (
        <FlashCard
          key={card.id}
          question={card.question}
          answer={card.correct_answer}
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

If your version is a little different, that's okay – as long as you have:

- `cards` state
- A `useEffect` that fetches questions
- A `FlashCard` that shows question and answer when clicked

---

## 2. Add score state to `App`

For **Tier 2**, we only care about a single score value.  
You’ll track separate `"correct"` / `"incorrect"` counts and a percentage in **Tier 3**, using `useMemo`.

Inside your `App` component (right under `cards`), add:

```jsx
const [score, setScore] = useState(undefined);
```

This will hold the user’s total score. Starting as `undefined` (instead of `0`) avoids a race condition: the save-to-`localStorage` effect can skip writing until the load effect has run, so it never overwrites a saved score with the initial value.

---

## 3. Add "Correct" / "Incorrect" buttons to each card

Update your `FlashCard` so that, **in addition to toggling the answer when clicked**, it also shows two buttons the user can press to mark their answer:

- A **Correct** button (adds to the score)
- An **Incorrect** button (does not change the score yet – you’ll handle separate counts in Tier 3)

First, change the props for `FlashCard` so it can receive a callback from `App`:

```jsx
function FlashCard(props) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="card"
      onClick={() => setOpen(!open)}
    >
      <h2>{props.question}</h2>
      {open && <p>{props.answer}</p>}

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation(); // don't re-toggle the card
          if (props.onCorrect) {
            props.onCorrect();
          }
        }}
      >
        Correct
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          if (props.onIncorrect) {
            props.onIncorrect();
          }
        }}
      >
        Incorrect
      </button>
    </div>
  );
}
```

Then, when you render each `FlashCard` in `App`, pass in functions that update your score:

```jsx
{cards.map((card) => (
  <FlashCard
    key={card.id}
    question={card.question}
    answer={card.correct_answer}
    onCorrect={() => setScore((score) => {
      if (score === undefined) {
        return 1;
      }
      return score + 1;
    })}
    onIncorrect={() => {
      // For Tier 2, you don't need to change the score here.
      // In Tier 3, you'll track separate correct/incorrect counts.
    }}
  />
))}
```

---

## 4. Show the score in your main component

At the top of your `App` JSX (above the list of cards), display the current score. Use a variable so you can show `0` before the load effect has run:

```jsx
let displayScore = 0;
if (score !== undefined) {
  displayScore = score;
}

return (
  <div className="app">
    <h1>Flash Cards</h1>

    <p>Score: {displayScore}</p>

    {cards.map((card) => (
      {/* ... your FlashCard code from above ... */}
    ))}
  </div>
);
```

Now, clicking **Correct** on any card should update the score you see at the top of the page.

---

## 5. Save and restore the score with `useEffect` + `localStorage`

Finally, use `useEffect` and `localStorage` so that the score is remembered even if the user refreshes the page.

1. **Load the saved score once when the app starts.** Always set `score` by the end of this effect (either from storage or `0`), so the save effect can tell that loading is done:

```jsx
useEffect(() => {
  try {
    const storedScore = localStorage.getItem("flashcard-score");
    if (!storedScore) {
      setScore(0);
      return;
    }
    const parsed = JSON.parse(storedScore);
    if (typeof parsed.score === "number") {
      setScore(parsed.score);
    } else {
      setScore(0);
    }
  } catch {
    setScore(0);
  }
}, []);
```

2. **Save the score whenever it changes.** Skip saving while `score` is still `undefined` (before the load effect has run), so you never overwrite a saved score with the initial value:

```jsx
useEffect(() => {
  if (score === undefined) {
    return;
  }

  const data = { score };
  localStorage.setItem("flashcard-score", JSON.stringify(data));
}, [score]);
```

With these two effects in place:

- The load effect runs **once** and always sets `score` (from storage or `0`).
- The save effect runs when `score` changes but **does nothing** until `score` is defined, avoiding a race where the save effect could overwrite storage before load runs.

When you refresh the page, your score should stay the same instead of resetting to zero.
