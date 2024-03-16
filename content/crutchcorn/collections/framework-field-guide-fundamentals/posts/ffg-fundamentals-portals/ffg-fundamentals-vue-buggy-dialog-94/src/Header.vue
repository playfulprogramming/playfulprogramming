<!-- Header.vue -->
<script setup>
import FolderIcon from "./FolderIcon.vue";
import DeleteIcon from "./DeleteIcon.vue";
import Modal from "./Modal.vue";
import { ref } from "vue";
const shouldShowModal = ref(false);

function showModal() {
	shouldShowModal.value = true;
}
</script>

<template>
	<div class="header-container">
		<Modal v-if="shouldShowModal" />
		<span class="icon-container">
			<FolderIcon />
		</span>
		<span class="header-title">Main folder</span>
		<span class="auto"></span>
		<button class="icon-btn" @click="showModal()">
			<DeleteIcon />
		</button>
	</div>
</template>
