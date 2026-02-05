---
{
title: "It's Prisma Time - Logging",
published: "2022-01-26T06:50:45Z",
tags: ["javascript", "typescript", "database", "orm"],
description: "Hi Guys 👋  Today we are going to see how to enable logging in Prisma, so don't waste time and let's...",
originalLink: "https://dev.to/this-is-learning/its-prisma-time-logging-4i7m",
coverImg: "cover-image.png",
socialImg: "social-image.png",
collection: "It's Prisma Time",
order: 13
}
---

Hi Guys 👋
Today we are going to see how to enable logging in Prisma, so don't waste time and let's start!

In Prisma we have 4 type of logging

- query: this level of log allows us to see the queries created by Prisma to perform our operations
- info
- warn
- error

*I think the last three levels of log don’t need a description if you’re a developer.*
We can enable all of them or only those are necessary.
By default these logs are written in the stdout, but we can also send them in an event and handle them as we prefer.

*P.S. if you are in development mode, you can enable all of these log levels setting the DEBUG environment variable to true*

But let's see how to enable these logs.

```ts
const prisma = new PrismaClient({
    log: [
      {
        emit: "event",
        level: "query",
      },
      "info",
      "warn",
      "error",
    ],
  });
  prisma.$on("query", e => {
    console.log("Query: " + e.query);
    console.log("Duration: " + e.duration + "ms");
  });
```

The log option accepts an array of log levels that can be simple strings (query, info, warn, or error) or objects composed of two fields: level and emit. The level field can have query, info, warn, or error as values; whereas the emit field can have two values: stdout or event. If the "emit" value is equal to "stdout", the result of this log level will be written in the console, otherwise, if the value is "event", the result must be handled by a subscriber.
But let’s clarify and see how to manage these logs.

```ts
const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    "info",
    "warn",
    "error",
  ],
});
prisma.$on("query", e => {
  console.log("Query: " + e.query);
  console.log("Duration: " + e.duration + "ms");
});
```

In this snippet of code, you can see how to enable the log levels and how to handle a subscriber of a specific type of log level.
As you can see, it's not difficult to enable logs but it's important to remember to do it in the right way in base of the environment where our software is running.
It's also possibile, as you can tell, to subscribe to the events of a log using the `$on` method. By using this method you can send where you want all your logs.
The last thing that I want to leave you is an example of a query logged in the console.

```console
SELECT `main`.`posts`.`id`, `main`.`posts`.`title`, `main`.`posts`.`content`, `main`.`posts`.`published`, `main`.`posts`.`createAt`, `main`.`posts`.`updatedAt` FROM `main`.`posts` WHERE `main`.`posts`.`published` = ? LIMIT ? OFFSET ?
```

As you can see, you can get the real SQL query executed by Prisma, and you can copy and past it in other SQL tool to check its plan or everything else.
In this way, we can check if we have a slowdown and if we need to write our own query.
The How is the goal of the next article 😁

So that's all for now folks. In the next article, we are going to see how to execute own queries using Prisma.

See you soon guys
Bye Bye 👋

*You can find the code of this article [here](https://github.com/puppo/it-s-prisma-time/tree/13-logging-query)*
