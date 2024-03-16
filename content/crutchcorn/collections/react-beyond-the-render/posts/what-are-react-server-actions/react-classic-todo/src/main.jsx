import { createRoot } from "react-dom/client";
import { useState, useRef } from "react";

function App() {
	const id = useRef(0);
	const [todos, setTodos] = useState([]);
	const [todoInput, setTodoInput] = useState("");

	function addTodo(e) {
		e.preventDefault();
		setTodos([...todos, { value: todoInput, id: ++id.current }]);
	}

	return (
		<>
			<ul>
				{todos.map((todo) => {
					return <li key={todo.id}>{todo.value}</li>;
				})}
			</ul>
			<form onSubmit={addTodo}>
				<input
					name="todo"
					value={todoInput}
					onChange={(e) => setTodoInput(e.target.value)}
				/>
				<button type="submit">Add Todo</button>
			</form>
		</>
	);
}

createRoot(document.getElementById("root")).render(<App />);
