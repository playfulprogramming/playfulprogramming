---
{
title: "It's Prisma Time - Delete",
published: "2022-01-05T07:20:02Z",
tags: ["javascript", "typescript", "database", "orm"],
description: "Hi Guys 👋  today we are going to see the delete operation.  Before moving to the delete operation, in...",
originalLink: "https://https://dev.to/playfulprogramming/its-prisma-time-delete-4036",
coverImg: "cover-image.png",
socialImg: "social-image.png",
collection: "It's Prisma Time",
order: 7
}
---

Hi Guys 👋
today we are going to see the delete operation.

*Before moving to the delete operation, in the code of this article I added the next snippet of code at the beginning, so every time you run the code you have some records in your database.*

```ts
const authors = await Promise.all(
  [1, 2, 3].map(
    async i =>
      await prisma.author.create({
        data: {
          firstName: `First name ${i}`,
          lastName: `Last name ${i}`,
        },
      })
  )
);
```

The delete operation in Prisma can be done in two ways: the deletion of one record and the deletion of multiple records.
Let's start from the first one and let's see the next code

```ts
const deletedAuthor = await prisma.author.delete({
  where: {
    id: authors[0].id,
  },
});
```

As you can see, the delete method is quite simple, you need to follow this pattern `prisma.[entity].delete`, the where field must have the primary key of the record that has to be deleted.
It's important to remember that if this method doesn't find a record to delete, throws an Exception that you can handle in this way

```ts
try {
  const deletedAuthor = await prisma.author.delete({
    where: {
      id: 1,
    },
  });
  console.log({ deletedAuthor });
} catch (error) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  ) {
    console.log("Author not found");
  } else console.error(error);
}
```

*If you are interested in seeing all the possibile errors returned by Prisma you can find the documentation [here](https://www.prisma.io/docs/reference/api-reference/error-reference)*

Let's bring the delete to the next level and let's see the deleteMany method.
I think you already have understood that this method allows you to delete multiple records in one step, but let me show you an example.

```ts
const deletedAuthorsResult = await prisma.author.deleteMany({
  where: {
    id: {
      in: authors.map(a => a.id),
    }
  },
});
```

As you can see, this method isn't so different from the delete, but the differences are in the where field and in this method you can filter the datas like in a SQL where.
In this particular case the code deletes the records that have the id contained in the array passed by the authors collection.
Another difference between the deleteMany and the delete is the result's type. The deleteMany returns an object with a single property called `count` and it contains the amount of the records effected by the delete operation.

Now, I would spend some words about the "where" because it exposes a lot of possibilities to search the records that we want to delete.
Thus I want to start this explanation from the "author where"'s typescript definition.

```ts
export type AuthorWhereInput = {
  id?: IntFilter | number
  firstName?: StringFilter | string
  lastName?: StringFilter | string
  comments?: CommentListRelationFilter
  posts?: AuthorsOnPostListRelationFilter
  AND?: Enumerable<AuthorWhereInput>
  OR?: Enumerable<AuthorWhereInput>
  NOT?: Enumerable<AuthorWhereInput>
}
```

As you can see, this type has some strange things, but if you are familiar with the SQL, I think you have an idea of what you can do.
Don't waste time and let's start from the `id`.
The id field can have two values, either a number or `IntFilter`. At this point, if you need to find your record using the id, you can pass your value to this field, else if you want to delete records using more complex search terms you can use the `IntFilter`, which is composed thus

```ts
export type IntFilter = {
  equals?: number
  in?: Enumerable<number>
  notIn?: Enumerable<number>
  lt?: number
  lte?: number
  gt?: number
  gte?: number
  not?: NestedIntFilter | number
}
```

As you can image this type represents the common operations that you can do in SQL with the numbers:

- equals: checks if the value is equal to the passed value
- in: checks if the value is inside of the list of numbers that you pass
- notIn: is the opposite of `in`
- lt: checks if the value is less than the passed value
- lte: checks if the value is less or equal to the passed value
- gt: checks if the value is greater than the passed value
- gte: checks if the value is greater or equal to the passed value
- not: checks if a value is not of the passed value, or you can also set it with the type `NestedIntFilter`, which is another type equal to the `IntFilter`, and it allows you to create your filters using the positive search terms and check if the records respect the opposite.
  As you may imagine, there are other three types similar to: StringFilter, BoolFilter and DateTimeFilter, and each one depends from the column's type that you are testing.
  DateTimeFilter is equal to the IntFilter expect that works
  with the Date. BoolFilter contains only the `equals` and the `not` operations for obvious reasons. The StringFilter in addition to the operations exposed by the IntFilter has other three operations: `contains`, `startsWith` and `endsWith` (I won't describe these operations because I think they speak by themselves).
  After this explanation, I think you have understood also the fields: `firstName`, `lastName`.
  Now I want to go on to the `posts` and `comments` fields, that have the same approach.
  These fields allow you to check some particular cases inside the posts or the comments related to the record. Each field allows you to do these three operations `every`, `some` and `none`

```ts
export type CommentListRelationFilter = {
  every?: CommentWhereInput
  some?: CommentWhereInput
  none?: CommentWhereInput
}

export type AuthorsOnPostListRelationFilter = {
  every?: AuthorsOnPostWhereInput
  some?: AuthorsOnPostWhereInput
  none?: AuthorsOnPostWhereInput
}
```

Using these filters you can check inside of the posts or the comments relative to the Author, so you can check:

- if `every` post/comment has a particular value or more particular values
- if `some` post/comment has a particular value or more particular values
- if `none` post/comment has a particular value or more particular values
  It's not so difficult to understand it but I recommend you to play with them.

Now it's time to see the last three operations: `AND`, `OR` and `NOT`.
I think you already understood their goals, but let me spend some words.
These three operations let you to combine multiple filters using the operation AND OR NOT. You can combine together these operations and you can also nest them. For instance, you can use the AND and the OR in the first level of your filter, and use the NOT and the OR inside the AND filter.
I think an example can give the idea.

```ts
const deletedAuthorsResult = await prisma.author.deleteMany({
  where: {
    AND: [
      {
        NOT: {
          id: 10,
        },
      },
      {
        OR: {
          firstName: {
            startsWith: "name",
          },
        },
      },
    ],
    OR: [
      {
        posts: {
          every: {
            post: {
              updatedAt: {
                lt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
              },
            },
          },
        },
      },
    ],
  },
});
```

As you can see, you can do every type of check in you delete using the `deleteMany` and I think the definition types created by the Prisma team are a good friends to prevent errors. It's obvious that they don't create the right query for you, that's your work. 💪

That's all for today guys!
I hope I let you a good introduction about the delete in prisma and that now you are ready to go to try it by yourself.
In the next article it's time to speak about the update operation, so see you soon folks!

Bye Bye! 👋

*The code of this article is available [here](https://github.com/Puppo/it-s-prisma-time/tree/07-delete)*
