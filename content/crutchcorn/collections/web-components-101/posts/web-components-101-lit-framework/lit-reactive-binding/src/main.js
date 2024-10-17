import { html, LitElement } from "https://cdn.skypack.dev/lit";
import { css } from "https://cdn.skypack.dev/lit@2.0.0-pre.2";

export class TodoElement extends LitElement {
	static get properties() {
		return {
			todos: { type: String },
		};
	}

	constructor() {
		super();
		this.message = "";
	}

	render() {
		return html` <h1>${this.todos}</h1> `;
	}
}

window.customElements.define("todo-component", TodoElement);

export class FormElement extends LitElement {
	static get properties() {
		return {
			todoList: { type: Array },
			inputVal: { type: String },
		};
	}

	_onSubmit(e) {
		e.preventDefault();
		this.todoList = [...this.todoList, this.inputVal];
		this.inputVal = "";
	}

	_onChange(e) {
		this.inputVal = e.target.value;
	}

	constructor() {
		super();
		this.inputVal = "";
		this.todoList = [];
	}

	render() {
		return html`
			<form @submit="${this._onSubmit}">
				<input
					.value="${this.inputVal}"
					@change="${this._onChange}"
					type="text"
				/>
				<button type="submit">Add</button>
			</form>
			<todo-component todos=${this.todoList}></todo-component>
		`;
	}
}

window.customElements.define("form-component", FormElement);
