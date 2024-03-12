<!-- Parent.vue -->
<script setup>
import { provide } from "vue";
import Child from "./Child.vue";

provide("WELCOME_MESSAGE", "Hello, world!");
</script>

<template>
	<Child />
</template>
