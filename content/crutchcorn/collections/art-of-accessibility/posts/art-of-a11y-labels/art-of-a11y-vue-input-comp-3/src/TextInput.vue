<!-- TextInput.vue -->
<script setup>
const props = defineProps(["label", "type", "id", "error"]);
</script>

<template>
	<label :for="props.id" class="label">
		{{ props.label }}
	</label>
	<input
		:id="props.id"
		:type="props.type"
		:aria-invalid="!!props.error"
		:aria-errormessage="props.id + '-error'"
	/>
	<p class="errormessage" :id="props.id + '-error'">{{ props.error }}</p>
</template>

<style scoped>
.label {
	margin-right: 1rem;
}

.errormessage {
	color: red;
}
</style>
