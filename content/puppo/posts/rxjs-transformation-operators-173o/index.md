---
{
title: "RxJS - Transformation Operators",
published: "2021-09-20T06:40:29Z",
tags: ["javascript", "typescript", "rxjs"],
description: "Welcome back, Today I'll speak about the Transformation Operators. These operators are used to modify...",
originalLink: "https://dev.to/this-is-learning/rxjs-transformation-operators-173o",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "13743",
order: 1
}
---


Welcome back,
Today I'll speak about the Transformation Operators. These operators are used to modify the value received.
But cut the chatter, and let's start.

* **[map](https://rxjs.dev/api/operators/map)**

> Applies a given project function to each value emitted by the source Observable, and emits the resulting values as an Observable.

```ts
import { interval } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

const source$ = interval(1000, ).pipe(
    take(5),
    tap(val => {
        console.log(`${new Date().toLocaleTimeString()}: Generated`, val);
    }),
)

source$.pipe(
    map(value => Math.pow(value, 2))
)
.subscribe({
    next: value => console.log(`${new Date().toLocaleTimeString()}: map`, value),
    complete: () => console.log(`${new Date().toLocaleTimeString()}: map: complete`),
})
```
```console
16:58:51: Generated 0
16:58:51: map 0
16:58:52: Generated 1
16:58:52: map 1
16:58:53: Generated 2
16:58:53: map 4
16:58:54: Generated 3
16:58:54: map 9
16:58:55: Generated 4
16:58:55: map 16
16:58:55: map: complete
```
The map operator is like the map function of the arrays.
It transforms the value using the function passed as an argument.

* **[mapTo](https://rxjs.dev/api/operators/mapTo)**

> Emits the given constant value on the output Observable every time the source Observable emits a value.

```ts
import { interval } from 'rxjs';
import { mapTo, take, tap } from 'rxjs/operators';

const source1$ = interval(1000).pipe(
    take(5),
    tap(val => {
        console.log(`${new Date().toLocaleTimeString()}: Source1 Generated`, val);
    }),
)

console.log(`${new Date().toLocaleTimeString()}: mapTo: start`)
source1$.pipe(
    mapTo(1000)
)
.subscribe({
    next: value => console.log(`${new Date().toLocaleTimeString()}: mapTo`, value),
    complete: () => console.log(`${new Date().toLocaleTimeString()}: mapTo: complete`),
})
```
```console
17:03:01: mapTo: start
17:03:02: Source1 Generated 0
17:03:02: mapTo 1000
17:03:03: Source1 Generated 1
17:03:03: mapTo 1000
17:03:04: Source1 Generated 2
17:03:04: mapTo 1000
17:03:05: Source1 Generated 3
17:03:05: mapTo 1000
17:03:06: Source1 Generated 4
17:03:06: mapTo 1000
17:03:06: mapTo: complete
```
The operator is similar to the map operator, but it returns a fixed value that does not depend on the source.


Now I start to talk about the operators: concat, exhaust, merge and switch.
These operators are similar to the others but they have some minimum differences that change their behaviour, and if you choose the wrong implementations you may not have the aspected result.

* **[concatMap](https://rxjs.dev/api/operators/concatMap)**

> Projects each source value to an Observable which is merged in the output Observable, in a serialized fashion waiting for each one to complete before merging the next.

```ts
import { interval, Observable, of } from 'rxjs';
import { concatMap, delay, take, tap } from 'rxjs/operators';

const powWithDelay$ = (value: number): Observable<number> => of(Math.pow(value, 2)).pipe(delay(2000))

const source$ = interval(1000).pipe(
    take(5),
    tap(val => {
        console.log(`${new Date().toLocaleTimeString()}: Generated`, val);
    }),
)

source$.pipe(
    concatMap(value => powWithDelay$(value))
)
.subscribe({
    next: value => console.log(`${new Date().toLocaleTimeString()}: concatMap`, value),
    complete: () => console.log(`${new Date().toLocaleTimeString()}: concatMap: complete`),
})
```
```console
17:54:07: Generated 0
17:54:08: Generated 1
17:54:09: Generated 2
17:54:09: concatMap 0
17:54:10: Generated 3
17:54:11: Generated 4
17:54:11: concatMap 1
17:54:13: concatMap 4
17:54:15: concatMap 9
17:54:17: concatMap 16
17:54:17: concatMap: complete
```
This operator is used to concatenate different observables.
The first source starts to emit the values, and the concatMap operator runs another observable for every value. The result values of the last observables are emitted as results of the operator concat.
You should remember that the concatMap operator runs only one value at a time. You can notice from the previous examples that the values 0,1 and 2 are emitted before the result of the first concatMap (0), and after that, you can notice the emission of the values 3 and 4 before the result of the second emitted value. The particular behaviour of the concatMap operator is better visible after the last generated value from the first source (4) because we can see all the concatMap results emitted every 2 seconds from each other.

Here's the marble diagram to explain better the behaviour:
![ConcatMap Marble Diagram](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7wmkcr2jyuj0rk4x1hsl.jpg)

* **[concatMapTo](https://rxjs.dev/api/operators/concatMapTo)**

> Projects each source value to the same Observable which is merged multiple times in a serialized fashion on the output Observable.

```ts
import { interval } from 'rxjs';
import { concatMapTo, skip, take, tap } from 'rxjs/operators';

const source1$ = interval(1000, ).pipe(
    skip(2),
    take(2),
    tap(val => {
        console.log(`${new Date().toLocaleTimeString()}: Source1 Generated`, val);
    }),
)

const source2$ = interval(2000, ).pipe(
    take(2),
    tap(val => {
        console.log(`${new Date().toLocaleTimeString()}: Source2 Generated`, val);
    }),
)

console.log(`${new Date().toLocaleTimeString()}: concatMapTo: start`)
source1$.pipe(
    concatMapTo(source2$)
)
.subscribe({
    next: value => console.log(`${new Date().toLocaleTimeString()}: concatMapTo`, value),
    complete: () => console.log(`${new Date().toLocaleTimeString()}: concatMapTo: complete`),
})
```
```console
18:12:28: concatMapTo: start
18:12:31: Source1 Generated 2
18:12:32: Source1 Generated 3
18:12:33: Source2 Generated 0
18:12:33: concatMapTo 0
18:12:35: Source2 Generated 1
18:12:35: concatMapTo 1
18:12:37: Source2 Generated 0
18:12:37: concatMapTo 0
18:12:39: Source2 Generated 1
18:12:39: concatMapTo 1
18:12:39: concatMapTo: complete
```
This operator is like the concatMap apart from the fact that it returns another observable that does not depend on the value received.
It can be used when an observable emit a value and we need to run another observable.
For example, we have a source that is a timer, and on every tick, we need to call an API. If we use the concatMapTo we can implement this solution easier.

* **[exhaustMap](https://rxjs.dev/api/operators/exhaustMap)**

> Projects each source value to an Observable which is merged in the output Observable only if the previous projected Observable has completed.

```ts
import { interval, Observable, of } from 'rxjs';
import { delay, exhaustMap, take, tap } from 'rxjs/operators';

const powWithDelay$ = (value: number): Observable<number> => of(Math.pow(value, 2)).pipe(delay(2000))

const source$ = interval(1000, ).pipe(
    take(5),
    tap(val => {
        console.log(`${new Date().toLocaleTimeString()}: Generated`, val);
    }),
)

source$.pipe(
    exhaustMap(value => powWithDelay$(value))
)
.subscribe({
    next: value => console.log(`${new Date().toLocaleTimeString()}: exhaustMap`, value),
    complete: () => console.log(`${new Date().toLocaleTimeString()}: exhaustMap: complete`),
})
```
```console
18:17:47: Generated 0
18:17:48: Generated 1
18:17:49: Generated 2
18:17:49: exhaustMap 0
18:17:50: Generated 3
18:17:51: Generated 4
18:17:52: exhaustMap 9
18:17:52: exhaustMap: complete
```

The exhaustMap operator syntactically is equal to the concat operator, but it has a different behavior: this operator during the execution of a projection ignores all other values received until the execution is not ended. If you see the result in the console of the before example, you can notice that the power of the values 1, 2, and 4 has never been shown.

The marble diagram of the exhaustMap operator in the previous example:
![ExhaustMap Marble Diagram](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/o5heddkiwdmbj3uyehot.jpg)

* **[mergeMap](https://rxjs.dev/api/operators/mergeMap)**

> Projects each source value to an Observable which is merged in the output Observable.

```ts
import { interval, Observable, of } from 'rxjs';
import { delay, mergeMap, take, tap } from 'rxjs/operators';

const powWithDelay$ = (value: number): Observable<number> => of(Math.pow(value, 2)).pipe(delay(2000))

const source$ = interval(1000, ).pipe(
    take(5),
    tap(val => {
        console.log(`${new Date().toLocaleTimeString()}: Generated`, val);
    }),
)

source$.pipe(
    mergeMap(value => powWithDelay$(value))
)
.subscribe({
    next: value => console.log(`${new Date().toLocaleTimeString()}: mergeMap`, value),
    complete: () => console.log(`${new Date().toLocaleTimeString()}: mergeMap: complete`),
})
```
```console
18:18:16: Generated 0
18:18:17: Generated 1
18:18:18: Generated 2
18:18:18: mergeMap 0
18:18:19: mergeMap 1
18:18:19: Generated 3
18:18:20: mergeMap 4
18:18:20: Generated 4
18:18:21: mergeMap 9
18:18:22: mergeMap 16
18:18:22: mergeMap: complete
```
The mergeMap operator is syntactically like concat and exhaust but it executes the projection as soon as a value arrives. This behaviour can open some strange cases, for example, it's not guaranteed the order of the result values with the order of the source values.
Let me give an example: we have a source that emits some values every 500ms, in the mergeMap operator we call an http API; the first value calls the API and the response arrives after 1.5seconds, the second value calls the same api but the response arrives after 200ms. The mergeMap operator in this case emits the result of the second value primarily and the result of the first one secondly.
As you can imagine, in some cases this behaviour can be wrong or unexpected, so, if you need to use the mergeMap operator, remember what I said before and ask yourself if it can produce some side effects or if it is the right solution of your problems.

Here is the MergeMap marble Diagram of the previous example:
![MergeMap Marble Diagram](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/z72t3ufmngyub6m1okpn.jpg)


* **[mergeMapTo](https://rxjs.dev/api/operators/mergeMapTo)**

> Projects each source value to the same Observable which is merged multiple times in the output Observable.

```ts
import { interval } from 'rxjs';
import { mergeMapTo, skip, take, tap } from 'rxjs/operators';

const source1$ = interval(1000, ).pipe(
    skip(2),
    take(2),
    tap(val => {
        console.log(`${new Date().toLocaleTimeString()}: Source1 Generated`, val);
    }),
)

const source2$ = interval(2000, ).pipe(
    take(2),
    tap(val => {
        console.log(`${new Date().toLocaleTimeString()}: Source2 Generated`, val);
    }),
)

console.log(`${new Date().toLocaleTimeString()}: mergeMap: start`)
source1$.pipe(
    mergeMapTo(source2$)
)
.subscribe({
    next: value => console.log(`${new Date().toLocaleTimeString()}: mergeMap`, value),
    complete: () => console.log(`${new Date().toLocaleTimeString()}: mergeMap: complete`),
})
```
```console
18:18:53: mergeMap: start
18:18:56: Source1 Generated 2
18:18:57: Source1 Generated 3
18:18:58: Source2 Generated 0
18:18:58: mergeMap 0
18:18:59: Source2 Generated 0
18:18:59: mergeMap 0
18:19:00: Source2 Generated 1
18:19:00: mergeMap 1
18:19:01: Source2 Generated 1
18:19:01: mergeMap 1
18:19:01: mergeMap: complete
```
This operator is like the mergeMap apart from the fact that it returns another observable that does not depend on the value received.
It can be used when an observable emits a value and we need to run another observable.
In simple words, it's like the concatMapTo with the behaviour of the mergeMap operator behind the scene.

* **[switchMap](https://rxjs.dev/api/operators/switchMap)**

> Projects each source value to an Observable which is merged in the output Observable, emitting values only from the most recently projected Observable.

```ts
import { interval, Observable, of } from 'rxjs';
import { delay, switchMap, take, tap } from 'rxjs/operators';

const powWithDelay$ = (value: number): Observable<number> => of(Math.pow(value, 2)).pipe(delay(2000))

const source$ = interval(1000, ).pipe(
    take(5),
    tap(val => {
        console.log(`${new Date().toLocaleTimeString()}: Generated`, val);
    }),
)

source$.pipe(
    switchMap(value => powWithDelay$(value))
)
.subscribe({
    next: value => console.log(`${new Date().toLocaleTimeString()}: switchMap`, value),
    complete: () => console.log(`${new Date().toLocaleTimeString()}: switchMap: complete`),
})
```
```console
18:19:16: Generated 0
18:19:17: Generated 1
18:19:18: Generated 2
18:19:19: Generated 3
18:19:20: Generated 4
18:19:22: switchMap 16
18:19:22: switchMap: complete
```
The switchMap operator is syntactically like concat, exhaust and merge. It executes the projection as soon as a value arrives, but when a new value arrives, if the projection of the previous value is in execution, it kills it and starts the execution of the projection for the new value.
It can be used for example for searching the data of an autocomplete input. When the user types a new letter and emits a new value, with this operator we can stop the previous search if it's on execution and start the new one.

Here is the SwitchMap marble Diagram of the previous example:
![SwitchMap Marble Diagram](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/homky2m86l0gfq0ssrar.jpg)

* **[switchMapTo](https://rxjs.dev/api/operators/switchMapTo)**

> Projects each source value to the same Observable which is flattened multiple times with switchMap in the output Observable.

```ts
import { interval } from 'rxjs';
import { skip, switchMapTo, take, tap } from 'rxjs/operators';

const source1$ = interval(1000, ).pipe(
    skip(2),
    take(2),
    tap(val => {
        console.log(`${new Date().toLocaleTimeString()}: Source1 Generated`, val);
    }),
)

const source2$ = interval(2000, ).pipe(
    take(2),
    tap(val => {
        console.log(`${new Date().toLocaleTimeString()}: Source2 Generated`, val);
    }),
)

console.log(`${new Date().toLocaleTimeString()}: switchMap: start`)
source1$.pipe(
    switchMapTo(source2$)
)
.subscribe({
    next: value => console.log(`${new Date().toLocaleTimeString()}: switchMap`, value),
    complete: () => console.log(`${new Date().toLocaleTimeString()}: switchMap: complete`),
})
```
```console
18:19:38: switchMap: start
18:19:41: Source1 Generated 2
18:19:42: Source1 Generated 3
18:19:44: Source2 Generated 0
18:19:44: switchMap 0
18:19:46: Source2 Generated 1
18:19:46: switchMap 1
18:19:46: switchMap: complete
```
This operator is like the switchMap apart from the fact that it returns another observable that does not depend on the value received.
It can be used when an observable emits a value and we need to run another observable.
In simple words, it's like the concatMapTo or the mergeMapTo with the behaviour of the switchMap operator behind the scene.


_with this operator, we have finish the explanation of the 4 "special" operators (concat, exhaust, merge and switch). As you can see they are similar to each other but if you choose the wrong one it can produces some unexpected side effects.
I hope these examples can help you in future to choose the right operator for you_


* **[pairwise](https://rxjs.dev/api/operators/pairwise)**

> Groups pairs of consecutive emissions together and emits them as an array of two values.

```ts
import { of } from 'rxjs';
import { pairwise } from 'rxjs/operators';

const source$ = of(1, 2, 3, 4, 5);

source$.pipe(
    pairwise()
)
.subscribe({
    next: value => console.log(`${new Date().toLocaleTimeString()}: pairwise`, value),
})
```
```console
18:20:02: pairwise [ 1, 2 ]
18:20:02: pairwise [ 2, 3 ]
18:20:02: pairwise [ 3, 4 ]
18:20:02: pairwise [ 4, 5 ]
```
This operator is used to get as result a tuple where in the first index there is the previous value and in the second index there is the current value. As you can imagine, if your source emits only one value the pairwise operator will never emit a value.


* **[scan](https://rxjs.dev/api/operators/scan)**

> Useful for encapsulating and managing state. Applies an accumulator (or "reducer function") to each value from the source after an initial state is established -- either via a seed value (second argument), or from the first value from the source.

```ts
import { of } from 'rxjs';
import { scan } from 'rxjs/operators';

const source$ = of(1, 2, 3, 4, 5);

source$.pipe(
    scan((acc, curr) => acc + curr, 0)
)
.subscribe({
    next: value => console.log(`${new Date().toLocaleTimeString()}: scan`, value),
})
```
```console
18:20:26: scan 1
18:20:26: scan 3
18:20:26: scan 6
18:20:26: scan 10
18:20:26: scan 15
```
This operator is similar to the [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) method of the array. We can create an accumulator and every time a new value is emitted from the source we can update this accumulator and return it as result.

Ok, that's all from the Transformation Operators, I hope this examples can help you in future and I hope you have achieved a clear idea of how and when to use these operators.

[Here](https://github.com/Puppo/rxjs-getting-started/tree/07-transformation-operators) you can find all the code examples.

See you soon Guys
Bye Bye!

