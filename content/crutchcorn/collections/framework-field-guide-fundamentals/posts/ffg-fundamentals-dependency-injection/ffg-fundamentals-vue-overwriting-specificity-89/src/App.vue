<!-- App.vue -->
<script setup>
import { provide } from "vue";
import Child from "./Child.vue";

provide("NAME", "Corbin");
</script>

<template>
	<Child />
</template>
