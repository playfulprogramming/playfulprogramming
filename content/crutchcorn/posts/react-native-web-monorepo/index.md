---
{
  title: "Set up a React Native Web Project in a Monorepo",
  description: "",
  published: '2024-04-05T13:45:00.284Z',
  tags: ['react', 'react native'],
  license: 'cc-by-nc-sa-4',
  originalLink: "https://example.com",
  collection: "React Native Monorepo",
  order: 2
}
---

In our last blog post, we took a look at how to scaffold a React Native monorepo. We explained how some of the benefits were not only code sharing between native apps, but that it enabled us to have different types of applications share the same code:

![// TODO:](../setup-a-react-native-monorepo/rn_monorepo.png)

Here, we showed a Windows, macOS, Android, and iOS app that all share from the same codebase in a monorepo.

What if I told you that this isn't where things stopped?

Let's look at how each of these platforms are supported in React Native:

- [iOS (maintained from Meta)](https://reactnative.dev/)
- [Android (maintained by Meta)](https://reactnative.dev/)
- [Windows (maintained by Microsoft)](https://microsoft.github.io/react-native-windows/)
- [macOS (maintained by Microsoft)](https://microsoft.github.io/react-native-windows/)
- [Web (maintained by ecosystem)](https://necolas.github.io/react-native-web/)

> Wait, what?! We can build web apps using React Native?!

It's true! While this might seem backwards at first, it's a superpower to get a React Native app ported to the web quickly.

So, how do we do this?

## Setting Up the Initial React Native Web Project

So, let's take the file structure from the last article and add a `websites/admin-portal` folder:

<!-- ::start:filetree -->

- `apps/`
  - `customer-portal/`
  - `admin-portal/`
- `packages/`
  - `shared-elements/`
- `websites/`
  - `admin-portal/`
- `package.json`

<!-- ::end:filetree -->
