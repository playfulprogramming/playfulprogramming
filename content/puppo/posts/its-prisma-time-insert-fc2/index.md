---
{
title: "It's Prisma Time - Insert",
published: "2021-12-30T07:06:20Z",
tags: ["javascript", "typescript", "database", "orm"],
description: "Welcome Guys, Today it's time to add some records to the database 😁 so don't waste time and get your...",
originalLink: "https://dev.to/this-is-learning/its-prisma-time-insert-fc2",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "It's Prisma Time",
order: 6
}
---

Welcome Guys,
Today it's time to add some records to the database 😁 so don't waste time and get your hand dirty.

Let's start from a simple insert that adds an author, in your `src/index.ts` copy the next example.

```ts
import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
  try {
    const newAuthor = await prisma.author.create({
      data: {
        firstName: "John",
        lastName: "Doe",
      },
    });
    console.log({ newAuthor });
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
```

In this code you created a simple insert that adds an author.
By using the patter `prisma.[entity].create` you can insert in your db your entities, but let's see this code in action executing the next two script

```
npx prisma db push
yarn dev
```

```json
{ newAuthor: { id: 1, firstName: 'John', lastName: 'Doe' } }
```

As you can see it's not so hard to insert a record, but it's time to take the insert to the next level.
Imagine that you want to insert a Post with one Comment in a single execution, how can you do that?
Well, add to the previous code the next one, below the `console.log({ newAuthor });`.

```ts
...
const newPost = await prisma.post.create({
  data: {
    title: "First Post",
    content: "This is the first post",
    published: false,
    comments: {
      create: {
        text: "First comment",
        author: {
          connect: {
            id: newAuthor.id,
          },
        },
      },
    },
  },
  include: {
    comments: true,
  },
});

console.log("newPost", JSON.stringify(newPost, null, 4));
...
```

And now run the code using

```
npx prisma db push
yarn dev
```

after that you can see this result

```
newPost {
    "id": 7,
    "title": "First Post",
    "content": "This is the first post",
    "published": false,
    "createAt": "2021-12-18T12:29:20.982Z",
    "updatedAt": "2021-12-18T12:29:20.982Z",
    "comments": [
        {
            "id": 7,
            "text": "First comment",
            "postId": 7,
            "authorId": 7
        }
    ]
}
```

But what happened?
By running this code you added in you database a post and a comment related to this post using a single command. I think you agree with me that it is a common feature in an ORM. But let's see better the create method and its parameters.
Let's start from the `data` field, this field allows you to indicate all the fields related to your entity, in this case the Post Entity. When I say the entity's fields I am referring to the own fields but also to the fields of its related Entities as you did with the Comment Entity in the previous example.
But let's move on and see another particularity in this example. To add the comment related to your post you used this snippet of code

```ts
...
comments: {
  create: {
    text: "First comment",
    author: {
      connect: {
        id: newAuthor.id,
      },
    },
  },
},
...
```

The first thing that comes to our attention is the create field. This field is not a field of the Comment Entity but is a command for Prisma. Using the [create](https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#create-a-related-record) command you are indicating to Prisma that you want to insert a new record in the comment table. The data relative to the comment are indicated inside of the create object just described. Okay but let’s look into this object where there is another peculiarity inside the field author. As you can see inside it there is a field called `connect`, but what is it? The [connect](https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#connect-an-existing-record) field is another command for Prisma. This command indicates to Prisma that the Author's record already exists in the database and it must not create it but it only needs to create the link between the comment record and the author record.
There is another command for Prisma to manage the insert of an entities and it is `connectOrCreate`. This command allows us to check if the relative record exists and in this case Prisma creates the link between the entities, otherwise if it doesn't exist Prisma creates also this new record. To give you an example, here, the author connect command rewrites with the `connectOrCreate`.

```ts
author: {
  connectOrCreate: {
    create: {
      lastName: "Last name",
      firstName: "First name",
    },
    where: {
      id: newAuthor.id,
    },
  },
},
```

When you insert a new record, all the crud operations in your database are made under a transaction, so if in your insertion you have an entity with 3 sub-entities, you'll get the success result only if all operations will be successful, otherwise you'll get an error and your database will be left clean as before the execution.

There is also a `createMany` method that allows you to do a bulk insert inside a collection. It isn't so different from the `create` method. I leave you the link to the documentation [here](https://www.prisma.io/docs/concepts/components/prisma-client/crud#create-multiple-records).
*N.B. createMany isn't supported in SQLite, Prisma helps you on that and when generates the definitions of the client, it detects the current connector and generates only the definitions supported by the connector*

Last but not least, Prisma exposes you a specific type for typescript that describes how you can call the create method in a type safe context. Next the author insert reviews with this type

```ts
import { Prisma, PrismaClient } from "@prisma/client";

...
const authorCreate: Prisma.AuthorCreateArgs = {
      data: {
        firstName: "John",
        lastName: "Doe",
      },
    };

    const newAuthor = await prisma.author.create(authorCreate);
...
```

Prisma does this work for all the entities that you described in the `prisma.schema` file and it doesn't just make this, but we will go deep into this in the next articles.

I think today you have got many notions about the insert with prisma. If you are interested in go in depth on the insert with prisma [here](https://www.prisma.io/docs/concepts/components/prisma-client/crud#create) the link to the official documentation.

That’s it guys.
In the next article we’re going to see the delete operation.

See you soon.
Bye Bye 👋

*You can find the code of this article [here](https://github.com/Puppo/it-s-prisma-time/tree/06-insert)*
