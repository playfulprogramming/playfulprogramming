<!-- Alert.vue -->
<script setup>
import { onMounted } from "vue";

const emit = defineEmits(["alert"]);
const props = defineProps(["alert"]);

// We are intentionally not cleaning up `onMounted`
onMounted(() => {
	setTimeout(() => {
		emit("alert");
		props.alert();
		console.log("I am showing the alert");
	}, 1000);
});
</script>

<template>
	<p>Showing alert...</p>
</template>
