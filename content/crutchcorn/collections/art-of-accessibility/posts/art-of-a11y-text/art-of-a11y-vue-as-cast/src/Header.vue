<!-- Header.vue -->
<!-- Suffers from https://github.com/vuejs/language-tools/issues/5159 -->
<script setup lang="ts" generic="T extends keyof HTMLElementTagNameMap = 'h1'">
const props = defineProps<
	Partial<HTMLElementTagNameMap[T]> & {
		as?: T;
	}
>();

const Component = props.as || "h1";
</script>

<template>
	<component :is="Component" v-bind="props" style="color: darkred">
		<slot />
	</component>
</template>
