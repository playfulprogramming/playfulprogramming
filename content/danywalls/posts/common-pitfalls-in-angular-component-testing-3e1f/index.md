---
{
title: "Common TestBed Pitfalls in Angular Component Testing",
published: "2023-01-28T08:12:23Z",
edited: "2023-02-24T17:34:19Z",
tags: ["angular", "testing", "javascript", "webdev"],
description: "When talking about unit testing, the first definition that comes into our head is to test the minor...",
originalLink: "https://dev.to/this-is-angular/common-pitfalls-in-angular-component-testing-3e1f",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

When talking about unit testing, the first definition that comes into our head is to test the minor testable parts of an app, like functions, methods, and classes. It sounds perfect for a simple function or isolated class without dependencies, but it is **not in the real world**.

In Angular, the components have decorators, services, pipes, templates to render the information, and sometimes child components, so we have too many actors in our test.

This article focuses on the typical problems or issues to face when we start adding testing in a single component with dependencies like services and child components.

## Scenario

We have an application showing a list of NBA Players from API using `PlayerService`; the app works with two main components.

- Player: The dumb component to show the single-player info.

- PlayerListComponent: Uses the list of players from the \`PlayerService\` to render in the view using the player component.

We are going to test the `playerlist.component.ts` handling dependencies of services and the child component.

The Typescript:

```typescript
import { Component, OnInit } from '@angular/core';
import { PlayerService } from 'src/app/services/players.services';
import { APIResponse, Player } from '../models/player';
@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.css'],
})
export class PlayerListComponent implements OnInit {

  players: Player[] = [];

  constructor(private playerService: PlayerService) { }

  ngOnInit(): void {
    this.playerService.getPlayers().subscribe((players: APIResponse) => {
      this.players = players.data;
    });
  }
}
```

The HTML Markup uses the `<app-player>` component.

```html
  <div *ngFor="let player of players" >
    <app-player [player]="player"></app-player>
  </div>
```

Let's try to test the component!

## Basic Of Jasmine

Before starting, remember that Angular relies on Jasmine and Karma as test runners and our tests. If you never write a test, it is short and intro.

1. `describe` : Group-related tests together. It takes a string and a function as arguments.

2. `beforeEach` : Runs before each test case for setup operations.

3. `it` : Defines a test case; it takes a string and a function as arguments.

4. `expect` : used to assert the behavior of the code being tested.

!\[]\(https://cdn.hashnode.com/res/hashnode/image/upload/v1673889605585/34a90ed3-3607-4e1b-82b5-0bdee9e5778c.png align="center")

Learn more about [Jasmine](https://jasmine.github.io/) and [Karma](https://karma-runner.github.io/latest/index.html)

## What is Testbed

The testbed is a powerful and easy-to-use testing environment that allows us to test components and services in isolation without depending on the rest of the application. It provides a set of APIs for creating and configuring the test environment and interacting with the tested component or service.

With the testbed, we are going to use two methods, `configureTestingModule` and `createComponent` .

To configure a test bed for a specific module or component, we use `configureTestingModule()` the method takes an object as an argument to configure providers, declarations, imports, and other options similar to `app.module.ts.`

*Learn more about* [*Testbed*](https://angular.io/api/core/testing/TestBed)

The `createComponent` creates an instance of a component and returns a `ComponentFixture` for that component, allowing for testing the component's behavior and DOM interactions.

We create the `player-list.component.spec.ts` , adding the `describe` with the test title.

```typescript
describe('PlayerList Component', () => {
    
})
```

Declare the fixture variable to store the component using `ComponentFixture` , and set the variable using the type `PlayerListComponent`.

```typescript
describe('PlayerList Component', () => {

  let fixture: ComponentFixture<PlayerListComponent>
      
  });
