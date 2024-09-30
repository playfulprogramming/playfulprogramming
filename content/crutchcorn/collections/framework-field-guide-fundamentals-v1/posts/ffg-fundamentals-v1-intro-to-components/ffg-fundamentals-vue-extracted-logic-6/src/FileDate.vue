<!-- FileDate.vue -->
<script setup>
function formatDate() {
	const today = new Date();
	// Month starts at 0, annoyingly
	const monthNum = today.getMonth() + 1;
	const dateNum = today.getDate();
	const yearNum = today.getFullYear();
	return monthNum + "/" + dateNum + "/" + yearNum;
}

const dateStr = formatDate();
</script>

<template>
	<span>12/03/21</span>
</template>
