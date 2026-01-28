---
{
title: "Sorry C# and Java developers, this is not how TypeScript works",
published: "2019-11-29T23:36:59Z",
edited: "2020-11-15T20:51:43Z",
tags: ["typescript", "csharp", "java", "javascript"],
description: "JavaScript is a loosely typed programming language and TypeScript does not change that.",
originalLink: "https://dev.to/this-is-learning/sorry-c-and-java-developers-this-is-not-how-typescript-works-401",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

*Cover photo by [Lina Trochez](https://unsplash.com/photos/ktPKyUs3Qjs) on [Unsplash](https://unsplash.com/).*

So you took a look at TypeScript. Classes and a C-like syntax. Seems easy enough.

Your manager *asks* you to rush the edit todo item feature in your brand new TypeScript application.

![Boss meme](./ojoxfgcj7jmt2suxmld9.jpeg)
*Boss meme by [Make a Meme](https://makeameme.org/meme/if-you-could-hk290u)*

On the server-side you have this C# class.

```csharp
// TodoItem.cs
public class TodoItem
{
    public string Id { get; set; }
    public bool IsDone { get; set; }
    public string Title { get; set; }

    public async Task Save()
    {
        // Write to database
    }
}
```

*C#: Todo item.*

On the client-side, you create a similar class.

```typescript
// todo-item.ts
class TodoItem {
  id: string;
  isDone: boolean;
  title: string;

  save(): Promise<void> {
    return fetch("/todo/" + this.id, {
      body: JSON.stringify(this),
      method: "POST",
    })
      .then(() => undefined);
  }
}
```

*TypeScript: Todo item.*

Not too bad.

We have a view for editing a todo item. The view class reads the todo item from the server using `fetch` which returns an `HttpResponse`.

```typescript
// edit-todo-item-view.ts
class EditTodoItemView {
  todoItem: TodoItem;

  onInitialize(id: string): Promise<void> {
    return this.readTodoItem(id)
      .then(todoItem => this.todoItem = todoItem)
      .then(() => undefined);
  }

  readTodoItem(id: string): Promise<TodoItem> {
    return fetch("/todo/" + id)
      .then((response: HttpResponse) => response.json());
  }
    
  saveTodoItem(): Promise<void> {
    return this.todoItem.save();
  }
}
```

*TypeScript: Edit todo item view.*

`HttpResponse`s can be parsed as JSON by using the `HttpResponse#json` method.

We add the `TodoItem` type to the returned promise of the `readTodoItem` method.

The application transpiles to JavaScript without errors, so we deploy it on a web server.

We tell our manager that the edit todo item feature is done and move on to the next task.

![Borat meme](./jbc4enrmsvkvwkz50l60.jpeg)
*Borat meme by [Meme Generator](https://memegenerator.net/instance/38220950/borat-meme-another-job-done-nais)*

Everything is fine… Until we start getting bug reports from users telling that they edited a todo item and saved it. But when they navigated back to the todo list, the todo item was not updated.

![Bug meme](./jr7llqej0li4lactmj03.jpeg)
*Bug meme by [Nepho](https://imgflip.com/i/loizf)*

But… It compiled! Did TypeScript let us down?

> JavaScript is a loosely typed programming language and TypeScript does not change that; even if it seems that way.

TypeScript was not lying to us. We were lying to TypeScript. It is easy to miss, but we told TypeScript to give the JSON object the `TodoItem` **type**.

The problem is that the JSON object was never constructed from the `TodoItem` class with the `new` keyword. It was actually an anonymous object without access to the `TodoItem` prototype.

To fix the bug, we have to make a few changes.

```typescript
// todo-item.ts
class TodoItem {
  id: string;
  isDone: boolean;
  title: string;

  constructor(properties) {
    this.id = properties.id;
    this.isDone = properties.isDone;
    this.title = properties.title;
  }

  save(): Promise<void> {
    return fetch("/todo/" + this.id, {
      body: JSON.stringify(this),
      method: "POST",
    })
      .then(() => undefined);
  }
}
```

*TypeScript: Todo item with constructor.*

We add a constructor that we can pass the JSON object to and get back an instance of `TodoItem`.

```typescript
// edit-todo-item-view.ts
class EditTodoItemView {
  todoItem: TodoItem;

  onInitialize(id: string): Promise<void> {
    return this.readTodoItem(id)
      .then(todoItem => this.todoItem = todoItem)
      .then(() => undefined);
  }

  readTodoItem(id: string): Promise<TodoItem> {
    return fetch("/todo/" + id)
      .then((response: HttpResponse) => response.json())
      .then(json => new TodoItem(json));
  }
    
  saveTodoItem(): Promise<void> {
    return this.todoItem.save();
  }
}
```

*TypeScript: Edit todo item view using the new keyword.*

After reading the JSON from the server, we pass it to the `TodoItem` constructor and get an actual instance of the class back.

We transpile the code, deploy it to the web server and this time we remember to test it… In production of course 🤪

![Obama meme](./9ox5gb7q2d0p021fyv8x.jpeg)
*Obama meme by [Meme Generator](https://memegenerator.net/instance/68651984/relief-obama-crisis-averted).*

*Dedicated to all the hard-working back-end developers who are forced to learn client-side web development.*
