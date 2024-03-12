"use client";
import { useCallback } from "react";
import { useFormStatus } from "react-dom";

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
	const addTodoAndRefresh = useCallback(async (formData) => {
		await addTodo(formData);
		window.location.reload();
	}, []);

	return (
		<>
			<form action={addTodoAndRefresh}>
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
