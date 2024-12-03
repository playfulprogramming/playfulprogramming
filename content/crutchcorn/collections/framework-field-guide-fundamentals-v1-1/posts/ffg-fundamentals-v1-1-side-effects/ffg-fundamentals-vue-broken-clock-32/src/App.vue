<!-- App.vue -->
<script setup>
import Clock from "./Clock.vue";
import { ref } from "vue";

const showClock = ref(true);

function setShowClock(val) {
	showClock.value = val;
}
</script>

<template>
	<div>
		<button @click="setShowClock(!showClock)">Toggle clock</button>
		<Clock v-if="showClock" />
	</div>
</template>
