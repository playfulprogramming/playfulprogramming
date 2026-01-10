---
{
title: "RxJS - Custom Operators",
published: "2021-10-04T06:14:29Z",
edited: "2021-10-13T11:43:40Z",
tags: ["javascript", "typescript", "rxjs"],
description: "Hi Folks 👋 after many articles in which I have illustrated the different types of operators already...",
originalLink: "https://dev.to/this-is-learning/rxjs-custom-operators-5gah",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "13743",
order: 1
}
---

Hi Folks 👋
after many articles in which I have illustrated the different types of operators already included in the RxJS library, today I show you how to create your own operators.
You can create a new operator in two ways: mixing the different operators illustrated in the previous articles or from scratch.
In common cases, when we need to create a new operator, all the behaviours that we need already exist in the operators exposed by the RxJS library. In these cases, we can use the "pipe" function to combine together the operators. With the "pipe" function you can create a new function that will be the new operator, and inside this function you can create the logic of your operator.
Here's an example
```ts
import { delay, interval, Observable, pipe, take, tap, UnaryFunction } from 'rxjs';

function takeLogAndDelay<T>(takeNumber: number, message: string, time: number): UnaryFunction<Observable<T>, Observable<T>> {
  return pipe(
    tap(x => console.log(message, x)),
    take(takeNumber),
    delay(time),
  );
}

interval(1000).pipe(
    takeLogAndDelay(10, 'Source', 2000)
).subscribe();
```
```console
Source 0
Source 1
Source 2
Source 3
Source 4
Source 5
Source 6
Source 7
Source 8
Source 9
```

As you can see, in the last example I created a new operator called "takeLogAndDelay". This operator combines together three operators: tap, take and delay.
As you can see, it's easy to create a new operator of this type and you just need to flow these rules:
- create a new function with the name of the new operator
- return the pipe function
- combine the operators in the pipe function

In 95% of your cases, you can resolve your problem and create a new operator using this method, while in the 5% of the cases not managed by this method you can create a new operator from scratch.
Below an example of the delay operator created from scratch.
```ts
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

function delay<T>(delayInMs: number) {
  return (observable: Observable<T>) =>
    new Observable<T>((subscriber) => {
      const allTimerIDs = new Set<NodeJS.Timeout>();
      let hasCompleted = false;
      const subscription = observable.subscribe({
        next(value) {
          const timerID = setTimeout(() => {
            subscriber.next(value);
            allTimerIDs.delete(timerID);
            if (hasCompleted && allTimerIDs.size === 0) {
              subscriber.complete();
            }
          }, delayInMs);

          allTimerIDs.add(timerID);
        },
        error: subscriber.error,
        complete() {
          hasCompleted = true;
          if (allTimerIDs.size === 0) {
            subscriber.complete();
          }
        },
      });

      return () => {
        subscription.unsubscribe();
        allTimerIDs.forEach((timerID) => clearTimeout(timerID));
      };
    });
}

of(1, 2, 3).pipe(
    tap((value) => console.log(new Date().toLocaleTimeString(), "before", value)),
    delay(3000)
).subscribe({
    next: (value) => console.log(new Date().toLocaleTimeString(), "after", value),
});
```
```console
22:11:01 before 1
22:11:01 before 2
22:11:01 before 3
22:11:04 after 1
22:11:04 after 2
22:11:04 after 3
```
As you can see, we can create a new operator and manage all the behaviours needed for our logic using the Observable constructor. It's rare to use this approach but if you find yourself in front of a case not yet solved by the existing operators, you can rely on it.

Ok guys, that's all for today.

See you soon
Bye bye 👋 
