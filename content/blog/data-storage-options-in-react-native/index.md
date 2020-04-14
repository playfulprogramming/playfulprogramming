---
{
	title: "Data Storage Options for React Native",
	description: "You know the classic expression: There's more than one way to... Err... store app data. That's how it's said 100%. Let's explore our options in React Native!",
	published: '2020-03-31T05:12:03.284Z',
	authors: ['crutchcorn'],
	tags: ['react', 'react native'],
	attached: [],
	license: 'cc-by-nc-sa-4',
}
---

One of the hardest parts of any front-end application (native application or website alike) is the data layer. Where do I store information? That question alone can cause lots of headaches when dealing with large-scale applications. Well, worry not, as we'll be going over some of the different options you have at your disposal in your React Native applications today.

# Key-Value Pair Storage {#default-preference}

Often, while creating settings options, it can be useful to store a simple key/value pairings of serializable data (like JSON). In the web world, we'd use `localStorage.` Ideally, we'd like a simple data storage for string-based data that has a `get,` a `set,` and a `clear` method to handle data for us. Luckily for us, there is!

[`react-native-default-preference`](https://github.com/kevinresol/react-native-default-preference) is an easy-to-add dependency that provides what we're looking for:

```
yarn add react-native-default-preference
```

Under-the-hood, it utilized native methods for storing data in a key-value manner. These APIs it employs is the [`SharedPreferences` API on Android](https://developer.android.com/reference/android/content/SharedPreferences) and the [`UserDefaults` API on iOS](https://developer.apple.com/documentation/foundation/userdefaults). This native code utilization should mean that not only is the data straightforward to access, but speedy as well.

# Secure Key-Value Pair Storage {#secure-key-store}

There may be an instance where you want to store a part of secure information to the device. For example, in [my mobile Git client I'm currently writing](https://twitter.com/crutchcorn/status/1249852692987428864), I'm grabbing an access token from the GitHub API. This type of sensitive data introduces a new set of problems when it comes to storage; conventional means of storing data are easily accessed from external sources, leading to a security vulnerability with such sensitive data. That said, both major mobile platforms have solved for this problem: [iOS has its Keychain API](https://developer.apple.com/documentation/security/keychain_services) while [Android provides a KeyStore API](https://developer.android.com/reference/java/security/KeyStore). Both can be accessed using the [`react-native-secure-key-store` npm package]([https://github.com/pradeep1991singh/react-native-secure-key-store](https://github.com/pradeep1991singh/react-native-secure-key-store#readme)) :

```
yarn add react-native-secure-key-store
```

This package provides an easy-to-use key-value pattern, not entirely dissimilar to the one we used in the last section.