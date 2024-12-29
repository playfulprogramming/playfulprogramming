---
{
  title: "Mastering Angular Unit Testing: Best Practices and Tools",
  description: "In this article, I’ll share the insights and experiences I’ve gained over the years with unit testing in Angular, along with the best practices I’ve adopted along the way.",
  published: '2024-12-12',
  tags: ["angular", "jest", "mocks", "javascript"],
  license: 'cc-by-nc-sa-4'
}
---


## Introduction

In this article, I would like to share the experience I gained over the years with unit testing in Angular. In a nutshell I will be speaking about the followings:

- Why you should unit test?
- Why you should mock and what are the advantages/disadvantages?
- What are SIFERS and why you should care?
- What is the Angular Testing Library (ATL)?
- Testing using SIFERS
- Querying DOM elements and dispatching events
- What are jest-auto-spies and observer-spy?

## Why?

I have seen many applications that do not contain any unit tests. Let me clarify why we need to write unit tests. Unit tests are a necessary aspect of any application. They provide us with assurance and confirmation about how the code should behave. They also serve as documentation to understand what the code is doing. Writing good tests helps us in understanding the design of the code. Not being able to write a unit test, indicates a bad design and usually tells us to refactor the code.

> The more your tests resemble the way your software is used, the more
> confidence they can give you.

## Mocks

To make sure you can concentrate on the code that has to be tested, you must properly mock external dependencies. For instance, you should mock any services or other components that the component you are testing utilizes. It's not advised to import the real implementations (more on why below). Feel free to import pure components, though, if your component uses them as dependents. You may also import a shared module that contains all of its dependencies.

