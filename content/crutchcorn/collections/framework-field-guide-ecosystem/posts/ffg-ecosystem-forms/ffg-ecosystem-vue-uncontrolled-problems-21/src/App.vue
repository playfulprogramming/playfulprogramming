<script setup>
import { ref } from "vue";

const agreeCheckbox = ref(null);

const checked = ref(false);
const showError = ref(false);

const onAgreeChange = (e) => {
	checked.value = e.target.checked;
	showError.value = false;
};

const submit = (event) => {
	event.preventDefault();
	if (!checked.value) {
		showError.value = true;
	} else {
		showError.value = false;
		alert("You have successfully signed up for our service, whatever that is");
	}
};

const onAgreeClick = () => {
	const el = agreeCheckbox.value;
	if (!el) return;
	el.checked = true;
	const event = new Event("input");
	el.dispatchEvent(event);
};
</script>

<template>
	<form @submit="submit($event)">
		<p>Pretend that there is some legalese here.</p>
		<label>
			<span>Agree to the terms?</span>
			<input
				ref="agreeCheckbox"
				@input="onAgreeChange($event)"
				type="checkbox"
			/>
		</label>
		<div v-if="showError">
			<p style="color: red">You must agree to the terms.</p>
			<button type="button" @click="onAgreeClick()">Agree</button>
		</div>
		<div style="margin-top: 1em">
			<button type="submit">Submit</button>
		</div>
	</form>
</template>
