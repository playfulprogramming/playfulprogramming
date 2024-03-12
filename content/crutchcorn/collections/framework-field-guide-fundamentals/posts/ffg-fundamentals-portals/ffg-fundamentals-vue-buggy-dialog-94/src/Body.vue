<!-- Body.vue -->
<script setup>
import FolderIcon from "./FolderIcon.vue";

const files = Array.from({ length: 10 }, (_, i) => i);
</script>

<template>
	<ul class="list-container">
		<li class="list-item" v-for="fileIdx of files">
			<FolderIcon />
			<span>File number {{ fileIdx + 1 }}</span>
		</li>
	</ul>
</template>
