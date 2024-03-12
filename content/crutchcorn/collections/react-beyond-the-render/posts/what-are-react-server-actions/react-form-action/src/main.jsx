import { createRoot } from "react-dom/client";
import { useState, useRef } from "react";

function App() {
	const id = useRef(0);
	const [todos, setTodos] = useState([]);

	async function addTodo(formData) {
		const todo = formData.get("todo");
		setTodos([...todos, { value: todo, id: ++id.current }]);
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

createRoot(document.getElementById("root")).render(<App />);
