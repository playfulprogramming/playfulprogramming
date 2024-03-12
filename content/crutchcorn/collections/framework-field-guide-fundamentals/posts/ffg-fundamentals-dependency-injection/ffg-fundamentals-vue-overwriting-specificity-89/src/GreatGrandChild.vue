<!-- GreatGrandChild.vue -->
<script setup>
import { inject } from "vue";

const name = inject("NAME");
</script>

<template>
	<p>Name: {{ name }}</p>
</template>
