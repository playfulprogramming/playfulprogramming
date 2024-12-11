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

function formatReadableDate(inputDate) {
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const monthStr = months[inputDate.getMonth()];
	const dateSuffixStr = dateSuffix(inputDate.getDate());
	const yearNum = inputDate.getFullYear();
	return monthStr + " " + dateSuffixStr + "," + yearNum;
}

function dateSuffix(dayNumber) {
	const lastDigit = dayNumber % 10;
	if (lastDigit == 1 && dayNumber != 11) {
		return dayNumber + "st";
	}
	if (lastDigit == 2 && dayNumber != 12) {
		return dayNumber + "nd";
	}
	if (lastDigit == 3 && dayNumber != 13) {
		return dayNumber + "rd";
	}
	return dayNumber + "th";
}

const dateStr = ref(formatDate(new Date()));
const labelText = ref(formatReadableDate(new Date()));

onMounted(() => {
	setTimeout(() => {
		// 24 hours, 60 minutes, 60 seconds, 1000 milliseconds
		const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
		dateStr.value = formatDate(tomorrow);
		labelText.value = formatReadableDate(tomorrow);
	}, 5000);
});
</script>

<template>
	<span v-bind:aria-label="labelText">{{ dateStr }}</span>
</template>
