---
{
title: "React Query - Authentication Flow",
published: "2023-04-12T06:00:39Z",
edited: "2023-04-12T07:03:58Z",
tags: ["react", "reactquery", "reacthooks"],
description: "Every application should handle an authentication flow; in this article, you'll learn how to build an...",
originalLink: "https://blog.delpuppo.net/react-query-authentication-flow",
coverImg: "cover-image.png",
socialImg: "social-image.png",
collection: "React Query",
order: 5
}
---

Every application should handle an authentication flow; in this article, you'll learn how to build an authentication flow in your React Application with React Query.

## Sign Up

The first step to build an authentication flow is the sign-up action. As you have already learned in this series, you should build a mutation to do this action. A possible solution could be this

```ts
async function signUp(email: string, password: string): Promise<User> {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  if (!response.ok)
    throw new ResponseError('Failed on sign up request', response);

  return await response.json();
}

type IUseSignUp = UseMutateFunction<User, unknown, {
  email: string;
  password: string;
}, unknown>

export function useSignUp(): IUseSignUp {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: signUpMutation } = useMutation<User, unknown, { email: string, password: string }, unknown>(
    ({
      email,
      password
    }) => signUp(email, password), {
    onSuccess: (data) => {
      // TODO: save the user in the state
      navigate('/');
    },
    onError: (error) => {
      enqueueSnackbar('Ops.. Error on sign up. Try again!', {
        variant: 'error'
      });
    }
  });

  return signUpMutation
}
```

By creating a mutation like that, you build the signUp in a very simple and clear way.\
Now using the `useSignUp` hook, you can get the mutation and call the signUp request to create a new user in your system. As you can notice, the code is pretty simple; the `signUp` method calls the API to post the new user's data and return the user data saved in the database. Then using the `useMutation` hook, you can build the mutation to handle the signUp action. If everything goes ok, the `onSuccess` hook calls the navigation to the home page; otherwise, the `onError` hook shows a toast with an error.\
In the code, there is a TODO that indicates something missing; we'll get back to this line in the future of this post.

## Sign In

The second step to build if you are building an authentication flow is SignIn. In this case, SignIn is pretty similar to SignUp; the only things that change are the endpoint and the scope of the hook.\
So the code can be this

```ts
async function signIn(email: string, password: string): Promise<User> {
  const response = await fetch('/api/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  if (!response.ok)
    throw new ResponseError('Failed on sign in request', response);

  return await response.json();
}

type IUseSignIn = UseMutateFunction<User, unknown, {
  email: string;
  password: string;
}, unknown>

export function useSignIn(): IUseSignIn {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: signInMutation } = useMutation<User, unknown, { email: string, password: string }, unknown>(
    ({
      email,
      password
    }) => signIn(email, password), {
    onSuccess: (data) => {
      // TODO: save the user in the state
      navigate('/');
    },
    onError: (error) => {
      enqueueSnackbar('Ops.. Error on sign in. Try again!', {
        variant: 'error'
      });
    }
  });

  return signInMutation
}
```

I don't want to spend much time describing this hook because it is very similar to the SignUp but only with the references for the SignIn. Also in this case, there is a TODO that we'll remove in the future of the post.

## The user

The core part of an authentication flow is where you save the user in the state. To do that, in this case, the best way is to create a new hook called `useUser` which is the owner of the user data.\
The `useUser` hook must have the user's data, and it has to save the user's data in the local storage and retrieve them when the user refreshes the page or gets back in the future.\
Let's start with the code that handles the local storage. Typically, this code is created with small functions with a specific goal like the next.

```ts
import { User } from './useUser';

const USER_LOCAL_STORAGE_KEY = 'TODO_LIST-USER';

export function saveUser(user: User): void {
  localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(user));
}

export function getUser(): User | undefined {
  const user = localStorage.getItem(USER_LOCAL_STORAGE_KEY);
  return user ? JSON.parse(user) : undefined;
}

export function removeUser(): void {
  localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
}
```

In this way, you can create a small module that handles all the local storage functions for the user.

Now it's time to see how you can build the `useUser` hook.\
Let's start with the code

