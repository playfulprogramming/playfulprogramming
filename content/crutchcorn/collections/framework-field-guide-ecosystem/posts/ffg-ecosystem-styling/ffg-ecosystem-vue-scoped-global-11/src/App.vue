<script setup>
import Child from "./Child.vue";
</script>

<template>
	<p class="blue">This is blue text</p>
	<p class="red">This is red text</p>
	<Child />
</template>

<style scoped>
.red {
	color: darkred;
}

:global(.blue) {
	color: darkblue;
}
</style>
