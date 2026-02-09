---
{
title: "Migrate from Jasmine to Jest and Testing Library in Angular",
published: "2021-12-27T08:16:52Z",
edited: "2022-11-04T13:40:02Z",
tags: ["angular", "testing", "frontend", "javascript"],
description: "Angular, by default, comes with Jasmine; it is a great testing framework. I spent one year and a half...",
originalLink: "https://www.danywalls.com/from-jasmine-to-jest-and-testing-library-in-angular-projects",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

Angular, by default, comes with Jasmine; it is a great testing framework. I spent one year and a half running and writing tests with Jasmine, it works, but the market is moving to Jest and Testing library.

Don't get scared because Jest is more straightforward and compatible with your Jasmine test.

This post aims to guide how to get rid of Jasmine and Karma and set up Jest and testing library.

## Why move to Jest and Testing library?

I decided to move all my Angular projects to Jest and testing library for a few reasons.

Jest is:

- Faster than Karma.
- Easy to read test reports.
- Code Coverage out of the box
- Great command-line interface to interact with the tests.
- Great community support.

The Testing library is:

- Focus user test
- So fast and easy.

> If you are looking to the easy way use jest schematic https://github.com/briebug/jest-schematic

## Remove Jasmine and Karma

To remove the package, delete them from the package.json and save it.

```json
"@types/jasmine": "~3.10.0",
"jasmine-core": "~3.10.0",
"karma": "~6.3.0",
 "karma-chrome-launcher": "~3.1.0",
 "karma-coverage": "~2.1.0",
 "karma-jasmine": "~4.0.0",
 "karma-jasmine-html-reporter": "~1.7.0",
```

And run the `npm install` command from the terminal again to npm remove not used packages.

Next, delete karma.conf.js and src/test.ts files.

```bash
    rm karma.conf.js 
     rm src/test.ts 
```

Remove the test area from angular.json.

```json
"test": {
          "builder": "@angular-devkit/build-angular:karma",
          "options": {
            "main": "src/test.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "tsconfig.spec.json",
            "karmaConfig": "karma.conf.js",
            "assets": ["src/favicon.ico", "src/assets"],
            "styles": ["src/styles.css"],
            "scripts": []
          }
```

Next, install and configure Jest for our angular app.

## Install and configure Jest

We will run the following command in our terminal to install jest library, Jest preset for angular, and jest types for typescript.

```bash
npm install --save-dev jest jest-preset-angular @types/jest
```

In your project root, create the setup-jest.ts file and import the angular preset.

```typescript
import 'jest-preset-angular/setup-jest';
```

Into the  package.json file edit the script`test: "ng test"` to `test: "jest"`

```json
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "jest"
  },
```

Add a Jest area to load `jest-preset-angular` and use the jest configuration file.

```json
  "jest": {
    "preset": "jest-preset-angular",
    "setupFilesAfterEnv": ["<rootDir>/setup-jest.ts"]
  }
```

Edit tsconfig.json into the compiler option :

```json
"esModuleInterop": true,
```

Edit tsconfig.spec.json, remove node and Jasmine to Jest, close similar to my example:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "types": ["jest"]
  },
  "include": ["src/**/*.spec.ts", "src/**/*.d.ts"]
}
```

Because jasmine tests are compatible, we run our existing test running the test script from the terminal.

```bash
npm run test

> lab@0.0.0 test
> Jest

 PASS  src/app/app.component.spec.ts
  AppComponent
    ✓ should create the app (169 ms)
    ✓ should have as title 'lab' (43 ms)
    ✓ should render title (47 ms)

Test Suites: 1 passed, one total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        1.635 s, estimated 4 s
Ran all test suites.
```

## Install the testing library

The @testing-library helps test UI components in the user way.

```bash
npm install --save-dev @testing-library/angular
```

Create an app.component.ui.spect.ts file, and we use the testing library to play with the UI.

First, import `render` and `screen` from @testing-library/angular,  `render` help us to load the component, and `screen` provide an extensive list o ways to find elements in the browser.

In our quick example, we find the "Next steps" text to learn more about using the testing library https://testing-library.com/docs/.

> We use the await keyword to wait for render and screen results.

```typescript
import { render, screen } from '@testing-library/angular';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  it('should render Welcome', async () => {
    await render(AppComponent);
    await screen.getByText('Welcome');
  });
});

```

Run your test again

```bash
npm run test

> lab@0.0.0 test
> Jest

 PASS  src/app/app.component.spec.ts
 PASS  src/app/app.ui.component.spec.ts

Test Suites: 2 passed, 2 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        4.631 s
Ran all test suites.
```

## Summary

Well, in short, we learned how to remove karma and Jasmine, install and configure Jest running our existing test, and add the testing library in our angular projects.

Hopefully, that will give you a bit of help with the Jest and Testing library. If you enjoyed this post, share it!
