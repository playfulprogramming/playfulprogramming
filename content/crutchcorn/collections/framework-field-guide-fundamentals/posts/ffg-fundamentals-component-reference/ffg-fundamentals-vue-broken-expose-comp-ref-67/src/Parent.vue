<!-- Parent.vue -->
<script setup>
import { ref, onMounted } from "vue";
import Child from "./Child.vue";

const childComp = ref();

onMounted(() => {
	alert(childComp.value.pi);
});
</script>

<template>
	<Child ref="childComp" />
</template>
