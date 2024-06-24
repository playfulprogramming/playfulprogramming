<!-- App.vue -->
<script setup>
import { provide } from "vue";
import Child from "./Child.vue";

provide("USER", { name: "Corbin" });
</script>

<template>
	<Child />
</template>
