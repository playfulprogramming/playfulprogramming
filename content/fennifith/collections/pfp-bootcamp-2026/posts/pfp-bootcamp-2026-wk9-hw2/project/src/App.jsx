import { useEffect, useMemo, useState } from "react";
import "./App.css";

function App() {
  const [cards, setCards] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [correctCount, setCorrectCount] = useState(undefined);
  const [incorrectCount, setIncorrectCount] = useState(undefined);

  // Load saved score from localStorage on first render
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

  // Persist score to localStorage whenever it changes (skip until we've loaded)
  useEffect(() => {
    if (correctCount === undefined || incorrectCount === undefined) {
      return;
    }
    const payload = { correctCount, incorrectCount };
    localStorage.setItem("flashcard-score", JSON.stringify(payload));
  }, [correctCount, incorrectCount]);

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
    if (!total) {
      return 0;
    }
    return Math.round((c / total) * 100);
  }, [correctCount, incorrectCount]);

  useEffect(() => {
    fetch("https://quiet-wildflower-c370.18jafenn90.workers.dev/")
      .then(res => res.json())
      .then(body => setCards(body.results));
  }, []);

  function handleMarkCorrect() {
    setCorrectCount((count) => {
      if (count === undefined) {
        return 1;
      }
      return count + 1;
    });
  }

  function handleMarkIncorrect() {
    setIncorrectCount((count) => {
      if (count === undefined) {
        return 1;
      }
      return count + 1;
    });
  }

  function getCardAnswer(card) {
    if (card.correct_answer !== undefined) {
      return card.correct_answer;
    }
    return card.answer;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) {
      return;
    }
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

      <section className="scoreboard">
        <p>Correct: {displayCorrect}</p>
        <p>Incorrect: {displayIncorrect}</p>
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
          answer={getCardAnswer(card)}
          onCorrect={handleMarkCorrect}
          onIncorrect={handleMarkIncorrect}
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
      <div className="card-actions">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (props.onCorrect) {
              props.onCorrect();
            }
          }}
        >
          Correct
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (props.onIncorrect) {
              props.onIncorrect();
            }
          }}
        >
          Incorrect
        </button>
      </div>
    </div>
  );
}

export default App;
