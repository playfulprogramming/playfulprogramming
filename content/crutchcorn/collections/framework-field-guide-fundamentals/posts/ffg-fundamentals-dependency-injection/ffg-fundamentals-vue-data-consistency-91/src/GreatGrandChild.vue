<!-- GreatGrandChild.vue -->
<script setup>
import { inject } from "vue";

// Nothing will display, because we switched the user
// type halfway through the component tree
const user = inject("USER");
</script>

<template>
	<p>Name: {{ user.name }}</p>
</template>
