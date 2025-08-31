<script setup>
import { ref } from 'vue';

const agreeCheckbox = ref(null);

	const onAgreeChange = () => {
		agreeCheckbox.value?.setCustomValidity("");
	}

	const submit = (event) => {
		event.preventDefault();
		const checkbox = agreeCheckbox.value;
		if (!checkbox) return;
		if (!checkbox.checked) {
			checkbox.setCustomValidity("You must agree to the terms.");
			checkbox.reportValidity();
		} else {
			checkbox.setCustomValidity("");
			alert("You have successfully signed up for our service, whatever that is");
		}
	}
</script>

<template>
		<form @submit="submit($event)">
			<p>Pretend that there is some legalese here.</p>
			<label>
				<span>Agree to the terms?</span>
				<input ref="agreeCheckbox" @input="onAgreeChange()" type="checkbox" />
			</label>
			<div style="margin-top: 1em;">
				<button type="submit">Submit</button>
			</div>
		</form>
</template>