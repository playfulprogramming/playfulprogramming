<!-- FileTableContainer -->
<template>
	<table
		style="
			color: #3366ff;
			border: 2px solid #3366ff;
			border-spacing: 0;
			padding: 0.5rem;
		"
	>
		<thead>
			<slot name="header"></slot>
		</thead>
		<slot></slot>
	</table>
</template>
