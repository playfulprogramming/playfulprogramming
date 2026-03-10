import { useState } from "react";
import "./App.css";

function App() {
  return (
    <div className="app">
      <h1>Flash Cards</h1>

      <FlashCard
        question="What is React?"
        answer="A JavaScript library for building user interfaces."
      />

      <FlashCard
        question="What is JSX?"
        answer="A syntax that looks like HTML but works inside JavaScript."
      />

      <FlashCard
        question="What is useState?"
        answer="A React hook that lets you store and update state."
      />
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
      <p hidden={!open}>{props.answer}</p>
    </div>
  );
}

export default App;
