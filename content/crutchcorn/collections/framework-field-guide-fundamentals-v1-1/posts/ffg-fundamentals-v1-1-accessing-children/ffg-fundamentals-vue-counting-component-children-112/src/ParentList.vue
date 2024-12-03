<!-- ParentList -->
<script setup>
const props = defineProps(["list"]);
</script>

<template>
	<p>There are {{ props.list.length }} number of items in this array</p>
	<ul>
		<slot></slot>
	</ul>
</template>
