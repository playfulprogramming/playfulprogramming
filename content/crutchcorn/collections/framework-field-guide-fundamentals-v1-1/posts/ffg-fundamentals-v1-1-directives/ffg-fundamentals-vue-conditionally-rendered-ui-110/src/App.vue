<!-- App.vue -->
<script setup>
import FeatureFlag from "./FeatureFlag.vue";
</script>

<template>
	<FeatureFlag name="addToCartButton">
		<button>Add to cart</button>
	</FeatureFlag>
	<FeatureFlag name="purchaseThisItemButton">
		<button>Purchase this item</button>
	</FeatureFlag>
</template>
