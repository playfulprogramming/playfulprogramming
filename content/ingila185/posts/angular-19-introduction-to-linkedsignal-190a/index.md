---
{
title: "Angular 19 - Introduction to linkedSignal",
published: "2024-11-03T08:27:13Z",
edited: "2024-11-04T10:02:49Z",
tags: ["angular", "webdev", "javascript", "programming"],
description: "Angular 19 is on the horizon, and it’s bringing a host of exciting new features to the table. One of...",
originalLink: "https://dev.to/this-is-angular/angular-19-introduction-to-linkedsignal-190a",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

Angular 19 is on the horizon, and it’s bringing a host of exciting new features to the table. One of the most notable additions is the linkedSignal primitive, which promises to revolutionize the way we handle reactive programming in Angular applications.

## The Problem with Reset Patterns

Traditionally, implementing reset patterns in Angular involved using `computed()` signals. While effective, this approach has limitations. When you need to set the value of a signal explicitly, it becomes a read-only signal, hindering flexibility.

## The linkedSignal Solution

`linkedSignal` addresses this limitation by providing a writable signal that automatically updates its value based on changes to a source signal. This enables us to create a seamless synchronization between the two, ensuring a glitch-free user experience.

## Understanding linkedSignal

While `linkedSignal` will have multiple overloads, two of them are worth mentioning:

- **linkedSignal with Source and Computation**

This overload allows you to create a linkedSignal that computes its value based on the value of a source signal. Here's an example:

```
import { signal, linkedSignal } from '@angular/core';

  const sourceSignal = signal(0);
  const linkedSignal = linkedSignal({
    source: this.sourceSignal,
    computation: () => this.sourceSignal() * 5,
  });
```

In this example, `linkedSignal` will always be twice the value of `sourceSignal`. Whenever sourceSignal changes, `linkedSignal` will automatically recompute its value. Here’s a more real-world example of linkedSignal:

![Angular 19 linkedSignal Primitive](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/txs8jzhyrq47nvj3m1c0.png)

The `CourseDetailComponent` component accepts a `courseId` as input and displays the number of enrolled students. We aim to reset the student count whenever the selected `courseId` changes. This necessitates a mechanism to synchronize two signals: the `courseId` and the studentCount.

While the usage of `computed()` can be effective in deriving values from other signals, they are read-only. To dynamically update the studentCount based on changes in the `courseId`, we leverage the `linkedSignal` primitive. By creating a writable signal linked to the `courseId`, we can both set the studentCount explicitly and automatically update it whenever the `courseId` changes. This approach provides a robust and flexible solution for managing signal dependencies and ensuring data consistency.

- **`linkedSignal` Shorthand**


For simpler scenarios, you can use a shorthand syntax to create `linkedSignal`:

```
const sourceSignal = signal(10);
const linkedSignal = linkedSignal(() => sourceSignal() * 2);
```
This shorthand syntax is equivalent to the first overload, but it’s more concise and easier to read.

## Key Benefits of LinkedSignals

- **Simplified Reset Patterns:** Easily implement reset patterns without the complexities of computed() signals.
- **Enhanced Flexibility:** Maintain the ability to set signal values explicitly while ensuring automatic updates.
- **Improved Performance:** Optimized under the hood for efficient updates.
- **Cleaner Code:** More concise and readable code, especially for complex reactive scenarios.

## Conclusion

`linkedSignal` is a powerful new tool in Angular's reactive toolkit. By understanding its core concepts and usage patterns, you can create more robust, responsive, and user-friendly Angular applications. With its ability to combine the best aspects of `computed()` and writable signals, `linkedSignal` is poised to become an indispensable tool for Angular developers. You can learn more about `linkedSignals` [from this stackblitz](https://stackblitz.com/edit/stackblitz-starters-ejsbos?file=src%2Fmain.ts).

Github PR: [https://github.com/angular/angular/pull/58189](https://github.com/angular/angular/pull/58189)