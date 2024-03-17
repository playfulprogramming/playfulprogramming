<script setup>
import DisplaySize from "./DisplaySize.vue";
</script>

<template>
	<table>
		<thead>
			<tr>
				<th>Bytes</th>
				<th>Human Readable</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>
					<p>138 bytes</p>
				</td>
				<td>
					<DisplaySize :bytes="138" />
				</td>
			</tr>
			<tr>
				<td>
					<p>13,876 bytes</p>
				</td>
				<td>
					<DisplaySize :bytes="13876" />
				</td>
			</tr>
			<tr>
				<td>
					<p>13,876,435 bytes</p>
				</td>
				<td>
					<DisplaySize :bytes="13876435" />
				</td>
			</tr>
			<tr>
				<td>
					<p>13,876,435,892 bytes</p>
				</td>
				<td>
					<DisplaySize :bytes="13876435892" />
				</td>
			</tr>
		</tbody>
	</table>
</template>
