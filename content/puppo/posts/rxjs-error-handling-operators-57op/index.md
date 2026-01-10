---
{
title: "RxJS - Error Handling Operators",
published: "2021-09-29T06:03:31Z",
tags: ["javascript", "typescript", "rxjs"],
description: "One of the best practice in our work is handle the errors, so today I'll show you some operators in...",
originalLink: "https://dev.to/this-is-learning/rxjs-error-handling-operators-57op",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "13743",
order: 1
}
---

One of the best practice in our work is handle the errors, so today I'll show you some operators in RxJS to handle the errors.
Let's start :)

* **[catchError](https://rxjs.dev/api/operators/catchError)**

> Catches errors on the observable to be handled by returning a new observable or throwing an error.

```ts
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
 
of('a', 'b', 'c', 'd', 1, 3).pipe(
    map((n: any) => n.toUpperCase()),
    catchError(err => {
        console.error(err.message);
        return of('A', 'B', 'C', 'D')
    }),
  )
  .subscribe(x => console.log(x));
```
```console
A
B
C
D
n.toUpperCase is not a function
A
B
C
D
```
This operator is used to catch the errors during the execution of the observables.
This operator helps us to handle the errors and prevent a bad flow of our users.

* **[retry](https://rxjs.dev/api/operators/retry)**

```ts
import { of } from 'rxjs';
import { map, retry } from 'rxjs/operators';

function toString(val: { toString: () => string }): string | never {
    console.log('toString of', val);
    if (Math.random() > 0.6)
        return val.toString()

    console.log('toString of', val, 'failed');
    throw new Error('toString failed')
}
 
of(1, 2, 3, 4, 5, 6, 7, 8, 9, 0).pipe(
    map(toString),
    retry(3)
  )
  .subscribe({
      next: x => console.log(x),
      error: error => console.error(error.message),
  });
```
```console
toString of 1
toString of 1 failed
toString of 1
toString of 1 failed
toString of 1
1
toString of 2
toString of 2 failed
toString of 1
toString of 1 failed
toString failed
```
This operator is used to retry the execution of an observable if it raises an error. We can indicate the max number of retries. If during the execution an observable raises a number of errors greater than the indicated value, the retry operator doesn't try anymore but goes out and raise the error.

* **[retryWhen](https://rxjs.dev/api/operators/retryWhen)**

> Returns an Observable that mirrors the source Observable with the exception of an error. If the source Observable calls error, this method will emit the Throwable that caused the error to the Observable returned from notifier. If that Observable calls complete or error then this method will call complete or error on the child subscription. Otherwise this method will resubscribe to the source Observable.

```ts
import { interval, timer } from 'rxjs';
import { delayWhen, filter, map, retryWhen, tap } from 'rxjs/operators';
 
interval(1000).pipe(
  map(val => {
    if (val > 5) {
      throw val;
    }
    return val;
  }),
  retryWhen(errors =>
    errors.pipe(
      tap(val => console.log(`Value ${val} was too high!`)),
      filter((_, index) => index < 3),
      delayWhen(val => timer(val * 1000))
    )
  )
).subscribe({
    next: x => console.log(x),
    error: error => console.error(error.message),
});
```
```console
0
1
2
3
4
5
Value 6 was too high!
0
1
2
3
4
5
Value 6 was too high!
0
1
2
3
4
5
Value 6 was too high!
0
1
2
3
4
5
Value 6 was too high!
```
This operator is used to retry the execution of an observable and it allows us to indicate the strategy of the retry.

I hope you have all the means now to better handle errors in your code.
It's all for today.
You can find all the code of this article [here]()

See you soon,
Bye Bye! 