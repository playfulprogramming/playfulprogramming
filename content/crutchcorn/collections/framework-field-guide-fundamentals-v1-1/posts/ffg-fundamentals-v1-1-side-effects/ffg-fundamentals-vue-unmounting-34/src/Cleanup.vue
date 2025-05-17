<!-- Cleanup.vue -->
<script setup>
import { onUnmounted } from "vue";

onUnmounted(() => {
	alert("I am cleaning up");
});
</script>

<template>
	<p>Unmount me to see an alert</p>
</template>
