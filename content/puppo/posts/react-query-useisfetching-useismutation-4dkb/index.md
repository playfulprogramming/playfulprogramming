---
{
title: "React Query - useIsFetching & useIsMutation",
published: "2023-03-29T05:49:40Z",
tags: ["react", "reactquery", "reacthooks"],
description: "Hey folks,  Today it is time to talk about two hooks exposed by react query: useIsFetching and...",
originalLink: "https://blog.delpuppo.net/react-query-useisfetching-useismutation",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "React Query",
order: 3
}
---

Hey folks,

Today it is time to talk about two hooks exposed by react query: useIsFetching and useIsMutation.

Each of these hooks could be used to understand if there is a fetching request or if there is a mutation request ongoing in the application.

They are useful if we need to create a global loader that appears when there are one or more requests on going.

But how can you use them?

Let's start with the useIsFetching.

```ts
import { useIsFetching } from '@tanstack/react-query';

export default function Loader() {
  const isFetching = useIsFetching();
  if (!isFetching) return null;

  return <>Fetching...</>
}
```

As you can see, the syntax is pretty simple. You can import the hook from the library and you can use the hook in your components. The hook returns only a boolean value that indicates if there are one or more fetching requests in the application. Then with this data, you can decide if you have to show a loader or not. Easy peasy!

Now it's time to move to the useIsMutation hook. This hook is similar to the previous one, the only different concept is that this hook handles the mutation requests. Let's see an example!

```ts
import { useIsMutating } from '@tanstack/react-query';

export default function Loader() {
  const isMutating = useIsMutating();
  if (!isMutating) return null;

  return <>Mutating...</>
}
```

As you can notice, the syntax is the same as the previous one, the only difference stands in the name of the hook and in its concept.

If you want to find more about these two hooks see my Youtube video about them.

{% embed https://youtu.be/dWuUjDNB6Yc %}

Ok, I think you have an idea of how these two hooks work. I hope you enjoyed this content.

See you soon folks

Bye Bye 👋

p.s. you can find the code of the video [here](https://github.com/Puppo/learning-react-query/tree/03-isfetching-and-mutating)

*Photo by [Rahul Mishra](https://unsplash.com/@rahuulmiishra?utm_source=Devto\&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=devto\&utm_medium=referral)*

<!-- ::user id="puppo" -->
