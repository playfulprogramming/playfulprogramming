<!-- TextInput.vue -->
<script setup>
const props = defineProps(['label', 'type']);
</script>

<template>
	<label>
    	{{props.label}}
        <input :type="props.type"/>
    </label>
</template>
