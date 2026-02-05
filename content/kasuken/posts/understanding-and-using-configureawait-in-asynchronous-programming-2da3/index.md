---
{
title: "Understanding and Using ConfigureAwait in Asynchronous Programming",
published: "2023-05-29T12:22:00Z",
tags: ["csharp", "async", "dotnet", "dotnetcore"],
description: "In this article, I will explain what ConfigureAwait is, why it is important to use it correctly, and...",
originalLink: "https://dev.to/this-is-learning/understanding-and-using-configureawait-in-asynchronous-programming-2da3",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

In this article, I will explain what `ConfigureAwait` is, why it is important to use it correctly, and how to use it with some code examples.

## What is ConfigureAwait?

`ConfigureAwait` is a method that can be used on any `Task` or `Task<T>` object to configure how the `await` keyword behaves when awaiting that task. It takes a boolean parameter called `continueOnCapturedContext`, which determines whether the continuation after the `await` should run on the same context as the one that started the task.

What is a context? A context is an abstraction that represents some state or environment associated with a thread of execution. For example, in a UI application, the context is typically the UI thread and its associated message loop. In an ASP.NET application, the context is the HTTP request and its associated state. A context can also be a custom implementation that provides some specific behavior.

The default behavior of `await` is to capture the current context when the task is started, and resume the continuation on that same context when the task is completed. This ensures that the continuation can access the same state and resources as the original code. However, this behavior can also cause some problems, such as:

- Deadlocks: If the captured context is blocked by another operation that depends on the completion of the task, a deadlock can occur. For example, if a UI thread is waiting synchronously for a task that needs to resume on the UI thread, a deadlock will happen.
- Performance: If the captured context is a UI thread or a thread pool thread, resuming the continuation on that context can cause unnecessary context switches and delays. For example, if a UI thread is busy processing other messages, resuming the continuation on that thread can take longer than resuming on another available thread.
- Scalability: If the captured context has a limited capacity for processing operations, resuming too many continuations on that context can exhaust its resources and degrade its responsiveness. For example, if an ASP.NET application has a fixed number of threads to handle requests, resuming too many continuations on those threads can reduce its throughput and increase its latency.

To avoid these problems, we can use `ConfigureAwait(false)` to tell `await` not to capture and resume on the current context, but instead resume on any available thread. This can improve performance, scalability and avoid deadlocks in some scenarios. However, it also means that we lose access to the original context and its state in the continuation, so we need to be careful not to access any context-dependent resources or code in that case.

## Why is ConfigureAwait important?

`ConfigureAwait` is important because it allows us to control how `await` behaves in different contexts and scenarios. Depending on our needs and goals, we can choose to use `ConfigureAwait(true)` or `ConfigureAwait(false)` to optimize our code for performance, scalability or correctness.

As a general rule of thumb:

- Use `ConfigureAwait(true)` (or omit it) when you need to access the original context or its state in the continuation. For example, if you need to update the UI or access some UI-dependent resources after awaiting a task.
- Use `ConfigureAwait(false)` when you don't need to access the original context or its state in the continuation. For example, if you are doing some CPU-bound or I/O-bound work that doesn't depend on any specific context.

However, there are some exceptions and caveats to this rule:

- If you are writing a library or a reusable component that can be used by different types of applications (UI or non-UI), you should always use `ConfigureAwait(false)` unless you have a good reason not to. This way, you avoid imposing any unnecessary constraints or assumptions on your consumers about their contexts and how they want to use your code.
- If you are writing an ASP.NET application (or any other application that uses a synchronization context), you should be aware that using `ConfigureAwait(false)` can change some behaviors and expectations of your code. For example, using `ConfigureAwait(false)` can break some features that rely on accessing HttpContext.Current or other request-specific state in your continuations. You should also be careful not to mix synchronous and asynchronous code in your controllers or handlers, as this can cause deadlocks even if you use `ConfigureAwait(false)`. For more details and best practices, see this article by Stephen Cleary.
- If you are writing a unit test for your asynchronous code, you should use `ConfigureAwait(true)` (or omit it) unless you have a good reason not to. This way, you ensure that your test runs in the same way as your production code would run in its intended context. Using `ConfigureAwait(false)` in your test can hide some potential issues or bugs that would only manifest in certain contexts.

## How to use ConfigureAwait?

Using `ConfigureAwait` is very simple: just append it to any `Task` or `Task<T>` object before awaiting it, and pass either `true` or `false` as the parameter. For example:

```csharp
// Capture and resume on the current context
await DoSomethingAsync().ConfigureAwait(true);

// Don't capture and resume on any available thread
await DoSomethingAsync().ConfigureAwait(false);
```

Note that `ConfigureAwait` only affects how the immediate continuation after the `await` is executed. It doesn't affect any subsequent continuations or async calls in your code. For example:

```csharp
// Don't capture and resume on any available thread
await DoSomethingAsync().ConfigureAwait(false);

// Capture and resume on whatever context was current at this point
await DoSomethingElseAsync();

// Don't capture and resume on any available thread
await DoAnotherThingAsync().ConfigureAwait(false);
```

If you want to apply `ConfigureAwait(false)` consistently throughout your code (which is recommended for libraries), you can use tools like Roslynator or FxCopAnalyzers to enforce this rule and detect any violations.

## Conclusion

In this article, I explained what `ConfigureAwait` is, why it is important to use it correctly, and how to use it with some code examples.

---

Are you interested in learning GitHub but don't know where to start? Try my course on LinkedIn Learning: [Learning GitHub](https://bit.ly/learninggithub).

![LinkedIn Learning](./sdc2bpiftpadibi4h51c.gif)

---

Thanks for reading this post, I hope you found it interesting!

Feel free to follow me to get notified when new articles are out 🙂

<!-- ::user id="kasuken" -->
