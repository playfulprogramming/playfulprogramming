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