```ts
async function getUser(user: User | null | undefined): Promise<User | null> {
  if (!user) return null;
  const response = await fetch(`/api/users/${user.user.id}`, {
    headers: {
      Authorization: `Bearer ${user.accessToken}`
    }
  })
  if (!response.ok)
    throw new ResponseError('Failed on get user request', response);

  return await response.json();
}

export interface User {
  accessToken: string;
  user: {
    email: string;
    id: number;
  }
}

interface IUseUser {
  user: User | null;
}

export function useUser(): IUseUser {
  const { data: user } = useQuery<User | null>(
    [QUERY_KEY.user],
    async (): Promise<User | null> => getUser(user),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      initialData: userLocalStorage.getUser,
      onError: () => {
        userLocalStorage.removeUser();
      }
    });

  useEffect(() => {
    if (!user) userLocalStorage.removeUser();
    else userLocalStorage.saveUser(user);
  }, [user]);

  return {
    user: user ?? null,
  }
}
```

The `getUser` function is simple; it provides the HTTP request to get the user info; if the user is null, return null otherwise, it calls the HTTP endpoint.

The `useQuery` hook is similar to the others seen before, but there are two new configurations to understand.

- **refetchOnMount** : this option is important to prevent the hook reloads the data each time it is used

- **initialData** : this option is used to load the data from the local storage; the initialData accepts a function that returns the initial value; if the initial value is defined, react query uses this value to refresh the data.

Now you have all the blocks of the authentication flow, but it's time to link `useSignUp` and `useSignIn` with the `useUser` hook.\
Using the [QueryClient](https://tanstack.com/query/v4/docs/react/reference/QueryClient) you can set the data of a specific query by the [setQueryData](https://tanstack.com/query/v4/docs/react/reference/QueryClient#queryclientsetquerydata) function.\
So the previous TODOs comments change in this way

```ts
export function useSignUp(): IUseSignUp {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: signUpMutation } = useMutation<User, unknown, { email: string, password: string }, unknown>(
    ({
      email,
      password
    }) => signUp(email, password), {
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY.user], data);
      navigate('/');
    },
    onError: (error) => {
      enqueueSnackbar('Ops.. Error on sign up. Try again!', {
        variant: 'error'
      });
    }
  });

  return signUpMutation
}


export function useSignIn(): IUseSignIn {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: signInMutation } = useMutation<User, unknown, { email: string, password: string }, unknown>(
    ({
      email,
      password
    }) => signIn(email, password), {
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY.user], data);
      navigate('/');
    },
    onError: (error) => {
      enqueueSnackbar('Ops.. Error on sign in. Try again!', {
        variant: 'error'
      });
    }
  });

  return signInMutation
}
```

With two simple lines of code, you can set the user in the `useUser` state because the key used to set the query data is the same as the `useUser`.\
Then, with an `useEffect` in the `useUser` hook, you can remove or set the user data in the local storage when the user changes

```ts
export function useUser(): IUseUser {
  const { data: user } = useQuery<User | null>(
    [QUERY_KEY.user],
    async (): Promise<User | null> => getUser(user),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      initialData: userLocalStorage.getUser,
      onError: () => {
        userLocalStorage.removeUser();
      }
    });

  useEffect(() => {
    if (!user) userLocalStorage.removeUser();
    else userLocalStorage.saveUser(user);
  }, [user]);

  return {
    user: user ?? null,
  }
}
```

To complete the authentication flow, the only missing thing is the logout.\
You can build it with a custom hook called `useSignOut`; its implementation is straightforward and could be done in this way

```ts
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { QUERY_KEY } from '../constants/queryKeys';

type IUseSignOut = () => void

export function useSignOut(): IUseSignOut {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const onSignOut = useCallback(() => {
    queryClient.setQueryData([QUERY_KEY.user], null);
    navigate('/auth/sign-in');
  }, [navigate, queryClient])

  return onSignOut
}
```

As you can notice, the hook returns a simple function that clears the value in the user state and navigates to the `sign-in` page.

Ok, perfect. Now you have all the notions of building an authentication flow with React Query, but If you want to find out more, watch my youtube video about authentication with React Query

<iframe src="https://www.youtube.com/watch?v=JNoiAumC94g"></iframe>

Ok, that's all from authentication.

I hope you enjoyed this content!

See you soon folks

Bye Bye 👋

p.s. you can find the code of the video [**here**](https://github.com/Puppo/learning-react-query/tree/05-auth)

*Photo by [Rahul Mishra](https://unsplash.com/@rahuulmiishra?utm_source=Devto\&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=devto\&utm_medium=referral)*

<!-- ::user id="puppo" -->
