<!-- App.vue -->
<script setup>
import { ref } from "vue";
import ParentList from "./ParentList.vue";

const list = ref([1, 2, 3]);

function addOne() {
	const randomNum = Math.floor(Math.random() * 100);
	list.value.push(randomNum);
}
</script>

<template>
	<ParentList :list="list">
		<!-- Think of this as "template is receiving an object
		 we'll call props" from "ParentList" -->
		<template v-slot="props">
			<li :style="'background-color:' + props.backgroundColor">
				{{ props.i }} {{ props.item }}
			</li>
		</template>
	</ParentList>
	<button @click="addOne()">Add</button>
</template>
