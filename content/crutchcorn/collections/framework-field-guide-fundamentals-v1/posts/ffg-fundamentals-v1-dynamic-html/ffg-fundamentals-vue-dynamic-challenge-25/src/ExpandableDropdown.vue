<!-- ExpandableDropdown.vue -->
<script setup>
const props = defineProps(["name", "expanded"]);
const emit = defineEmits(["toggle"]);
</script>

<template>
	<div>
		<button @click="emit('toggle')">
			{{ expanded ? "V" : ">" }}
			{{ name }}
		</button>
		<div v-if="expanded">More information here</div>
	</div>
</template>
