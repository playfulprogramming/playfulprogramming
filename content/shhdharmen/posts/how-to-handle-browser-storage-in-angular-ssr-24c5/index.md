---
{
title: "How to handle browser storage in Angular SSR?",
published: "2023-11-25T16:33:24Z",
edited: "2023-12-11T09:06:49Z",
tags: ["angular", "angularssr", "typescript", "webdev"],
description: "In this quick tutorial, we will learn best way to handle browser storage with Angular SSR",
originalLink: "https://blog.shhdharmen.me/browser-storage-in-angular-ssr",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

Server-side applications will not have access to certain browser APIs and features. They are unable to utilize browser-specific global objects such as `window`, `document`, `navigator`, or `location`, and certain `HTMLElement` properties.

Typically, code that depends on symbols specific to a browser should be run only in the browser, not on the server. This can be ensured using the lifecycle hooks `afterRender` and `afterNextRender`. These hooks are executed only in the browser and are bypassed on the server.

But, in some cases, `afterRender` or `afterNextRender` are not helpful. For example, when you want to use `localStorage` in services.

Let's see how we can handle such scenario in a step-by-step guide.

## 1. A service to use browser storage for Browser

Let's create a `BrowserStorageService` with below content:

```typescript
import { Inject, Injectable, InjectionToken } from '@angular/core';

export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage,
});

@Injectable()
export class BrowserStorageService {
  constructor(@Inject(BROWSER_STORAGE) public storage: Storage) {}

  get(key: string) {
    return this.storage.getItem(key);
  }

  set(key: string, value: string) {
    this.storage.setItem(key, value);
  }

  remove(key: string) {
    this.storage.removeItem(key);
  }

  clear() {
    this.storage.clear();
  }
}
```

As you can see, we have created a service to handle browser storage.

## 2. Provide service to whole browser application

Now, add `BrowserStorageService` in `providers` array of your `app.config.ts` if you are using standalone mode or in `app.module.ts` if you are using module mode.

```typescript
providers: [BrowserStorageService],
```

Now, instead of using `localStorage` directly, use `BrowserStorageService` everywhere in your whole application.

Please note that we have not yet handled the server-side implementation. If you try to build the project, you will get error similar to below:

```bash
ERROR ReferenceError: localStorage is not defined
```

Let's fix that.

### 3. A service to use browser storage for Server

Now, server don't have any global variables like `localStorage` and hence it fails when it runs the application with `BrowserStorageService`

The idea is to provide an implementation to server-side code, so that it works without breaking.

Let's create another service called `BrowserStorageServerService ` with below content:

```typescript
import { Injectable } from '@angular/core';
import { BrowserStorageService } from './browser-storage.service';

@Injectable()
export class BrowserStorageServerService extends BrowserStorageService {
  constructor() {
    super({
      clear: () => {},
      getItem: (key: string) => JSON.stringify({ key }),
      setItem: (key: string, value: string) => JSON.stringify({ [key]: value }),
      key: (index: number) => index.toString(),
      length: 0,
      removeItem: (key: string) => JSON.stringify({ key }),
    });
  }
}
```

As you can see, we have extended `BrowserStorageServerService ` from `BrowserStorageService`, so that we can easily override the methods.

This is just a mock service, it's important to have all the methods in place, implementation doesn't matter, you can change as you like.

## 4. Provide service to whole server application

Now, we will have to tell server to use `BrowserStorageServerService` whenever it gets instance of `BrowserStorageService`. It can be easily done by `provide` and `useClass` properties of [`ClassProvider`](https://angular.io/api/core/ClassProvider).

Update the `providers` array of your `app.config.server.ts` if you are using standalone mode or in `app.server.module.ts` if you are using module mode:

```typescript
providers: [
    {
      provide: BrowserStorageService,
      useClass: BrowserStorageServerService,
    },
  ],
```

Thats it! Now your application should run fine.
