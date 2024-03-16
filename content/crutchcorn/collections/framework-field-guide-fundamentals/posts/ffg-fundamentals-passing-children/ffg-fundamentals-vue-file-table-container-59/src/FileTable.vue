<script setup>
import { ref } from "vue";
import FileTableContainer from "./FileTableContainer.vue";
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
		<FileTableContainer>
			<FileTableBody :onlyShowFiles="onlyShowFiles" />
		</FileTableContainer>
	</div>
</template>
