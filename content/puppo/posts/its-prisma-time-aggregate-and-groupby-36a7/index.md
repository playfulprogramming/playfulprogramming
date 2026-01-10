---
{
title: "It's Prisma Time - Aggregate and GroupBy",
published: "2022-01-18T08:44:57Z",
tags: ["javascript", "typescript", "database", "orm"],
description: "Welcome back Folks 👋  Today we are seeing how to aggregate and group data.  Let's start from the...",
originalLink: "https://dev.to/this-is-learning/its-prisma-time-aggregate-and-groupby-36a7",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "15827",
order: 1
}
---

Welcome back Folks 👋
Today we are seeing how to aggregate and group data.

Let's start from the first one.
To aggregate data in Prisma you have to use the [aggregate](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#aggregate) method.
Using this method, you can aggregate data of type number, and you can do these operations:

- max
- min
- count
- sum
- avg

*N.B. I won't spend time explaining what these operations do because I think their names speak for themselves*

Therefore, let's give an example to see the aggregate method at work.

```ts
const aggregate = await prisma.author.aggregate({
  _avg: {
    age: true,
  },
  _max: {
    age: true,
  },
  _min: {
    age: true,
  },
});
```

As you can see, in this example, we aggregated the authors and we got as result the authors' ages average, the age of the older author and the age of the younger author. The result is composed in this way:

```ts
{
    _avg: {
        age: true;
    };
    _max: {
        age: true;
    };
    _min: {
        age: true;
    };
}
```

In addition, the aggregate method allows us to use these operations:

- where
- orderBy
- take
- skip
- cursor

So as you can immagine, you can filter and sort your data before aggregate them.
I think this feature might be clear that way, so let's move on to the groupBy feature.

The [groupBy](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#groupby) feature allows us to group data by one o more fields.
Let’s see an example to start

```ts
const commentsGroupByPost = await prisma.comment.groupBy({
  by: ["postId"],
  _count: {
    authorId: true,
    _all: true,
  },
  orderBy: {
    _count: {
      authorId: "desc",
    },
  },
  having: {
    authorId: {
      _count: {
        gt: 1,
      },
    },
  },
});
```

In this example, we grouped the comments by post, and after that, we counted the number of comments with the author and the number of comments for that post.
Moreover, we sorted the result by the authors' count and, using the having option, we took only the posts that have at least a comment with an author.
As you can see, this method is not difficult to use and understand. *It's also possibile to filter the data with the `where` option.*

I think for today that's all.
We saw how to aggregate and how to group data using Prisma and, if you want to deepen, the prisma team created this [video](https://www.youtube.com/watch?v=BdlCPdPaorY) to explain better the groupBy feature.

In the next article we will see how to run our queries under transaction, but for today it's time to close 😃

See you soon guys
Bye bye 👋

*To show the code of this article in action follow this [link](https://github.com/puppo/it-s-prisma-time/tree/11-grouping-and-aggregate)*
