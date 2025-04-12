import { bootstrapApplication } from "@angular/platform-browser";

import {
	Component,
	provideExperimentalZonelessChangeDetection,
	ChangeDetectionStrategy,
	signal,
} from "@angular/core";

@Component({
	selector: "word-list",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div>
			<button (click)="addWord()">Add word</button>
			<button (click)="removeFirst()">Remove first word</button>
			<ul>
				@for (word of words(); track word.id) {
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
	words = signal<Word[]>([]);

	addWord() {
		const newWord = getRandomWord();
		// Remove ability for duplicate words
		if (this.words().includes(newWord)) return;
		this.words.set([...this.words(), newWord]);
	}

	removeFirst() {
		const newWords: Word[] = [];
		newWords.shift();
		this.words.set(newWords);
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
