<!-- FileActionButtons.vue -->
<script setup>
const emit = defineEmits(["delete", "copy", "favorite"]);
</script>

<template>
	<button @click="emit('delete')">Delete</button>
	<button @click="emit('copy')">Copy</button>
	<button @click="emit('favorite')">Favorite</button>
</template>
