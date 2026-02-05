---
{
title: "TanStack Form Tutorial: Advanced Validation",
published: "2024-05-21T12:05:10Z",
edited: "2024-05-21T12:08:06Z",
tags: ["webdev", "typescript", "tutorial", "codenewbie"],
description: "Validation is one of the core features of forms, probably the most important one.  In the last...",
originalLink: "https://leonardomontini.dev/tanstack-form-advanced-validation/",
coverImg: "cover-image.png",
socialImg: "social-image.png",
collection: "TanStack Form",
order: 2
}
---

Validation is one of the core features of forms, probably the most important one.

In [the last article](https://dev.to/this-is-learning/tanstack-form-setup-and-simple-validation-with-shadcnui-1al) we set up together a simple form with TanStack Form and basic validation. Today we'll push it a bit further and see how to handle more complex validation scenarios. In this order:

1. Form-level validation
2. Backend validation
3. Local + Async validation
4. User feedback during validation
5. Listen and validate on linked fields
6. Validating libraries (zod, yup, valibot)

## Follow along

As usual I also recorded a demo where I set up everything which I recommend you to watch and follow along, you can find it here:

<iframe src="https://www.youtube.com/watch?v=Pys2ExswZT0"></iframe>

Interested in the source code? Here on GitHub: https://github.com/Balastrong/tanstack-form-demo/tree/02-advanced-validation
(you can leave a star ⭐️ if you want)

Here below you can find the most important steps and code snippets, let's begin!

## Form-level validation

In the first video we added validators to the `form.Field` components to have field-level validation. Guess what, we can also add validators to the `form` component to have form-level validation!

```tsx
const form = useForm({
  defaultValues: {
    username: '',
    password: '',
  },
  validators: {
    onSubmit: ({ value }) => {
      if (!value.username || !value.password) {
        return 'Please fill in all fields';
      }
    },
  },
  onSubmit: ({ value }) => {
    console.log(value);
  },
});
```

Spoiler: soon it will be possible to validate fields in the form validator too! See: https://github.com/TanStack/form/pull/656

## Backend validation

Sometimes you don't have enough data on the frontend to do a very specific validation. An example? Checking if a username is already taken. In this case you can send the data to the backend and get a response back.

To reproduce this I created a method returning a promise that resolves after 1 second, mocking a backend. If you're following along with the tutorial and you don't have a backend to test with, here's what I used in the video:

```tsx
export function validateUsername(username: string) {
  return new Promise<string | undefined>((resolve) => {
    console.log('Validating username: ' + username);
    setTimeout(() => {
      resolve(['foo', 'bar', 'baz'].includes(username) ? 'Username already taken' : undefined);
    }, 1000);
  });
}
```

We can now use it inside our username validator, having this as a result:

```tsx
 <form.Field
    name="username"
    validatorAdapter={zodValidator}
    validators={{
        onChangeAsyncDebounceMs: 100,
        onChangeAsync: ({ value }) => validateUsername(value),
    }}
    children={(field) => (
        ...
    )}
/>
```

With that the async validation runs after 100ms of inactivity on the input field and performs our (mock) backend validation.

## Local + Async validation

To be clear, you can have both local and async validation at the same time. There's also one optimization you might want to know: the async validation will run after the local validation passes.

This perfectly works:

```tsx
<form.Field
  name="username"
  validatorAdapter={zodValidator}
  validators={{
    onChangeAsyncDebounceMs: 100,
    onChangeAsync: ({ value }) => validateUsername(value),
    onChange: ({ value }) => value.length < 3 && 'Username must be at least 3 characters long',
  }}
  children={(field) => ...}
/>
```

## User feedback during validation

If your validation takes a little bit of time (even half a second) you might want to inform your user that something is going on. Tanstack Form exposes a properly called `isValidating` which comes to the rescue!

```tsx
<form.Field
  name="username"
  validatorAdapter={zodValidator}
  validators={{
    onChangeAsyncDebounceMs: 100,
    onChangeAsync: ({ value }) => validateUsername(value),
    onChange: ({ value }) => value.length < 3 && 'Username must be at least 3 characters long',
  }}
  children={(field) => (
    <div className="relative">
      <Input id="username" type="text" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
      {field.getMeta().isValidating && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <LoaderCircle className="animate-spin" />
        </div>
      )}
    </div>
  )}
/>
```

## Listen and validate on linked fields

Here's another common usecase: you want to validate a field based on the value of another field AND make sure to run the validation when the OTHER field changes.

There you have: `onChangeListensTo`:

```tsx
<form.Field
  name="confirmPassword"
  validators={{
    onChangeListenTo: ['password'],
    onChange: ({ value, fieldApi }) =>
      fieldApi.getMeta().isDirty && value !== fieldApi.form.getFieldValue('password') && 'Passwords do not match',
  }}
  children={(field) => (
    <>
      <Label htmlFor="password">Confirm Password</Label>
      <Input
        id="confirmPassword"
        type="password"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {field.state.meta.errors && <p className="text-destructive text-sm mt-1">{field.state.meta.errors}</p>}
    </>
  )}
/>
```

Adding `onChangeListenTo: ['password']` to the `confirmPassword` field will make sure that the validation runs when the `password` field changes.

## Validating libraries (zod, yup, valibot)

Do you have schemas of your data? You can use them to validate your form fields! TanStack Form supports zod, yup and valibot out of the box.

You can pass the schema definition and make it work by also passing an adapter to the `form.Field` component:

Let's make an example with zod and its adapter, `zodValidator`:

```sh
npm i zod @tanstack/zod-form-adapter
```

After installing both `zod` and `@tanstack/zod-form-adapter` you can use it like this:

```tsx
 <form.Field
    name="username"
    validatorAdapter={zodValidator}
    validators={{
        onChange: z.string().min(3)
    }}
    children={(field) => (
        ...
    )}
/>
```

Or if you have the schema defined somewhere else:

```tsx
const UsernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters");

...
 <form.Field
    name="username"
    validatorAdapter={zodValidator}
    validators={{
        onChange: UsernameSchema
    }}
    children={(field) => (
        ...
    )}
/>
```

### Conclusion

And this was a glimpse into some of the validation options that Tanstack Form is currently supporting.

The next video of this series will probably be about arrays and dynamic fields, so make sure to [subscribe to the channel](https://www.youtube.com/@DevLeonardo?sub_confirmation=1) to not miss it!

I hope you enjoyed this article, if you have any questions or feedback feel free to reach out in the comments below. See you in the next one! 👋

---

Thanks for reading this article, I hope you found it interesting!

I recently launched a GitHub Community! We create Open Source projects with the goal of learning Web Development together!

Join us: https://github.com/DevLeonardoCommunity

Do you like my content? You might consider subscribing to my YouTube channel! It means a lot to me ❤️
You can find it here:
[![YouTube](https://img.shields.io/badge/YouTube:%20Dev%20Leonardo-FF0000?style=for-the-badge\&logo=youtube\&logoColor=white)](https://www.youtube.com/c/@DevLeonardo?sub_confirmation=1)

Feel free to follow me to get notified when new articles are out ;)

<!-- ::user id="balastrong" -->
