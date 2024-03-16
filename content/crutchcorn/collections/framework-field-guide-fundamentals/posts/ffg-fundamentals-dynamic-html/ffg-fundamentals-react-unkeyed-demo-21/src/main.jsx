import { createRoot } from "react-dom/client";
import { useState } from "react";

const WordList = () => {
	const [words, setWords] = useState([]);

	const addWord = () => {
		const newWord = getRandomWord();
		// Remove ability for duplicate words
		if (words.includes(newWord)) return;
		setWords([...words, newWord]);
	};

	const removeFirst = () => {
		const newWords = [...words];
		newWords.shift();
		setWords(newWords);
	};

	return (
		<div>
			<button onClick={addWord}>Add word</button>
			<button onClick={removeFirst}>Remove first word</button>
			<ul>
				{words.map((word) => {
					return (
						<li>
							{word.word}
							<input type="text" />
						</li>
					);
				})}
			</ul>
		</div>
	);
};

const wordDatabase = [
	{ word: "who", id: 1 },
	{ word: "what", id: 2 },
	{ word: "when", id: 3 },
	{ word: "where", id: 4 },
	{ word: "why", id: 5 },
	{ word: "how", id: 6 },
];

function getRandomWord() {
	return wordDatabase[Math.floor(Math.random() * wordDatabase.length)];
}

createRoot(document.getElementById("root")).render(<WordList />);
