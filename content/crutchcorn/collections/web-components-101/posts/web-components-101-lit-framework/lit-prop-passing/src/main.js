import { html, LitElement } from "https://cdn.skypack.dev/lit";

class MyElement extends LitElement {
	static get properties() {
		return {
			property: { type: Array },
		};
	}

	render() {
		return html` <h1>${this.property.length}</h1> `;
	}
}

window.customElements.define("my-component", MyElement);

class ChangeMessageElement extends LitElement {
	static get properties() {
		return {
			array: { type: Array },
		};
	}

	constructor() {
		super();
		this.array = [];
	}

	changeElement() {
		this.array = ["Testing", "Second", "Another"];
	}

	render() {
		return html`
			<!-- If "property" didn't have a period, it would pass as attribute -->
			<my-component .property=${this.array}></my-component>
			<button @click=${this.changeElement}>Change to 3</button>
		`;
	}
}

window.customElements.define("change-message-component", ChangeMessageElement);
