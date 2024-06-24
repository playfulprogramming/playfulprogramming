<!-- Table.vue -->
<script setup>
const props = defineProps(["data"]);
</script>

<template>
	<table>
		<thead>
			<slot name="header" :length="props.data.length"></slot>
		</thead>
		<tbody>
			<slot
				v-for="(item, i) in props.data"
				:key="i"
				:rowI="i"
				:value="props.data[i]"
			/>
		</tbody>
	</table>
</template>
