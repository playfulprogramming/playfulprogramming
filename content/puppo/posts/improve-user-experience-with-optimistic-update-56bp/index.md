---
{
title: "Improve user experience with optimistic update",
published: "2023-05-11T05:56:50Z",
tags: ["react", "reactquery", "reacthooks"],
description: "Hey Folks,  Sometimes to improve the user experience you can decide to bet on the success of your...",
originalLink: "https://blog.delpuppo.net/improve-user-experience-with-optimistic-update",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "22248",
order: 1
}
---


Hey Folks,

Sometimes to improve the user experience you can decide to bet on the success of your code, so you can assume that the code will go in the right way to make your application faster in the eyes of your users. This approach is called Optimistic Update and can be handled in some lines of code using react query with the `useMutation` hook. Yes, this approach is like a bet with the code but it's also important to keep in mind to handle the errors in case of failure.

To handle the optimistic update you have to handle an `useMutation` hook in your codebase. This hook exposes three events to handle to perform the optimistic update: `onMutate`, `onSuccess` and the `onError`.

The `onMutate` event is called immediately when your code calls the `useMutation` hook. This event is used to create a snapshot of the current state before moving forward and updating the state with the new values. It's important to save the previous state because it permits you in case of failure to restore it in the future if needed.

The `onSuccess` event is called in case of success of the mutation. If your code jumps in this event, you are safe and everything has gone in the right way.

The `onError` event is called in case of failure of the mutation. If your code is inside of this event unfortunately something went wrong. In this case, you must handle the restoration of the state to the previous one and notify the user that something went wrong.

To help you to understand better the case let's see an example

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

const editTodoRequest = async (todo: Todo): Promise<Todo> => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const response = await fetch(`api/tasks/${todo.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todo),
  });
  if (!response.ok) {
    throw new ResponseError(`Failed to edit todo with id ${todo.id}`, response);
  }
  return await response.json();
};

type UseEditTodo = (todo: Todo) => void;

export const useEditTodo = (): UseEditTodo => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const client = useQueryClient();
  const { mutate: editTodo } = useMutation<
    Todo,
    unknown,
    Todo,
    {
      oldTodos?: Todo[];
      oldTodo?: Todo;
      messageKey: string | number;
    }
  >(editTodoRequest, {
    onMutate: (todo) => {
      const messageKey = enqueueSnackbar('Todo edited', {
        variant: 'success',
      });
      const oldTodos = client.getQueryData<Todo[]>([QUERY_KEY.todos]);
      const oldTodo = client.getQueryData<Todo>([QUERY_KEY.todos, todo.id]);
      client.setQueryData([QUERY_KEY.todos, todo.id], todo);
      client.setQueryData<Todo[]>([QUERY_KEY.todos], (oldTodos) =>
        oldTodos?.map((oldTodo) => (oldTodo.id === todo.id ? todo : oldTodo))
      );

      return {
        oldTodos,
        oldTodo,
        messageKey,
      };
    },
    onSuccess: () => {
      client.invalidateQueries([QUERY_KEY.todos]);
    },
    onError: (error, todo, ctx) => {
      if (!ctx) return;
      const { oldTodos, oldTodo, messageKey } = ctx;
      closeSnackbar(messageKey);
      const errorMessage = mapError(error);
      enqueueSnackbar(
        `Ops! There was an error on editing todo: ${errorMessage}`,
        {
          variant: 'error',
        }
      );
      client.setQueryData([QUERY_KEY.todos, todo.id], oldTodo);
      client.setQueryData<Todo[]>([QUERY_KEY.todos], oldTodos);
    },
  });

  return editTodo;
};

```

As you can notice, in the mutate event, the code creates a toast for the user, which indicates that everything has gone in the right way and after that, the code takes the current state, returns it and update the state with the new values. The return is important because it permits getting this data in the `onError` event in case of failure. The `onError` event, as you can notice, handles the restoration of the state, removes the success toast and shows a new one with the error message. This part is crucial if you want to handle an optimistic update because it gives feedback to the user in case of failure.

Last but not least, you can also handle the `onSuccess` event if you want to invalidate a query after the mutation or for some other motivation. The `onSuccess` is not required always but depends on your case.

Ok, I think now you have an idea of how the optimistic update works in react query, but if you want to dive into it check out my youtube video too.

{% embed https://www.youtube.com/watch?v=IwkhNxIyyzA %}

I think thats all from this article; I hope you enjoyed this content!

See you soon folks  
Bye Bye 👋

p.s. you can find the code of the video [**here**](https://github.com/Puppo/learning-react-query/tree/09-optimistic-update)

_Photo by [Rahul Mishra](https://unsplash.com/@rahuulmiishra?utm_source=Devto&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=devto&utm_medium=referral)_

{% embed https://dev.to/puppo %}