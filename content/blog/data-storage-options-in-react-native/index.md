---
{
	title: "Data Storage Options for React Native",
	description: "React Native contains multiple different ways you can persist data for your application. Let's look at the choices and their pros and cons.",
	published: '2020-04-14T05:12:03.284Z',
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

There may be an instance where you want to store a part of secure information to the device. For example, in [my mobile Git client I'm currently writing](https://gitshark.dev), I'm grabbing an access token from the GitHub API. This type of sensitive data introduces a new set of problems when it comes to storage; conventional means of storing data are easily accessed from external sources, leading to a security vulnerability with such sensitive data. That said, both major mobile platforms have solved for this problem: [iOS has its Keychain API](https://developer.apple.com/documentation/security/keychain_services) while [Android provides a KeyStore API](https://developer.android.com/reference/java/security/KeyStore). Both can be accessed using the [`react-native-secure-key-store` npm package](https://github.com/pradeep1991singh/react-native-secure-key-store#readme) :

```
yarn add react-native-secure-key-store
```

This package provides an easy-to-use key-value pattern, not entirely dissimilar to the one we used [in the last section](#default-preference).

## Local Database Usage {#sqlite-storage}

There may be times where having simple key-value storage isn't enough. Sometimes, you need the power and flexibility that a full-scale database provides. That said, not all of the data you need always requires a database to be hosted on the server. This instance is where having a local SQL database comes into play. React Native has a few different options for utilizing an on-device SQL database, but the most popular is using the [`react-native-sqlite-storage`](https://github.com/andpor/react-native-sqlite-storage) package:

```
yarn add react-native-sqlite-storage
```

This package allows you to use full SQL syntax for querying and creating.

## ORM Options {#orms}

Want the power and utility of a SQL database, but don't want to play with any of the SQL syntaxes yourself? No problem, there is a myriad of options to build on top of SQLite using React Native. One of my favorites us [TypeORM](http://typeorm.io/). Useful for both TypeScript and vanilla JS usage, it provides a bunch of functionality that maps relatively directly to SQL.

Alternatively, if you're looking for something with more of a framework feel, there's [WatermelonDB](https://github.com/Nozbe/WatermelonDB). WatermelonDB is utilized with [RxJS](https://rxjs.dev/) to provide an event-based fast-as-fusion alternative to more conventional ORMs.

# Remote Database Usage {#serverless}

While you're able to utilize [something like Fetch or Axios to make calls to your remote API for data](https://reactnative.dev/docs/network#using-fetch), you might want to utilize a serverless database to provide data to your apps. React Native's got you covered whether you want to use [MongoDB Stitch](https://www.npmjs.com/package/mongodb-stitch-react-native-sdk), [Firebase's Firestore or Realtime Database](https://rnfirebase.io/), or others.

# Synchronized Database Usage {#realm}

While you're more than able to cache database calls manually, sometimes it's convenient to have your data synchronized with your backend. This convenience is one of the selling points of [Realm](https://realm.io/). Realm is an unconventional database in that it's written natively and is not SQL based. You're able to [integrate with React Native as a local database](https://realm.io/docs/javascript/latest#getting-started) and connect to their [Realm Sync platform](https://docs.realm.io/sync/getting-started-1/getting-a-realm-object-server-instance) to provide a simple to use synchronization between your database backend and mobile client.

> A note about RealmDB: [MongoDB acquired Realm in 2019](https://techcrunch.com/2019/04/24/mongodb-to-acquire-open-source-mobile-database-realm-startup-that-raised-40m/). While this may seem like an unrelated note to leave here, I mention it because large-scale changes are in the immediate horizon for the platform. MongoDB is open about such. They plan on integrating the platform into a larger-scoped platform _also_ (confusingly) called [Realm](https://www.mongodb.com/realm). I mention this because if you're starting a new project, you may want to be aware of what these changes will have in store for your future. It seems like they have a lot of exciting things coming soon!

# Pros and Cons {#pros-and-cons}

| Option                                        | Pros                                                                                                         | Cons                                                                                                                         |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| [Key-Value Pair Storage](#default-preference) | <ul><li>Extremely fast</li><li>Useful for simple data storing</li></ul>                                      | <ul><li>Can only store serializable data</li><li>Not very cleanly separated</li><li>Not very secure</li></ul>                |
| [Secure Key-Value Storage](#secure-key-store) | <ul><li>Fast</li><li>A secure method of data storing</li></ul>                                               | <ul><li>Can only store serializable data</li><li>Not very cleanly separated</li></ul>                                        |
| [SQLite without ORM](#sqlite-storage)         | <ul><li>Cleanly separated data</li></ul>                                                                     | <ul><li>Difficult to maintain code and table migrations manually</li><li>Not very fast compared to key-value pairs</li></ul> |
| [SQLite with ORM](#orms)                      | <ul><li>Cleanly separated data</li><li>Much more easy to maintain than writing SQL itself</li></ul>          | <ul><li>Often slower than writing SQL by hand</li><li>More work to get setup</li></ul>                                       |
| [Serverless](#serverless)                     | <ul><li>Simple setup</li><li>No need to schema or migrate a database when data requirements change</li></ul> | <ul><li>Potentially difficult to cache</li><li>Not on-device</li></ul>                                                       |
| [RealmDB](#realm)                             | <ul><li>An easy-to-sync on-device and cloud storage</li></ul>                                                | <ul><li>A heavier requirement of investment than something more standard</li><li>Large migrations on the horizon</li></ul>   |

# Conclusion

As with many things in engineering, where to store data is a broad-reaching and integral question to be asking yourself while developing. I've found myself mixing many of these options for a single application, depending on the context. Each has its strengths to draw from and weaknesses to consider.

If you liked this article and want to see more React Native content, consider subscribing to our newsletter below. We have more React Native content on its way soon. We also have [a community Discord](https://discord.gg/FMcvc6T) if you have questions or comments that you'd like to discuss with us!
