---
{
title: "It's Prisma Time - Migrations",
published: "2022-02-02T07:36:09Z",
tags: ["javascript", "typescript", "database", "orm"],
description: "Hello Guys 👋, Today it's time to speak about migrations.  Migrations in Prisma are managed by Prisma...",
originalLink: "https://https://dev.to/playfulprogramming/its-prisma-time-migrations-7pk",
coverImg: "cover-image.png",
socialImg: "social-image.png",
collection: "It's Prisma Time",
order: 15
}
---

Hello Guys 👋,
Today it's time to speak about migrations.

Migrations in Prisma are managed by *Prisma Migrate*.
Prisma Migrate is an imperative database schema migration tool that enables you to:

- Keep your database schema in sync with your Prisma schema as it evolves and
- Maintain existing data in your database

To see how it works, today we'll recreate all the schema used in this series, so let's started.

## First migration

Before creating our first migration, we need to create our schema, thus in the `prisma/schema.prisma` we will create the entities: Post, Author and AuthorsOnPost. To do that, we need to add in `prisma/schema.prisma` this code.

```
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Post {
  id        Int @id @default(autoincrement())
  title     String
  content   String
  published Boolean  @default(false)
  createAt  DateTime @default(now())
  updatedAt DateTime @updatedAt

  authors   AuthorsOnPost[]

  @@map("posts")
}

model Author {
  id        Int @id @default(autoincrement())
  firstName String
  lastName  String
  age       Int
  posts     AuthorsOnPost[]

  @@map("authors")
}

model AuthorsOnPost {
  author    Author @relation(fields: [authorId], references: [id])
  authorId  Int
  post      Post @relation(fields: [postId], references: [id])
  postId    Int

  @@id([authorId, postId])
  @@map("authors_on_post")
}
```

Once this is done, we can generate our first migration using this command

```cli
npx prisma migrate dev
```

This command generates our first migration for us.
If you take a look at your project, you can notice that you have a new folder called migration inside the Prisma folder. Inside this folder, there is another folder whose name is the timestamp of when you have executed the migration command. The format is YYYYmmDDhhMMss.
If you open this folder, you find a file called `migration.sql`, where you can see inside the scripts to generate the schema of your database.
In this case, in this file, there are 3 CREATE TABLE commands, each for every entity (Author, Post, AuthorsOnPost).
Prisma allows us to indicate migration's name too by using the `--name` option. Therefore the previous command could be executed in this way

```cli
npx prisma migrate dev --name create_post_and_author_entities
```

By doing that, the migration's folder adds to its name this name immediately after the timestamp. Thus we have a migration with info about what it does.

*Important*
When we run the migrate command, Prisma updates our local database too.

## Second migration

Now we want to add the Comment entity to our schema.
First of all we have to create it in the Prisma Schema adding this code in the `prisma/schema.prisma` file

```prisma
model Comment {
  id        Int @id @default(autoincrement())
  text      String
  post      Post @relation(fields: [postId], references: [id], onDelete: NoAction, onUpdate: Cascade)
  postId    Int
  author    Author? @relation(fields: [authorId], references: [id], onDelete: SetNull, onUpdate: Cascade)
  authorId  Int?

  @@map("comments")
}
```

Once this is done, we need to update the entities Author and Post adding the collections of comments. To do this, you need to add these lines of code

```prisma
model Post {
  ...
  comments  Comment[]
  ...
}

model Author {
  ...
  comments  Comment[]
  ...
}
```

Now it's time to create our second migration using the next command

```cli
npx prisma migrate dev --name add_comment_entity
```

As you can see, now we have another folder in the migration folder that contains the last migration.

## Rename a field

How we can notice, updating our schema is not so difficult using the migrate command, unless we have to rename one or more fields.
When we have to rename a field, the Prisma Migrate tool works in this way

1. CREATE a new column
2. DROP the existing column and the data in that column

as you can imagine, by doing that, we'll lose our data.
But how can we handle these changes then?
To handle these changes is possible using a single migration but in different steps.

1. Rename the column
2. Create the migration
3. Edit the migration
4. Execute the migration

But let's see that in action.
Imagine we want to rename the field firstName and lastName of the Author entity with givenName and familyName. The first action to do is rename these fields to our schema. Then update the `prisma/schema.prisma` in this way.

```prisma
model Author {
  ...
  givenName   String
  familyName  String
  ...
}
```

After that it's time to create our migration. This time though, we'll use a special option `--create-only`. This option allows us to create the migration script but this time the migration doesn't execute yet.
Now execute the following command

```cli
npx prisma migrate dev --name rename_author_columns --create-only
```

This command generates the new migration file but now we have to edit it to avoid data loss.
If we open this file, we'll find it in this situation.

```sql
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_authors" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "givenName" TEXT NOT NULL,
    "familyName" TEXT NOT NULL,
    "age" INTEGER NOT NULL
);
INSERT INTO "new_authors" ("age", "id") SELECT "age", "id" FROM "authors";
DROP TABLE "authors";
ALTER TABLE "new_authors" RENAME TO "authors";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
```

As you can notice, all the data inside of the columns firstName and lastName will be lost.
To prevent this loss we need to update the insert command.
We can rewrite our insert in this way

```sql
INSERT INTO "new_authors"
  ("id", "age", "givenName", "familyName")
SELECT
  "id", "age", "firstName", "lastName"
FROM "authors";
```

Now it's time to do the last step to make this migration real

```cli
npx prisma migrate dev
```

By running this command our migration will be executed and our database will be updated.

As you can see, Prisma Migrate is a powerful tool that can help us but if we don't pay attention we could get hurt.

If you are interested in going in-depth into migrations, I let you some links about it:

- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Migration in Development](https://www.prisma.io/docs/concepts/components/prisma-migrate#development-environments)
- [Migration in Production](https://www.prisma.io/docs/concepts/components/prisma-migrate#production-and-testing-environments)
- [Customizing Migration](https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate/customizing-migrations)

Ok Guys, it's all for today!
In the next article we are going to speak about seeding.

See you soon
Bye Bye 👋

*The code of this article can be find [here](https://github.com/Puppo/it-s-prisma-time/tree/15-migrations)*
