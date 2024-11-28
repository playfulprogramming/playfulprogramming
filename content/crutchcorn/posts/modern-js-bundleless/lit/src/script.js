import { html, css, LitElement } from "lit";

export class SimpleGreeting extends LitElement {
	static get styles() {
		return css`
			p {
				color: blue;
			}
		`;
	}

	static get properties() {
		return {
			name: { type: String },
		};
	}

	constructor() {
		super();
		this.name = "Somebody";
	}

	render() {
		return html`<p>Hello, ${this.name}!</p>`;
	}
}

customElements.define("simple-greeting", SimpleGreeting);
