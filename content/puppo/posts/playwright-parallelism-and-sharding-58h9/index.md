---
{
title: "Playwright - Parallelism and sharding",
published: "2023-02-09T07:00:39Z",
edited: "2023-02-21T07:22:51Z",
tags: ["playwright", "e2e"],
description: "Hey Folks,  Today I'll speak about parallelism and sharding with Playwright, so don't waste time and...",
originalLink: "https://blog.delpuppo.net/playwright-parallelism-and-sharding",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "Playwright",
order: 10
}
---

Hey Folks,

Today I'll speak about parallelism and sharding with Playwright, so don't waste time and jump into it.

By default, Playwright runs your tests in parallel. It uses many worker processes at the same time. But you have different solutions to handle or remove parallelism in Playwright.

- Test files are in parallel, and each file is executed in order, from the first test to the last one. This is the default configuration

- Using `test.describe.configure` you can configure a file to run its tests in parallel

- it's possible to configure the entire project to have all tests in all files that run in parallel using testProject.fullyParallel or testConfig.fullyParallel

- it's possible to disable the parallelism limit by setting the number of workers to one.

## Worker processes

Each test runs in its own worker processes, and communication between workers is impossible. A process is an Os process that runs independently and is orchestrated by the test runner. Each worker has the same environment and starts its own browser.\
Playwright Test reuses a single worker as much as possible to make testing faster, so multiple test files are usually run in one worker one after another.\
Each time a test fails, the worker is shouted down to guarantee a pristine environment for the following tests.

### Limit the worker processes

Nonetheless, you can control the maximum number of parallel worker processes via the command line or in the configuration file in this way

```sh
npx playwright test --workers 4
```

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Limit the number of workers on CI, use default locally
  workers: process.env.CI ? 2 : undefined,
});

```

## Disable parallelism

However, it's possible to disable the parallelism too. To do that, the solution is to set the workers' configuration to one by command line or configuration file.

```sh
npx playwright test --workers 1
```

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Limit the number of workers on CI, use default locally
  workers: 1,
});

```

## Parallelize tests in a single file

Playwright, by default, runs all the tests in a single file in order, but it's possible to run them in parallel too. To do that, you have two possible solutions, by the configuration file or by the `test.describe.configure()`

The solution by the configuration file enables parallelism in each file of your test suite instead the `test.describe.configure()` enables it just in a single file.

By the way, the setting of this configuration is elementary; if you decide to enable it by the config file, the solution is this:

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  fullyParallel: true,
});
```

else, if you want to enable parallelism using `test.describe.configure()` the solution is this

```ts
import { test } from '@playwright/test';

test.describe.configure({ mode: 'parallel' });
```

It's essential to spend some words about `beforeAll` and `afterAll` hook. In this case, these hooks will be executed for each process, so they become like `beforeEach` and `afterEach` hooks.

## Serial mode

Sometimes, you have to run the tests in the same file in serial. To do that in Playwright, you can configure the serial mode. In this way, Playwright executes all the tests in sequence, but if one of the chain fails, the following tests will not execute, and so they will be skipped.

*This kind of configuration exists in Playwright, but it's not recommended.*

However, if you want to enable it, you have to add this line of code to your test file

```ts
import { test, Page } from '@playwright/test';

// Annotate entire file as serial.
test.describe.configure({ mode: 'serial' });
```

## Shard tests between multiple machines

Another cool feature, if you want to speed up your test suite, is the shard configuration. This configuration permits splitting the execution of the test suite in different machines so that you can parallelise your suite much more. This configuration helps the execution of your CI, so you don't have to waste too much time waiting for the CI.\
To use this configuration, you have to use the `--shard` option and indicate 2 numbers

- the total of shards

- which shard Playwright has to run

So, for instance, an example could be like this

```sh
npx playwright test --shard=1/3
npx playwright test --shard=2/3
npx playwright test --shard=3/3
```

In this way, you are dividing your test suite into 3 shards, and each command runs one of them.

## Control test order

By default, Playwright runs all the tests in parallel, so it doesn't guarantee the order execution. However, if you disable the parallelism, you should need to execute the test in a specific order. To do that, you have two options:

- Sort test files alphabetically

- Use a "test list" file

As you can imagine, for the first option, you have to choose a rule to order your files; for instance, in the official documentation, they say to add a prefix with three numbers: 001, 002, 003, etc. etc., easy peasy lemon squeeze.

For the second option instead, the game becomes trickier. You have to put your test in a helper file, and then you have to create a new file that imports all the helpers, and you have to wrap each helper in a `test.describe`.\
Then, you have to disable the parallelism and indicate to Playwright to use only the file that contains the helpers. In my opinion, yes, it's a solution, but probably, I prefer the first approach. To leave you a concrete idea, here you can find a possible implementation picked directly from the official documentation

```ts
// feature-a.spec.ts
import { test, expect } from '@playwright/test';

export default function createTests() {
  test('feature-a example test', async ({ page }) => {
    // ... test goes here
  });
}
```

```ts
// feature-b.spec.ts
import { test, expect } from '@playwright/test';

export default function createTests() {
  test.use({ viewport: { width: 500, height: 500 } });

  test('feature-b example test', async ({ page }) => {
    // ... test goes here
  });
}
```

```ts
// test.list.ts
import { test } from '@playwright/test';
import featureBTests from './feature-b.spec.ts';
import featureATests from './feature-a.spec.ts';

test.describe(featureBTests);
test.describe(featureATests);
```

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  workers: 1,
  testMatch: 'test.list.ts',
});
```

Another critical thing to remember in this solution is to wrap all the tests in the helpers with a function; in this way, your tests will not depend on the import/export statement, and you will prevent strange mistakes.

Ok, that's all! Now, I suppose you have an idea of how parallelism works in Playwright and have all the notions to handle it.

I hope you enjoyed this article, and if you have any questions, don't hesitate to reach out to me, you are welcome.

See you soon folks\
Bye Bye 👋

<!-- ::user id="puppo" -->
