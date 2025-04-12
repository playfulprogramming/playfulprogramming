<!-- GreatGrandChild.vue -->
<script setup>
import { inject } from "vue";

// Despite the `AGE` being closer, this is
// specifically looking for the `NAME` and will
// go further up in the tree to find that data from `App`
const name = inject("NAME");
// Meanwhile, this will search for the context that pertains to its name
const favFood = inject("FAV_FOOD");
</script>

<template>
	<p>Name: {{ name }}</p>
	<p>Favorite food: {{ favFood }}</p>
</template>
