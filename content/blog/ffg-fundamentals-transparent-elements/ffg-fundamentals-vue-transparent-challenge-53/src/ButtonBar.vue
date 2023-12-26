<!-- ButtonBar.vue -->
<script setup>
import FileActionButtons from "./FileActionButtons.vue";

const props = defineProps(["fileSelected"]);
const emit = defineEmits(["delete", "copy", "favorite", "settings"]);
</script>

<template>
	<div style="display: flex; gap: 1rem">
		<FileActionButtons
			v-if="props.fileSelected"
			@delete="emit('delete')"
			@copy="emit('copy')"
			@favorite="emit('favorite')"
		/>
		<button @click="emit('settings')">Settings</button>
	</div>
</template>
