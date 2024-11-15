import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	provideExperimentalZonelessChangeDetection,
	signal,
} from "@angular/core";

@Component({
	selector: "word-list",
	template: `
		<div>
			<button (click)="addWord()">Add word</button>
			<button (click)="removeFirst()">Remove first word</button>
			<ul>
				@for (word of words; track word.id) {
					<li>
						{{ word.word }}
						<input type="text" />
					</li>
				}
			</ul>
		</div>
	`,
})
class WordListComponent {
	words: Word[] = [];

	addWord() {
		const newWord = getRandomWord();
		// Remove ability for duplicate words
		if (this.words.includes(newWord)) return;
		this.words = [...this.words, newWord];
	}

	removeFirst() {
		const newWords: Word[] = [];
		for (let i = 0; i < this.words.length; i++) {
			if (i === 0) continue;
			// We could just push `this.words[i]` without making a new object
			// But when we do so the bug I'm hoping to showcase isn't visible.
			// Further, this is commonplace to make a new object in a list to
			// avoid accidental mutations
			newWords.push({ ...this.words[i] });
		}
		this.words = newWords;
	}
}

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

interface Word {
	word: string;
	id: number;
}

bootstrapApplication(WordListComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
