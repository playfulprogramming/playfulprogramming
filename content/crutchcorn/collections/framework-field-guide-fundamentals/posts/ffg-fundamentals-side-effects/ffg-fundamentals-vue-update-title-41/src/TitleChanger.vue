<!-- TitleChanger.vue -->
<script setup>
import { ref } from "vue";
const title = ref("Movies");

function updateTitle(val) {
	setTimeout(() => {
		title.value = val;
		document.title = val;
	}, 5000);
}
</script>

<template>
	<div>
		<button @click="updateTitle('Movies')">Movies</button>
		<button @click="updateTitle('Music')">Music</button>
		<button @click="updateTitle('Documents')">Documents</button>
		<p>{{ title }}</p>
	</div>
</template>
