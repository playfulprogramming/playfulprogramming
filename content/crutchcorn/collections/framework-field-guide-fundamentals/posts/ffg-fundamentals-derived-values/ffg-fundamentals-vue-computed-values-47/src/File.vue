<!-- File.vue -->
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import FileDate from "./FileDate.vue";

const props = defineProps(["isSelected", "isFolder", "fileName", "href"]);

const emit = defineEmits(["selected"]);

const inputDate = ref(new Date());
const interval = ref(null);

onMounted(() => {
	// Check if it's a new day every 10 minutes
	interval.value = setInterval(
		() => {
			const newDate = new Date();
			if (inputDate.value.getDate() === newDate.getDate()) return;
			inputDate.value = newDate;
		},
		10 * 60 * 1000,
	);
});

onUnmounted(() => {
	clearInterval(interval.value);
});
</script>

<template>
	<button
		v-on:click="emit('selected')"
		:style="
			isSelected
				? 'background-color: blue; color: white'
				: 'background-color: white; color: blue'
		"
	>
		{{ fileName }}
		<span v-if="isFolder">Type: Folder</span>
		<span v-else>Type: File</span>
		<FileDate v-if="!isFolder" :inputDate="inputDate" />
	</button>
</template>
