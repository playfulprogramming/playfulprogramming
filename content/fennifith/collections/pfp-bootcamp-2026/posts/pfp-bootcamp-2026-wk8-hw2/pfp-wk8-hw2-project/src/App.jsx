import { useState } from "react";
import "./App.css";

const cards = [
  { id: 1, question: "What is React?", answer: "A JavaScript library for building user interfaces." },
  { id: 2, question: "What is JSX?", answer: "A syntax that looks like HTML but works inside JavaScript." },
  { id: 3, question: "What is useState?", answer: "A React hook that lets you store and update state." },
];

function App() {
  return (
    <div className="app">
      <h1>Flash Cards</h1>

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
