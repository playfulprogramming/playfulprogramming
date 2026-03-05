import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [cards, setCards] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  useEffect(() => {
    fetch("https://quiet-wildflower-c370.18jafenn90.workers.dev/")
      .then(res => res.json())
      .then(body => setCards(body.results));
  }, []);

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
