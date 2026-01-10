---
{
title: "TanStack Router: Go to Previous page after Sign In",
published: "2025-09-16T14:36:21Z",
tags: ["react", "webdev", "tutorial", "javascript"],
description: "Welcome back to the TanStack Router series, today going double digits with chapter 10!  Let's fix a...",
originalLink: "https://leonardomontini.dev/tanstack-router-login-redirect/",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "26578",
order: 1
}
---

Welcome back to the TanStack Router series, today going double digits with [chapter 10](https://www.youtube.com/playlist?list=PLOQjd5dsGSxJilh0lBofeY8Qib98kzmF5)!

Let's fix a very common UX issue when implementing authentication flows. You navigate to a page then you're forced to sign in, but then you get redirected to the homepage. Maybe you set some filters or data, now everything is gone.

In this article I will show two approaches to redirect users back to the page they were on right before signing in, keeping any query parameters intact. First the classic explicit redirect, then an alternative that can capture the previous location automatically.

Video version here: https://youtu.be/MXffKeNfOvQ

## The problem in one sentence

You sign in and get redirected to the homepage, losing the page and search parameters you had before.

## Approach 1: explicit redirect via search param

This is the straightforward and reliable solution. We explicitly pass a `redirectTo` param everywhere the user can navigate to the sign in page and we use it to go back after signing in.

Our Sign In form component will look like this, it defaults to the homepage or redirects to the provided URL after a successful sign in.

```tsx
export const SignInForm = ({ redirectTo = '/' }: { redirectTo?: string }) => {
  const navigate = useNavigate();

  const signIn = () => {
    // Your sign in logic here

    navigate({ to: redirectTo });
  };

  return (
    <form onSubmit={signIn}>
      {/* form fields */}
      <Button type="submit">Sign In</Button>
    </form>
  );
};
```

But where does `redirectTo` come from? Let's add it as a search parameter to the sign in route.

```tsx
import { createFileRoute } from '@tanstack/react-router';
import { SignInForm } from 'src/components/auth/sign-in-form';
import { Layout } from 'src/components/layout';
import { z } from 'zod';

export const Route = createFileRoute('/sign-in')({
  component: RouteComponent,
  validateSearch: z.object({
    redirectTo: z.string().optional().catch('/'),
  }),
  // ...
});

function RouteComponent() {
  const { redirectTo } = Route.useSearch();

  return (
    <Layout>
      {/* ... */}
      <SignInForm redirectTo={redirectTo} />
      {/* ... */}
    </Layout>
  );
}
```

What is that `validateSearch` doing? It uses Zod to parse the search parameters and extract `redirectTo`, defaulting it to `/` if not provided. Then in the component we read it with `Route.useSearch()` and pass it down to the `SignInForm`.

> If you want to learn more about handling search parameters with TanStack Router, check out my previous article: [Handling Query Parameters](https://leonardomontini.dev/tanstack-router-query-params/).

The next steps is to ensure that every link to the sign in page includes the `redirectTo` parameter. Here's an example in the `Header` component:

```tsx
import { useRouter } from '@tanstack/react-router';
import { ButtonLink } from '../button-link';

export const Header = () => {
  const router = useRouter();

  return (
    <header>
      {/* ... */}

      <ButtonLink to="/sign-in" search={{ redirectTo: router.state.location.href }}>
        Sign In
      </ButtonLink>
      {/* ... */}
    </header>
  );
};
```

> What is `ButtonLink`? It is just a styled wrapper around the `Link` component from TanStack Router. You can use `Link` directly if you prefer or learn how to create your own custom link component in a video I made about it: https://youtu.be/-kmf3ZYlduU

With this, after a successful sign in you will land back on the original page including all the search parameters.

## Tradeoff of the explicit approach

You must remember to add the `redirectTo` param in every link to the sign in page. Not a big issue though, and you can wrap it in a helper or custom hook like a "go to sign in" utility, but it is still one more thing to do.

## Approach 2: capture previous location automatically

I also experimented with a small hook that tracks the previous location without passing any search parameters to the sign in page. I'm not entirely sure how stable and reliable this is, but it worked well in my tests so I thought it was worth sharing:

```ts
function usePreviousLocation() {
  const router = useRouter();
  const [previousLocation, setPreviousLocation] = useState<string>('/');
  useEffect(() => {
    return router.subscribe('onResolved', ({ fromLocation }) => {
      setPreviousLocation(fromLocation?.href ?? '/');
    });
  }, []);
  return previousLocation;
}
```

This hook subscribes to the router's navigation events and captures the "from" location after each navigation. It stores it in state so it can be used later.

With this alone you can forget about everything we already said, you'll no longer need to pass `redirectTo` in each navigation or handle search params. Just use the hook in your sign in form:

```tsx
export const SignInForm = () => {
  const navigate = useNavigate();
  const previousLocation = usePreviousLocation();

  const signIn = () => {
    // Your sign in logic here

    navigate({ to: previousLocation });
  };

  return (
    <form onSubmit={signIn}>
      {/* form fields */}
      <Button type="submit">Sign In</Button>
    </form>
  );
};
```

## Combine both for a robust UX

The two approaches might also work well together. You can prefer the explicit `redirectTo` when provided, and fall back to the previously captured location when it is not. This covers both deliberate redirects and default behavior without extra effort.

```tsx
export const SignInForm = ({ redirectTo }: { redirectTo?: string }) => {
  const navigate = useNavigate();
  const previousLocation = usePreviousLocation();

  const signIn = () => {
    // Your sign in logic here

    navigate({ to: redirectTo ?? previousLocation });
  };

  return (
    <form onSubmit={signIn}>
      {/* form fields */}
      <Button type="submit">Sign In</Button>
    </form>
  );
};
```

## Notes

- This article focuses on TanStack Router, but the same idea works in TanStack Start too.
- If you are using authenticated routes or guards, you might also like this related article: [Authenticated Routes and Guards](https://leonardomontini.dev/tanstack-router-authenticated-guards/).

## Conclusion

That is it. With either the explicit redirect or the previous location approach, you can make your sign in flow return users to exactly where they left off, preserving query parameters and their context.

If you have different ideas or improvements, let me know in a comment.

Code is taken from the [ConfHub project](https://confhub.tech/), you can find it here: https://github.com/Balastrong/confhub


---

Thanks for reading this article, I hope you found it interesting!

Let's connect more: https://leonardomontini.dev/newsletter

Do you like my content? You might consider subscribing to my YouTube channel! It means a lot to me ❤️
You can find it here:
[![YouTube](https://img.shields.io/badge/YouTube:%20Dev%20Leonardo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/c/@DevLeonardo?sub_confirmation=1)

Feel free to follow me to get notified when new articles are out ;)
{% embed https://dev.to/balastrong %}