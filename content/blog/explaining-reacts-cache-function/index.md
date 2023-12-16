---
{
    title: "Explaining React's cache Function",
    description: "",
    published: '2023-12-17T21:52:59.284Z',
    authors: ['crutchcorn'],
    tags: ['react', 'webdev', 'javascript'],
    attached: [],
    license: 'cc-by-4'
}
---

> Some warning about how this is an experimental API and may change in the future

1) Compare/contrast React useMemo/useCallback/memo/cache
2) Show how `cache` persists between functions

```jsx
import { createRoot } from "react-dom/client";
import { cache, useReducer, useState } from "react";

const test = cache((id) => {
	alert(id);
});

function App() {
	const [counter, setCounter] = useState(0);
	const [_, rerender] = useReducer(() => ({}), {});
	test(counter);
	return (
		<div>
			<button onClick={() => setCounter((v) => v + 1)}>Add to {counter}</button>
			<button onClick={rerender}>Rerender</button>
			<input key={Math.floor(Math.random() * 10)} />
		</div>
	);
}

createRoot(document.getElementById("root")).render(<App />);
```

Mention this as useful when combined with React's `use` Hook

It even caches results:

```jsx
const getIsEvenOrOdd = cache(
  (number) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(number % 2 === 0 ? "Even" : "Odd");
      }, 2000);
    }),
);

function App() {
  const [counter, setCounter] = useState(0);

  const isEvenOrOdd = getIsEvenOrOdd(counter);

  return (
    <div>
      <button onClick={() => setCounter((v) => v + 1)}>Add to {counter}</button>
      <p>
        {counter} is {isEvenOrOdd}
      </p>
    </div>
  );
}
```

And errors:

```jsx
const getIsEven = cache((number) => {
  alert("I am checking if " + number + " is even or not");
  if (number % 2 === 0) {
    throw "Number is even";
  }
});

// Even if you render this component multiple times, it will only perform the
// calculation needed to throw the error once.
function ThrowAnErrorIfEven({ number, instance }) {
  getIsEven(number);

  return <p>I am instance #{instance}</p>;
}
```