- [Using individual components](https://angular.io/guide/testing-components-scenarios#nested-component-tests)
- [Import a shared module](https://angular.io/guide/testing-components-scenarios#setup-with-module-imports)

### Disadvantages of not mocking

- You will be using the real implementation and are forced to mock all of its properties, methods, etc. You will end up in a rabbit hole, where you are suddenly mocking classes that are several layers down the dependency tree.
- You will have to declare the nested components and provide all of its dependencies
- It takes longer for your tests to execute since the complete dependency tree must be resolved first.
- The state of your tests might not be correct.
- Your tests will suddenly start to fail if a dependency downstream changes. 
- It becomes very difficult to debug the tests when an error occurs.

## SIFERS

Let's start with the setup. Instead of using the `beforeEach` to set up the testing environment, I use [SIFERS](https://medium.com/@kolodny/testing-with-sifers-c9d6bb5b362).

> **S**imple **I**njectable **F**unctions **E**xplicitly **R**eturning **S**tate (SIFERS) is a way to capture what the tests should do when setting up the testing environment as well as returning a mutable clean state.

SIFERS use a `setup` function that can receive optional arguments to set up the testing environment. This is the biggest benefit compared to `beforeEach`. `beforeEach` gets called automatically before each unit test, hindering us to set any mocked values on the dependencies that are needed during the initialization of the component/service.

Using SIFERS allows us to be much more flexible with the testing environment to mock values before the component/service is initialized. The `setup` function is then called in every test and can return a state for your test (Classes, Properties etc..). 

One thing I like in my SIFERS is to try to keep the number of arguments small. If you need multiple arguments or your list is growing over a certain number of parameters, you can use an interface. This will keep your code organized and easy to read.

A simple `setup` function can look like this:

```ts
function setup({ value = false }) {
  const mockService: Partial<RealService> = {
    someFunction: jest.fn()
      .mockReturnValue(value ? 'foo' : 'bar'),
  };

  const service = new MyService(mockService);
  return {
    service,
    mockService,
  };
}
```

Using the above example, the tests can look like this:

```ts
it('returns foo when feature flag is enabled', () => {
  // Pass true into the setup to ensure that 
  // someFunction returns foo
  const { service } = setup(true);
  expect(service.someFunction()).toEqual('foo');
});

it('returns bar when feature flag is disabled', () => {
  // Pass false into the setup to ensure that 
  // someFunction returns bar
  const { service } = setup(false);
  expect(service.someFunction()).toEqual('bar');
});
```
I am not going into the full details of SIFERS here as it's already very well explained by the author [Moshe Kolodny](https://medium.com/@kolodny).

[Testing with SIFERS](https://medium.com/@kolodny/testing-with-sifers-c9d6bb5b362) 

## Angular Testing Library (ATL)

I am a big fan of the [ATL](https://testing-library.com/docs/angular-testing-library/intro/) library and try to use it in all of my projects. ATL is a very lightweight solution to test Angular components. ATL is described as:

> Angular Testing Library provides utility functions to interact with Angular components, in the same way as a user would. 

_Tim Deschryver_

Let's start with the setup of module. Instead of using `TestBed.configureTestingModule`, you need to use the `render` method. Keep in mind that the `render` method should only be used if you are testing **components**. Services can be tested without ATL and the `render` method.

There are many examples of how to use the ATL [here](https://github.com/testing-library/angular-testing-library/tree/main/apps/example-app/src/app/examples). They contain everything from Components, Forms, Input/Output, NGRX, Directives, Angular Material, Signals etc. [Tim Deschryer](https://timdeschryver.dev/) also has a very detailed [article](https://timdeschryver.dev/blog/good-testing-practices-with-angular-testing-library) with lots of examples that I recommend reading. 

Here is an example using a `SIFER`, and the `render` method. You will also notice that I am using the `createSpyFromClass` method to mock the classes, which automatically mocks all functions, properties and even observables for us automatically. More on that is covered later in the article.

```ts
import { render } from '@testing-library/angular';
import { createSpyFromClass } from 'jest-auto-spies';
// ... other imports

async function setup({ enableFlag = false }) {
  const mockMySomeService = createSpyFromClass(MyService);
  mockMySomeService.doSomething.mockReturnValue(enableFlag);

  const { fixture } = await render(AppComponent, {
    imports: [...],
    providers: [{ 
      provide: MyService, 
      useValue: mockMySomeService 
    }],
  });
}
```
### Setting declarations

Similar to `TestBed`, you can pass in a collection of components and directives using [declarations](https://testing-library.com/docs/angular-testing-library/api#declarations). The syntax is the same.

However if you are importing a module, that already contains the component, then you need to set the [excludeComponentDeclaration](https://testing-library.com/docs/angular-testing-library/api#excludecomponentdeclaration) to `true`.

Some other useful properties that you may need to use in your tests from the ATL [API](https://testing-library.com/docs/angular-testing-library/api). See the full API for examples. 

### Setting providers

Use the [componentProviders](https://testing-library.com/docs/angular-testing-library/api/#componentproviders) to set the providers for your component. If you need to set the providers at the module level, consider using the [providers](https://testing-library.com/docs/angular-testing-library/api/#providers) instead.

### Set @Input/@Output

Setting the `@Input` and `@Output` properties of the component can be achieved using [componentProperties](https://testing-library.com/docs/angular-testing-library/api#componentproperties). This allows you to set them both at the same time. 

If you need more control over those properties you can use the [componentInputs](https://testing-library.com/docs/angular-testing-library/api#componentinputs) or [componentOutputs](https://testing-library.com/docs/angular-testing-library/api#componentoutputs). In a `TestBed` based test, you would probably just set the input through the component instance itself. 

## Testing Services

To test services, you do not need to use the ATL or `TestBed`. Instead, you can pass the mocked dependencies directly into the constructor of the service to be tested. The below example mocks the `LogService` and `TableService`.

```ts
// some.service.ts
@Injectable({ providedIn: 'root' })
export class SomeService {
  constructor(
    private readonly logService: LogService, 
    private readonly tableService: TableService) {}
}

// some.service.spec.ts
async function setup() {
  const mockLogService = createSpyFromClass(LogService);
  const mockTableService = createSpyFromClass(TableService);

  const service = new SomeService(
    mockLogService, 
    mockTableService
  );

  return {
    service,
    mockLogService,
    mockTableService,
  };
}
```
## Testing Components

A component should always test the behaviour of the public API. Private APIs are never tested explicitly. **To test the components, use the DOM as much as possible.** This is the same behaviour you would expect from your user and you want your test to mimic this as much as possible. The ATL helps us with this. This is also called a shallow testing. 

Do not treat all public methods of your component as the public API that you can test directly from your unit tests. **They are only public for your template**. The public methods are called from the DOM (i.e. a button click) and should be tested in the same manner. 

Example of a component to be tested:

```ts
// app-foo.component.ts
@Component({
  selector: 'app-foo',
  template: `
    <input 
      data-testid='my-input'
      (keydown)='handleKeyDown($event)' />`
})
export class FooComponent {
  constructor(private readonly someService: SomeService) {}

  handleKeyDown(value: string) {
    this.someService.foo(value);
  }
}
```
Your SIFER `setup` could look like this:

```ts
// app-foo.component.spec.ts
async function setup() {
  const mockSomeService = createSpyFromClass(SomeService);
  const { fixture } = await render(FooComponent, {
    providers: [{ 
      provide: SomeService, 
      useValue: mockSomeService 
    }],
  });

  return {
    fixture,
    mockSomeService,
    fixture.componentInstance
  }
}
```

Do not do this. The test is directly accessing the public API, bypassing the template entirely. You could remove the DOM `input` element entirely and the test would still pass. This is a false positive test and does not serve any purpose. 

```ts
it('emits a value', async () => {
  const { mockSomeService, component } = await setup(...);
  component.handleKeyDown(value);

  expect(mockSomeService.foo)
    .toHaveBeenCalledWith(value);
})
```

This is the correct way to test the function. Here I am using `screen` to get access to the `input` element and `userEvent` to emit DOM events. 

```ts
import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

it('emits a value', async () => {
  const { mockSomeService, component } = await setup(...);
  const textbox = screen.queryByTestId('my-input');

  userEvent.type(textbox, 'foo,');
  userEvent.keyboard('{Enter}');

  expect(mockSomeService.foo)
    .toHaveBeenCalledWith(value);
})
```
## Query DOM Elements using `screen`

The `screen` API provides several powerful functions to query the DOM. Functions like `waitFor` or `findBy` return a promise and can be used to find elements that toggle their visibility dynamically based of some conditions.

It is recommended to query the elements in the following order. See the API for the [full priority list](https://testing-library.com/docs/queries/about#priority) and their descriptions. 

1. [getByRole](https://testing-library.com/docs/queries/byrole)
2. [getByLabelText](https://testing-library.com/docs/queries/bylabeltext)
3. [getByPlaceholderText](https://testing-library.com/docs/queries/byplaceholdertext)
4. [getByText](https://testing-library.com/docs/queries/bytext)
5. [getByDisplayValue](https://testing-library.com/docs/queries/bydisplayvalue)
6. [getByAltText](https://testing-library.com/docs/queries/byalttext)
7. [getByTitle](https://testing-library.com/docs/queries/bytitle)
8. [getByTestId](https://testing-library.com/docs/queries/bytestid)

### Dispatching DOM Actions

ATL comes with two APIs to dispatch events through the DOM:

- [userEvent](https://testing-library.com/docs/user-event/intro) 
- [Events](https://testing-library.com/docs/dom-testing-library/api-events/) 

`userEvent` is preferred over `fireEvents` (provided by the `Events` API). The difference as provided in the docs is:

> fireEvent dispatches DOM events, whereas user-event simulates full interactions, which may fire multiple events and do additional checks along the way.

## jest-auto-spies

To Mock classes, I use [`jest-auto-spies`](https://www.npmjs.com/package/jest-auto-spies). `jest-auto-spies` return a mocked type safe class without having to manually define all of its functions and properties. Besides saving a lot of time, it also provides helper functions for observables, methods, getters, and setters. The below example is using the `createSpyFromClass` method to create a spy class.

If you need to provide dependencies into your module directly, you can use `provideAutoSpy(MyClass)`, which is a shortcut for `{provide: MyClass, useValue: createSpyFromClass(MyClass)}`. 

Keep in mind that this should only be used if you don't need to mock any functions of that class. If you need to mock something from that class, then you should provide the mocked instance. 

Here are a few examples:

### Create a simple spy on a class

```ts
const mockMyService = createSpyFromClass(MyService);
```

### Create a spy on class and emit a value on an observable

```ts
const mockMyService = createSpyFromClass(MyService, {
	observablePropsToSpyOn: ['foo$'],
});

mockMyService.foo$.nextWith('bar');
```

### Create a spy on a class and function

```ts
const mockMyService = createSpyFromClass(MyService, {
	methodsToSpyOn: ['foo'],
});

mockMyService.foo.mockReturnValue('bar');
```
See [`jest-auto-spies`](https://www.npmjs.com/package/jest-auto-spies) for more helper functions and its usage.

## Use observer-spy instead of subscribe / avoid the `done` callback

To test asynchronous code, I use `subscribeSpyTo` from the `observer-spy` library instead of subscribing to the observable. This also helps to get rid of the `done` callback. 

The `done` function was introduced to test async code. However, it is very error prone and unpredictable. Because of that you might get false positives making your tests green, while other times you might get a timeout. 

Note that there is a [lint rule](https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/no-done-callback.md) that you can use to prohibit the usage of the `done` callback. 

You also do not need to unsubscribe from the observable, as there is an auto [unsubscribe hook](https://github.com/hirezio/observer-spy#auto-unsubscribing)
in place. This gets called automatically in `afterEach`.

Here are a few examples on how to use the library taken from their readme. See [more examples](https://github.com/hirezio/observer-spy#const-observerspy--subscribespytoobservable) in the readme.

```ts
const fakeObservable = of('first', 'second', 'third');
const observerSpy = subscribeSpyTo(fakeObservable);

// No need to unsubscribe, as the have an auto-unsubscribe in place.
// observerSpy.unsubscribe();

// Expectations:
expect(observerSpy.getFirstValue()).toBe('first');
expect(observerSpy.receivedNext()).toBeTruthy();
expect(observerSpy.getValues()).toEqual(fakeValues);
expect(observerSpy.getValuesLength()).toBe(3);
expect(observerSpy.getValueAt(1)).toBe('second');
expect(observerSpy.getLastValue()).toBe('third');
expect(observerSpy.receivedComplete()).toBeTruthy();
```

## Resources

- [Angular Testing Library](https://testing-library.com/docs/angular-testing-library/intro/)
- [Angular Testing Library Examples](https://github.com/testing-library/angular-testing-library/tree/main/apps/example-app/src/app/examples)
- [Angular Testing Guide](https://angular.io/guide/testing)
- [NgRx Testing](https://ngrx.io/guide/store/testing)
- [A Guide to Robust Angular Applications](https://testing-angular.com/)
- [Good testing practices with 🦔 Angular Testing Library](https://timdeschryver.dev/blog/good-testing-practices-with-angular-testing-library)

## Summary

The article explored my experience with unit testing in Angular, emphasizing its importance for code quality and maintainability. It covered the necessity of proper mocking to isolate units and avoid reliance on real implementations. SIFERS were highlighted as a flexible approach for setting up the testing environment and enhancing test readability. The Angular Testing Library (ATL) was introduced as a valuable tool for component testing, mimicking user interactions as close as possible to real users. Additionally, the article mentioned useful tools like jest-auto-spies for efficient class mocking and provided resources for further exploration of testing practices in Angular.