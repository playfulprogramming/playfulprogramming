<!-- AlarmScreen.vue -->
<script setup>
import { onMounted } from "vue";

const props = defineProps(["snooze", "disable"]);

onMounted(() => {
	console.log("MOUNT IS RUNNING");
	setTimeout(() => {
		// Automatically snooze the alarm
		// after 10 seconds of inactivity
		// In production, this would be 10 minutes
		console.log("CALLING SNOOZE");
		props.snooze();
	}, 10 * 1000);
});
</script>

<template>
	<div>
		<p>Time to wake up!</p>
		<button @click="props.snooze()">Snooze for 5 seconds</button>
		<button @click="props.disable()">Turn off alarm</button>
	</div>
</template>
