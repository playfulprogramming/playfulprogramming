<!-- GrandChild.vue -->
<script setup>
import { provide, ref } from "vue";
import GreatGrandChild from "./GreatGrandChild.vue";

const greeting = ref("✨ Welcome 💯");

// New ✨ sparkly ✨ functionality adds some fun! 💯
function changeGreeting(newVal) {
	if (!newVal.includes("✨")) {
		newVal += "✨";
	}
	if (!newVal.includes("💯")) {
		newVal += "💯";
	}
	greeting.value = newVal;
}

provide("MESSAGE", { greeting, changeGreeting });
</script>

<template>
	<GreatGrandChild />
</template>
