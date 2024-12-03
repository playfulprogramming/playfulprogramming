<!-- File.vue -->
<script setup>
import { ref } from "vue";
const props = defineProps(["fileName"]);

const isSelected = ref(false);
const inputDate = new Date();
function selectFile() {
	isSelected.value = !isSelected.value;
}
</script>

<template>
	<button
		v-on:click="selectFile()"
		:style="
			isSelected
				? 'background-color: blue; color: white'
				: 'background-color: white; color: blue'
		"
	>
		{{ props.fileName }}
		<FileDate :inputDate="inputDate" />
	</button>
</template>
