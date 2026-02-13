---
{
title: "RxJS - Marble Testing",
published: "2021-10-08T06:16:39Z",
edited: "2021-10-13T11:44:12Z",
tags: ["javascript", "typescript", "rxjs"],
description: "Hello Folks 👋! Today it's time to speak about testing and how to test the code when we use...",
originalLink: "https://https://dev.to/playfulprogramming/rxjs-marble-testing-2gg9",
coverImg: "cover-image.png",
socialImg: "social-image.png",
collection: "RxJS - Getting Started",
order: 15
}
---

Hello Folks 👋!
Today it's time to speak about testing and how to test the code when we use RxJS.
Before moving our focus to the testing, I need to explain two different types of Observables: cold and hot.

# Hot and Cold

When you create an Observable, you can create a hot or a cold observable. This characteristic depends on where the producer of this Observable is set; when the producer is created by the Observable, the observable is "cold", instead when the producer is created out from the observable it is defined "hot".
Let me shed some light on all these words.
**What's a producer?**
The producer is the source of the values of our observable.
**Cold Observables**
Cold Observables are functions that create the producer and manage it for all its life. The cold observable is in charge of these things:

1. create the producer
2. activate the producer
3. start listening to the producer
4. unicast
5. close the producer

Here's an example:

```ts
const source = new Observable((observer) => {
  const socket = new WebSocket('ws://someurl');
  socket.addEventListener('message', (e) => observer.next(e));
  return () => socket.close();
});
```

**Hot Observables**
An observable is “hot” if its underlying producer is either created or activated outside of subscription.

1. shares a reference to a producer
2. starts listening to the producer
3. multicast (usually)

Here's an example:

```ts
const socket = new WebSocket('ws://someurl');
const source = new Observable((observer) => {
  socket.addEventListener('message', (e) => observer.next(e));
});
```

