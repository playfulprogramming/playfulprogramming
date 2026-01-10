---
{
title: "RxJS - Multicast Operator",
published: "2021-10-01T06:23:32Z",
tags: ["javascript", "typescript", "rxjs"],
description: "Hi Folk 👋, in the previous articles we've seen that when we subscribe to an observable, the...",
originalLink: "https://dev.to/this-is-learning/rxjs-multicast-operator-1k9i",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "13743",
order: 1
}
---

Hi Folk 👋,
in the previous articles we've seen that when we subscribe to an observable, the observable restarts every time and do not remember the last value emitted.
In some cases, this behaviour can not be the right solution, so today I'll show you how to share the values using the Multicast Operators.

* **[share](https://rxjs.dev/api/operators/share)**

> Returns a new Observable that multicasts (shares) the original Observable. As long as there is at least one Subscriber this Observable will be subscribed and emitting data. When all subscribers have unsubscribed it will unsubscribe from the source Observable. Because the Observable is multicasting it makes the stream hot.

```ts
/**
marble share
{
    source a:           +--0-1-2-3-4-#
    operator share:     {
        +--0-1-2-3-4-#
        ......+2-3-4-#
    }
}
*/
import { interval } from 'rxjs';
import { share, take, tap } from 'rxjs/operators';
 
const source1 = interval(1000)
.pipe(
    take(5),
    tap((x: number) => console.log('Processing: ', x)),
    share()
);

source1.subscribe({
    next: x => console.log('subscription 1: ', x),
    complete: () => console.log('subscription 1 complete'),
});

setTimeout(() => {
    source1.subscribe({
        next: x => console.log('subscription 2: ', x),
        complete: () => console.log('subscription 2 complete'),
    });
}, 3000);


setTimeout(() => {
    source1.subscribe({
        next: x => console.log('subscription 3: ', x),
        complete: () => console.log('subscription 3 complete'),
    });
}, 7000);
```
```console
Processing:  0
subscription 1:  0
Processing:  1
subscription 1:  1
Processing:  2
subscription 1:  2
subscription 2:  2
Processing:  3
subscription 1:  3
subscription 2:  3
Processing:  4
subscription 1:  4
subscription 2:  4
subscription 1 complete
subscription 2 complete
Processing:  0
subscription 3:  0
Processing:  1
subscription 3:  1
Processing:  2
subscription 3:  2
Processing:  3
subscription 3:  3
Processing:  4
subscription 3:  4
subscription 3 complete
```
![share Marble Diagram](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7kq3wgsd7p6daltyihrd.jpg)
This operator can help us when we need to share the value of an observable during its execution. But what does it mean? It means that the first subscription starts the observable and all the next subscriptions that subscribe to this observable do not run a new instance of the observable but they receive the same values of the first subscription, thus losing all the previous values emitted before their subscription.
It's important to remember that when the observable is completed, and another observer subscribes itself to the observable, the shared operator resets the observable and restarts its execution from the beginning.
Anyway, sometimes our code needs to prevent the restarting of our observables, but what can we do in these cases?
It's simple! The share operator exposes us some options: resetOnComplete, resetOnError, resetOnRefCountZero, and each of these options can help us to prevent the resetting of the observables in different cases. These options can work or with a simple boolean value that enables or disables the behaviour, or we can pass a notifier factory that returns an observable which grants more fine-grained control over how and when the reset should happen.
The resetOnComplete option prevents the resetting after the observable's completion. So, if it is enabled when another observer subscribes to an observable already completed this observer receives immediately the complete notification.
The resetOnError option prevents the resetting of the observable after an error notification.
The resetOnRefCountZero option works with the number of observers subscribed instead. It prevents the resetting if there aren't any observer subscribed. To better understand, if all the subscriptions of our observable are unsubscribed, and this option is enabled, the observable isn't reset. otherwise, if this option is disabled, the observable restarts from the beginning at the next subscription.
Here's an example using the resetOnRefCountZero option.

```ts
import { interval, timer } from 'rxjs';
import { share, take } from 'rxjs/operators';
 
const source = interval(1000).pipe(take(3), share({ resetOnRefCountZero: () => timer(1000) }));
 
const subscriptionOne = source.subscribe(x => console.log('subscription 1: ', x));
setTimeout(() => subscriptionOne.unsubscribe(), 1300);

setTimeout(() => source.subscribe(x => console.log('subscription 2: ', x)), 1700);

setTimeout(() => source.subscribe(x => console.log('subscription 3: ', x)), 5000);
```
```console
subscription 1:  0
subscription 2:  1
subscription 2:  2
subscription 3:  0
subscription 3:  1
subscription 3:  2
```
![shared with resetOnRefCountZero option Marble Diagram](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/q6ebecgs8rcymrtwz8is.jpg)

* **[shareReplay](https://rxjs.dev/api/operators/shareReplay)**

> Share source and replay specified number of emissions on subscription.

```ts
import { interval } from 'rxjs';
import { shareReplay, take, tap } from 'rxjs/operators';

const obs$ = interval(1000);
const shared$ = obs$.pipe(
  take(4),
  tap(console.log),
  shareReplay(3)
);
shared$.subscribe(x => console.log('sub A: ', x));

setTimeout(() => {
  shared$.subscribe(y => console.log('sub B: ', y));
}, 3500);
```
```console
0
sub A:  0
1
sub A:  1
2
sub A:  2
sub B:  0
sub B:  1
sub B:  2
3
sub A:  3
sub B:  3
```
![shareReplay Marble Diagram](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kud1ghis4m39geeqsuvf.jpg)
In some cases, when we share the values between multiple observers, if an observer subscribes to an already started observable, we also need to replay all the previous already emitted values. To resolve this problem we can use the shareReplay operator.
This operator shares the emitted values and if another observer subscribes to the observable it replays the previous values.
The number of values replayed can be configured: by default all the values already emitted are emitted again, but we can also indicate or a maximum number of elements to remember or a maximum time length.

Ok guys, that's all for today.
If you are interested in trying the code of this article, you can find it [here](https://github.com/puppo/rxjs-getting-started/tree/12-multicasting-operators).

In the next article, I'll show you how to create your custom operators.

See you soon!