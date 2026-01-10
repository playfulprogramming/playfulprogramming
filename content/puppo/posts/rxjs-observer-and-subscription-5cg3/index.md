---
{
title: "RxJS - Observer and Subscription",
published: "2021-09-08T05:31:15Z",
edited: "2021-09-09T07:07:03Z",
tags: ["javascript", "typescript", "rxjs"],
description: "Welcome back guys, today the topics of the article are Observers and Subscriptions.         ...",
originalLink: "https://dev.to/this-is-learning/rxjs-observer-and-subscription-5cg3",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "13743",
order: 1
}
---

Welcome back guys,
today the topics of the article are **Observers** and **Subscriptions**.

## Observer

An observer is a consumer of values. An observer is something that is interested to the emitted values by the observable. In RxJS an Observer is simply a set of callbacks (next, error, complete).
Here's a simple example of an observer

```ts
import { Observer } from "rxjs";

const observer: Observer<string> = {
  next: (value: string) =>
    console.log(`[observer] next`, value),
  error: (error: Error) =>
    console.error(`[observer] error`, error),
  complete: () =>
    console.log(`[observer] complete!`),
};
```

As you can see an observer has three callbacks, one for each type of notification that an Observable may emit. Every callback can react in the base of the observable event notification.
An observer could have not all the three callbacks defined because maybe it doesn't want to react to all the notifications. In these cases, you can create an observer with the only callbacks you need.

```ts
import {
  NextObserver,
  ErrorObserver,
  CompletionObserver,
} from "rxjs";

const nextObserver: NextObserver<string> = {
  next: (value: string) =>
    console.log(`[nextObserver] next`, value),
};

const errorObserver: ErrorObserver<string> = {
  error: (error: Error) =>
    console.error(`[errorObserver] error`, error),
};

const completeObserver: CompletionObserver<string> = {
  complete: () =>
    console.log(`[completeObserver] complete!`),
};
```

It's possible to define a NextObserver without the next property but indicating only the body of the next method, in this case, the observer by default is of the type NextObserver.

```
const defaultNextObserver: (value: string) => void = (value: string) =>
    console.log(`${new Date().toISOString()} - [defaultNextObserver] next`, value)
```

## Subscription

A Subscription is an actor that decides when an Observable must be listened and when we can stop listening to it.
Until an observable is not subscribed in your code nothing happens, but as soon as you create a subscription, the magic starts.
A Subscription in RxJS is an object created using the method "subscribe" and it has one main method: "unsubscribe"; this method allows you to stop listening the observable event.
*In your code is **important** to call the "unsubscribe" when you no longer need the subscription, this prevent problems as the memory leaks.*
An example of a Subscription

```ts
import { Subscription } from "rxjs";

const observer = (value: string) => console.log(`[unsubscribe method] next`, value)

const subscription: Subscription = observable.subscribe(observer);
subscription.unsubscribe();
```

Another pretty feature in RxJS Subscription is the "add" method; this method allows you to collect more subscriptions inside of one Subscription instance and after that, you can unsubscribe all the subscriptions at once time.

```ts
import { Subscription } from "rxjs";

const subscription: Subscription = observable.subscribe((value: string) =>
  console.log(
    `[unsubscribe 1 method] next`,
    value
  )
);
subscription.add(
  observable.subscribe((value: string) =>
    console.log(
      `[unsubscribe 2 method] next`,
      value
    )
  )
);

subscription.unsubscribe();
```

In some cases when you call the unsubscribe method you need to run some special code in your observable: RxJS let us do this using a special syntax inside of the observable declaration. When you create the observable you can return a function that the library invokes in the future during the unsubscription. Below a simple example to understand better the problem and the solution:

```ts
import {
  Observable,
  Subscriber,
  Subscription,
} from "rxjs";

const observableWithCallback = new Observable<string>(
  (subscriber: Subscriber<string>) => {
    let count = 0;
    const id = setInterval(() => {
      subscriber.next(`Count: ${++count}`);
    }, 300);

    return () => {
      console.log("On UnSubscription");
      clearInterval(id);
    };
  }
);

const subscriptionObservableWithCallback: Subscription = observableWithCallback.subscribe({
  next: (value: string) =>
    console.log(`[observableWithCallback] Next: ${value}`),
});
setTimeout(() => {
  subscriptionObservableWithCallback.unsubscribe();
}, 3000);

```

```console
[observableWithCallback] Next: Count: 1
[observableWithCallback] Next: Count: 2
[observableWithCallback] Next: Count: 3
[observableWithCallback] Next: Count: 4
[observableWithCallback] Next: Count: 5
[observableWithCallback] Next: Count: 6
[observableWithCallback] Next: Count: 7
[observableWithCallback] Next: Count: 8
[observableWithCallback] Next: Count: 9
On UnSubscription
```

Ok, guys, that's all for today.
In the next article we'll see the last fundamental of RxJS: the *Operator* and later, we can move to see the features of this Library.

You can find the examples of this article [here](https://github.com/Puppo/rxjs-getting-started/tree/02-observer-and-subscription).

See you soon guys!
