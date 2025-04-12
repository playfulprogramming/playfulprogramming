<script setup>
const props = defineProps(["bool"]);
</script>

<template>
	<div><p v-if="bool">Text here</p></div>
</template>
