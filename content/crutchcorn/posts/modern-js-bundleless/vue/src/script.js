import { createApp, ref } from "vue";

const OtherComponent = {
	template: `<div>{{ message }}</div>`,
	setup() {
		const message = ref("Hello vue!");
		return {
			message,
		};
	},
};

const App = {
	components: {
		OtherComponent,
	},
	template: `
		<div>
			<OtherComponent />
		</div>
	`,
};

createApp(App).mount("#app");
