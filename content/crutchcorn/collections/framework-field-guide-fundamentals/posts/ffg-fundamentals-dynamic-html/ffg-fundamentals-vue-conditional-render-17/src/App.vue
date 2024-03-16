<script setup>
import ConditionalRender from "./ConditionalRender.vue";
</script>

<template>
	<div>
		<h1>Shown contents</h1>
		<ConditionalRender :bool="true" />
		<h1>Hidden contents</h1>
		<ConditionalRender :bool="false" />
	</div>
</template>
