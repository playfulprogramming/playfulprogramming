---
{
title: "3 Pillars Only Senior Developers Know About Firebase and Firestore Databases",
published: "2025-04-02T09:06:44Z",
edited: "2025-04-02T09:12:27Z",
tags: ["firebase", "database", "webdev", "mobile"],
description: "Google offers robust, real-time NoSQL database solutions: the original Realtime Database and the...",
originalLink: "https://dev.to/this-is-learning/3-pillars-only-senior-developers-know-about-firebase-and-firestore-databases-oe0",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

Google offers robust, real-time NoSQL database solutions: the original Realtime Database and the newer, more robust Cloud Firestore.

These solutions empower developers to build dynamic, collaborative applications with relative ease, synchronizing data across clients in milliseconds.

However, harnessing its full potential requires moving beyond basic implementation and embracing core best practices.

In fact, without careful consideration of data structure, security, and query efficiency, applications can quickly become sluggish, insecure, and expensive to operate.

> Mastering core principles is not just recommended; it's essential for building applications that are scalable, secure, performant, and cost-effective.

## 1: Strategic Data Structuring

The most significant shift for developers coming from traditional SQL backgrounds is understanding the NoSQL paradigm inherent in both Firebase Realtime Database and Cloud Firestore. Unlike relational databases where [normalization](https://en.wikipedia.org/wiki/Database_normalization) (minimizing redundancy) is king and complex joins stitch data together, Firebase databases excel when data is structured specifically for the access patterns of your application's views or features.

### Performance, Cost, and Simplicity

Firebase databases are optimized for fetching specific data paths quickly. Retrieving data at a node in the real-time database fetches all child data beneath it. Firestore reads operate on documents and structuring data to match your UI needs means faster reads.

> Complex client-side joins or fetching large, deeply nested structures that contain unnecessary data dramatically slows down your application.

Firebase pricing models are heavily influenced by the amount of data read, written, and stored. Efficient structures minimize read operations.

> Fetching large amounts of unneeded data directly translates to higher bills.

While [denormalization](https://en.wikipedia.org/wiki/Denormalization) might initially seem complex, it often simplifies client-side query logic. Instead of writing code to fetch data from multiple locations and stitch it together, you retrieve pre-joined or relevant data directly.

> [Denormalization](https://en.wikipedia.org/wiki/Denormalization) is the practice of intentionally duplicating data across different locations in your database to optimize read performance. Instead of storing related data in separate collections/nodes and joining them at read time, you should store copies of the data where it's frequently needed together.

### Real World Example

Consider a social media application displaying posts.
Each post shows the author's username and profile picture.

#### Normalized (SQL-like) Approach (Anti-pattern in Firebase)

```json
// /posts/{postId}
{
  "text": "My awesome post!",
  "timestamp": 1678886400,
  "authorId": "user123"
}

// /users/{userId}
{
  "username": "Alice",
  "profilePicUrl": "https://example.com/alice.jpg"
  // ... other user details
}
```

To display a list of posts, the client would first fetch the posts and then, for each post, make a separate request to fetch the corresponding user's details. This leads to N+1 query problems, `slow loading, and increased read costs`.

#### Denormalized (Firebase Best Practice) Approach

```json
// /posts/{postId}
{
  "text": "My awesome post!",
  "timestamp": 1678886400,
  "authorId": "user123",
  "authorUsername": "Alice", // Denormalized
  "authorProfilePicUrl": "https://abc.com/alice.jpg" // Denormalized
}

// /users/{userId} (Still exists for profile pages, etc.)
{
  "username": "Alice",
  "profilePicUrl": "https://example.com/alice.jpg"
  // ... other user details
}
```

Now, fetching a list of posts retrieves all necessary display information in a single query. The read is significantly faster and cheaper.

> The main drawback of denormalization is update complexity. If Alice changes her username, you need to update it not only in `/users/user123` but also in *every single post* she authored.

## 2: Fortifying with Security Rules

Firebase Security Rules are arguably the most critical component for production applications. They are the only reliable way to control access to your data. Relying solely on client-side logic to enforce permissions is fundamentally insecure, as malicious users can bypass your app's code and interact directly with the database API.

### Data Protection, Integrity, and Preventing Abuse

Ensure users can only read and write data they are permitted to see or modify (e.g., a user accessing only their profile, not others).
Validate the structure, type, and content of data being written. Prevent users from writing malformed or invalid data that could break your application or corrupt your dataset.
With security rules, you can stop malicious users from performing costly operations, like deleting entire collections or writing massive amounts of junk data, which could incur huge costs or render your app unusable.

For a more detailed exploration of this specific pillar, please refer to [my dedicated article](https://dev.to/this-is-learning/exploring-firebase-database-security-rules-1kmk) on the subject.

## 3: Optimizing Queries and Data Retrieval

Even with a well-structured database and robust security, inefficient data retrieval can cripple your application's performance and inflate your Firebase bill.

> Optimization focuses on fetching only the data you need, when you need it, as quickly as possible.

### Performance, User Experience, and Cost Control

Faster data loading leads to a more responsive UI and a better user experience slow queries result in loading spinners, janky interfaces, and user frustration.
Firebase charges for reads, writes, and bandwidth. Fetching unnecessary data, performing inefficient queries, or keeping unused real-time listeners active directly increases costs.

> Optimization is crucial for managing your budget, especially at scale.

### Fetch Only What You Need

Never fetch an entire large collection if you only need a few items, you can use `where()` clauses to filter data server-side.

Firestore supports chaining multiple `where()` filters (equality `==`, range `<`, `<=`, `>`, `>=`, `!=`, `in`, `not-in`, `array-contains`, `array-contains-any`).

Realtime Database has more limited querying (`orderByChild`, `orderByKey`, `orderByValue` combined with `equalTo`, `startAt`, `endAt`, `limitToFirst`, `limitToLast`).

While Firestore always retrieves the entire document matching a query, you can use `select('field1', 'field2')` on the client SDK after the query executes to extract only specific fields from the retrieved documents, potentially saving memory and processing on the client.

> This does not reduce the amount of data read from Firebase for billing purposes.

### Limits and Pagination

Don't load thousands of items (e.g., chat messages, posts, product listings) at once. Use `limit()` (Firestore) or `limitToFirst()` / `limitToLast()` (Realtime Database) to fetch a manageable initial set (e.g., 20 items).
As the user scrolls or requests more data, use the last retrieved item as a cursor to fetch the next batch.
Pagination dramatically improves initial load times and reduces the amount of data fetched per interaction.

### Client-Side Caching

Firebase SDKs have built-in offline persistence capabilities (especially Firestore), which act as a local cache. Enable this feature [`enablePersistence()` in Firestore](https://firebase.google.com/docs/firestore/manage-data/enable-offline#configure_offline_persistence) to allow your app to function offline and load previously fetched data instantly from the local cache while fetching updates in the background. This significantly improves perceived performance and user experience, especially on flaky networks.

> Optimization is about working smarter, not harder, with data retrieval. Fetch only what's necessary using precise queries, limits, pagination, and client-side caching. These practices lead to faster apps, happier users, and lower Firebase bills.

---

Mastering Firebase databases goes far beyond simply writing and reading data. The essential practices of strategic data structuring, ironclad security rules, and optimized querying are the cornerstones of successful application development. Denormalize for speed, secure with rules, and query with precision. Adhering to these principles is the key differentiator between a prototype and a production-ready application—one that is scalable, safe, fast, and financially viable.

> Make these best practices a non-negotiable part of your Firebase development workflow.

---

You can [follow me on GitHub](https://github.com/gioboa), where I'm creating cool projects.

I hope you enjoyed this article, don't forget to give ❤️.
Bye 👋

<!-- ::user id="gioboa" -->
