---
{
	title: "Writing better tests for Angular with Angular Testing Library",
	description: "A simple explination of writing better tests for Angular applications and setting up Angular Testing Library",
	published: "2020-05-12T04:45:30.247Z",
	edited: "2020-06-09T04:45:30.247Z",
	authors: ["skatcat31"],
	tags: ["testing", "angular"],
	attached: [],
	license: "cc-by-nc-sa-4"
}
---

Some evangelicals say that before code ever exists, there always needs to be a test to know how the code should be written. That frankly isn't true. A test isn't _strictly_ needed to determine how to code. What **is** needed are tests that give confidence that as code is written, a change to already existing functionality doesn't happen and that new functionality will behave properly as time goes on. To this end, a lot of testing libraries and frameworks exist. Often times, tests are written in regards to the library or framework used and not to the end product's specifications. For Angular, this is especially true when the default testing implementation is for testing angular, and not for testing what a developer would use Angular to build. **Tests should be written in the same way a user would use them.** We don't need to test Angular; we need to test what we make with Angular.

# Writing tests for an Angular application does not mean testing Angular {#test-the-web-not-angular}

In regards to Angular and writing tests, we must first understand what the tests are for. For a great many projects, that means testing a webpage. In proper testing for a webpage, the underlying library should be able to be changed at any time for maintainability purposes, and the tests should still work. To that end, we must write tests for the web and not for Angular. When using the Angular CLI, it sets up some tests, but when looking closely at the tests, it becomes apparent that the tests are testing Angular and not the output.

```js
it('should create the app', () => {
  const fixture = TestBed.createComponent(AppComponent);
  const app = fixture.componentInstance;
  expect(app).toBeTruthy();
});
```

This test isn't a very good test. It doesn't say anything about the actual output of the application component itself. When the output is a full, rich webpage and tests are testing Angular, then the tests won't do much when the content of the webpage is changed.

While the default testing setup does allow for the writing of tests that would test the outputted HTML they are still specific to Angular

```js
it('should render title', () => {
  const fixture = TestBed.createComponent(AppComponent);
  fixture.detectChanges();
  const compiled = fixture.nativeElement;
  expect(compiled.querySelector('.content span').textContent).toContain('The app is running!');
});
```

That test looks a little better, but it's still very tied to Angular. The test requires in-depth knowledge of how Angular actually routes and moves all the bits around to write tests for it, and as a result, the tests are completely tied into Angular and the current API footprint. If — over the years — Angular is retired, these tests will no longer be valid.

If the tests were just tailored to the outputted DOM or containers it would be a much easier and more adaptable test.

```js
test('should render counter', async () => {
  await render(AppComponent);
  expect(document.querySelector('.content span').innerText).toBe('The app is running!');
});
```

This test no longer even needs Angular to be the library chosen. It just requires that a render method, when given the component, will render it to the DOM present in the testing environment. This can be run in the Framework, and even tested against in a real world browser. This is a good test in that the first `span` inside of `.content` has the `innerText` value expected in the test. These are all JavaScript and DOM APIs and thus can be trusted in any environment that adheres to them.

Writing tests that don't rely on testing Angular, but instead rely on the DOM, allows the application to be tested in a way that a user would use the application instead of the way that Angular internally works.

# Fixing that shortcoming using Testing Library {#testing-library}

Thankfully, writing tests like these have been made simple by a testing library simply called "[Testing Library](https://testing-library.com)." Testing Library is a collection of libraries for various frameworks and applications. One of the supported libraries is Angular, through the [Angular Testing Library](https://testing-library.com/docs/angular-testing-library/intro). This can be used to test Angular apps in a simple DOM focused manner with some nice helpers to make it even easier to work with. It relies on [Jest](https://jestjs.io/) as an extension to the Jasmine testing framework to make testing easier, and more end-results focused. With that tooling, a project can have tests much less focused on Angular and much more focused on what is being made.

## Transitioning to Jest and Angular Testing Library {#transitioning-to-jest}

### Get rid of Karma {#remove-karma}

Angular ships with Karma alongside Jasmine for running tests and collecting coverage. With Jest, an Angular project no longer needs Karma or the other packages that would be installed by the Angular CLI.

#### Uninstall Karma

```bash
npm uninstall karma karma-chrome-launcher karma-coverage-istanbul-reporter karma-jasmine karma-jasmine-html-reporter
```

#### Remove the leftover configurations {#remove-karma-config}

Deleting the following will remove the leftover configuration files from the project:

```bash
karma.config.js
src/test.ts
```

Once those two files are deleted, any references to `src/test.ts` will need to be removed. Removing the paths from the following file that reference them cleans it up easily enough:

```json
tsconfig.spec.json
{
  ...,
  "files": [
    "src/test.ts", <- delete
    ...
    ]
}
```

The project also no longer needs the `test` key inside of `angular.json` as it stands, and thus it's contents can be removed. Don't worry, we'll be making `ng test` work again later.

```json
angular.json
{
  ...,
  "test": {} <- delete contents, but leave the key
  ....
}
```

Finally the project no longer needs the Jasmine types in the spec configuration

```json
tsconfig.spec.json
{
  ...,
  "compilerOptions": {
    ...,
    "types": [
      "jasmine", <- delete
      ...
    ]
  }
}
```

Now the project is ready for installing any other test runner.

### Setting up Jest {#setup-jest}

Now that the project has no Karma it can be setup with Jest

#### Install Jest

```bash
npm i -D @types/jest jest jest-preset-angular ts-jest @angular-builders/jest
```

This installs Jest, the types for Jest, a TypeScript pre-processor for Jest, and a preset that makes setting up Jest much easier.

#### Configure Jest

The project now needs to know how to best utilize Jest. Creating and modify the following files will allow Jest to load it's own configuration.

```js
jest.config.js
module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: [
        '<rootDir>/jest.setup.ts'
    ]
};
```

```typescript
jest.setup.ts
import 'jest-preset-angular';
```

```json
tsconfig.spec.json
{
  ...,
  "compilerOptions": {
    ...,
    "types": [
      "jest", <- new
      ...
    ]
  }
}
```

```json
tsconfig.json
{
  ...,
  "compilerOptions": {
    ...,
    "esModuleInterop": true, <- new
    "emitDecoratorMetadata": true, <- new
    ...
  },
  ...
}
```

```json
package.json
{
  ...,
  "scripts": {
    ...,
    "test": "jest --coverage --config ./jest.config.js", <- new
    "test:watch": "jest -o --watch --config ./jest.config.js", <- new
    ...
  },
  ...
}
```

```json
angular.json
{
  ...,
  "test": {
    "builder": "@angular-builders/jest:run" <- new
  }
  ....
}
```

Jest is now the test runner for the projectand it can be run with NPM, Yarn, or the Angular CLI. It can now be used in combination with Testing Library.

### Install Angular Testing Library

Now the project is ready to have better tests written for it and by using [Angular Testing Library](https://testing-library.com/docs/angular-testing-library/intro) the tests can be simplified with some great helpers.

```bash
npm install --save-dev @testing-library/angular
```

# Ready, Steady, Test! {#conclusion}

Now that the project has a better testing library with some great helpers better tests can be written. There are plenty of [great examples](https://testing-library.com/docs/angular-testing-library/examples) for learning and [Tim Deschryver](https://timdeschryver.dev/blog/good-testing-practices-with-angular-testing-library) has more examples to help in that endeavor, and the Angular Testing Library will make tests much simpler to write and maintain. With Angular, good tests, and plenty of confidence anyone would be happy to ship a project with this setup.
