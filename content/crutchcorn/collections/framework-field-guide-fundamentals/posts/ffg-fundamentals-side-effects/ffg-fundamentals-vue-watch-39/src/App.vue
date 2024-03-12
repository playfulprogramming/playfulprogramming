<!-- App.vue -->
<script setup>
import { ref, watch } from "vue";

const title = ref("Movies");

watch(
	// Only listen for changes to `title`, despite what's in the function body
	title,
	() => {
		document.title = title.value;

		// Adding an alert so that it's easier to see when the effect runs
		alert(`The title is now ${title.value}`);
	},
	{ immediate: true },
);
</script>

<template>
	<div>
		<button @click="title = 'Movies'">Movies</button>
		<button @click="title = 'Music'">Music</button>
		<button @click="title = 'Documents'">Documents</button>
		<p>{{ title }}</p>
	</div>
</template>
