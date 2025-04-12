<!-- WordList.vue -->
<script setup>
import { ref } from "vue";

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

const words = ref([]);

function addWord() {
	const newWord = getRandomWord();
	// Remove ability for duplicate words
	if (words.value.includes(newWord)) return;
	words.value.push(newWord);
}

function removeFirst() {
	words.value.shift();
}
</script>

<template>
	<div>
		<button @click="addWord()">Add word</button>
		<button @click="removeFirst()">Remove first word</button>
		<ul>
			<li v-for="word in words">
				{{ word.word }}
				<input type="text" />
			</li>
		</ul>
	</div>
</template>
