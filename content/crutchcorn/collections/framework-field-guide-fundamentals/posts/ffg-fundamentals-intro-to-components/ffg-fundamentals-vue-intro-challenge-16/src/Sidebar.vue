<!-- Sidebar.vue -->
<script setup>
import { ref } from "vue";
import ExpandableDropdown from "./ExpandableDropdown.vue";

// Just to show that the value is displaying properly
const moviesExpanded = ref(true);
const picturesExpanded = ref(false);
const conceptsExpanded = ref(false);
const articlesExpanded = ref(false);
const redesignExpanded = ref(false);
const invoicesExpanded = ref(false);
</script>

<template>
	<div>
		<h1>My Files</h1>
		<ExpandableDropdown
			name="Movies"
			:expanded="moviesExpanded"
			@toggle="moviesExpanded = !moviesExpanded"
		/>
		<ExpandableDropdown
			name="Pictures"
			:expanded="picturesExpanded"
			@toggle="picturesExpanded = !picturesExpanded"
		/>
		<ExpandableDropdown
			name="Concepts"
			:expanded="conceptsExpanded"
			@toggle="conceptsExpanded = !conceptsExpanded"
		/>
		<ExpandableDropdown
			name="Articles I'll Never Finish"
			:expanded="articlesExpanded"
			@toggle="articlesExpanded = !articlesExpanded"
		/>
		<ExpandableDropdown
			name="Website Redesigns v5"
			:expanded="redesignExpanded"
			@toggle="redesignExpanded = !redesignExpanded"
		/>
		<ExpandableDropdown
			name="Invoices"
			:expanded="invoicesExpanded"
			@toggle="invoicesExpanded = !invoicesExpanded"
		/>
	</div>
</template>
