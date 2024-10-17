import { html, LitElement } from "https://cdn.skypack.dev/lit";
import { css } from "https://cdn.skypack.dev/lit@2.0.0-pre.2";

export class HelloElement extends LitElement {
	static get properties() {
		return {
			message: { type: String },
		};
	}

	constructor() {
		super();
		this.message = "Hello world";
	}

	render() {
		return html` <h1>${this.message}</h1> `;
	}
}

window.customElements.define("hello-component", HelloElement);

const msgs = [
	"🌵🌵🌵🌵🌵 Too many cactus 🌵🌵🌵🌵",
	"📜 Not enough scrolls",
	"💪 We're all in this togther",
	"😝 Use moar emoji",
];

export class ChangeMessageElement extends LitElement {
	static get properties() {
		return {
			message: { type: String },
		};
	}

	changeSelectedMsg() {
		const newMsg = msgs[Math.floor(Math.random() * msgs.length)];
		this.message = newMsg;
	}

	constructor() {
		super();
		this.message = "Hello world";
	}

	render() {
		return html`
			<button @click="${this.changeSelectedMsg}">Toggle</button>
			<hello-component message=${this.message}></hello-component>
		`;
	}
}

window.customElements.define("change-message-component", ChangeMessageElement);