```

It's time to use the `BeforeEach` and TestBed to configure our Testing module, as we learn before the `configureTestingModule` help us set up our module.

Declare the `PlayerListComponent` and with `TestBed.createComponent` to create the instance of `PlayerListComponent`.

The final code looks like this:

```typescript

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerListComponent } from './player-list.component';
describe('PlayerList Component', () => {

  let fixture: ComponentFixture<PlayerListComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerListComponent]
    })
    fixture = TestBed.createComponent(PlayerListComponent);
  })
  it('should render the component', () => {
    expect(true).toBe(true)
  })
})
```

Save the changes and run the command: `npm run test`:

```bash
✔ Browser application bundle generation complete.
Chrome 108.0.0.0 (Windows 10) PlayerList Component should render the component FAILED
        NullInjectorError: R3InjectorError(DynamicTestModule)[PlayerService -> PlayerService]: 
          NullInjectorError: No provider for PlayerService!
        error properties: Object({ ngTempTokenPath: null, ngTokenPath: [ 'PlayerService', 'PlayerService' ] })
Chrome 108.0.0.0 (Windows 10): Executed 1 of 1 (1 FAILED) (0.046 secs / 0.04 secs)
TOTAL: 1 FAILED, 0 SUCCESS
```

We got an error because the component uses the `PlayerService` in the constructor, so we need to provide the `PlayerService` without making a real request.

Mock to rescue us, using the function `createSpyObj` from jasmine, we can mock objects with spy methods, allowing you to track and test the behavior of specific functions without executing the actual implementation.

Declare a new variable `mockPlayerService` using `jasmine.createSpyObj` , it forced to declare the methods to Mock. In our case, `getPlayers`

```typescript

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerService } from 'src/app/services/players.services';
import { PlayerListComponent } from './player-list.component';
describe('PlayerList Component', () => {

  let fixture: ComponentFixture<PlayerListComponent>

  const mockPlayerService = jasmine.createSpyObj<PlayerService>(["getPlayers"]);
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerListComponent],
      providers: [{
        provide: PlayerService,
        useValue: mockPlayerService
      }]
    })
    fixture = TestBed.createComponent(PlayerListComponent);
  })
  it('should render the component', () => {
    expect(true).toBe(true)
  })
})
```

Everything is green! So we can start to write our test.

*Learn more about* [*Mock and Spies*](https://www.danywalls.com/the-role-of-mocks-and-spies-in-unit-testing)

## Testing The Component

We have the testing module ready; we are ready for the following tasks to test the component by doing the following tasks.

- \[x] Fake the response data

- \[x] Create a test for the component get players from the service

- \[x] Trigger the component `change-detection`.

- \[x] Validate the property `players` has a value from the fake response.

Let's **Create a test to get players** from services. We create a variable with structure from the backend to use as a fake data response:

```typescript

  const FAKE_API_RESPONSE: APIResponse = {
    data: [{
      id: 1,
      first_name: 'Lebron'
    }]
  };
```

**Create a test to get players from the service** with `it` should get players from services and use `and.returnValue` with the mock to return an observable as a fake response, we must **trigger the change detection** using `fixture.detectChanges` to start the change detection lifecycle in the component.

```typescript
  it('should get players from service', () => {
    mockPlayerService.getPlayers.and.returnValue(of(FAKE_API_RESPONSE));
    fixture.detectChanges();
  })
```

Save and ... DAMMMM!!! We got a new error!!!

```bash
PlayerList Component > should get players from the service
Error: NG0304: 'app-player' is not a known element (used in the 'PlayerListComponent' component template):
1. If 'app-player' is an Angular component, then verify that it is a part of an @NgModule where this component is declared.
2. If 'app-player' is a Web Component, then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component to suppress this message.
```

## Why Error: NG0304: 'app-player' is not a known element?

The playlist uses a component that is not registered in our testing module. **What option do I have?**

The `schemas` property in the `@NgModule` decorator configures template validation using the `NO_ERRORS_SCHEMA` constant that disables template validation completely.

Let's try the following:

```typescript

