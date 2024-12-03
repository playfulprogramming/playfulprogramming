<!-- Child.vue -->
<script setup>
import { inject } from "vue";

const portalContainerEl = inject("portalContainerEl");
</script>

<template>
	<div v-if="portalContainerEl">
		<Teleport :to="portalContainerEl">Hello, world!</Teleport>
	</div>
</template>
