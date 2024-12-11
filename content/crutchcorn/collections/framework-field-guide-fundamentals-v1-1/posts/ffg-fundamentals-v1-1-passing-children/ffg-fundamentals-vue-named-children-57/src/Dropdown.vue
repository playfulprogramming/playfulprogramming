<!-- Dropdown.vue -->
<script setup>
const props = defineProps(["expanded"]);

const emit = defineEmits(["toggle"]);
</script>

<template>
	<button
		@click="emit('toggle')"
		:aria-expanded="expanded"
		aria-controls="dropdown-contents"
	>
		{{ props.expanded ? "V" : ">" }} <slot name="header" />
	</button>
	<div id="dropdown-contents" role="region" :hidden="!props.expanded">
		<slot />
	</div>
</template>
