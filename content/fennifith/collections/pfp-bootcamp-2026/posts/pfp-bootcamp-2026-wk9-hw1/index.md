---
{
  title: "Week 9 - Tier 1 Homework",
  published: "2026-03-04T21:00:00.000Z",
  order: 9,
  noindex: true
}
---

# Fetch trivia questions from an API

**Goal**: Use a `fetch()` call to populate our cards with random trivia questions from https://opentdb.com/api_config.php.

> Note: Open Trivia Database has very strict rate limiting, which means their API will temporarily block you if you send too many requests.
>
> To work around this, we'll use `https://quiet-wildflower-c370.18jafenn90.workers.dev/` in place of their URL.

Start out by replacing your `App.jsx` with the following code. (This builds on the Week 8 Tier 3 code, but with the form & inputs removed). Note that `initialCards` is also removed - we've replaced our initial cards with an empty array.

```jsx
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [cards, setCards] = useState([]);

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

---

## 1. Add a `useEffect` that runs when your page loads

Below your `useState`, set up a [useEffect](https://react.dev/reference/react/useEffect) hook.

Remember to pass an empty array as the second "dependencies" argument. This will ensure that your effect only runs once, when the page is loaded.

```js
useEffect(() => {
  console.log("Hello from useEffect");
}, []);
```

If you reload the page in your browser, you should see `"Hello from useEffect"` in the logs!

---

## 2. Write your fetch call inside `useEffect`

Recall the [Week 6 - Tier 3](/posts/pfp-bootcamp-2026-wk6-hw3/) homework, where we used a fetch call to manually populate data on the page.

This time, we're adding the fetch within our `useEffect` callback, and passing the response to `setCards()` to modify our state.

```js
// Call the Open Trivia Database API
fetch("https://quiet-wildflower-c370.18jafenn90.workers.dev/")
  // Read the response body as JSON
  .then(res => res.json())
  // Update our state to display the cards it returns
  .then(body => setCards(body.results));
```

If you run your code with these changes, you should see all of the cards render with the trivia questions!

However, you'll notice that none of the cards show anything for the answer.

---

## 3. Update our card components to display the trivia answers

Let's replace our `setCards()` call with a `console.log(body)` function - with this, you should see an `Object { response_code: 0, results: [...] }` in the browser console.

Each trivia question contains a data structure such as:

```js
{
  "category": "Entertainment: Music",
  "correct_answer": "True",
  "difficulty": "easy",
  "incorrect_answers": ["False"]​,
  "question": "The 2011 movie &quot;The Adventures of Tintin&quot; was directed by Steven Spielberg.",
  "type": "boolean"
}
```

Now, look at where we pass this data to our `<FlashCard>` component:

```jsx
{cards.map((card) => (
  <FlashCard
    key={card.id}
    question={card.question}
    answer={card.answer}
  />
))}
```

Our code is looking for a `card.answer`, but the JSON data has defined a `"correct_answer"`.

Update this to use the correct property name.

<details>
<summary>Full Code</summary>

<iframe data-frame-title="Flash Card App" src="pfp-code:./project?file=src/App.jsx"></iframe>

</details>
