---
{
title: "RxJS - Operators",
published: "2021-09-10T04:53:36Z",
tags: ["javascript", "typescript", "rxjs"],
description: "Hi Guys and welcome back, today I introduce the concepts of Operators. Operators are functions. Isn't...",
originalLink: "https://dev.to/this-is-learning/rxjs-operators-20mi",
coverImg: "cover-image.png",
socialImg: "social-image.png",
collection: "RxJS - Getting Started",
order: 3
}
---

Hi Guys and welcome back, today I introduce the concepts of **Operators**.
Operators are functions. Isn't it easy? Operators are functions of two types in RxJS: *Creation* or *Pipeable*.

## Creation

Creation operators are simple functions and their scope is to create new observables.

```ts
import { of } from "rxjs";

of(1, 2, 3, 4).subscribe(x => console.log("[of] result", x));
```

```console
[of] result 1
[of] result 2
[of] result 3
[of] result 4
```

The most commons creation operators are: ajax, empty, from, fromEvent, interval, of, throwError, timer, combineLatest, concat, forkJoin, merge and zip.

In the next article I'll deepen these types of operators, today I just make an overview of the operator's types.

## Pipeable

Pipeable operators are functions that take an Observable as input and return another observable. These functions are pure, so the input observable does not change but the function returns a new one. The main scopes of these operators are: transform, filter, and work with the input observable.
An example of pipeable operators:

```ts
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

new Observable<number>(observer => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.next(4);

  observer.complete();
})
  .pipe(
    map(val => val * 2),
    tap(res => {
      console.log("[pipeable tap]", res);
    })
  )
  .subscribe();
```

```
[pipeable tap] 2
[pipeable tap] 4
[pipeable tap] 6
[pipeable tap] 8
```

The pipeable operators are divided by scopes and the scopes are: Transformation, Filtering, Join, Multicasting, Error Handling, Utility, Conditional and Boolean and Mathematical and Aggregate.

As you can understand you can combine Creation operators with Pipeable operators to manage your business logic like here

```ts
import { timer } from "rxjs";
import { take } from "rxjs/operators";

timer(0, 1000)
  .pipe(take(10))
  .subscribe(x => console.log("[timer] result", x));
```

```
[timer] result 0
[timer] result 1
[timer] result 2
[timer] result 3
[timer] result 4
[timer] result 5
[timer] result 6
[timer] result 7
[timer] result 8
[timer] result 9
```

With this last article, I have introduced all the pillars to the base of the RxJS library and the Reactive Programming. In the next article, we'll start to explore the operator's world.

That's all guys,
See you soon!

*[Here](https://github.com/Puppo/rxjs-getting-started/tree/03-operators) you can find the code of this article.*
