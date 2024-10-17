import { html, LitElement } from "https://cdn.skypack.dev/lit";

export class HelloElement extends LitElement {
	static get properties() {
		return {
			val: { type: Number },
		};
	}

	render() {
		return html` <h1>${this.val} is typeof ${typeof this.val}</h1> `;
	}
}

window.customElements.define("hello-component", HelloElement);
