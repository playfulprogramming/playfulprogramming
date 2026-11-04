import { useState, useEffect, useCallback, useRef } from "react";
import { getTodos, updateTodos, type Todo } from "./services";

// Enums to avoid problems outlined by TkDodo here: https://tkdodo.eu/blog/why-you-want-react-query
type GetServerState<T> = {status: "loading"} | {status: "data", payload: T} | {status: "error", error: Error}
type SetServerState = {status: "idle"} | {status: "pending"} | {status: "error", error: Error} | {status: "success"}

function useOnRevisit(fn: () => void) {
	useEffect(() => {
		function onVisibilityChange() {
			if (!document.hidden) {
				// User returned to the tab
				fn();
			}
		}
		document.addEventListener("visibilitychange", onVisibilityChange);
		return () => document.removeEventListener("visibilitychange", onVisibilityChange);
	}, [])
}

export default function App() {
	const [serverState, setServerState] = useState({status: "loading"} as GetServerState<Todo[]>);
	const [todos, setTodos] = useState([] as Todo[]);

	// The most problematic part of this code sample
	useEffect(() => {
		if (serverState.status === "data") {
			setTodos(serverState.payload)
		}
	}, [serverState])

	const fetchServerData = useCallback((signal?: AbortSignal) => {
		setServerState({status: "loading"});
		 getTodos({signal: signal})
		 	.then(data => setServerState({status: "data", payload: data}))
			.catch(err => setServerState({status: "error", error: err}))
	}, []);

	useOnRevisit(() => fetchServerData());

	useEffect(() => {
		const controller = new AbortController();
		fetchServerData(controller.signal);
		return () => controller.abort();
	}, [fetchServerData])

	const [fetchTodoState, setFetchTodoState] = useState({status: 'idle'} as SetServerState)

	const saveTodosController = useRef<AbortController>(undefined)
	function saveTodos(todos: Todo[]) {
		 if (saveTodosController.current) {
			saveTodosController.current.abort();
		 }
		 saveTodosController.current = new AbortController();
		 setFetchTodoState({status: "pending"});
			updateTodos({data: todos, signal: saveTodosController.current.signal})
		 	.then(() => setFetchTodoState({status: "success"}))
			.catch(err => setFetchTodoState({status: "error", error: err}))
	}

    return (
        <div>
            {serverState.status === "loading" && <p>Loading...</p>}
            {serverState.status === "error" && <p>Error loading todos</p>}
            <ul>
                {todos.map(todo => (
                    <li key={todo.id}>
                        {todo.title} {todo.completed ? "(Completed)" : "(Pending)"}
                    </li>
                ))}
            </ul>
            <button onClick={() => setTodos([...todos, { id: Date.now(), title: 'New Todo', completed: false }])}>Add Todo</button>
            <button onClick={() => saveTodos(todos)}>Save Todos</button>
            {fetchTodoState.status === "pending" && <p>Saving...</p>}
            {fetchTodoState.status === "error" && <p>Error saving todos</p>}
            {fetchTodoState.status === "success" && <p>Todos saved successfully</p>}
        </div>
    );
}