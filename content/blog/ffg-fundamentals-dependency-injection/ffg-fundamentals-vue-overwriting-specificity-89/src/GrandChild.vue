<!-- GrandChild.vue -->
<script setup>
import { provide } from "vue";
import GreatGrandChild from "./GreatGrandChild.vue";

// Notice the new provider here, it will suppliment the `App` injected value
// for all child components of `GrandChild`
provide("NAME", "Kevin");
</script>

<template>
	<GreatGrandChild />
</template>
