<!-- Sidebar.vue -->
<script setup>
import { ref } from "vue";
import ExpandableDropdown from "./ExpandableDropdown.vue";

const categories = [
	"Movies",
	"Pictures",
	"Concepts",
	"Articles I'll Never Finish",
	"Website Redesigns v5",
	"Invoices",
];

const expandedMap = ref(objFromCategories(categories));

const onToggle = (cat) => {
	expandedMap.value[cat] = !expandedMap.value[cat];
};

function objFromCategories(categories) {
	let obj = {};
	for (let cat of categories) {
		obj[cat] = false;
	}
	return obj;
}
</script>

<template>
	<div>
		<h1>My Files</h1>
		<ExpandableDropdown
			v-for="cat of categories"
			:key="cat"
			:name="cat"
			:expanded="expandedMap[cat]"
			@toggle="onToggle(cat)"
		/>
	</div>
</template>
