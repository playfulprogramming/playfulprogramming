<!-- Header.vue -->
<script setup lang="ts" generic="T extends keyof HTMLElementTagNameMap = 'h1'">
const props = defineProps<{
	as?: T;
}>();

const Component = props.as || "h1";
</script>

<template>
	<component :is="Component" v-bind="props" style="color: darkred">
		<slot />
	</component>
</template>
