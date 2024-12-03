<!-- ParentList.vue -->
<script setup>
const props = defineProps(["list"]);
</script>

<template>
	<p>There are {{ props.list.length }} number of items in this array</p>
	<ul id="parentList">
		<slot
			v-for="(item, i) in props.list"
			:item="item"
			:i="i"
			:backgroundColor="i % 2 ? 'grey' : ''"
		></slot>
	</ul>
</template>
