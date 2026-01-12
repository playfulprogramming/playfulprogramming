---
{
title: "It's Prisma Time - Select",
published: "2022-01-11T07:03:04Z",
tags: ["javascript", "typescript", "database", "orm"],
description: "Welcome back Guys, Today it's time to get our record using the select command.  Let's start with a...",
originalLink: "https://dev.to/this-is-learning/its-prisma-time-select-3lie",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "It's Prisma Time",
order: 9
}
---

Welcome back Guys,
Today it's time to get our record using the select command.

Let's start with a simple example (copy and paste the setup method in the [repository]() if you want some record in your database).

```ts
const prisma = new PrismaClient();
const posts = await prisma.post.findMany();
console.log(JSON.stringify(posts, undefined, 2));
```

As you can see, to do the select in Prisma we need to use the [findMany](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findmany) method. In this case, the code does a simple select without anything else (no where, no groupBy, no orderBy...), it's like doing this query

```sql
SELECT *
FROM POSTS
```

But let's move on and add a WHERE clause to our select.

```ts
...
const posts = await prisma.post.findMany({
  where: {
    id: {
      gte: 5,
    },
  },
});
...
```

The where clause is the same seen in the previous articles (delete and update), so I won't go in depth because I've already spent many words about it.
Therefore let's see the order by command

```ts
const posts = await prisma.post.findMany({
  orderBy: {
    published: "desc",
  },
});
```

As you can see, the orderBy command is so simple, you need to create an object and indicate the column used for the sorting and its direction ("desc" or "asc"). But if you want to indicate multiple columns in your sorting, the syntax is a little bit different. Let's see it in this code.

```ts
const posts = await prisma.post.findMany({
  orderBy: [{ published: "desc" }, { createAt: "asc" }],
});
```

As you can tell, when you need to indicate multiple columns, the orderBy field wants an array of values, and each value must contains the column name and its direction.

But let's go on and see how to indicate only a subset of columns of our entity.
Supposing that we want to select only the fields `id`, `title` and `content` of the Post Entity, how can we do that?
Fortunately, in the findMany method there is a configuration to indicate that, let's see it the next code.

```ts
const posts = await prisma.post.findMany({
  select: {
    id: true,
    title: true,
    content: true,
  },
});
```

As you can notice, using the select option, we can indicate the column we want to extract, but Prisma doesn't end here its works. When we use the select option, Prisma returns an object that respects our selection, so the typescript compiler can detect the right fields of the objects. In this case the `posts` collection has this type

```ts
const posts: {
    id: number;
    title: string;
    content: string;
}[]
```

It's fantastic I think, isn't it?

Ok let's go on and see the `include` option.
The include option is used to load the relative Entities too.
Immagine you want get for each post its relative authors and its comments; using the include option it's possibile.
Let's see how in the next code.

```ts
const posts = await prisma.post.findMany({
  include: {
    authors: {
      select: {
        author: true,
      },
    },
    comments: true,
  },
});
```

As you can see, the include option allows us to get the authors and the comments relative to each post.
The result of this query is

```json
[
  {
    "id": 1,
    "title": "Post title 2",
    "content": "Post content 2",
    "published": true,
    "createAt": "2022-01-03T08:52:30.690Z",
    "updatedAt": "2022-01-03T08:52:30.690Z",
    "authors": [
      {
        "author": {
          "id": 4,
          "firstName": "First name 2",
          "lastName": "Last name 2"
        }
      }
    ],
    "comments": []
  },
  {
    "id": 2,
    "title": "Post title 5",
    "content": "Post content 5",
    "published": false,
    "createAt": "2022-01-03T08:52:30.690Z",
    "updatedAt": "2022-01-03T08:52:30.690Z",
    "authors": [
      {
        "author": {
          "id": 3,
          "firstName": "First name 5",
          "lastName": "Last name 5"
        }
      }
    ],
    "comments": []
  },
  {
    "id": 3,
    "title": "Post title 1",
    "content": "Post content 1",
    "published": false,
    "createAt": "2022-01-03T08:52:30.690Z",
    "updatedAt": "2022-01-03T08:52:30.690Z",
    "authors": [
      {
        "author": {
          "id": 5,
          "firstName": "First name 1",
          "lastName": "Last name 1"
        }
      }
    ],
    "comments": []
  }
  ...
]
```

After the explanation of the `findMany` method, it's important to spend some words about other two methods: [findUnique](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findunique) and [findFirst](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findfirst). As you can immagine, these two methods allow us to retrieve a single record. The findFirst is like the findMany but it returns the first record of the result. The findUnique otherwise returns a record by its key. If they do not find any results return `null`.
Let's see an example of both:
*- findFirst*

```ts
const post = await prisma.post.findFirst({
  where: {
    published: true,
  },
});
```

\_- findUnique

```ts
const post = await prisma.post.findUnique({
  where: {
    id: 1,
  },
});
```

Ok, I think that's all for today.
In the next article we are going to see how to paginate the results.

See you soon guys!
Bye Bye!

*[Here](https://github.com/Puppo/it-s-prisma-time/tree/09-select) you can find the code of this article*
