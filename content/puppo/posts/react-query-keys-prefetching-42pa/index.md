---
{
title: "React Query - Keys & Prefetching",
published: "2023-05-03T05:30:39Z",
tags: ["react", "reactquery", "reacthooks"],
description: "Hey Folks, Today I want to share two important things if you are using ReactQuery. The first is how...",
originalLink: "https://blog.delpuppo.net/react-query-keys-prefetching",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "22248",
order: 1
}
---

Hey Folks, Today I want to share two important things if you are using ReactQuery. The first is how the keys are composed, and the second is how to prefetch data to reduce the user's wasted time. So let's start 🚀

## Keys

As you have already learned in this series, React query uses the keys to save the data of a specific API. And these keys must be unique for each specific API. When you create a `useQuery` hook, the first parameter is the query's key, which is an array. This array is used to compose the key, and it is in charge of you creating the key in the right way for your case. As said before, the key is an array, and in this way, you can create a key composed of different data.\
So, for instance, you can have a key for the list of the todos and a key for the detail of a specific todo (`["todos"]` and `["todo", 2]`.)\
As you can notice, you can put in the key whatever you want, string number or boolean; it is completely on your side; the important thing you must remember every time is that each key must be unique. This concept, and the key you choose, are also important if you want to prefetch the data because you must use the same key to save the data prefetched in the react query state.

## Prefetching

In some scenarios, loading the data before the user asks for it could be interesting. This improves the user experience and reduces the waste time for them. But how can you do that with react query?\
First, you need to use the `QueryClient` object that exposes the `prefetchQuery` method.\
This method accepts two parameters: the query's key and the fetch request.\
In this way, you can handle a simple but powerful prefetching flow with few lines of code. Let's take a look at this example

```ts
export const useTodos = (): UseTodos => {
  const client = useQueryClient();

  const [userFilter, setUserFilter] = useState<number | null>(null);

  const filterTodoByAssignee = useCallback(
    (todos: Todo[]) => {
      if (!userFilter) return todos;
      return todos.filter((todo) => todo.assigneeId === userFilter);
    },
    [userFilter]
  );

  const {
    data: todos = [],
    isLoading,
    isFetching,
    error,
  } = useQuery([QUERY_KEY.todos], fetchTodos, {
    refetchOnWindowFocus: false,
    retry: 2,
    select: filterTodoByAssignee,
    onSuccess: (data) => {
      data.forEach((todo) => {
        client.prefetchQuery([QUERY_KEY.todos, id], () => fetchTodo(id));
      });
    },
  });

  return {
    todos,
    isLoading,
    isFetching,
    error: mapError(error),
    setUserFilter,
  };
};
```

As you can notice, in this example in the `onSuccess` hook, the prefetch feature starts to load the data of every todo in the result of the list. That allows React Query to save the data in the storage and reuse them in the future when the application asks for that data. For instance, in a todo detail hook like this

```ts
const fetchTodo = async (id: Todo['id']): Promise<Todo> => {
  const response = await fetch(`api/tasks/${id}`);
  if (!response.ok) {
    throw new ResponseError(`Failed to fetch todo with id ${id}`, response);
  }
  return await response.json();
};

export const useGetTodoById = (id: Todo['id']): UseTodo => {
  const {
    data: todo = null,
    isLoading,
    error,
  } = useQuery([QUERY_KEY.todos, id], () => fetchTodo(id), {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  return {
    todo,
    isLoading,
    error: mapError(error),
  };
};
```

As you can see, the key of this `useQuery` is the same as the key in the prefetch example, and in this way, ReactQuery is able to understand if the data are already loaded or not.\
As you can imagine, with this simple feature, you can improve the quality of your application and maybe prefetch some data that could take too long to load.

Ok, I think you have a great idea of how key and prefetching work in React Query.\
To learn more about them, check out also my Youtube video available here 👇

{% embed https://www.youtube.com/watch?v=svvx-pl\_hTE %}

I think thats all from this article; I hope you enjoyed this content!

See you soon folks\
Bye Bye 👋

p.s. you can find the code of the video [**here**](https://github.com/Puppo/learning-react-query/tree/08-query-key-and-prefetch-data)

*Photo by [Rahul Mishra](https://unsplash.com/@rahuulmiishra?utm_source=Devto\&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=devto\&utm_medium=referral)*

{% embed https://dev.to/puppo %}
