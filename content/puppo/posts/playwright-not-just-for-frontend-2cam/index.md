---
{
title: "Playwright - Not just for Frontend",
published: "2023-02-16T07:00:38Z",
edited: "2023-02-21T07:23:26Z",
tags: ["playwright", "apitesting"],
description: "In this path with Playwright we spent a lot of time speaking about e2e tests and component testing in...",
originalLink: "https://blog.delpuppo.net/playwright-not-just-for-frontend",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "20832",
order: 1
}
---


In this path with Playwright we spent a lot of time speaking about e2e tests and component testing in the frontend world. But now its time to spill the beans and tell you a secret. Playwright can be used on the backend side too.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1676058978940/d5057d18-bfd2-4122-be9f-a34480bc702e.gif)

## API Testing

Playwright can test REST API too. In some scenarios, you don't have a UI, but you have an API integration and have to test your integration in some way.  
Using API testing with Playwright, you can call your APIs without a user interface and check their correct execution.

The key volta for doing that on Playwright is the `request` object. Using this object, you can call your APIs and check their result.

But let's take a look at it.

First, I didn't create a backend API for this example, but I used a fake API to test. I created it with json-server and json-server-auth. They are two npm packages that use a JSON file as a database and expose the database in an API. You can find more about json-server in its [documentation](https://github.com/typicode/json-server) and about json-server-auth [here](https://www.npmjs.com/package/json-server-auth).

It's time to understand how API testing works.  
A straightforward example could be this

```ts
test("should call a winner", async ({ request }) => {
  const result = await request.post("http://localhost:3001/api/winners", {
    data: {
      winner: "O",
    },
  });
  expect(result.ok()).toBeTruthy();
  expect(await result.json()).toEqual(
    expect.objectContaining({
      winner: "O",
      id: expect.any(Number),
    })
  );
});
```

This example is to understand the structure of an API test, then you'll see a more complex example.  
The `request` object is exposed by Playwright in each test, like the page object in a standard e2e test in the browser. With this object, you can call one or more HTTP requests. Then, when you have the result of the requests, you can check if the result is ok or if the response respects a specific schema.  
As you can notice, it's elementary

- create a request

- wait for the result

- check the result

Typically, a simple API test has this flow, probably before you could have a login request because your APIs are under authentication, but a login request is just another request before.

I created a more complex example to give you a better idea of the flow you can create with Playwright and API testing (This approach could be used with e2e tests too).

The example is so structured. For each test, the suite:

- creates a new json-server database

- creates a new json-server process

- runs the tests

- kill the json-server

- delete the temporary database

Let's start from the beginning. I created two files for the tests. One file is the database with one row for the winners and one user inside. The other file is the route file to make a sort of authentication in the API. (you can learn more about that following the json-server documentation seen before).

So these two files are in the db folder and appear in this way

```json
// db_test.json
{
  "users": [
    {
      "email": "test@test.it",
      "password": "$2a$10$ONSI/ac5n4iyMj7LfcRIsOzYQ8dqPYK33TTH1Qp7YORPjvofkoTgS",
      "id": 1
    }
  ],
  "winners": [
    {
      "winner": "X",
      "createdAt": "2023-01-16T21:06:20.749Z",
      "id": 1
    }
  ]
}
```

```json
// routes_test.json
{
  "/api/*": "/$1",
  "users": 600,
  "winners": 664
}
```

Now it's time to create a routine for each test that gets these two files, creates a copy of the database, and runs the json-server in a specific port. In this way, if we have many tests in parallel, each test doesn't depend on the actions done in the other tests.

To do that, I created this code

```ts
// api.spec.ts
import { expect, test } from "@playwright/test";
import { ChildProcess, exec } from "child_process";
import { randomUUID } from "crypto";
import { copyFile, unlink } from "fs/promises";
import { join } from "path";

const dbName = `db_test_${randomUUID()}.json`;

const dbInitPath = join(process.cwd(), "db", "db_test.json");
const dbPath = join(process.cwd(), "db", dbName);

const portsMapping = {
  chromium: 3001,
  firefox: 3002,
  webkit: 3003,
} as const;
let port: 3001 | 3002 | 3003;
let baseUrl: string;
let api_process: ChildProcess;

test.beforeAll(async ({ browserName }) => {
  port = portsMapping[browserName];
  baseUrl = `http://localhost:${port}/api`;
  // Create a file to be uploaded
  await copyFile(dbInitPath, dbPath);

  // Start the server
  await new Promise<void>((resolve, reject) => {
    api_process = exec(
      `npx json-server-auth --watch ${dbPath} --port ${port} --routes db/routes_test.json`,
      err => {
        if (err) reject(err);
      }
    );

    api_process.stdout?.on("data", data => {
      if (data.includes("Watching...")) {
        setTimeout(() => {
          resolve();
        }, 10);
      }
    });
  });
});
```

There are some critical points in this code:

```ts
const dbName = `db_test_${randomUUID()}.json`;

