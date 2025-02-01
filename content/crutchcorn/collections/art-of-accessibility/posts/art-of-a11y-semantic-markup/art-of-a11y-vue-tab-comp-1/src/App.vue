<!-- App.vue -->
<script setup>
import { ref } from "vue";

const activeTab = ref("javascript");

function setActiveTab(val) {
	activeTab.value = val;
}
</script>

<template>
	<div>
		<ul role="tablist">
			<li
				role="tab"
				id="javascript-tab"
				:aria-selected="activeTab === 'javascript'"
				aria-controls="javascript-panel"
				@click="setActiveTab('javascript')"
			>
				JavaScript
			</li>
			<li
				role="tab"
				id="python-tab"
				:aria-selected="activeTab === 'python'"
				aria-controls="python-panel"
				@click="setActiveTab('python')"
			>
				Python
			</li>
		</ul>
		<div
			role="tabpanel"
			id="javascript-panel"
			aria-labelledby="javascript-tab"
			:hidden="activeTab !== 'javascript'"
		>
			<code>console.log("Hello, world!");</code>
		</div>
		<div
			role="tabpanel"
			id="python-panel"
			aria-labelledby="python-tab"
			:hidden="activeTab !== 'python'"
		>
			<code>print("Hello, world!")</code>
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
