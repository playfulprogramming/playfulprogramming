<!-- FileDate.vue -->
<script setup>
import { ref, onMounted } from "vue";

function formatDate(inputDate) {
	// Month starts at 0, annoyingly
	const monthNum = inputDate.getMonth() + 1;
	const dateNum = inputDate.getDate();
	const yearNum = inputDate.getFullYear();
	return monthNum + "/" + dateNum + "/" + yearNum;
}

const dateStr = ref(formatDate(new Date()));

onMounted(() => {
	setTimeout(() => {
		// 24 hours, 60 minutes, 60 seconds, 1000 milliseconds
		const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
		dateStr.value = formatDate(tomorrow);
	}, 5000);
});
</script>

<template>
	<span>{{ dateStr }}</span>
</template>
