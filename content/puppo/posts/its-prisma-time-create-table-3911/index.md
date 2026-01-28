---
{
title: "It's Prisma Time - Create Table",
published: "2021-12-21T07:02:02Z",
tags: ["javascript", "typescript", "database", "orm"],
description: "Hello Folks 👋  and welcome back to this series, today it's time to create your first table with...",
originalLink: "https://dev.to/this-is-learning/its-prisma-time-create-table-3911",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "It's Prisma Time",
order: 3
}
---

Hello Folks 👋  and welcome back to this series,
today it's time to create your first table with prisma, are you ready? Then let's go 💪

Before starting, let me explain which type of tables we are going to create in this series. For this series we are going to create a simple db to manage a blog, ok.. not a big and strong blog but an easy blog to focus our learn on the main concepts of prisma. Since we’re talking about blogs, let's start from the post table obviously.
Open the `prisma/schema.prisma` file and append the following snippet.

```ts
model Post {
  id        Int @id @default(autoincrement())
  title     String
  content   String
  published Boolean  @default(false)
  createAt  DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("posts")
}
```

Great! But what did you do adding this code? 🤔
Writing this code you described the entity Post and you indicated to Prisma:

- I want an entity called Post
- This entity has 6 properties
- The id property is of type Integer, it is the primary key of my entity (`@id`) and it must be auto-generated (`@default(autoincrement())`)
- The title property is of type String
- The content property is of type String
- The published property is of type Boolean and its default value is false
- The createAt is of type DateTime and when a new record is inserted, set it with the current date time
- The updatedAt is of type DateTime and when a record is updated, update it with the current date time (`@updatedAt`)
- Call the table "posts" (`@@map("posts")`)

Well, nothing so difficult, just some special syntax to remember.
I don't want to go too deep but If you are interested in the Data model of Prisma [here](https://www.prisma.io/docs/concepts/components/prisma-schema/data-model#defining-models) the link to the documentation.
*N.B. It's important to know well the mapping between the Prisma's types and the native's types of the different database services*

But let's go ahead, you described your entity now I think you want use it.
To use this entity inside of your typescript code, you need to create its typescript definition. To do this, run the following code:

```
npx prisma generate
```

This command adds in you package.json a new dependence `@prisma/client`, and creates a folder `.prisma` inside of your node\_modules folder.
The `@prisma/client` is the package that contains the client to connect to your database, whereas, the .prisma folder contains a file `index.d.ts` that describes the post Entity and all the possible functions to work with this Entity.
Ok, at this point, let's try to get data from this collection of `posts` and to do this let's create a file called `index.ts` inside the src folder and copy the following code. (`src/index.ts`)

```ts
import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
  try {
    const posts = await prisma.post.findMany();
    console.log({ posts });
  } finally {
    prisma.$disconnect();
  }
}

main();
```

In this simple code, you created a connection to your database, found the posts inside the posts collections, and logged the result in the console.
To run this code you have to add this section in your `package.json` file.

```json
...
  "scripts": {
    "dev": "ts-node ./src/index.ts"
  },
...
```

This script permits you to run the code written above.
Ok, it's time to show the result. Run in your terminal the following script.

```
yarn dev
```

![Cat Oh no](./hs567zh06u7hyl20vv4r.jpg)
Ok, maybe that's not the result that you expected but something's gone 😅
The error that you are seeing in your terminal appeared because we haven't a database.... we haven't a database yet 😃
In the next article, I'll show you how to create the database and we'll resolve this terrible mistake, I promise!

I think that could be all for today!
See you soon Guys
Bye Bye 👋

*The code of this article is available [here](https://github.com/Puppo/it-s-prisma-time/tree/03-create-table)*
