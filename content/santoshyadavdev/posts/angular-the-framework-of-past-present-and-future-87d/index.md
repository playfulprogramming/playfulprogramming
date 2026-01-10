---
{
title: "Angular: The Framework of Past, Present, and Future",
published: "2023-04-06T22:34:23Z",
edited: "2023-04-07T07:40:37Z",
tags: ["angular", "webdev", "programming"],
description: "Photo by Drew Beamer on Unsplash  I started using Angular in 2017 when version 4 was released. And I...",
originalLink: "https://dev.to/this-is-angular/angular-the-framework-of-past-present-and-future-87d",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

Photo by <a href="https://unsplash.com/ja/@dbeamer_jpg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Drew Beamer</a> on <a href="https://unsplash.com/photos/xU5Mqq0Chck?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

I started using Angular in 2017 when version 4 was released. And I have seen this framework growing since then. In this blog, let's see why Angular is a framework of Past, Present, and Future.

# AngularJS and the Start of Angular

AngularJS was released in 2010 and was one of Google's first Open Source front-end frameworks. It was open-sourced and lived for 12 years before reaching the end of life in 2022.

AngularJS introduced a new way to write the html templates. It introduced directives like "ng-for, ng-if," which paved the way for many other frameworks and rendering engines.

The AngularJS team quickly realized it's difficult to maintain a vast codebase written in JavaScript. And a rewrite of AngularJS called Angular was announced in 2014.

# Choosing the best tool for the job

Angular is known for deep diving into the existing tools before picking the best for the job. Let's see the tools chosen by the Angular team over the years.

## Past

When Angular development started, Angular Team decided to use **Typescript**, which was very new in 2014, and many didn't like it. Some chose not to use it and moved to another framework where they could use Javascript.

But everyone has realized the true power of Typescript over the years, and most developers now choose and prefer Typescript over Javascript.

2014 was the time many build tools for Javascript started appearing. I remember using Grunt and Gulp. Even when the early version of Angular appeared (2.0), SystemJS was used, and developers had to configure everything independently. With Angular 4.0 Angular team introduced **Webpack** and **CLI**, and all the configuration was hidden from the developers. Webpack served as the best and most stable tool over the years. It became a tool trusted by many other frameworks and developers.

There was a time the Angular team considered introducing **Bazel** as the build tool. Bazel is a great tool, but introducing it might have complicated the development effort, as it is hard to understand. The angular team decided not to take that path.

## **Present**

Angular still uses **Webpack** and has experimental support for **esbuild**. The team realized its time to move on and chose other tools better than Webpack.

**CLI** has improved over the years, enabling smooth migrations between Angular versions. Check out <https://update.angular.io/>

## Future

After considering many build tools, Angular will invest in **esbuild**, which will be used for building Angular applications.

But **vite** is the hottest tool now; you said, yes team decided not to use it as it was not the best fit for building Angular applications. Still, it will serve applications using **vite** when you are doing the dev build.

# Rendering Engines

Angular uses a compiler to build and produce the final build output, which generally goes through multiple tools. One of them is the rendering engine; the Angular team has iterated over the rendering engines numerous times, and Ivy is the current generation which has unblocked the Angular team to introduce great features like the Standalone component.

# Focus on Reactivity

## Past

Angular wanted developers to write more reactive code from Day 1 and chose the best tool present **RxJs**. For APIs like **HTTP** and **Router**, Angular used RxJs internally; even for EventEmitter RxJs Subject was used.

## Present

RxJs usage has grown over the years, and more and more developers are using this powerful library. Still, many developers asked for Angular without RxJs. Many want better integration of Angular with RxJs.

## Future

The angular team is experimenting with Signals, and there will be a public RFC soon. Signals will reduce the learning curve, which was required for RxJs. Still, it will also introduce APIs to better integrate with RxJs.

# Change Detection

## Past

Change Detection has always been a very critical part of any framework. The angular team introduced zone.js very early to take care of change detection.

## Present

Angular still uses zone.js, but soon it started giving performance issues for large apps, and developers had to figure out how to improve the performance. OnPush change detection strategy is widely used to improve performance. Libraries like RxAngular allow you to disable zone.js but need some refactoring.

## Future

We, developers, should focus on writing more quality code rather than caring about change detection. Yes, this is the policy the Angular team has decided to go with. With the introduction of Signals, zone.js will become optional, and you can care less about Change Detection strategies.

# Do not leave anyone behind policy.

Angular has a release cycle of 6 months, which means there will be a new major release every 6 months. And the version has support for the next 18 months, which means if you have been on an Angular version for more than 18 months, chances are the version is not supported anymore.

But Angular has your back. For any new version release, Angular CLI offers an automatic migration. You need to run `ng update` and relax.

You can read the [docs](https://update.angular.io/) to update Angular between multiple versions

```bash
ng update 
```

# Great Set of features

Over the years, the Angular team has interacted more with the community and worked on some excellent features.

## inject function

One of the most loved features of Angular is DI (Dependency Injection). We all love it. With `inject`, function Angular team made the developer experience even better.

Let's see an example before and after:

```bash
@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss'],
})
export class EmployeeDetailsComponent {

  modes$ = this.route.queryParamMap.pipe(
    map((params: ParamMap) => params.get('mode'))
  );
  userName$ = this.route.paramMap.pipe(
    map((params: ParamMap) => params.get('username'))
  );

  employeeId$ = this.route.paramMap
    .pipe(
      map((params: ParamMap) => params.get('employeeId'))
    );
  constructor(private route: ActivatedRoute) { }

}
```

With inject function

```typescript
@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss'],
})
export class EmployeeDetailsComponent {
  modes$ = inject(ActivatedRoute).queryParamMap.pipe(
    map((params: ParamMap) => params.get('mode'))
  );
  userName$ = inject(ActivatedRoute).paramMap.pipe(
    map((params: ParamMap) => params.get('username'))
  );

  employeeId$ = inject(ActivatedRoute).paramMap.pipe(
    map((params: ParamMap) => params.get('employeeId'))
  );
  constructor() {}
}
```

Template:

```xml
<h1>
   Employee Details for EmployeeId: {{employeeId$ | async}}
</h1>

<h2>Current Mode: {{ modes$ | async }} </h2>
```

## Standalone components

The angular community has been asking Angular Module less Angular for a long time. I still love Angular Modules, it still has their place when structuring your apps, but we can usually work without them. Not having Angular Modules reduces the mental modal and learning curve. So now we have Standalone Components, Standalone Component does not require to be registered with any Angular Modules, and it still has backward compatibility, meaning you can use them in an Angular Module.

```typescript
import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  standalone: true, // Standalone flag to differentiate between component with module
  imports:[
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ] // you can import Angular Module, Standalone Component/Directive/Pipe here
})
export class UserComponent implements OnInit{
  
  constructor() {
  }

}
```

## Standalone APIs

To take the Standalone Component experience to the next level, Angular introduced Standalone APIs, its already available for Router and HttpClient, and even libraries like NgRx also introduced the Standalone APIs.

Let's see the code sample below to use Standalone APIs for Http and Router

```typescript

providers: [
    provideHttpClient(),
       provideRouter(
      routes,
      withDebugTracing(),
      withEnabledBlockingInitialNavigation() //required for SSR
      withHashLocation(),
      withPreloading( PreloadAllModules),
      withRouterConfig({
        onSameUrlNavigation: 'reload',
      })
    ),
]
```

## Standalone Component Migration

Of course, we now have Standalone Components but think about the effort you and your team have to go through to convert all components to Standalone, dont worry; the Angular teams have your back, run the below command and migrate all components, directives, and pipes to Standalone, Happy migration.

```bash
ng generate @angular/core:standalone
```

## functional guards

Router guards are great, but we had to write a service every time we had to write a guard. It all changed with the introduction of the functional guard. Guards can be a function now. No need to write a class anymore.

```typescript
const authGuard: CanMatchFn = () => {
  const authService = inject(LoginService);
  const router = inject(Router);

  if (authService.isLoggedIn) {
    return true;
  }

  return router.parseUrl('/login');
};
```

## New Image Directive

It's 2023, and images are among the most critical reasons for bad LCP(Largest Conentful Page). You dont need to care about this anymore with the introduction of the NgOptimizedImage directive.

# Listening to Community

## Optional ZoneJS

If you are an Angular developer, you know what zone.js is. It is responsible for all the magic in Angular around change detection.

But it starts giving performance hits in large enterprise applications, and enterprise is where Angular shines.

Finally, we will have an optional zone for our Applications. Signals are coming to Angular, and it will make zone.js optional, and a good thing it's backward compatible. It means you can still have an existing app with zone.js and run these new components, which are signals side by side. There are ways to disable zone.js, but it's not very straightforward.

In the below sample `signals: true` property will land soon, but not available with `16.0.0-next.7` version

```typescript
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-counter',
  standalone: true,
  signals: true, // you can still try this code by commenting this line
  imports: [CommonModule],
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export default class CounterComponent {
  count = signal(0);

  increment() {
    this.count.update(n => n + 1);
  }

}
```

```xml
<p>counter works!</p>
{{ count() }}

<button (click)="increment()">Increment</button>
```

But Signals will bring more than just optional zone.js. you can read more on the RFC

<https://github.com/angular/angular/discussions/49685>

<https://github.com/angular/angular/discussions/49684>

<https://github.com/angular/angular/discussions/49682>

<https://github.com/angular/angular/discussions/49683>

<https://github.com/angular/angular/discussions/49681>

## SSR and hydration

SSR in Angular has many issues today. SSR in Angular is less famous than other React or Vue-based SSR frameworks. The Angular team has started improving the SSR experience and released the first feature.

{% twitter 1643324830761259008%}

## Typed Forms

Angular has types of forms ReactiveForms and Template Driven forms. The community wanted forms to be typed for a long time, and it finally landed in Angular 14.

Yes, you can create typed forms now, and chances are you are already using them.

```typescript
  form: FormGroup = this.fb.group({
    name: new FormControl<string>(''),
    salary: new FormControl<number>(0),
    age: new FormControl<number>(0),
    dob: new FormControl<Date>(new Date()),
  });
constructor(private fb: FormBuilder) {}
```

# Conclusion

I tried to summarize all the fantastic things Angular is going to bring to you as a developer. I am looking at a great future investing in Angular as I did six years ago when I picked up Angular and transitioned from a .Net developer to Angular Developer.

Investing my time in learning and supporting the Angular framework was worth it in the Past, which is still rocking in the present, and I am sure with features like Signals, it will keep shining in the future.
