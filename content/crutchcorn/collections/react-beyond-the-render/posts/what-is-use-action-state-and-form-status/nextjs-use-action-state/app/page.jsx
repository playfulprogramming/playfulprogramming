import { Todo } from "./client";
import { addTodoToDatabase, getTodos } from "./todos";
import { redirect } from "next/navigation";

export default async function Home() {
	const todos = await getTodos();

	async function addTodo(previousState, formData) {
		"use server";
		const todo = formData.get("todo");
		if (!todo) return "Please enter a todo";
		await addTodoToDatabase(todo);
		redirect("/");
	}

	return <Todo todos={todos} addTodo={addTodo} />;
}
