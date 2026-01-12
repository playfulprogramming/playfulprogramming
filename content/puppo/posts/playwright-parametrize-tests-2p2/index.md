---
{
title: "Playwright - Parametrize tests",
published: "2023-02-23T07:00:39Z",
edited: "2023-03-15T05:45:56Z",
tags: ["playwright", "e2e"],
description: "Hey folks,  Today it's time to speak about how to parametrize tests with Playwright.  There are cases...",
originalLink: "https://blog.delpuppo.net/playwright-parametrize-tests",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "Playwright",
order: 12
}
---

Hey folks,

Today it's time to speak about how to parametrize tests with Playwright.

There are cases where we want to test the same behaviour but with different values, so in these cases, it's common to create a structure for the test and reuse it with different parameters.

The easiest way to do that with Playwright is using vanilla javascript.\
You can create an array with different cases, and using the `for` clause, you can call the test N times with different parameters.

Coming back to the Tic Tac Toe application, a real example could be to simulate different rounds and, for each round, indicate the sequence of the moves and who must be the winner.

An implementation of this scenario can be done in this way

```ts
import { expect, test as base } from "@playwright/test";

const test = base.extend({
  page: async ({ baseURL, page }, use) => {
    baseURL && (await page.goto(baseURL));
    await use(page);
  },
});

type TestCase = {
  winner: "X" | "O";
  moves: number[];
};

const testCases: TestCase[] = [
  {
    winner: "X",
    moves: [1, 5, 6, 7, 3, 9, 2],
  },
  {
    winner: "O",
    moves: [3, 1, 5, 7, 9, 4],
  },
];

for (const { winner, moves } of testCases) {
  test(`should win the player "${winner}" with these ${moves}`, async ({
    page,
  }) => {
    for (const move of moves) {
      await page.locator(`button:nth-child(${move})`).click();
    }

    const winnerParagraph = await page.getByText(/winner/i);
    await expect(winnerParagraph).toContainText(winner);
  });
}
```

As you can notice, the result is quite simple:

1. Define a TestCase type

2. Create an array with the cases

3. Iterate the cases and create a `test` for each case

4. Run and check the test result

Ok, this solution is good and can resolve many of our cases, but you can do more with Playwright!\
It's possible to load a csv file and use it to map all the test cases. Playwright doesn't fully expose this solution, but the simplicity with which Playwright is built permits a simple solution to do this.

Let me show you an example:

You can map the previous two cases in a csv file like this

```csv
// e2e/csv/winners_cases.csv
"test_case","winner","moves"
"should win the player X","X","1,5,6,7,3,9,2"
"should win the player O","O","3,1,5,7,9,4"
```

Then using an npm package called `csv-parse` we can load the csv in our test in this way

```ts
import { parse } from "csv-parse/sync";
import fs from "fs";
import path from "path";

const cases = parse(
  fs.readFileSync(
    path.join(process.cwd(), "e2e", "csv", "winners_cases.csv")
  ),
  {
    columns: true,
    skip_empty_lines: true,
  }
);
```

Now in the `records` variable, you have all the data that describe your test cases.\
The last thing to do is to create the tests like in the previous example

```ts
 for (const testCase of cases) {
  test(testCase.test_case, async ({ page }) => {
    const moves = testCase.moves.split(",");
    for (const move of moves) {
      await page.locator(`button:nth-child(${move})`).click();
    }

    const winnerParagraph = await page.getByText(/winner/i);
    await expect(winnerParagraph).toContainText(testCase.winner);
  });
}
```

And voila, you have a test suite that runs the test from a csv file.

In my opinion, both ways are good, but with the csv file you have less control of your code and your tests, and it's easy to face an error that doesn't depend on the test or the code but because someone changed the file in the wrong way. So please pay attention to who touches the files 😊

Ok, I think you have an idea of how you can parameterize your tests.

It's time to say goodbye to this series, this is the last article. I'll come back to you in the future if there will be new features to share with you 😊 But for now, I suppose that's all!

I hope you enjoyed it and see you soon!

test.afterAll(() => {

Bye bye 👋

});

*N.b. you can find the code of this article* [*here*](https://github.com/Puppo/playwright-series/tree/11-parameterize-test)

{% embed https://dev.to/puppo %}
