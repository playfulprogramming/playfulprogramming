<!-- FileDate.vue -->
<script setup>
const dateStr = `${
	new Date().getMonth() + 1
}/${new Date().getDate()}/${new Date().getFullYear()}`;
</script>

<template>
	<span>12/03/21</span>
</template>
