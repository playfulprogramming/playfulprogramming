import { Todo } from "./client";
import { addTodoToDatabase, getTodos } from "./todos";

export default async function Home() {
	const todos = await getTodos();

	async function addTodo(formData) {
		"use server";
		const todo = formData.get("todo");
		await addTodoToDatabase(todo);
	}

	return <Todo todos={todos} addTodo={addTodo} />;
}
