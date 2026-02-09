---
{
title: "Playwright - Fixtures",
published: "2023-01-05T09:00:42Z",
edited: "2023-02-21T07:20:05Z",
tags: ["playwright", "e2e"],
description: "Hey there, Today I want to speak about Fixtures, a vital friend if you're going to work with...",
originalLink: "https://blog.delpuppo.net/playwright-fixtures",
coverImg: "cover-image.png",
socialImg: "social-image.png",
collection: "Playwright",
order: 5
}
---

Hey there,\
Today I want to speak about Fixtures, a vital friend if you're going to work with Playwright and you want to share data between your tests or create custom executions.

Let's start with a simple example.

```ts
test('should win the player "X"', async ({ page }) => {
  await page.goto("/");
  await page.locator("button:nth-child(1)").click();
  await page.locator("button:nth-child(5)").click();
  await page.locator("button:nth-child(6)").click();
  await page.locator("button:nth-child(7)").click();
  await page.locator("button:nth-child(3)").click();
  await page.locator("button:nth-child(9)").click();
  await page.locator("button:nth-child(2)").click();

  const winnerParagraph = await page.getByText(/winner/i);
  await expect(winnerParagraph).toContainText("X");
});

```

Imagine you want to extract all the indexes of the buttons in an array to replicate this test and reduce all these click commands to have a shorter test.\
So, the first refactor before introducing the fixture feature could be this.

```ts
test('should win the player "X"', async ({ page }) => {
  const playerXWinMoves = [1, 5, 6, 7, 3, 9, 2];

  for (const move of playerXWinMoves) {
    await page.locator(`button:nth-child(${move})`).click();
  }

  const winnerParagraph = await page.getByText(/winner/i);
  await expect(winnerParagraph).toContainText("X");
});

```

As you can notice, all the steps to reproduce the players' moves are contained in the `playerXWinMoves` variables. The test is concise, but most important, all the actions are in a single variable. Now it's time to introduce fixtures.

Before carrying on, let me spend some words describing what fixtures are.

## What fixtures are

Test fixtures are used to establish an environment for each test, giving the test everything it needs and nothing else. Test fixtures are isolated between tests. With fixtures, you can group tests based on their meaning instead of their standard setup.\
After this definition, you can think fixtures could be replaced by before/after hooks, but fixtures have several advantages over these hooks:

- Fixtures **encapsulate** setup and teardown in the same place, making it easier to write.

- Fixtures are **reusable** between test files - you can define them once and use them in all your tests. That's how Playwright's built-in `page` fixture works.

- Fixtures are **on-demand** - you can define as many fixtures as you'd like, and Playwright Test will set up only the ones needed by your test and nothing else.

- Fixtures are **composable** - they can depend on each other to provide complex behaviours.

- Fixtures are **flexible**. Tests can use any combination of fixtures to tailor the precise environment they need without affecting other tests.

- Fixtures simplify **grouping**. You no longer need to wrap tests in `describe`s that set up an environment and are free to group your tests by their meaning instead.

Perfect, after this boring theoric part, it's time to get your hands dirty with fixtures in Playwright.\
To start the explanation, I want to begin with the final result.

```ts
import { expect, test as base } from "@playwright/test";

type TestFixtures = {
  playerXWinMoves: [number, number, number, number, number, number, number];
};

const test = base.extend<TestFixtures>({
  playerXWinMoves: async ({}, use) => {
    await use([1, 5, 6, 7, 3, 9, 2]);
  },
});

test('should win the player "X"', async ({ page, playerXWinMoves }) => {
  for (const move of playerXWinMoves) {
    await page.locator(`button:nth-child(${move})`).click();
  }

  const winnerParagraph = await page.getByText(/winner/i);
  await expect(winnerParagraph).toContainText("X");
});

```

As you can see, to build our fixture, you have to extend the test object exposed by Playwright. Inside this function, you can create an object that represents your fixtures. In this case, I added the `playerXWinMoves` property to share the steps to reproduce the Player X win. In addition, just because I love working with Typescript, I added the `TestFixtures` type to describe my fixtures. It's essential to notice that inside the fixture, you must use the `use` method to set the value for your fixtures.\
Ok, carry on and let's take a look at the test now. You can notice that you can get the `playerXWinMoves` fixture directly from the object passed to your test. And now, if you remove the previous variable and use the new one from the params, you will create your first test with Playwright using fixture.\
Great, I hope you can understand the incredible power of this feature and how it can help you to make your test more readable or to bring together some data useful in many tests.\
But before closing, let me leave you another bit. With fixtures, you can also override an object exposed directly by Playwright. For instance, you can override the page object, and instead of creating a `beforeEach` hook to navigate to the home page, you can override the page and add this step in a fixture, so every test, before its execution, runs the steps to navigate to the home page.\
And how can we do that? Simply in this way.

```ts
const test = base.extend<TestFixtures>({
  page: async ({ baseURL, page }, use) => {
    baseURL && (await page.goto(baseURL));
    await use(page);
  },
});

```

Doing that, now each test, when it starts its execution, goes to the baseURL and then runs all the code. Incredible no? Now, you can remove the `beforeEach` hook in the test file and rerun your tests to check the result.

Ok, that's all folk!\
Today you have learned how Playwright fixtures work and how to build one.\
I hope you enjoyed this post, and if you have any doubts, don't hesitate to reach out to me; I will be happy to help you.

See you soon\
Bye Bye 👋

*p.s. you can check out the code of this article* [here](https://github.com/Puppo/playwright-series/tree/05-fixture)

<!-- ::user id="puppo" -->
