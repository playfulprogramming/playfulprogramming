---
{
title: "RxJS - Observable",
published: "2021-09-06T05:52:55Z",
edited: "2021-09-09T07:07:18Z",
tags: ["javascript", "typescript", "rxjs"],
description: "Hi Guys, Today I want to start a little series about Reactive Programming with RxJS. I start from the...",
originalLink: "https://dev.to/this-is-learning/rxjs-observable-597e",
coverImg: "cover-image.png",
socialImg: "social-image.png",
collection: "RxJS - Getting Started",
order: 1
}
---

Hi Guys,
Today I want to start a little series about Reactive Programming with [RxJS](https://rxjs.dev/).
I start from the basic core concepts behind of this Programming Paradigm to move after and show the potentialities of the RxJS library.

The idea of this series was born some weeks ago during a refactor in an Angular application, because I noticed a lot of errors in the codebase about RxJS. The problem behind this code unfortunately is that the developers begin using the angular framework without the basics of the RxJS library and the Reactive Programming. So I decided to write some articles to show the basics behind the RxJS library and Reactive Programming in general.

A little preamble before passing on the topic of this article: RxJS is a library for composing asynchronous and event-based programs by using observable sequences. So RxJS and Reactive Programming are not the solution for all your problems, but they are good solutions in contexts where asynchronous and events are the stars. I've preferred to clarify that because sometimes programmers believe that but after having introduced the Reactive Programming, they come across with other problems because the library and the paradigm are very simple but at the same time it's easy to get hurt if you don't know how it works.

The last info about the series: the code is written in Typescript, but you can use RxJS also in vanilla javascript if you prefer.

Now let's start with the first argument, the star behind the Reactive Programming, the *Observable*.

Observables (the one who is observed) are one of the key concepts behind Reactive Programming along with Observers and Subscribers (those who observes, controls).
Observables can be a stream or a collection of datas, but you could imagine an observable like a lazy Push collection of multiple values.
To understand better the concept let me show you an example

```ts
import { Observable, Subscriber } from "rxjs";

const observable = new Observable<string>((subscriber: Subscriber<string>) => {
  subscriber.next("Hello World");
  subscriber.error(new Error("Something went wrong!"));
  subscriber.complete();
});
```

As you can see the Observable is a class that accept a subscriber (a callback function).
This subscriber has 3 main possible action:

1. **next**: The next method emits the value passing as parameter to all the subscriptions, so the system can react accordingly.
2. **error**: The error method emits an error during the execution of the observable.
3. **complete**: The complete method sets the observable closed. When this happens, all the future methods (next and error) emitted for the closed observable will be ignored.

To better understand here's another example, with its result in the console

```ts
import { Observable, Observer, Subscriber } from "rxjs";

const observer: Observer<string> = {
  next: (value: string) => console.log("next", value),
  error: (error: Error) => console.error("error", error),
  complete: () => console.log("complete!"),
};

const observable = new Observable<string>((subscriber: Subscriber<string>) => {
  subscriber.next("Hello");
  subscriber.next("World");

  subscriber.complete();

  // this will never be logged

  subscriber.error(new Error("Something went wrong!"));

  subscriber.next("Hello");
  subscriber.next("World");
});

observable.subscribe(observer);
```

```sh
next Hello
next World
complete!
```

*p.s. don't pay attention to the observer in this moment, to simplify it think that when the subscriber calls the next method, the next function in the observer will be called and the same goes for the error and complete methods*

You can notice how the subscriber calls the next method twice: first with "Hello" and after with "World" and the result is logged into the console. Next, the subscriber calls the complete method and it is registered in the console too. After that, the subscriber calls the error method and the next method twice, but in the console nothing happens. This behaviour is due to the fact that the observable is ended by the complete method so the observable no longer emits any events.
When we complete the observable, it's important to remember that all the next methods called (next, error or complete) are ignored.

That's all for now.
You can find the example at this [link](https://github.com/Puppo/rxjs-getting-started/tree/01-observable)

See you soon guys!
