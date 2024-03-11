<!-- App.vue -->
<script setup>
import { ref, watchEffect } from "vue";

const title = ref("Movies");

// watchEffect will re-run whenever `title.value` is updated
watchEffect(() => {
	document.title = title.value;

	// Adding an alert so that it's easier to see when the effect runs
	alert(`The title is now ${title.value}`);
});
</script>

<template>
	<div>
		<button @click="title = 'Movies'">Movies</button>
		<button @click="title = 'Music'">Music</button>
		<button @click="title = 'Documents'">Documents</button>
		<p>{{ title }}</p>
	</div>
</template>
