<!-- TitleChanger.vue -->
<script setup>
import { watch, ref, onUnmounted } from "vue";
const title = ref("Movies");

let timeoutExpire = null;

function updateTitle(val) {
	clearTimeout(timeoutExpire);
	timeoutExpire = setTimeout(() => {
		title.value = val;
		document.title = val;
	}, 5000);
}

onUnmounted(() => clearTimeout(timeoutExpire));
</script>

<template>
	<div>
		<button @click="updateTitle('Movies')">Movies</button>
		<button @click="updateTitle('Music')">Music</button>
		<button @click="updateTitle('Documents')">Documents</button>
		<p>{{ title }}</p>
	</div>
</template>