....CODE COLLAPSED
TestBed.configureTestingModule({
      declarations: [PlayerListComponent],
      providers: [
        {
          provide: PlayerService,
          useValue: mockPlayerService,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(PlayerListComponent);
  });
  it('should get players from service', () => {
    mockPlayerService.getPlayers.and.returnValue(of(FAKE_API_RESPONSE));
    fixture.detectChanges();
  });
});
```

*Note: There are better approaches than ignoring the template issues; later, we will find another way to handle them.*

Save, and ... Yeahhh, **Green again**. Let's continue validating the property's value from the fake response.

How are we sure the property player has value? The fixture exposes some ways to access the component:

1. `componentInstance`: Returns an instance of the tested component. We can use this property to access the properties and methods of the component and check their values.

2. `debugElement`: Returns an instance of `DebugElement` the tested component. The `DebugElement` is a wrapper around the native element and allows you to interact with the component's DOM in a way that is agnostic to the underlying platform.

3. `debugElement.nativeElement`: Returns the native element of the tested component, the actual element in the DOM. We can use this property to interact with the component's DOM indirectly d check its attributes, styles, and content.

Let's use the `componentInstance` to access the players property, using `expect` to assert the values, the `FAKE_API_REPONSE`, return a single item, and check the length of players is equal to 1.

```typescript
 it('should get players from service', () => {
    mockPlayerService.getPlayers.and.returnValue(of(FAKE_API_RESPONSE));
    fixture.detectChanges();
    expect(fixture.componentInstance.players.length).toEqual(1)
  });
```

Save and the results:

!\[]\(https://cdn.hashnode.com/res/hashnode/image/upload/v1673889447633/cae0091b-1245-4c6f-8aab-5317d11670d9.png align="center")

## Working with Child Components

**Do you remember we ignored the template?** That solution was just a patch. If we want to be sure our component renders the players, then we must validate that the template works.

Similar to what we did with the service, we can mock the `<app-player>` component, so remove the `schemas: [NO_ERRORS_SCHEMA]` .

To mock the component, we declare a new component in the test, with the same selector `app-player` , and the properties required by our test. In the template, add the CSS class `player` to make it easy to find the elements.

```typescript
 @Component({
    selector: 'app-player',
    template: `<div class='player'>
     <span>{{player.name}}</span>
   </div>`
  })
  class MockPlayer {
    @Input() player!: Player;
  }
```

Next, register the `MockPlayer` in the declarations section:

```typescript
 TestBed.configureTestingModule({
      declarations: [PlayerListComponent, MockPlayer],
      providers: [
        {
          provide: PlayerService,
          useValue: mockPlayerService,
        },
      ]
    });
```

**What we did?**

We provide a Mock component with the same selector and register in the testing module. When the component requests the \<app-data>, the testing module provides our mock.

## Test Render Child Components

First, Similar to our other test, we must assign the fake data and trigger the change detection.

To find and interact with the component, we will to some methods from the component fixture.

`queryAll` returns an array of DebugElements that match a given predicate.

`by.css` a predicate `queryAll` to find elements that match a given CSS selector.

`by.directive` use as a predicate `queryAll` to find elements that have been instantiated with a given directive.

The `debugElement` is an object that provides access to the underlying native element and component instance associated with a given DOM element in a test fixture.

Because we add a CSS class in the mock component, we use the By.css to query all elements with the class `div.player` render in the DOM.

Create a new variable `totalPlayers` and store the result of `queryAll` in `totalPlayer` it returns an array, use the `totalPlayer.length` to expect the test.

```typescript
  it('should render the players', () => {
    mockPlayerService.getPlayers.and.returnValue(of(FAKE_API_RESPONSE));
    fixture.detectChanges();
const totalPlayers =      fixture.debugElement.queryAll(By.css('div.player')
    expect(totalPlayers).length).toBe(1);
  })
```

Save, and our tests pass using a mock service and template.

!\[]\(https://cdn.hashnode.com/res/hashnode/image/upload/v1673889416095/22868825-6e4e-4aa6-b426-9c73320600bd.png align="center")

**Note:** Another alternative is with `By.directive` using the component class name.

```typescript
expect(fixture.debugElement.queryAll(By.directive(MockPlayer)).length).toBe(1);
```

Done! We have already tested our component:

- \[x] We validate the component to get the data.

- \[x] We validate the date is in the DOM.

- \[x] We learn to Mock Services and Components

- \[x] We learn to Query elements in the DOM using By

## Conclusion

We learn the common pitfalls when testing components in Angular with multiple dependencies. Testing components with a testbed, mocking services, and child components is an important part of ensuring the robustness and reliability of your application.

Mocking services and child components will enable you to control the inputs and outputs of those dependencies, making it easier to test the component in isolation.

These techniques can improve your testing strategy and build more reliable and maintainable applications.

If like please share :)

Photo by Louis Reed on Unsplash
