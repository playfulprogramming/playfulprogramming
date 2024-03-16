<!-- App.vue -->
<script setup>
import { ref, provide } from "vue";
import Child from "./Child.vue";

const greeting = ref("");

function changeGreeting(val) {
	greeting.value = val;
}

provide("MESSAGE", { greeting, changeGreeting });
</script>

<template>
	<Child />
</template>
