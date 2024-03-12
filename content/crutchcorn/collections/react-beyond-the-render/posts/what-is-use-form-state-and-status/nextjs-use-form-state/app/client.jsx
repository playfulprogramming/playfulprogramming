"use client";
import { useFormState } from "react-dom";

export function Todo({ todos, addTodo }) {
	const [state, action] = useFormState(addTodo, "");

	return (
		<>
			<form action={action}>
				{state && <p>{state}</p>}
				<input name="todo" />
				<button type="submit">Add Todo</button>
			</form>
			<ul>
				{todos.map((todo) => {
					return <li key={todo.id}>{todo.value}</li>;
				})}
			</ul>
		</>
	);
}
