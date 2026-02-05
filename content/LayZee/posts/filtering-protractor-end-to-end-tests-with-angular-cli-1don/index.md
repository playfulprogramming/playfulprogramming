---
{
title: "Filtering Protractor end-to-end tests with Angular CLI",
published: "2021-08-25T20:01:40Z",
tags: ["angular", "testing", "protractor"],
description: "Demonstrating the \"grep\" and \"invertGrep\" test filtering options of Angular CLI's Protractor builder.",
originalLink: "https://dev.to/this-is-angular/filtering-protractor-end-to-end-tests-with-angular-cli-1don",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

*Cover photo by [Michael Burrows](https://www.pexels.com/photo/faceless-barista-pouring-water-in-dripper-7125769/) on Pexels.*

End-to-end tests are relatively slow and with a large test suite, it is very valuable to be able to run only certain tests at a time.

Angular CLI 9.1 added support for the `--grep` and `--invert-grep` parameters to the Protractor builder. These are both end-to-end test filtering options that are passed to Protractor.

```powershell
ng e2e my-app --grep "logged out"
```

The previous command demonstrates an example test filter. The `grep` option is parsed as a regular expression, so every test that has the string `"logged out"` in its description will be run. This includes the description passed to the `describe` and `it` test wrapper functions.

We can set the `--invert-grep` parameter flag to invert the filter as seen in the following listing.

```powershell
ng e2e my-app --grep "logged out" --invert-grep
```

The `grep` parameter accepts a regular expression and searches full test descriptions with all their parts joined, for example in a freshly generated Angular CLI workspace, something like the following end-to-end test case is generated.

```ts
import { AppPage } from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('my-app app is running!');
  });
});
```

The description of the test case will be `"workspace-project App should display welcome message"`. We can filter in this test by passing `"^workspace"` or `"message$"` as the `grep` option or even a combination as seen in the following command which filters in tests with descriptions that start with `"workspace"` or end with `"message"`.

```powershell
ng e2e my-app --grep "^workspace|message$"
```

The `grep` and `invertGrep` options have been supported by the Protractor CLI for years, but support in the official Angular CLI builder for Protractor was first introduced in Angular CLI 9.1.
