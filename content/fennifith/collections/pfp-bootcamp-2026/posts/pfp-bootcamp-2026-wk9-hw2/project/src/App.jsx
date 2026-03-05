import { useEffect, useMemo, useState } from "react";
import "./App.css";

function App() {
  const [cards, setCards] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  // Load saved score from localStorage on first render
  useEffect(() => {
    try {
      const stored = localStorage.getItem("flashcard-score");
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (typeof parsed.correctCount === "number") {
        setCorrectCount(parsed.correctCount);
      }
      if (typeof parsed.incorrectCount === "number") {
        setIncorrectCount(parsed.incorrectCount);
      }
    } catch {
      // If anything goes wrong reading/parsing, just ignore and start from zero
    }
  }, []);

  // Persist score to localStorage whenever it changes
  useEffect(() => {
    const payload = {
      correctCount,
      incorrectCount,
    };
    localStorage.setItem("flashcard-score", JSON.stringify(payload));
  }, [correctCount, incorrectCount]);

  const accuracyPercent = useMemo(() => {
    const total = correctCount + incorrectCount;
    if (!total) return 0;
    return Math.round((correctCount / total) * 100);
  }, [correctCount, incorrectCount]);

  useEffect(() => {
    fetch("https://quiet-wildflower-c370.18jafenn90.workers.dev/")
      .then(res => res.json())
      .then(body => setCards(body.results));
  }, []);

  function handleMarkCorrect() {
    setCorrectCount((count) => count + 1);
  }

  function handleMarkIncorrect() {
    setIncorrectCount((count) => count + 1);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    setCards([
      ...cards,
      {
        id: Date.now(),
        question: newQuestion.trim(),
        correct_answer: newAnswer.trim(),
      },
    ]);
    setNewQuestion("");
    setNewAnswer("");
  }

  return (
    <div className="app">
      <h1>Flash Cards</h1>

      <section className="scoreboard">
        <p>Correct: {correctCount}</p>
        <p>Incorrect: {incorrectCount}</p>
        <p>Accuracy: {accuracyPercent}%</p>
      </section>

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
          answer={card.correct_answer ?? card.answer}
          onCorrect={handleMarkCorrect}
          onIncorrect={handleMarkIncorrect}
        />
      ))}
    </div>
  );
}

function FlashCard({ question, answer, onCorrect, onIncorrect }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="card"
      onClick={() => setOpen(!open)}
    >
      <h2>{question}</h2>
      {open && <p>{answer}</p>}
      <div className="card-actions">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCorrect?.();
          }}
        >
          Correct
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onIncorrect?.();
          }}
        >
          Incorrect
        </button>
      </div>
    </div>
  );
}

export default App;
