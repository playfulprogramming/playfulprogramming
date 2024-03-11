<!-- Layout.vue -->
<script setup></script>

<template>
	<div style="display: flex; flex-wrap: nowrap; min-height: 100vh">
		<div
			style="
				width: 150px;
				background-color: lightgray;
				border-right: 1px solid gray;
			"
		>
			<slot name="sidebar" />
		</div>
		<div style="width: 1px; flex-grow: 1">
			<slot />
		</div>
	</div>
</template>
