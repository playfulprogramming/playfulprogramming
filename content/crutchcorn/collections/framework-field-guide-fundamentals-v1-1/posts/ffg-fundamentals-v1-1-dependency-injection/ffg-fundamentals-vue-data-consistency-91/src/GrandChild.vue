<!-- GrandChild.vue -->
<script setup>
import { provide } from "vue";
import GreatGrandChild from "./GreatGrandChild.vue";

provide("USER", { firstName: "Corbin", lastName: "Crutchley" });
</script>

<template>
	<GreatGrandChild />
</template>
