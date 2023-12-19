import { Todo } from "./client";
import { getTodos } from "./todos";

export default async function Home() {
	const todos = await getTodos();
	return <Todo todos={todos} />;
}
