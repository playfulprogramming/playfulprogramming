---
{
title: "React Query - Abort Request",
published: "2023-05-17T05:29:28Z",
edited: "2023-05-17T06:52:24Z",
tags: ["react", "reactquery", "reacthooks"],
description: "Hey Folks,  Today it's time to learn how you can abort an ongoing request with ReactQuery.  Before...",
originalLink: "https://blog.delpuppo.net/react-query-abort-request",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "22248",
order: 1
}
---


Hey Folks,

Today it's time to learn how you can abort an ongoing request with ReactQuery.

Before moving to the example, I want to introduce the [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal).

AbortSignal is a javascript interface used to abort ongoing methods. Typically, you can create an AbortSignal by an [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController), which simplifies the creation and execution of the AbortSignal. When you create an AbortController (`controller = new AbortController()`) you get an instance of it that has two core concepts: the signal (`controller.signal`) and the abort method (`controller.abort()`).

The first one is important because it contains the signal with its status, and the second one is important because it allows you to change the status of the abort from `false` to `true`.

Using these two interfaces, in javascript, you can handle out-of-the-box the abort of an HTTP request created with the [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) but also with [axios](https://axios-http.com) if you want. When you create a request, both accept a signal and if you abort that signal you can abort the request.

AbortSignal has also a static method called `timeout` that accepts a number that describes the timeout time in milliseconds. Using this method you can create easily a signal that changes its status after some time. Very common if you want to handle a timeout of your request.

Just a quick example to make you understand the power of these interfaces.

```ts
try {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  const res = await fetch(url, { signal: controller.signal });
  const body = await res.json();
} catch (e) {
  if (e.name === "AbortError") {
    // Notify the user of abort.
    // Note this will never be a timeout error!
  } else {
    // A network error, or some other problem.
    console.log(`Type: ${e.name}, Message: ${e.message}`);
  }
} finally {
  clearTimeout(timeoutId);
}
```

In this example, you can see an abort request created with an AbortController. This example uses a setTimeout method to handle the timeout and as you can notice, when the code creates the fetch API passes the signal status to the fetch. In this way, the fetch request and the signal are linked together. This example could be simplified in this way using the AbortSignal timeout method.

```ts
try {
  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
  const body = await res.json();
} catch (e) {
  if (e.name === "AbortError") {
    // Notify the user of abort.
    // Note this will never be a timeout error!
  } else {
    // A network error, or some other problem.
    console.log(`Type: ${e.name}, Message: ${e.message}`);
  }
}
```

Ok, now you have an idea of how AbortSignal and AbortController work, so we can move on to the next step; how can you abort a request with ReactQuer?

Good news for you, ReactQuery out-of-the-box handles a signal for you for every query and mutation, and your business it's only decided if you want to use it or not.

Let's start with an example

```ts
const fetchTodos = async (signal: AbortSignal | undefined): Promise<Todo[]> => {
  const response = await fetch('api/tasks', {
    signal,
  });
  if (!response.ok) {
    throw new ResponseError('Failed to fetch todos', response);
  }
  return await response.json();
};

interface UseTodos {
  todos: Todo[];
  isLoading: boolean;
  isFetching: boolean;
  error?: string;
  setUserFilter: Dispatch<SetStateAction<number | null>>;
}

export const useTodos = (): UseTodos => {
  const client = useQueryClient();

  const {
    data: todos = [],
    isLoading,
    isFetching,
    error,
  } = useQuery([QUERY_KEY.todos], ({ signal }) => fetchTodos(signal), {
    refetchOnWindowFocus: false,
    retry: 2
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

As you can notice, `useQuery` has a second parameter that contains different options, one of them is the signal. This signal is an AbortSignal that you can use to abort your request if you want. In the example, for instance, the signal is passed to the `fetchTodos` method and then passed to fetch request.

As you can understand, aborting a request is a piece of cake 🍰

Ok, I think now you have all the notions to abort an HTTP request in javascript and in ReactQuery too.

If you want to go dive into the Abort Request with React query don't miss my Youtube channel 🚀

{% embed https://www.youtube.com/watch?v=BL_E7SrymWI %}

I think thats all from this article; I hope you enjoyed this content!

See you soon folks  
Bye Bye 👋

p.s. you can find the code of the video [**here**](https://github.com/Puppo/learning-react-query/tree/10-abort-request)

_Photo by [Rahul Mishra](https://unsplash.com/@rahuulmiishra?utm_source=Devto&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=devto&utm_medium=referral)_

{% embed https://dev.to/puppo %}