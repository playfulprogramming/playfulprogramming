---
{
title: "It's Prisma Time - Transactions",
published: "2022-01-20T07:19:05Z",
edited: "2023-02-16T09:29:21Z",
tags: ["javascript", "typescript", "database", "orm"],
description: "Hello Guys 👋  Today it's time to speak about transactions.  Transactions are a pillar of the database...",
originalLink: "https://dev.to/this-is-learning/its-prisma-time-transactions-ji5",
coverImg: "cover-image.png",
socialImg: "social-image.png",
collection: "It's Prisma Time",
order: 12
}
---

Hello Guys 👋
Today it's time to speak about transactions.

Transactions are a pillar of the database world, and they help us to make consistency in the data when we work with multiple entities.
So, can Prisma not handle them?
Obviously the answer is no 😃

In this moment, Prisma handles the transactions in two ways, the first one is the official feature and the second one is in preview.
Let's start from the first one.
The first method to do a transaction in Prisma is using the `$transaction` method. This method accepts a list of operations that are performed in a single transaction.
If all of these operations are successful the transaction does the commit otherwise it does the rollback.
Let's see this method at work.

```ts
const result = await prisma.$transaction([
  prisma.author.create({
    data: {
      firstName: "Author from transaction",
      lastName: "Author from transaction",
      age: getRandomInt(16, 100),
    },
  }),
  prisma.post.create({
    data: {
      title: "Post from transaction",
      content: "Post from transaction",
      published: false,
    },
  }),
]);
```

The result of this operation is an array of elements, where the elements are the result of each operation in the transaction, in our example the result is composed in this way `[Author, Post]`.
As you can imagine, this type of transaction is a good solution if you need to create a bulk insert or if you need to create a list of entities not relative to each other.
Therefore, to solve this problem, the Prisma team is working to improve the transaction method.
In this time, we can try this feature in preview, enabling it in the `schema.prisma` file.
First of all, open the `schema.prisma` file and update the generator client in this way

```ts
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["interactiveTransactions"]
}
```

*N.B. since [4.7.0](https://github.com/prisma/prisma/releases/tag/4.7.0), this feature has been production ready, so you can remove the `"interactiveTransactions"` flag.*

after that it's necessary to update the prisma definitions, so run in your terminal this command

```
npx prisma generate
```

By doing this, we enabled the feature.
Now, we'll see the previous example, rewritten in the way that the author and post are in relation.
Let's see the result

```ts
const result = await prisma.$transaction(async prisma => {
  const authorData = {
    firstName: "Author from transaction",
    lastName: "Author from transaction",
    age: getRandomInt(16, 100),
  } as const;
  const author = await prisma.author.create({
    data: authorData,
  });
  const post = await prisma.post.create({
    data: {
      title: "Post from transaction",
      content: "Post from transaction",
      published: false,
      authors: {
        create: [
          {
            authorId: author.id,
          },
        ],
      },
    },
    include: {
      authors: {
        include: {
          author: true,
        },
      },
    },
  });
  return { author, post };
});
```

As you can see, this feature allows us to handle the transaction like a function, and in this function we can do all the operations that we want to guarantee under transaction. We can also create an entity by using the create method and await its result. After that we can use this result to create or update another entity always under transaction.
If you want to roll back the transaction because there are some inconsistent data, you need to throw an exception.

I think for today that's all, but before I let you go, I suggest you this [reading](https://www.prisma.io/docs/guides/performance-and-optimization/prisma-client-transactions-guide) about transactions in the prisma site. It explains very well how this feature works and how to handle it in the best way.

In the next article, we are going to see how to log the queries executed by Prisma, but now it's time to say goodbye 😃

See you soon Guys
Bye bye 👋

*You can find the code of this article [here](https://github.com/puppo/it-s-prisma-time/tree/12-transaction)*
