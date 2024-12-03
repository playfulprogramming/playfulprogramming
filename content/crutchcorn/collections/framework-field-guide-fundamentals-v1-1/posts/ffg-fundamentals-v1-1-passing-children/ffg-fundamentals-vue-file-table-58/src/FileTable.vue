<script setup>
import { ref } from "vue";
import FileTableBody from "./FileTableBody.vue";

const onlyShowFiles = ref(false);

function toggleOnlyShow() {
	onlyShowFiles.value = !onlyShowFiles.value;
}
</script>

<template>
	<div>
		<button @click="toggleOnlyShow()" style="margin-bottom: 1rem">
			Only show files
		</button>
		<table style="border-spacing: 0">
			<FileTableBody :onlyShowFiles="onlyShowFiles" />
		</table>
	</div>
</template>
