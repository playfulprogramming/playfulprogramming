---
{
title: "Firebase Data Connect Introduces Enum Support for Enhanced Data Modeling",
published: "2025-07-31T10:13:19Z",
edited: "2025-07-31T10:14:03Z",
tags: ["firebase", "programming", "database", "graphql"],
description: "Enums allow you to quickly define a list of static, predefined values with a specific order, which...",
originalLink: "https://dev.to/this-is-learning/firebase-data-connect-introduces-enum-support-for-enhanced-data-modeling-2j97",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

Enums allow you to quickly define a list of static, predefined values with a specific order, which can significantly improve data integrity and code readability within your applications. 
Now with Firebase, you can use Enum to improve your database models.

## Defining and Using Enums

Adding an enum to your [Firebase Data Connect](https://firebase.google.com/docs/data-connect) service is straightforward.

First, you define the enum type along with its predefined values. Then, you reference it in your table schema.

```graphql
enum Language {
  ENGLISH
  FRENCH
  SPANISH
  GERMAN
  JAPANESE
  "Languages not defined above"
  OTHER_LANGUAGES
}

type Movie
  @table {
  title: String! 
  genre: String 
  description: String 
  originalLanguage: Language! @default(value: ENGLISH)
  availableLanguages: [Language!]
  // other fields
}
```

In this example, we define a `Language` enum with a set of supported languages.
This enum is then used in the `Movie` type to specify the original language of a movie and the languages in which it's available.

> The `@default` directive sets the default value for `originalLanguage` to `ENGLISH`.

## Seamless Integration with GraphQL and SDKs

Enums in Data Connect work seamlessly with your GraphQL schema, just like other types, queries, and mutations.

> You define them in GraphQL, and Data Connect automatically generates SDKs that include your enums.

This means you can use them directly in your generated types and operations, providing a type-safe and convenient way to work with predefined values in your client application.

## Enum features

Data Connect's enum feature lets you use enums directly in GraphQL queries to `filter data` based on specific `enum values`. There's a `wide range of filtering options` available, like equals, not equals, greater than, less than, and more. 

You can even `count` how many times each enum value appears using the _count function. Feel free to add new values to your enums, but be careful with the order, as it affects how filtering works.

You can also test your enums locally using the [VS Code emulator](https://marketplace.visualstudio.com/items?itemName=GoogleCloudTools.firebase-dataconnect-vscode) to make sure everything is working smoothly before you go live.

---

With enum support, Firebase Data Connect empowers you to create more robust, maintainable, and expressive data models for your applications. By leveraging the power of PostgreSQL enums and integrating them seamlessly into your GraphQL workflow, Data Connect simplifies the process of working with predefined values and ensures data consistency across your entire application.

---

You can [follow me on GitHub](https://github.com/gioboa), where I'm creating cool projects.

I hope you enjoyed this article, don't forget to give ❤️.
Until next time 👋

{% embed https://dev.to/gioboa %}

