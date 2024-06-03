"use client";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";

function TodoFormInner() {
	const status = useFormStatus();
	return (
		<>
			{status.pending && <p>Adding todo...</p>}
			<input disabled={status.pending} name="todo" />
			<button disabled={status.pending} type="submit">
				Add Todo
			</button>
		</>
	);
}

export function Todo({ todos, addTodo }) {
	const [state, action] = useActionState(addTodo, "");

	return (
		<>
			<form action={action}>
				{state && <p>{state}</p>}
				<TodoFormInner />
			</form>
			<ul>
				{todos.map((todo) => {
					return <li key={todo.id}>{todo.value}</li>;
				})}
			</ul>
		</>
	);
}
