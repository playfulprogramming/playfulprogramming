---
{
title: "Full-Text Search with Firebase Data Connect",
published: "2025-07-25T09:25:26Z",
edited: "2025-07-25T09:25:34Z",
tags: ["firebase", "webdev", "programming", "database"],
description: "In the previous article, you saw how to create a project from scratch with Firebase Data...",
originalLink: "https://dev.to/this-is-learning/full-text-search-with-firebase-data-connect-40o5",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

In the [previous article](https://dev.to/this-is-learning/firebase-data-connect-rapid-development-and-granular-control-with-graphql-32g5), you saw how to create a project from scratch with Firebase Data Connect.

Today, I want to talk to you about a brand new feature:

**full-text search**

This feature allows you to implement powerful search functionality directly within your application, providing a seamless and intuitive user experience.

Full-text search goes beyond simple keyword matching. It lets you quickly and efficiently locate information within large datasets by searching for keywords and phrases across multiple columns at once.

Implementing full-text search with Data Connect is straightforward. It begins with annotating the desired string fields in your GraphQL schema with the `@searchable` directive.

```gql
type User @table(key: "id") {
  id: String!
  firstName: String! @searchable
  lastName: String @searchable
  email: String!
}
```

This simple annotation tells Data Connect that these fields should be indexed and used for full-text search. For example, if you have a `Product` type with fields like `name`, `description`, and `category`, marking these with `@searchable` would allow users to search across all three simultaneously.

Once the schema is updated, a new query is needed.

```gql
query SearchUsers($searchTerm: String) @auth(level: PUBLIC) {
  users_search(query: $searchTerm) {
    id,
    firstName,
    lastName,
    email
  }
}
```

## Language choice

By default, full-text search parses documents in English.
You can change this with the language argument on the `@searchable` directive.

```gql
type User @table(key: "id") {
  id: String!
  firstName: String! @searchable(language: "german")
  ...
}
```

Choosing the correct language significantly improves search accuracy, particularly when dealing with languages with complex grammatical structures.

Finally, Data Connect allows you to set a `relevanceThreshold`. This allows you to filter out less relevant results, ensuring that only the most pertinent information is displayed to the user.

> Determining the appropriate threshold often requires experimentation and analysis of your data, but it can significantly improve the perceived quality of the search results.

To figure out an appropriate value for relevance threshold, you should perform a few test searches and look at the \_metadata.relevance.

```gql
query SearchUsers($searchTerm: String) @auth(level: PUBLIC) {
  users_search(query: $searchTerm) {
    id,
    ...
    _metadata {
      relevance
    }
  }
}
```

---

You can read the full list of features and filters on the [official Firebase documentation](https://firebase.google.com/docs/data-connect/solutions-full-text-search).

Firebase Data Connect offers a powerful and flexible solution for implementing robust search functionality in your applications. By leveraging PostgreSQL's full-text search capabilities and providing a streamlined GraphQL interface, Data Connect simplifies the process of indexing and querying data, ultimately empowering developers to create more engaging and informative user experiences.

---

You can [follow me on GitHub](https://github.com/gioboa), where I'm creating cool projects.

I hope you enjoyed this article, don't forget to give ❤️.
Until next time 👋

<!-- ::user id="gioboa" -->
