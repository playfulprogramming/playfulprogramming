<!-- File.vue -->
<script setup>
import FileDate from "./FileDate.vue";
const inputDate = new Date();

const props = defineProps(["isSelected", "isFolder", "fileName", "href"]);

const emit = defineEmits(["selected"]);
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
		<FileDate v-if="!isFolder" :inputDate="inputDate" />
	</button>
</template>
