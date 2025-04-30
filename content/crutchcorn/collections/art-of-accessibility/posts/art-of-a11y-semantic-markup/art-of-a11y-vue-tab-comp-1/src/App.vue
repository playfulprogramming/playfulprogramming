<!-- App.vue -->
<script setup>
import { ref } from "vue";

const tabList = [
	{
		id: "javascript-tab",
		label: "JavaScript",
		panelId: "javascript-panel",
		content: `console.log("Hello, world!");`,
	},
	{
		id: "python-tab",
		label: "Python",
		panelId: "python-panel",
		content: `print("Hello, world!")`,
	},
];

const activeTabIndex = ref(0);

function setActiveTabIndex(val) {
	const normalizedIndex = normalizeCount(val, tabList.length);
	activeTabIndex.value = normalizedIndex;
	const target = document.getElementById(tabList[normalizedIndex].id);
	target?.focus();
}

function onKeyDown(event) {
	let preventDefault = false;

	switch (event.key) {
		case "ArrowLeft":
			setActiveTabIndex(activeTabIndex.value - 1);
			preventDefault = true;
			break;

		case "ArrowRight":
			setActiveTabIndex(activeTabIndex.value + 1);
			preventDefault = true;
			break;

		case "Home":
			setActiveTabIndex(0);
			preventDefault = true;
			break;

		case "End":
			setActiveTabIndex(tabList.length - 1);
			preventDefault = true;
			break;

		default:
			break;
	}

	if (preventDefault) {
		event.stopPropagation();
		event.preventDefault();
	}
}

function normalizeCount(index, max) {
	if (index < 0) {
		return max - 1;
	}

	if (index >= max) {
		return 0;
	}

	return index;
}
</script>

<template>
	<div>
		<ul role="tablist">
			<li
				v-for="(tab, index) in tabList"
				:key="tab.id"
				role="tab"
				:id="tab.id"
				:tabIndex="index === activeTabIndex ? 0 : -1"
				:aria-selected="index === activeTabIndex"
				:aria-controls="tab.panelId"
				@click="setActiveTabIndex(index)"
				@keydown="onKeyDown($event)"
			>
				{{ tab.label }}
			</li>
		</ul>
		<div
			v-for="(tab, index) in tabList"
			:key="tab.panelId"
			role="tabpanel"
			:id="tab.panelId"
			:aria-labelledby="tab.id"
			:style="'display: ' + (index !== activeTabIndex ? 'none' : 'block')"
		>
			<code>
				{{ tab.content }}
			</code>
		</div>
	</div>
</template>

<style scoped>
/* index.css */
[role="tablist"] {
	margin: 0;
	padding: 0;
	display: flex;
	gap: 0.25rem;
}

[role="tab"] {
	display: inline-block;
	padding: 1rem;
	border: solid black;
	border-width: 2px 2px 0 2px;
	border-radius: 1rem 1rem 0 0;
}

[role="tab"]:focus-visible {
	outline: none;
	box-shadow:
		0 0 0 2px #000,
		0 0 0 4px #fff,
		0 0 0 6px #000;
}

[role="tab"]:hover {
	background: #d3d3d3;
}

[role="tab"]:active {
	background: #878787;
}

[role="tab"][aria-selected="true"] {
	background: black;
	color: white;
}

[role="tabpanel"] {
	border: solid black;
	border-width: 2px;
	padding: 1rem;
	border-radius: 0 1rem 1rem 1rem;
}
</style>
