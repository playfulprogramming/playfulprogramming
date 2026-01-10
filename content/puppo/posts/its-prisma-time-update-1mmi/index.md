---
{
title: "It's Prisma Time - Update",
published: "2022-01-07T08:00:45Z",
tags: ["javascript", "typescript", "database", "orm"],
description: "Hi Folks 👋 Today it's time to learn something about the update operation, so don't waste time and...",
originalLink: "https://dev.to/this-is-learning/its-prisma-time-update-1mmi",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "15827",
order: 1
}
---

Hi Folks 👋
Today it's time to learn something about the update operation, so don't waste time and let's go!

The update method in Prisma is not that different from the insert. Let's give an example.
Starting from the code of the previous article, you can remove all the code relative to the delete operation and after the insert you can add the following code.

```ts
const updatedAuthor = await prisma.author.update({
  data: {
    firstName: "Updated first name",
    lastName: "Updated last name",
  },
  where: {
    id: authors[0].id,
  },
});
console.log({ updatedAuthor });
```

As you can see, the update method used the patter `prisma.[entity].update`, not so different from the insert and the delete, obviously the update method updates an existing row. And another thing, if the update method doesn't find the record, it throws an exception that you have to handle in your code.
If you execute that code you get this result.

```json
{
  updatedAuthor: {
    id: 3,
    firstName: 'Updated first name',
    lastName: 'Updated last name'
  }
}
```

I think this operation is easy to understand, but now let me show you some special features that the update method exposes.
In some cases, when we want to update a row, we don't want to set a new value, but we want to `increment`, `decrement`, `multiply` or `divide` a field in a [atomic update operation](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#atomic-number-operations). To do this Prisma exposes us these commands in the type `IntFieldUpdateOperationsInput`

```ts
export type IntFieldUpdateOperationsInput = {
  set?: number
  increment?: number
  decrement?: number
  multiply?: number
  divide?: number
}
```

and we can use it in this way

```ts
const updatedAuthor = await prisma.author.update({
  data: {
    id: {
      increment: 1
    }
  },
  where: {
    id: authors[0].id,
  },
});
```

Obviously, incrementing the primary key doesn't have sense, but this is just a demonstrative example.
Let's go on and see another important feature exposed by the update operation, to work with the relative collections.
In the insert operation, we saw that when we want to insert a new record, we can use [create](https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#create-a-related-record), [connect](https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#connect-an-existing-record) or [connectOrCreate](https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#connect-or-create-a-record) operation to create a relation between two records. In the update operation in addition we have:

- [upsert](https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#update-or-create-a-related-record): update or create a related record
- [set](https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#disconnect-all-related-records): connect the record with an existing records, *(if you set this field with an empty you disconnect all record)*
- [disconnect](https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#disconnect-a-related-record): remove the relation with existing records
- [delete](https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#delete-specific-related-records): delete the record in relation with it
- [update](https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#update-a-specific-related-record): update the related record
- [updateMany](https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#update-all-related-records-or-filter): update the related records
- [deleteMany](https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#delete-all-related-records): delete the related records

I let you the official document for each type, so you can deepen if you are interested.

As you can imagine, over the update operation there is the updateMany operation. In this article I prefer not to look into this operation because I have already left you many info about the update. But let me spend some words about it, so you can try it by yourself.
The updateMany operation combine the `where` seen in the deleteMany operation with the features explained above, so it's obvious to understand that this operation allows you to update many records, using a complex filter.

It's all for today guys.
In the next article it's time to see the select operation.

See you soon
Bye Bye 👋

*You can find the code of this article [here](https://github.com/Puppo/it-s-prisma-time/tree/08-update)*
