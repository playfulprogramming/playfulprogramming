---
{
  title: "Week 8 - Tier 2 Homework",
  published: "2026-02-24T21:00:00.000Z",
  order: 7,
  authors: ["whatade"],
  noindex: true
}
---

# Refactor the Card List with .map

This homework **builds on Week 8, Tier 1** (flash cards with conditional rendering). Use that as your starting point.

**Goal**: Replace the **hardcoded list of `<FlashCard />` components** with a dynamic list using `.map` over an array of data.

---

## Starting Point

Your `App` might look like:

```jsx
function App() {
  return (
    <div className="app">
      <h1>Flash Cards</h1>

      <FlashCard question="What is React?" answer="..." />
      <FlashCard question="What is JSX?" answer="..." />
      <FlashCard question="What is useState?" answer="..." />
    </div>
  );
}
```

---

## What to Do

1. **Create an array of card objects** (each with `question` and `answer`), e.g.:

   ```jsx
   const cards = [
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
   ```

2. **Use `.map`** to render one `FlashCard` for each object.

3. **Pass a `key` prop** to each `FlashCard` (use `id` or the index). React needs `key` when rendering lists.


```jsx
{cards.map((card) => (
  <FlashCard
    key={card.id}
    question={card.question}
    answer={card.answer}
  />
))}
```

---

## Checklist

- There is a `cards` array (or similar) in `App`
- `App` uses `cards.map(...)` to render the list
- Each `FlashCard` has a `key` prop
- The UI still looks and behaves the same; only the way you build the list has changed

<details>
<summary>Full Code</summary>

<iframe data-frame-title="Flash Card App" src="pfp-code:./pfp-wk8-hw2-project?file=src/App.jsx"></iframe> 

</details>
