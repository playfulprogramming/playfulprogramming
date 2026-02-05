---
{
title: "It's Prisma Time - Pagination",
published: "2022-01-13T07:10:33Z",
tags: ["javascript", "typescript", "database", "orm"],
description: "Hi Guys 👋 Today we are going to see how to paginate our results. So don't waste time and let's...",
originalLink: "https://dev.to/this-is-learning/its-prisma-time-pagination-218e",
coverImg: "cover-image.png",
socialImg: "social-image.png",
collection: "It's Prisma Time",
order: 10
}
---

Hi Guys 👋
Today we are going to see how to paginate our results.
So don't waste time and let's go!

With Prisma there are two ways to paginate results: [Offset pagination](https://www.prisma.io/docs/concepts/components/prisma-client/pagination#offset-pagination) or [Cursor-based pagination](https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination).
What are the differences though?
The first one is used when we need to create a sequence of pages and get their datas according to the page. The second one, instead, is used when we want the items after a specific record, to continue the list after that element.

But let's see an example of both, starting with the first one `skip` and `take`

```ts
{
  const pageOnePosts = await prisma.post.findMany({
    take: 3,
    orderBy: {
      id: "asc",
    },
  });
  console.log(`Page 1: `, JSON.stringify(pageOnePosts, undefined, 2));

  const pageTwoPosts = await prisma.post.findMany({
    skip: 3,
    take: 3,
    orderBy: {
      id: "asc",
    },
  });
  console.log(`Page 2: `, JSON.stringify(pageTwoPosts, undefined, 2));
}
```

The result of this example is this

```json
[
  {
    "id": 1,
    "title": "Post title 1",
    "content": "Post content 1",
    "published": false,
    "createAt": "2022-01-03T10:14:51.274Z",
    "updatedAt": "2022-01-03T10:14:51.274Z"
  },
  {
    "id": 2,
    "title": "Post title 8",
    "content": "Post content 8",
    "published": true,
    "createAt": "2022-01-03T10:14:51.274Z",
    "updatedAt": "2022-01-03T10:14:51.274Z"
  },
  {
    "id": 3,
    "title": "Post title 4",
    "content": "Post content 4",
    "published": true,
    "createAt": "2022-01-03T10:14:51.274Z",
    "updatedAt": "2022-01-03T10:14:51.274Z"
  }
]

[
  {
    "id": 4,
    "title": "Post title 10",
    "content": "Post content 10",
    "published": true,
    "createAt": "2022-01-03T10:14:51.274Z",
    "updatedAt": "2022-01-03T10:14:51.274Z"
  },
  {
    "id": 5,
    "title": "Post title 9",
    "content": "Post content 9",
    "published": false,
    "createAt": "2022-01-03T10:14:51.274Z",
    "updatedAt": "2022-01-03T10:14:51.274Z"
  },
  {
    "id": 6,
    "title": "Post title 6",
    "content": "Post content 6",
    "published": true,
    "createAt": "2022-01-03T10:14:51.274Z",
    "updatedAt": "2022-01-03T10:14:51.274Z"
  }
]
```

As you can see, the first `findMany` has the orderBy and the take options. The orderBy is used to give a sort to our results and the take option is used to get the first 3 elements of the results. In this case the skip option isn't indicated so its value is 0 (default value). Instead, in the second `findMany` method there is also the skip option, and it's indicated with the value 3. In this case, the findMany method returns 3 elements (take: 3) after the third element (skip: 3), so we can see the results of the second page.
I think it's not so difficult to understand it, so let's go on to the cursor implementation.
Let's start from the code

```ts
const pageOnePosts = await prisma.post.findMany({
  take: 3,
  orderBy: {
    id: "asc",
  },
});
console.log(`Page 1: `, JSON.stringify(pageOnePosts, undefined, 2));

const pageTwoPosts = await prisma.post.findMany({
  skip: 1,
  take: 3,
  cursor: {
    id: pageOnePosts[pageOnePosts.length - 1].id,
  },
  orderBy: {
    id: "asc",
  },
});
console.log(`Page 2: `, JSON.stringify(pageTwoPosts, undefined, 2));
```

The results

```json
[
  {
    "id": 1,
    "title": "Post title 1",
    "content": "Post content 1",
    "published": false,
    "createAt": "2022-01-03T10:14:51.274Z",
    "updatedAt": "2022-01-03T10:14:51.274Z"
  },
  {
    "id": 2,
    "title": "Post title 8",
    "content": "Post content 8",
    "published": true,
    "createAt": "2022-01-03T10:14:51.274Z",
    "updatedAt": "2022-01-03T10:14:51.274Z"
  },
  {
    "id": 3,
    "title": "Post title 4",
    "content": "Post content 4",
    "published": true,
    "createAt": "2022-01-03T10:14:51.274Z",
    "updatedAt": "2022-01-03T10:14:51.274Z"
  }
]

[
  {
    "id": 4,
    "title": "Post title 10",
    "content": "Post content 10",
    "published": true,
    "createAt": "2022-01-03T10:14:51.274Z",
    "updatedAt": "2022-01-03T10:14:51.274Z"
  },
  {
    "id": 5,
    "title": "Post title 9",
    "content": "Post content 9",
    "published": false,
    "createAt": "2022-01-03T10:14:51.274Z",
    "updatedAt": "2022-01-03T10:14:51.274Z"
  },
  {
    "id": 6,
    "title": "Post title 6",
    "content": "Post content 6",
    "published": true,
    "createAt": "2022-01-03T10:14:51.274Z",
    "updatedAt": "2022-01-03T10:14:51.274Z"
  }
]
```

As you may notice, the results are the same of the previous example but the implementation is a little bit different in the second part.
In this case, the second findMany has the same orderBy and take options as in the first example, but it has a different skip and uses the cursor option. First let's focus on the cursor option. This option allows us to indicate the last item returns by the previous search, so we can restart our pagination from this element and combining it with the `skip: 1`, we'll get the results after this element.
*It's important to indicate the skip option with the one value, otherwise the element indicates in the cursor is part of the results.*

As you can tell, both implementations are correct but each of them resolve a different type of pagination. Now it's your job to take the right one.

Ok guys that's all!
I hope now you have an idea of how you can paginate your datas using prisma.
In the next article, we are going to see how to aggregate and group the datas.

See you soon!
Bye Bye 👋

*[Here](https://github.com/Puppo/it-s-prisma-time/tree/10-pagination) you can find the code of this article.*
