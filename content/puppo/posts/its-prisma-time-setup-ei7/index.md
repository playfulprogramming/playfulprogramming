---
{
title: "It's Prisma Time - Setup",
published: "2021-12-16T07:03:17Z",
tags: ["javascript", "typescript", "database", "orm"],
description: "Hi Guys, welcome to the second article of this series.  Today I'll show you how to setup a project...",
originalLink: "https://dev.to/this-is-learning/its-prisma-time-setup-ei7",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "15827",
order: 1
}
---

Hi Guys,
welcome to the second article of this series.

Today I'll show you how to setup a project with Prisma.
This project in addition to prisma uses typescript, but let's start.

The first thing that you need to do is to initialize a folder as a node project. To do this you need to run the following command in your terminal. (I used yarn but if you prefer npm or something else feel free to use it)

```
yarn init -y
```

I suppose that if you are here you know what you did running this command.
We go on and add now to our workspace some dependencies using the next command.

```
yarn add -d typescript @types/node ts-node prisma
```

The first three dependencies are related to typescript and they are necessary to use typescript in our project, the last one is the [Prisma CLI](https://www.prisma.io/docs/reference/api-reference/command-reference). The Prisma CLI helps us to create, update or view our database, it is easy to use and it hasn't a lot of commands to remember.
Now it's time to create our Prisma schema, for this series I decided to use SQLite as database service because it's the easiest to set up. Run the following command to generate the schema.

```
npx prisma init --datasource-provider sqlite
```

As you can see, this command created a file `schema.prisma` inside of the folder `prisma`.
In this file, you can see two sections: client and db.
The client section is used to identify the provider used to manage the connection with the source, whereas in the db section you can find the connection string to the database and the provider to identify the type of the source, in our case `SQLite`.
The schema file is the single source of truth when we use Prisma, in this file, we add all the entities and all their relations. From this file, Prisma can generate our typescript types related to the entities and it can create our migration scripts to upgrade the schema of our source.
As you can see, the schema file needs to access an environment variable(DATABASE\_URL), so to do this, it was created a file `.env` in the root of the project where inside we can find this variable.

The last thing I want to leave you today is related to the parameter `--datasource-provider` in the script. By default, if you don't pass this parameter the script uses PostgreSQL as database service, so if you need to use a different service you need to specify it using the `--datasource-provider` parameter.

I think this is all for today. In the next article we are going to create our first table with Prisma and we are going to start playing with this tool.

Ok guys, see you soon 👋

*You can find the code of this article [here](https://github.com/Puppo/it-s-prisma-time/tree/02-setup)*
