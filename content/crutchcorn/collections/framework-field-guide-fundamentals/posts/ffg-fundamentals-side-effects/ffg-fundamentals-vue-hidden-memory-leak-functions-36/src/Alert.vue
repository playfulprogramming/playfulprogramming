<!-- Alert.vue -->
<script setup>
import { onMounted } from "vue";

const props = defineProps(["alert"]);

onMounted(() => {
	setTimeout(() => {
		props.alert?.();
	}, 1000);
});
</script>

<template>
	<p>Showing alert...</p>
</template>
