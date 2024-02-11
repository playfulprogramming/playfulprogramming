<!-- Child.vue -->
<script setup>
import { inject } from "vue";
import GrandChild from "./GrandChild.vue";

const name = inject("NAME");
</script>

<template>
	<p>Name: {{ name }}</p>
	<GrandChild />
</template>
