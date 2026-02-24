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
