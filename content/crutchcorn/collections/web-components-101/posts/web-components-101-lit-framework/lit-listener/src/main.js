import { html, LitElement } from "https://cdn.skypack.dev/lit";

export class HelloElement extends LitElement {
	render() {
		return html` <p>Hello!</p> `;
	}
}

window.customElements.define("hello-component", HelloElement);
