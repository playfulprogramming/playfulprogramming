"use client";
import { useCallback, useState } from "react";

export function Todo({ todos, addTodo }) {
	const [isLoading, setIsLoading] = useState(false);

	const addTodoAndRefresh = useCallback(async (formData) => {
		await addTodo(formData);
		window.location.reload();
	}, []);

	return (
		<>
			{isLoading && <p>Adding todo...</p>}
			<ul>
				{todos.map((todo) => {
					return <li key={todo.id}>{todo.value}</li>;
				})}
			</ul>
			<form
				action={addTodoAndRefresh}
				onSubmit={() => {
					// We're using onSubmit so that we don't have to wait for the server
					// to get the request before we set isLoading to true
					setIsLoading(true);
				}}
			>
				<input disabled={isLoading} name="todo" />
				<button disabled={isLoading} type="submit">
					Add Todo
				</button>
			</form>
		</>
	);
}
