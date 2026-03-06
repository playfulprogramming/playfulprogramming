---
{
  title: "Week 9 - Tier 3 Homework",
  published: "2026-03-04T21:00:00.000Z",
  order: 11,
  noindex: true
}
---

# Track correct / incorrect answers with `useMemo`

This homework **builds on Week 9, Tier 2** (score stored in state and synced with `localStorage`).  
Use your finished Tier 2 code as the starting point.

From Tier 2, you should already have:

- An `App` component that:
  - Fetches trivia questions with `useEffect`
  - Stores them in `cards` state
  - Renders a `FlashCard` for each card
- A single `score` state in `App`
- `Correct` / `Incorrect` buttons on each card that call handlers in `App`
- A `useEffect` that saves `score` to `localStorage` and restores it on page load

In Tier 3, we’ll **upgrade your scoring**:

- Track separate **`correct`** and **`incorrect`** counts
- Use **`useMemo`** to calculate a **percentage of correct answers**
- Display all three at the top of the page

---

## 1. Replace `score` with `correctCount` / `incorrectCount`

In your `App` component, replace the single `score` state with two counters:

```jsx
const [correctCount, setCorrectCount] = useState(undefined);
const [incorrectCount, setIncorrectCount] = useState(undefined);
```

You can remove the old `score` state:

```jsx
// Before (Tier 2)
const [score, setScore] = useState(undefined);

// After (Tier 3)
const [correctCount, setCorrectCount] = useState(undefined);
const [incorrectCount, setIncorrectCount] = useState(undefined);
```

Starting as `undefined` avoids a race: the save effect can skip writing until the load effect has run, so it never overwrites saved counts.

---

## 2. Update your `FlashCard` handlers to change the counts

Your `FlashCard` from Tier 2 should already accept `onCorrect` and `onIncorrect` props and call them when the buttons are clicked.

In `App`, update how you render each `FlashCard` so that:

- `onCorrect` **increments** `correctCount`
- `onIncorrect` **increments** `incorrectCount`

```jsx
{cards.map((card) => (
  <FlashCard
    key={card.id}
    question={card.question}
    answer={card.correct_answer}
    onCorrect={() => setCorrectCount((count) => {
      if (count === undefined) {
        return 1;
      }
      return count + 1;
    })}
    onIncorrect={() => setIncorrectCount((count) => {
      if (count === undefined) {
        return 1;
      }
      return count + 1;
    })}
  />
))}
```

You don’t need to change the inside of `FlashCard` for this step, as long as it still calls `onCorrect()` and `onIncorrect()` when those buttons are clicked.

---

## 3. Show the counts in your main component

Next, update the JSX inside `App` so that it shows both counts at the top of the page. Use variables so you can show `0` before the load effect has run:

```jsx
let displayCorrect = 0;
if (correctCount !== undefined) {
  displayCorrect = correctCount;
}
let displayIncorrect = 0;
if (incorrectCount !== undefined) {
  displayIncorrect = incorrectCount;
}

return (
  <div className="app">
    <h1>Flash Cards</h1>

    <p>Correct: {displayCorrect}</p>
    <p>Incorrect: {displayIncorrect}</p>

    {cards.map((card) => (
      {/* ... your FlashCard code from above ... */}
    ))}
  </div>
);
```

When you click **Correct** or **Incorrect** on any card, the matching number should increase.

---

## 4. Use `useMemo` to calculate the correctness percentage

Now we’ll calculate a **percentage of correct answers** based on your two counts.

At the top of your `App` component (near your state declarations), add:

```jsx
const accuracyPercent = useMemo(() => {
  let c = 0;
  if (correctCount !== undefined) {
    c = correctCount;
  }
  let i = 0;
  if (incorrectCount !== undefined) {
    i = incorrectCount;
  }
  const total = c + i;
  if (total === 0) {
    return 0;
  }
  return Math.round((c / total) * 100);
}, [correctCount, incorrectCount]);
```

Make sure you’ve imported `useMemo` from React at the top of the file:

```jsx
import { useEffect, useMemo, useState } from "react";
```

Then, display the percentage under your counts (reuse the same `displayCorrect` and `displayIncorrect` variables you added above):

```jsx
<p>Correct: {displayCorrect}</p>
<p>Incorrect: {displayIncorrect}</p>
<p>Accuracy: {accuracyPercent}%</p>
```

Now the page will always show the **latest** percentage, even as `correctCount` and `incorrectCount` change.

---

## 5. (Optional) Save and restore counts with `localStorage`

If you want to extend your Tier 2 `localStorage` logic, you can store both counts instead of a single `score`. Use the same pattern as Tier 2: initial state `undefined`, load effect always sets both values, save effect skips while either is `undefined`.

1. **Load the saved counts once when the app starts.** Always set both counts by the end (from storage or `0`):

```jsx
useEffect(() => {
  try {
    const stored = localStorage.getItem("flashcard-score");
    if (!stored) {
      setCorrectCount(0);
      setIncorrectCount(0);
      return;
    }
    const parsed = JSON.parse(stored);
    if (typeof parsed.correctCount === "number") {
      setCorrectCount(parsed.correctCount);
    } else {
      setCorrectCount(0);
    }
    if (typeof parsed.incorrectCount === "number") {
      setIncorrectCount(parsed.incorrectCount);
    } else {
      setIncorrectCount(0);
    }
  } catch {
    setCorrectCount(0);
    setIncorrectCount(0);
  }
}, []);
```

2. **Save the counts whenever they change.** Skip saving until both are defined (load has run):

```jsx
useEffect(() => {
  if (correctCount === undefined || incorrectCount === undefined) {
    return;
  }

  const data = { correctCount, incorrectCount };
  localStorage.setItem("flashcard-score", JSON.stringify(data));
}, [correctCount, incorrectCount]);
```

With this in place:

- The save effect never runs with the initial `undefined` values, so it never overwrites storage before load.
- Refreshing the page will *restore* your correct/incorrect counts, and `accuracyPercent` will recompute from the restored values.

