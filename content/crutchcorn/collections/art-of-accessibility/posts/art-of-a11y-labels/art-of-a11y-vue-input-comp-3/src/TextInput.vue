<!-- TextInput.vue -->
<script setup>
import { computed } from "vue";
import { v4 as uuidv4 } from "uuid";

const props = defineProps(["label", "type", "id", "error"]);

const uuid = uuidv4();

const realId = computed(() => props.id || uuid);
</script>

<template>
	<label :for="props.id" class="label">
		{{ props.label }}
	</label>
	<input
		:id="props.id"
		:type="props.type"
		:aria-invalid="!!props.error"
		:aria-errormessage="realId + '-error'"
	/>
	<p class="errormessage" :id="realId + '-error'">{{ props.error }}</p>
</template>

<style scoped>
.label {
	margin-right: 1rem;
}

.errormessage {
	color: red;
}
</style>
