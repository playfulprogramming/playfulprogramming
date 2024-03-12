<!-- App.vue -->
<script setup>
import { ref, provide } from "vue";
import Child from "./Child.vue";

const portalContainerEl = ref(null);
provide("portalContainerEl", portalContainerEl);
</script>

<template>
	<div style="height: 100px; width: 100px; border: 2px solid black">
		<div ref="portalContainerEl"></div>
	</div>
	<Child />
</template>
