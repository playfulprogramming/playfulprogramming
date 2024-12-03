<!-- TitleChanger.vue -->
<script setup>
import { ref, onUnmounted } from "vue";
const title = ref("Movies");

const timeoutExpire = ref(null);

function updateTitle(val) {
	clearTimeout(timeoutExpire.value);
	timeoutExpire.value = setTimeout(() => {
		title.value = val;
		document.title = val;
	}, 5000);
}

onUnmounted(() => clearTimeout(timeoutExpire.value));
</script>

<template>
	<div>
		<button @click="updateTitle('Movies')">Movies</button>
		<button @click="updateTitle('Music')">Music</button>
		<button @click="updateTitle('Documents')">Documents</button>
		<p>{{ title }}</p>
	</div>
</template>
