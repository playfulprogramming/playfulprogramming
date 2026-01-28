---
{
title: "React Query - Infinite Queries",
published: "2023-06-07T05:30:39Z",
tags: ["react", "reactquery", "reacthooks"],
description: "Hey Folks,  Today it's time to learn how you can build an infinite query with React Query.  To build...",
originalLink: "https://blog.delpuppo.net/react-query-infinite-queries",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "React Query",
order: 12
}
---

Hey Folks,

Today it's time to learn how you can build an infinite query with React Query.

To build an infinite query you have to use the `useInfiniteQuery` hook. This hook is similar to the `useQuery` but with some more properties to handle the infinite loading in the best way.

The key concepts, if you are working with `useInfiniteQuery` are:

- **Key** : in this case, the key is unique for each page, `useInfiniteQuery` handles all the pages inside its state

- **page** : each chunk of your infinite query is represented as a page and the first page returned by the `useInfiniteQuery` is undefined. This helps you to understand if it's the first iteration or not.

- **hasNextPage** : is a variable returned by the hook and its scope is to determine if another chunk exists or not

- **fetchNextPage** : is a function used to fetch the next chunk

- **isLoading** : is a flag that determines if there is a loading ongoing (The query has no data yet)

- **isFetching** : is a flag that determines if there is a fetch request ongoing

- **getNextPageParam** : this function is an option to pass at the hook and it is used to determine if there is another chunk or not after the response

ok, let's see the code to be clearer

```ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';

const fetchTodos = async (
  page: number,
  limit: number,
  signal: AbortSignal | undefined
): Promise<{
  totals: number;
  todos: Todo[];
}> => {
  const response = await fetch(`api/tasks?_page=${page + 1}&_limit=${limit}`, {
    signal,
  });
  if (!response.ok) {
    throw new ResponseError('Failed to fetch todos', response);
  }
  const todos: Todo[] = await response.json();
  const totals = Number.parseInt(
    response.headers.get('x-total-count') || '0',
    10
  );

  return {
    totals,
    todos,
  };
};

interface UseTodos {
  todos: Todo[];
  isLoading: boolean;
  isFetching: boolean;
  error?: string;
  hasNext: boolean;
  next?: () => void;
}

export const useTodos = (): UseTodos => {
  const [limit] = useState<number>(5);

  const { data, hasNextPage, fetchNextPage, isLoading, isFetching, error } =
    useInfiniteQuery(
      [QUERY_KEY.todos],
      ({ signal, pageParam: page = 0 }) => fetchTodos(page, limit, signal),
      {
        refetchOnWindowFocus: false,
        retry: 2,
        getNextPageParam: (lastPage, pages) => {
          if (Math.ceil(lastPage.totals / limit) > pages.length)
            return pages.length;
          return undefined;
        },
      }
    );

  return {
    todos: data?.pages.flatMap(({ todos }) => todos) || [],
    isLoading,
    isFetching,
    error: mapError(error),
    next: fetchNextPage,
    hasNext: hasNextPage || false,
  };
};
```

As you can notice, the flow is very simple, the hook returns the current page or chunk, you have to handle the fetch request and then you can determine the result and if there is another chunk or not.\
Another important thing to keep in mind is that the result of the `useInfiniteQuery` is an array and each element of the array contains the data of each chunk.

Ok, I suppose you have an idea of how Infinite Queries work in React Query, but if you want to deep into it don't miss my youtube about it.

<iframe src="https://www.youtube.com/watch?v=F1KD4GY1iws"></iframe>

I think thats all from this article.

This is the last post of this series, I hope you enjoyed the content and now you are aware of using ReactQuery in your React application.

See you soon folks\
Bye Bye 👋

p.s. you can find the code of the video [**here**](https://github.com/Puppo/learning-react-query/tree/12-infinitive-scroll)

*Photo by [Rahul Mishra](https://unsplash.com/@rahuulmiishra?utm_source=Devto\&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=devto\&utm_medium=referral)*

<!-- ::user id="puppo" -->
