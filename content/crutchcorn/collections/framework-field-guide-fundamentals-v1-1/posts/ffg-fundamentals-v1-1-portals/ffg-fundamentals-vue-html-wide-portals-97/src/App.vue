<!-- App.vue -->
<script setup>
import Child from "./Child.vue";
</script>

<template>
	<!-- Even though it's rendered first, it shows up last because it's being appended to <body> -->
	<Child />
	<div style="height: 100px; width: 100px; border: 2px solid black"></div>
</template>