Ok, I think that now you have an idea of the difference between these two types and I can move to the topic of the day, but if you are interested in deepen this argument [here](https://benlesh.medium.com/hot-vs-cold-observables-f8094ed53339) is a post about Hot and Cold written by [Ben Lesh](https://twitter.com/BenLesh).

# Marble Testing

To test our code in RxJS we use Marble testing. A method that combines the [Marble Diagram](https://https://dev.to/playfulprogramming/rxjs-marble-diagrams-4jmg) with the code, and allows us to represent the behaviours of our observables and translate them to something that the Testing Framework can understand.

## Marble Syntax

As you can imagine, the marble testing has its own syntax to represent the behaviours and here you can find its rules:

- ` ` whitespace: horizontal whitespace is ignored, and can be used to help vertically align multiple marble diagrams.
- `-` frame: 1 "frame" of virtual time passing (see above description of frames).
- `[0-9]+[ms|s|m]` time progression: the time progression syntax lets you progress virtual time by a specific amount. It's a number, followed by a time unit of ms (milliseconds), s (seconds), or m (minutes) without any space between them, e.g. a 10ms b.
- `|` complete: The successful completion of an observable. This is the observable producer signaling complete().
- `#` error: An error terminating the observable. This is the observable producer signaling error().
- `[a-z0-9]` e.g. 'a' any alphanumeric character: Represents a value being emitted by the producer signaling next().
- `()` sync groupings: When multiple events need to be in the same frame synchronously, parentheses are used to group those events.
- `^` subscription point: (hot observables only) shows the point at which the tested observables will be subscribed to the hot observable. This is the "zero frame" for that observable, every frame before the ^ will be negative. Negative time might seem pointless, but there are in fact advanced cases where this is necessary, usually involving ReplaySubjects.

## [TestScheduler](https://rxjs.dev/api/testing/TestScheduler)

The TestScheduler is the magician that translates the Marble Syntax to something that the Test Framework can understand. It's important to remember that we cannot use the TestScheduler to test our code all the time. For example, if the code consumes a Promise we cannot use it but we should use a traditional method.
The TestScheduler exposes us some APIs that we can use to write our tests but we start from its initialization.

```ts
import { TestScheduler } from 'rxjs/testing';

describe('Marble Testing', () => {
    let testScheduler: TestScheduler;

    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
    });
});
```

*N.B. all the examples use [jest](https://jestjs.io/) as Testing Framework*

As you can see, it's important to create a new TestScheduler for every test, this allows us to have a new instance for every test and create a clean case. But the weird thing in this code is the body of the code passing to the TestScheduler. This code is particular if you are confident with any test framework because in this function we have already indicated the expectations of the test, but we haven't written one yet. This, because the TestScheduler exposes some helpers to test the code and these helpers call the function indicated in the constructor of the  TestScheduler to check the failure or the success of the test.

But let's see a concrete example:

```ts
import { TestScheduler } from 'rxjs/testing';

describe('Marble Testing', () => {
    let testScheduler: TestScheduler;

    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
    });
    
    it('test', () => {
        testScheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;
            const source$ = cold('-a-b-c|');
            const expected = '-a-b-c|';
        
            expectObservable(source$).toBe(expected);
        });
    });

});
```

In this example, we created a cold Observable that emits 3 values: a, b and c. Using the expectObservable helper we can test our observable by comparing it with the expectation passed to the toBe method.
Now let's add some dynamism to our tests and see how to pass values to our observable inside of the tests.

```ts
import { TestScheduler } from 'rxjs/testing';

describe('Marble Testing', () => {
    let testScheduler: TestScheduler;

    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
    });

    it('test with values', () => {
        testScheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;
            const source$ = cold('-a-b-c|', { a: 1, b: 2, c: 3 });
            const expected = '-a-b-c|';
        
            expectObservable(source$).toBe(expected, { a: 1, b: 2, c: 3 });
        });
    });
});
```

In this example, you can see that we can pass another argument to the cold function. This argument is an object where the fields are the correspondents of the value passed in the marble string, so if you use a, b, and c in the marble string you have to use a, b, and c as fields of your argument. The values of these fields are the values used by the test and emitted by the observable. The same goes for the toBe method, it accepts another argument where we can pass the expected result values.
Another important concept when you test your observables is the time, in these cases, it's possible to specify after how much time an observable emits a value or after how much time a value is expected. Here, an example using the `concatMap` operator combined with the `delay` operator that delays the result by 100ms.

```ts
import { concatMap, delay, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

describe('Marble Testing', () => {
    let testScheduler: TestScheduler;

    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
    });
    
    it('test', () => {
        testScheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;
            const source$ = cold('-a-b-c|');
            const final$ = source$.pipe(concatMap(val => of(val).pipe(delay(100))));
            const expected = '- 100ms a 99ms b 99ms (c|)';
            expectObservable(final$).toBe(expected);
        });
    });

});
```

In the previous examples I showed you how to test cold Observables, but you can test hot observables too.
One of the important concepts, when you create a hot Observable, is that you can indicate when the observables are subscribed, and you can do that using the `^` character.
When you indicate the subscription you might remember that your results start from the subscription and the values emitted before are ignored by the test. You can see an example below.

```ts
import { TestScheduler } from 'rxjs/testing';

describe('Marble Testing', () => {
    let testScheduler: TestScheduler;

    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
    });
    
    it('test', () => {
        testScheduler.run((helpers) => {
            const { hot, expectObservable } = helpers;
            const source$ = hot('-a-b-^-c|');
            const expected = '--c|';
            expectObservable(source$).toBe(expected);
        });
    });

});
```

The last test case that I'll show you today is how to test the subscriptions. Sometimes could be necessary to test when an observable is subscribed and for how much time.
Let me use an example: we have two observables combined together using a concat operator, in this case, we need to test if the first observable is subscribed and when it is completed we need to check if the second observable is subscribed.
While you are before these cases, you need to use the `expectSubscriptions` helper. This helper allows you to check the subscriptions of an observable and detects when the observable is subscribed and when is unsubscribed.
Here you can find the example explained above.

```ts
import { concat } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

describe('Marble Testing', () => {
    let testScheduler: TestScheduler;

    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
    });
    
    it('test subscriptions', () => {
        testScheduler.run((helpers) => {
            const { cold, expectObservable, expectSubscriptions } = helpers;
            const source1$ = cold('-a-b-c|');
            const source2$ = cold('-d-e-f|');
            const final$ = concat(source1$, source2$);

            const expected = '-a-b-c-d-e-f|';
            const expectedSubscriptionsSource1 = '^-----!';
            const expectedSubscriptionsSource2 = '------^-----!';

            expectObservable(final$).toBe(expected);
            expectSubscriptions(source1$.subscriptions).toBe(expectedSubscriptionsSource1);
            expectSubscriptions(source2$.subscriptions).toBe(expectedSubscriptionsSource2);
        });
    });

});
```

Ok guys, I think that's enough for today. [Here](https://github.com/Puppo/rxjs-getting-started/tree/15-testing) you can find the code of this article.
But before I let you go, I have bad news unfortunately, this is the last article of the series, so today there will be some special regards.
I hope you enjoyed this series and you understood better the RxJS world.
Thanks for having read the series and if you have any doubts don't hesitate to contact me, I will be happy to help you.

I will be back soon with new contents, see you soon guys, stay subscribed, and bye-bye.
