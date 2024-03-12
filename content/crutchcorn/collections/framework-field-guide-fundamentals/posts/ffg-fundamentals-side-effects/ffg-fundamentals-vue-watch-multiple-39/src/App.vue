<!-- App.vue -->
<script setup>
import { ref, watch } from "vue";

const title = ref("Movies");
const count = ref(0);

// This will run when `title` and `count` are updated, despite async usage
watch([title, count], (currentValue, previousValue, onCleanup) => {
	const timeout = setTimeout(() => {
		const val = "Title is " + title.value + " and count is " + count.value;
		document.title = val;

		// Adding an alert so that it's easier to see when the effect runs
		alert(val);
	}, 1000);

	onCleanup(() => clearTimeout(timeout));
});
</script>

<template>
	<div>
		<button @click="title = 'Movies'">Movies</button>
		<button @click="title = 'Music'">Music</button>
		<button @click="title = 'Documents'">Documents</button>
		<p>{{ title }}</p>
		<button @click="count++">Increment</button>
	</div>
</template>
