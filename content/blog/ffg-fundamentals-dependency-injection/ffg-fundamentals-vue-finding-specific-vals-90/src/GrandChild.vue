<!-- GrandChild.vue -->
<script setup>
import { provide } from "vue";
import GreatGrandChild from "./GreatGrandChild.vue";

provide("FAV_FOOD", "Ice Cream");
</script>

<template>
	<GreatGrandChild />
</template>
