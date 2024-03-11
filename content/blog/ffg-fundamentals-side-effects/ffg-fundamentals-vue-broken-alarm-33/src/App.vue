<!-- App.vue -->
<script setup>
import AlarmScreen from "./AlarmScreen.vue";
import { ref, onMounted } from "vue";

const secondsLeft = ref(5);
const timerEnabled = ref(true);

onMounted(() => {
	setInterval(() => {
		if (secondsLeft.value === 0) return;
		secondsLeft.value = secondsLeft.value - 1;
	}, 1000);
});

const snooze = () => {
	// In production, this would add 5 minutes, not 5 seconds
	secondsLeft.value = secondsLeft.value + 5;
};

const disable = () => {
	timerEnabled.value = false;
};
</script>

<template>
	<p v-if="!timerEnabled">There is no timer</p>
	<AlarmScreen
		v-else-if="secondsLeft === 0"
		:snooze="snooze"
		:disable="disable"
	/>
	<p v-else>{{ secondsLeft }} seconds left in timer</p>
</template>
