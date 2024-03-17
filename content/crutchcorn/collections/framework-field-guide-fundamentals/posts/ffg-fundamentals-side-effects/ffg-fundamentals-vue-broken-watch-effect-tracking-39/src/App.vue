<!-- App.vue -->
<script setup>
import { ref, watchEffect } from "vue";

const title = ref("Movies");
const count = ref(0);

// watchEffect will re-run only when `count.value` is updated
watchEffect(() => {
	console.log(count.value);
	// This is an async operation, inner `ref` usage won't be tracked
	setTimeout(() => {
		const val = "Title is " + title.value + " and count is " + count.value;
		// Adding an alert so that it's easier to see when the effect runs
		alert(val);
		document.title = val;
	}, 0);
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