const dbInitPath = join(process.cwd(), "db", "db_test.json");
const dbPath = join(process.cwd(), "db", dbName);
```

Here I created two new variables, one contains the path of the init database file, and the second one is the path for the database used by the test.

Then I mapped each browser in different ports, so if the tests run in parallel, there aren't problems of concurrency in the same database. (If your suite is only for API testing you can run the suite only with one browser, in this case, I kept the suite like in the previous articles)

```ts
const portsMapping = {
  chromium: 3001,
  firefox: 3002,
  webkit: 3003,
} as const;
let port: 3001 | 3002 | 3003;
```

In the beforeAll hook, I created the copy of the database, and then I ran the json-server process to expose the API.

```ts
test.beforeAll(async ({ browserName }) => {
  port = portsMapping[browserName];
  baseUrl = `http://localhost:${port}/api`;
  // Create a file to be uploaded
  await copyFile(dbInitPath, dbPath);

  // Start the server
  await new Promise<void>((resolve, reject) => {
    api_process = exec(
      `npx json-server-auth --watch ${dbPath} --port ${port} --routes db/routes_test.json`,
      err => {
        if (err) reject(err);
      }
    );

    api_process.stdout?.on("data", data => {
      if (data.includes("Watching...")) {
        setTimeout(() => {
          resolve();
        }, 10);
      }
    });
  });
});
```

It seems a bit strange, but as you can see, in this way, I simulated a new database for each test file, so each test has its database and doesn't depend on the other tests.

As you can imagine, in this way, you can create a clean environment for each test.

Then I added another hook, the afterAll, where I killed the API process and deleted the database file.

```ts
test.afterAll(async () => {
  console.log("Kill server", baseUrl);
  api_process.kill();
  await unlink(dbPath);
});
```

Then I created the first test that checks if the result of the get method returns an array of winners.  
This is easy peasy

```ts
test("should return an array of winner", async ({ request }) => {
  const result = await request.get(`${baseUrl}/winners`);
  expect(result.ok()).toBeTruthy();
  expect(await result.json()).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        winner: expect.stringMatching(/^O|X$/),
        id: expect.any(Number),
      }),
    ])
  );
});
```

I can call the API and get the result using the request object, and then I can check if the result is ok and if the response is like expected.  
This example is pretty simple, so I don't want to spend too much time on it; I guess it is comprehensible.  
But now it's time to move to another example that is a bit more complex.  
The test has to test the insert in the winners' collection. To do this action, the user must be logged in, so before doing the post, we have to login into the API. The result is something like this.

```ts
test("should insert a winner", async ({ request }) => {
  console.log("Testing the server", baseUrl);
  const loginResult = await request.post(`${baseUrl}/login`, {
    data: {
      email: "test@test.it",
      password: "test",
    },
  });
  expect(loginResult.ok()).toBeTruthy();
  const { accessToken } = await loginResult.json();
  const result = await request.post(`${baseUrl}/winners`, {
    data: {
      winner: "O",
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  expect(result.ok()).toBeTruthy();
  expect(await result.json()).toEqual(
    expect.objectContaining({
      winner: "O",
      id: expect.any(Number),
    })
  );
});
```

As you can see, in this example, I created a flow of authentication, and then the test moves to the post request for the winners if it is ok. Yes, probably if you are familiar with testing; this is not rocket science, but you can see how it's easy to create API testing with Playwright.

So far so good; in this article, you discovered API testing with Playwright and a medium example of how you can create a flow of API testing with Playwright.

That's all folks!  
I hope you enjoyed it and see you soon!

Bye bye 👋

_N.B. you can find the code of this article_ [_here_](https://github.com/Puppo/playwright-series/tree/10-api-testing)

{% embed https://dev.to/puppo %}