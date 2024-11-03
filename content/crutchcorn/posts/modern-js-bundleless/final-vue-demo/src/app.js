import { ref } from "vue";

const OtherComponent = {
	template: `<div>{{ message }}</div>`,
	setup() {
		const message = ref("Hello vue!");
		return {
			message,
		};
	},
};

export default {
	components: {
		OtherComponent,
	},
	template: `
		<div>
			<OtherComponent />
		</div>
	`,
};
