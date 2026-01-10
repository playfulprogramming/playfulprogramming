---
{
title: "Playwright - CI",
published: "2023-01-19T09:00:45Z",
edited: "2023-02-21T07:21:23Z",
tags: ["playwright", "testing", "github", "githubaction"],
description: "Hi there, Today I want to speak about integrating Playwright in your GitHub action CI. So don't waste...",
originalLink: "https://blog.delpuppo.net/playwright-ci",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "20832",
order: 1
}
---


Hi there,  
Today I want to speak about integrating Playwright in your GitHub action CI.  
So don't waste time and let's start.

To start, you have to create a file called `playwright.yml` in this path `.github/workflows`.

> The `.github/workflows`' path is used to save the files for your GitHub Actions, and the name of the file is not important for GitHub because the value for it is inside of your files.

Let's start to copy and paste this code into the playwright.yml

```yaml
name: Playwright Tests
on: [push]
```

These two info are used to give a name to the CI and to define what triggers this CI.  
These are standard fields that you can find in every GitHub Action in the world.  
In this case, the CI will trigger every push in the project.

Now it's time to add the first job to run your e2e tests in CI.  
To do that, add this to your file.

```yaml
jobs:
  test-e2e:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      - name: Run Playwright tests
        run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-e2e-report
          path: playwright-report/
          retention-days: 30
```

Jobs are used in GitHub Action to run different stuff, like build, test, deploy etc. etc.  
In this example, the `test-e2e`'s job creates a list of steps to run the test in the CI.  
But what this job does:

1. `runs-on` is used to indicate on which platform the job has to run

2. `actions/checkout@v3` checkouts the code

3. `actions/setup-node@v3` setups the node version for the job

4. `Install dependencies` installs all the dependencies in the `node_modules`

5. `Install Playwright Browsers` installs the browsers for Playwright

6. `Run Playwright tests` runs the e2e tests

7. `actions/upload-artifact@v3` uploads the test's results in the GitHub Artifact

Ok, this is the job for the e2e tests; now it's time to add the job for the component tests.  
To do that, copy and paste the following code

```yaml
  test-ct:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      - name: Run Playwright tests
        run: npx playwright test -c playwright-ct.config.ts
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-ct-report
          path: playwright-report/
          retention-days: 30
```

As you can see, it's similar to the previous job but has different configurations, so I don't dive into it.  
Now with these two jobs, you have a CI ready to run.  
To do that, `git add` + `git commit` + `git push`, and go into your online GitHub repository. In the tab Actions, you can find your CI in action, and If you click on it, you can see the two jobs running. (It's important to understand that these two jobs run in parallel, you can find more info about job execution [here](https://docs.github.com/en/actions/using-jobs/using-jobs-in-a-workflow))

![CI on action](https://cdn.hashnode.com/res/hashnode/image/upload/v1672660069370/bb711c0d-c1e3-46be-aff9-c91a0748f2e1.png)

When the CI is ended, you are sure that your tests are ok as expected. And the result will be like this.

![CI ended](https://cdn.hashnode.com/res/hashnode/image/upload/v1672660231591/f0f1a420-23ec-4d5f-a50e-6ffd23df1582.png)

Perfect, now you have your first GitHub action configured to run your tests with Playwright.

Good, that's all folk, I think you have all the info to integrate Playwright in your CI without any problem.

Thank you and see you soon.

Bye Bye 👋

_The code of this post is available_ [_here_](https://github.com/Puppo/playwright-series/tree/07-ci)_._

{% embed https://dev.to/puppo %}