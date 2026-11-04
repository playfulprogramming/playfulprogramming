export interface Todo {
	id: number;
	title: string;
	completed: boolean;
}

export async function getTodos({}: {signal?: AbortSignal}): Promise<Todo[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
        { id: 1, title: "Todo 1", completed: false },
        { id: 2, title: "Todo 2", completed: true }
    ];
}

export async function updateTodos({}: {data: Todo[], signal?: AbortSignal}): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
}