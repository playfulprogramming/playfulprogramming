import { addTodoToDatabase, getTodos } from "./todos";
import { redirect } from "next/navigation";

export default async function Todo() {
	const todos = await getTodos();
	async function addTodo(formData) {
		"use server";
		const todo = formData.get("todo");
		await addTodoToDatabase(todo);
		// Refresh the page to see the new todo
		redirect("/");
	}
	return (
		<>
			<ul>
				{todos.map((todo) => {
					return <li key={todo.id}>{todo.value}</li>;
				})}
			</ul>
			<form action={addTodo}>
				<input name="todo" />
				<button type="submit">Add Todo</button>
			</form>
		</>
	);
}
