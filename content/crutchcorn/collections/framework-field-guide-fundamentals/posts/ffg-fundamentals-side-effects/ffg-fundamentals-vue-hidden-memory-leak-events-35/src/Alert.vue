<!-- Alert.vue -->
<script setup>
import { onMounted } from "vue";

const emit = defineEmits(["alert"]);

onMounted(() => {
	setTimeout(() => {
		emit("alert");
	}, 1000);
});
</script>

<template>
	<p>Showing alert...</p>
</template>
