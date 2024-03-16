<!-- Layout.vue -->
<script setup>
const props = defineProps(["sidebarWidth"]);
</script>

<template>
	<div style="display: flex; flex-wrap: nowrap; min-height: 100vh">
		<div
			:style="`
          width: ${props.sidebarWidth}px;
          height: 100vh;
          overflow-y: scroll;
          border-right: 2px solid #bfbfbf;
        `"
		>
			<slot name="sidebar" />
		</div>
		<div style="width: 1px; flex-grow: 1">
			<slot />
		</div>
	</div>
</template>
