<!-- App.vue -->
<script setup>
import Table from "./Table.vue";

const data = [
	{
		name: "Corbin",
		age: 24,
	},
	{
		name: "Joely",
		age: 28,
	},
	{
		name: "Frank",
		age: 33,
	},
];
</script>

<template>
	<Table :data="data">
		<template #header="{ length }">
			<tr>
				<th>{{ length }} items</th>
			</tr>
		</template>
		<template v-slot="{ rowI, value }">
			<tr>
				<td
					:style="rowI % 2 ? 'background: lightgrey' : 'background: lightblue'"
				>
					{{ value.name }}
				</td>
			</tr>
		</template>
	</Table>
</template>
