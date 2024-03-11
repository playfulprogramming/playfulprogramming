<!-- App.vue -->
<script setup>
import { ref, watch } from "vue";

const title = ref("Movies");

watch(
	title,
	() => {
		const el = document.querySelector("#title-paragraph");

		alert(el?.innerText);
	},
	{ immediate: true, flush: "post" },
);
</script>

<template>
	<div>
		<button @click="title = 'Movies'">Movies</button>
		<button @click="title = 'Music'">Music</button>
		<button @click="title = 'Documents'">Documents</button>
		<p id="title-paragraph">{{ title }}</p>
	</div>
</template>
