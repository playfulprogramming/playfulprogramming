<!-- Parent.vue -->
<script setup>
import { ref, onMounted } from "vue";
import Child from "./Child.vue";

const childComp = ref();

onMounted(() => {
	console.log(childComp.value);
});
</script>

<template>
	<Child ref="childComp" />
</template>
