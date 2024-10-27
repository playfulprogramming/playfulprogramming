<script setup lang="ts">
const RoughlyPi: number = 3.14;
function areaOfCircle(radius: number) {
	return RoughlyPi * radius * radius;
}
const Radius: number = 5;
</script>

<template>
	<p>Area of circle with radius {{ Radius }} is {{ areaOfCircle(Radius) }}</p>
</template>
