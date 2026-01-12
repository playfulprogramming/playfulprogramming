---
{
title: "Playwright - Generate tests' code",
published: "2022-12-29T09:00:46Z",
edited: "2023-02-21T07:19:39Z",
tags: ["playwright", "e2e"],
description: "Hi there, today you will learn how to generate the code for your tests.  First of all, you have to...",
originalLink: "https://blog.delpuppo.net/playwright-generate-tests-code",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "Playwright",
order: 4
}
---

Hi there,\
today you will learn how to generate the code for your tests.

First of all, you have to run the application, so type in your terminal `npm run dev` , and you will have your application up and running at the address `http://localhost:5173`.\
Now you have to run the Playwright code generator. To do that, you have to open another tab in your terminal and type `npx playwright codegen`.\
This command opens in your display a new browser and the Playwright inspector.\
Now, the browser shows an empty tab, and the Playwright inspector is on a new page, ready to listen to what you will do in the browser. If you go into the browser's address bar and type `http://localhost:5173,` you can notice that something has changed in the Playwright Inspector. The inspector noted the page change and added this step to the test body. Now, you can click on one square and simulate a game between two players, you can notice that the inspector records all these steps and creates the body of the test for you. The result of these actions is this

```ts
test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.locator('._Square_pba4r_1').first().click();
  await page.locator('button:nth-child(5)').click();
  await page.locator('button:nth-child(6)').click();
  await page.locator('button:nth-child(7)').click();
  await page.locator('button:nth-child(3)').click();
  await page.locator('button:nth-child(9)').click();
  await page.locator('button:nth-child(2)').click();
});

```

As you can see, the generated code is good but not perfect, so please use this tool with the head on the shoulders and check the result every time to ensure your test's value.

Say that, now it's time to copy and paste the code into our test file and improve its content. Let's start by changing the test name from `test` to `should win the player "X"` and changing the goto value from `http://localhost:5173/` to `/` because our base root corresponds to the home page. Then refactoring the first click probably is a good refactor to improve the test, so you have to change the line from `await page.locator('._Square_pba4r_1').first().click();` to `await page.locator("button:nth-child(1)").click();` and last but not least, add the assertion. In this case, if the test name is `should win the player "X"` the best assertion is something like this

```ts
const winnerParagraph = await page.getByText(/winner/i);
await expect(winnerParagraph).toContainText("X");

```

So the code tries to get the paragraph with the winner text and checks if the value contains the `X` value.\
The final result is this

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

Now, you can run the test and check the result which should be green.

Ok, I think that's all from the code generation.\
In this article, you learnt how to record your steps and convert them to code for your tests. Please, as I said before, use this tool responsibly and check the generated code every time.

That's it, folk.

See you soon 👋

p.s. you can find the result of this article [here](https://github.com/Puppo/playwright-series/tree/04-code-generator)

{% embed https://dev.to/puppo %}
