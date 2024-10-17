import { html, LitElement } from "https://cdn.skypack.dev/lit";
import { repeat } from "https://cdn.skypack.dev/lit/directives/repeat.js";

import { css } from "https://cdn.skypack.dev/lit@2.0.0-pre.2";

export class TodoElement extends LitElement {
	static get properties() {
		return {
			todos: { type: Array },
		};
	}

	constructor() {
		super();
		this.todos = [];
	}

	render() {
		const headerText = this.todos.filter((todo) => todo.completed).length;

		return html`
			<h1>${headerText}</h1>
			<ul>
				${repeat(
					this.todos,
					(todo) => html`
						<li>
							<input
								type="checkbox"
								@change=${todo.onChange}
								.checked=${todo.completed}
							/>
							${todo.name}
						</li>
					`,
				)}
			</ul>
		`;
	}
}

window.customElements.define("todo-component", TodoElement);

export class FormElement extends LitElement {
	static get properties() {
		return {
			todoList: { type: Array },
			inputVal: { type: String },
			currTodoId: { type: Number },
		};
	}

	_onSubmit(e) {
		e.preventDefault();
		const todoId = this.currTodoId++;
		this.todoList = [
			...this.todoList,
			{
				name: this.inputVal,
				completed: false,
				id: todoId,
				onChange: () => {
					this.toggleTodoItem(todoId);
				},
			},
		];
		this.inputVal = "";
	}

	_onChange(e) {
		this.inputVal = e.target.value;
	}

	toggleTodoItem(todoId) {
		this.todoList = this.todoList.map((todo) => {
			if (todo.id !== todoId) return todo;
			return {
				...todo,
				completed: !todo.completed,
			};
		});
	}

	toggleAll() {
		this.todoList = this.todoList.map((todo) => ({
			...todo,
			completed: !todo.completed,
		}));
	}

	constructor() {
		super();
		this.inputVal = "";
		this.todoList = [];
		this.currTodoId = 0;
	}

	render() {
		return html`
			<button @click=${this.toggleAll}>Toggle all</button>
			<form @submit=${this._onSubmit}>
				<input .value=${this.inputVal} @change=${this._onChange} type="text" />

				<button type="submit">Add</button>
			</form>
			<!-- Notice the period in ".todos" -->
			<todo-component .todos=${this.todoList}></todo-component>
		`;
	}
}

window.customElements.define("form-component", FormElement);
