<!-- Clock.vue -->
<script setup>
import { ref, onMounted } from "vue";

const time = ref(formatDate(new Date()));

onMounted(() => {
	setInterval(() => {
		console.log("I am updating the time");
		time.value = formatDate(new Date());
	}, 1000);
});

function formatDate(date) {
	return (
		prefixZero(date.getHours()) +
		":" +
		prefixZero(date.getMinutes()) +
		":" +
		prefixZero(date.getSeconds())
	);
}

function prefixZero(number) {
	if (number < 10) {
		return "0" + number.toString();
	}

	return number.toString();
}
</script>

<template>
	<p role="timer">Time is: {{ time }}</p>
</template>
