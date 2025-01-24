<!-- FeatureFlag.vue -->
<script setup>
const flags = {
	addToCartButton: true,
	purchaseThisItemButton: false,
};

const props = defineProps(["name"]);
</script>

<template>
	<slot v-if="flags[props.name]"></slot>
</template>
