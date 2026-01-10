---
{
title: "It's Prisma Time - Execute your own queries",
published: "2022-01-28T07:10:53Z",
tags: ["javascript", "typescript", "database", "orm"],
description: "Hello Folks 👋 Today it's time to see how we can execute our own queries.  In prisma we can run two...",
originalLink: "https://dev.to/this-is-learning/its-prisma-time-execute-your-own-queries-4olp",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "15827",
order: 1
}
---

Hello Folks 👋
Today it's time to see how we can execute our own queries.

In prisma we can run two kind of custom queries: "Actionable" queries (INSERT, UPDATE or DELETE) and "Retrievable" queries (SELECT). The first one can be executed using the `$executeRaw` method while the other one can be executed using the `$queryRaw`.

## Method $executeRaw
This method enables us to create custom queries to insert update or delete records in the database.
Using the [tagged template](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals?retiredLocale=it#tagged_templates) we can write our query and Prisma runs it "magically".
Let’s see it in action to understand it better
```ts
const result = await prisma.$executeRaw`
INSERT INTO posts (title, content, published, updatedAt)
VALUES (${"Post Title"}, ${"Post Content"}, ${false}, ${new Date()});`;
console.log(`Insert result: ${result}`);
```
As you can see, it's not so difficult to use this method. 
By using the Tagged Template we can write our query and pass all the parameters in complete safety. In complete safety? Yes, you are reading right. By using this method all the parameters passed with the syntax `${parameter}` are safe from the SQL-Injection, so we won't worry about these attacks.
_You can read more about this [here](https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#sql-injection)_
The last thing that I want to leave you is the return value of this method. The method returns the number of records affected by our queries. Thus we can check if our queries are executed correctly.

## Method $queryRaw
This method allows us to retrieve data using custom queries.
Sometimes, we need more performance and the query created by Prisma must be rewritten, in this case the `$queryRaw` method is our lifeline.
This method uses the Tagged Template and it prevents attack by SQL-injection too.
The result of this method is always an array and the type of this array depends on the result of your query. To explain better this concept let me give an example.
```ts
const result: Post[] = await prisma.$queryRaw<Post[]>`
SELECT p.id, p.title, p.content, p.published, p.createAt, p.updatedAt
FROM posts p
WHERE p.published = ${true}
ORDER BY p.createAt DESC`;
result.forEach(post => {
  const { id, title, content, createAt, published, updatedAt } = post;
  console.log({
    id,
    title,
    content,
    createAt,
    published,
    updatedAt,
  });
});
```
If you look closely this piece of code, you can notice that the `result` variable is an array of type Post, and also the `$queryRaw` method indicates that as its return type. By doing so, we receive the right check by typescript in the following rows of code. But there is a thing to keep in mind. The conversion from the result of the query to your type is not guaranteed by Prisma, it's your business in this case.
_N.B. If you don't indicate your result type, by default Prisma returns the [unknown](https://dev.to/this-is-learning/typescript-tips-tricks-any-vs-unknown-2ho6) type_



Let's move on and see another feature that we can adopt when we are using these methods.
Sometimes we have to use the IN operator in a custom query. Probably you are thinking that using the `map` method of the array is the right thing, unfortunately it's not so. To do this, Prisma exposes us a specific method `Prisma.join`. This method builds for us the IN clause in a safety mode, so we can use it in our custom queries.
Let's see it in action
```ts
const posts = await prisma.$queryRaw<
  Post[]
>`SELECT * FROM posts WHERE id IN (${Prisma.join([1, 2, 3])})`;
console.log(`Posts in 1,2,3: ${JSON.stringify(posts, null, 2)}`);
```
As you can notice, in this piece of code the values in the IN clause are built using the `join` method, nothing so difficult but it's important to keep in mind to use it in these cases.

Two other good features exposed by Prisma are the `Prisma.sql` and `Prisma.empty`. These features enable us to create dynamic queries. Imagine that your query needs to do a WHERE clause only if there is a filter. By combining these two features you can create a custom query that depends on the data that you receive. Let's see an example
```ts
const author: string | undefined = "transaction";
const authors = await prisma.$queryRaw<Author[]>`
SELECT * FROM authors a ${
  !!author
    ? Prisma.sql`WHERE a.firstName || ' ' || a.lastName LIKE ${`%${author}%`}`
    : Prisma.empty
}`;

console.log(`Authors: ${JSON.stringify(authors, null, 2)}`);
```
As you can see, in this example we check the value of the author variable, and if it's defined the query will execute using the filter (Prisma.sql), otherwise the query will execute without the filter(Prisma.empty).
Even here, nothing so difficult to understand but these are two really good methods to write our own queries better.

Ok Guys, it's all for today.
In the next article we are going to see how to use the migrations with Prisma.

See you soon
Bye Bye 👋

_You can find the code of this article [here](https://github.com/Puppo/it-s-prisma-time/tree/14-execute-your-queries)_