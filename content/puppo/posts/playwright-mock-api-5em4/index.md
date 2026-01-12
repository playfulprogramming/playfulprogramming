---
{
title: "Playwright - Mock API",
published: "2023-01-26T07:32:48Z",
edited: "2023-02-21T07:21:43Z",
tags: ["playwright", "e2e", "mocking", "api"],
description: "Hi there, Today I want to talk about how to mock API with Playwright.  To do that, I add a new...",
originalLink: "https://blog.delpuppo.net/playwright-mock-api",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "Playwright",
order: 8
}
---

Hi there,\
Today I want to talk about how to mock API with Playwright.

To do that, I add a new feature to the usual example. When one of the players wins, the system sends a POST request to the URL `http://localhost:3001/api/winners` to save the history of the results of the games.

The API server is built using [json-server](https://github.com/typicode/json-server). You can find all the steps to reproduce the feature in this [commit](https://github.com/Puppo/playwright-series/commit/55467d588c7017bb1c8b851ba17b38fe9faa070c).

## Mock API

Mocking API is a common feature in testing frameworks. In Playwright, to do that, you have to use the `page.route` method. This method permits you to work with API in different ways:

- Mocking responses

- Modify requests

- Modify responses

- Abort requests

Any request that a page does, including XHRs and fetch requests, can be tracked, modified and mocked in Playwright using `page.route`.

## Mock API in action

In this article, I want to show you how to start to use this API.\
Let's start with the test. The test is straightforward; it reproduces a game where the Player `X` wins and, in the end, checks if the application fetches the POST request to save the winner.

The test's base is composed in this way

```ts
test("should register the winner calling the winner API[POST]", async ({
  page,
  playerXWinMoves,
}) => {
  /// mock the API
  for (const move of playerXWinMoves) {
    await page.locator(`button:nth-child(${move})`).click();
  }
});
```

As you can see, the test is similar to the previous one.

Now it's time to see how you can mock the API.

First, you have to get your API; to do this, you have to use the `page.route` that way.

```ts
page.route("http://localhost:3001/api/winners", async route => {   
});
```

So, as you can notice, the `page.route` method accepts two parameters: the first is the URL of your API, and the second is a function used to work with your request.

Now it's time to get info from your request, for instance, the method and the body of the request.

```ts
page.route("http://localhost:3001/api/winners", async route => {
  const request = route.request();
  const method = await request.method();
  const postData = await request.postDataJSON();
});
```

Very simple, as you can see, it's important to remember that all the methods of the request return a Promise, and you have to use the await keyword to get the value.

Now, another important feature when you want to mock API is to return custom responses.

```ts
page.route("http://localhost:3001/api/winners", async route => {
  const request = route.request();
  const method = await request.method();
  const postData = await request.postDataJSON();

  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify(Object.assign({ id: 1 }, postData)),
  });
});
```

Using `route.fulfill` you can mock the response. You can set the status code, content type, body, etc. In this way, you have all the power to work with the response.

Perfect, you have all the tools to mock the request. But before closing, I want to leave you another tip. You can use the `page.route` as the assertion of your test.

Let's see an example

```ts
page.route("http://localhost:3001/api/winners", async route => {
  const request = route.request();
  const method = await request.method();
  const postData = await request.postDataJSON();

  expect(await request.method()).toBe("POST");
  expect(await request.postDataJSON()).toEqual(
    expect.objectContaining({
      winner: expect.stringMatching("X"),
      createdAt: expect.any(String),
    })
  );

  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify(Object.assign({ id: 1 }, postData)),
  });
});
```

As you can notice, you can use the `expect` function also inside of the `page.route`. So you can check if the request is called and in the right way.

To close the article, here you can find the entire test.

```ts
test("should register the winner calling the winner API[POST]", async ({
  page,
  playerXWinMoves,
}) => {
  page.route("http://localhost:3001/api/winners", async route => {
    const request = route.request();
    const method = await request.method();
    const postData = await request.postDataJSON();

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(Object.assign({ id: 1 }, data)),
    });

    expect(await request.method()).toBe("POST");
    expect(await request.postDataJSON()).toEqual(
      expect.objectContaining({
        winner: expect.stringMatching("X"),
        createdAt: expect.any(String),
      })
    );
  });

  for (const move of playerXWinMoves) {
    await page.locator(`button:nth-child(${move})`).click();
  }
});
```

Ok, I think that's all from Mocking API. Now you have all the notions to start mocking API with Playwright, and if you have any doubt, you can reach out to me without problems or check the official [documentation](https://playwright.dev/docs/mock).\
I hope you enjoyed this content.

See you soon folk!

Bye bye 👋

*You can find the code of this article* [*here*](https://github.com/Puppo/playwright-series/tree/08-mockapi)

{% embed https://dev.to/puppo %}
