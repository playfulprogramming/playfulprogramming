---
{
title: "Building Realtime Web Apps with Angular and Firebase Database",
published: "2025-03-19T10:15:40Z",
edited: "2025-03-19T10:29:36Z",
tags: ["firebase", "angular", "frontend", "webdev"],
description: "In today's web development world, building dynamic and real-time applications is more important than...",
originalLink: "https://dev.to/this-is-angular/building-realtime-web-apps-with-angular-and-firebase-database-2mkb",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

In today's web development world, building dynamic and real-time applications is more important than ever. [Angular](https://angular.dev/), coupled with [Firebase](https://console.firebase.google.com/) Database, offers a robust and efficient way to create such applications.

This article will guide you through using a simple Angular 19 with Firebase Database, explaining the key components and demonstrating how to leverage the power of this combination.

## What is Firebase Database?

Firebase Database is a NoSQL, cloud-hosted database. It allows you to store and synchronize data between your users in real-time. This is particularly useful for applications requiring instant updates, such as chat applications, collaborative tools, or social media feeds.

## Installing AngularFire

In your Angular project, install @angular/fire dependency using npm:

```bash
npm install @angular/fire
```

Import the necessary Firebase modules and initialize the Firebase app in your app.config.ts file. The provided code already includes the necessary setup for Firebase App and Firebase Database.

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideRouter } from '@angular/router';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { getDatabase, provideDatabase } from '@angular/fire/database';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideDatabase(() => getDatabase()),
  ],
};
```

Ensure your environment.firebaseConfig (in environment.ts and environment.prod.ts) contains your Firebase configuration object:

```typescript
export const environment = {
    production: false,
    firebaseConfig: {
        apiKey: "-----",
        authDomain: "-----",
        projectId: "-----",
        storageBucket: "-----",
        messagingSenderId: "-----",
        appId: "-----",
    }
};
```

This code ensures that Firebase is initialized when your Angular application starts.

## Diving into `app.component.ts`

> It's intentionally all in the same file so you can actually copy and paste the snippet and have something working without having to create multiple files. Best practices recommend separating your logic into multiple files.

```typescript
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { getDatabase, objectVal, ref, set } from '@angular/fire/database';
import { Observable } from 'rxjs';

type Post = { caption: string; imageUrl: string };

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="feed-container">
      <button class="create-post-button" (click)="openCreatePost()">
        Create New Post
      </button>
      @for (post of posts$ | async | keyvalue; track post.key) {
      <div class="post-card">
        <img
          [src]="post.value.imageUrl"
          [alt]="post.value.caption"
          class="post-image"
        />
        <div class="post-footer">
          <h2>{{ post.value.caption }}</h2>
        </div>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .feed-container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .create-post-button {
        width: 100%;
        padding: 12px;
        background: #0095f6;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
        margin-bottom: 20px;
      }
      .create-post-button:hover {
        background: #0081d6;
      }
      .post-card {
        background: white;
        border: 1px solid #dbdbdb;
        border-radius: 3px;
        margin-bottom: 20px;
      }
      .post-image {
        width: 100%;
        height: auto;
      }
      .post-footer {
        padding: 16px;
      }
    `,
  ],
})
export class AppComponent {
  private DATABASE_TABLE_NAME = 'posts';
  private readonly database;

  readonly posts$: Observable<Record<string, Post>>;

  constructor() {
    this.database = getDatabase(inject(FirebaseApp));
    this.posts$ = objectVal(ref(this.database, this.DATABASE_TABLE_NAME));
  }

  openCreatePost() {
    const newPostKey = `${this.DATABASE_TABLE_NAME}/${this.getRandomNumber()}`;
    const newPostValue: Post = {
      caption: 'Angular 19 + Firebase Database Starter',
      imageUrl: 'https://images.unsplash.com/photo-1575936123452-b67c3203c357',
    };
    set(ref(this.database, newPostKey), newPostValue);
  }

  private getRandomNumber() {
    return Math.floor(Math.random() * (1000 - 1 + 1)) + 1;
  }
}
```

This component is the heart of our application and imports necessary modules from Angular, `@angular/fire`, and RxJS.

- `getDatabase`, `objectVal`, `ref`, and `set` are the key Firebase Database functions we'll be using.
- `Post Type` defines the structure of a post object, with `caption` and `imageUrl` properties.
- DATABASE\_TABLE\_NAME is a constant defining the name of the database table where posts are stored (set to 'posts').
- `database` is the instance of the Firebase Database, obtained using - `getDatabase(inject(FirebaseApp))`.
- `posts$` is an `Observable` that streams data from the Firebase Database.
- `objectVal(ref(this.database, this.DATABASE_TABLE_NAME))` creates a reference to the 'posts' table and uses `objectVal` to convert the data into an Observable. `objectVal` returns an observable of the entire object stored at that location.

## Reading Data

The `posts$` Observable automatically retrieves and updates data from the 'posts' table in your Firebase Database. Whenever the data in the database changes, the Observable emits a new value, and the Angular template is automatically updated.

## Writing Data

The `openCreatePost` function demonstrates how to write data to the Firebase Database. The `set` function is used to write data to a specific location in the database.

## Expanding the Application

Here are some ideas for expanding this basic starter project:

- User Interface Improvements: Enhance the UI with more appealing styling, loading indicators, and error handling.
- Input Forms: Implement an input form for users to create and submit their own posts. Use Angular Forms for validation and data binding.

## Best Practices

- Data Modeling: Carefully consider your data model and structure your data in a way that is efficient and scalable. Firebase Database is a NoSQL database, so you'll need to think about how to best represent your data in a JSON format.
- Security Rules: Configure Firebase Database security rules to protect your data from unauthorized access. This is crucial for ensuring the security of your application.
- Error Handling: Implement robust error handling to gracefully handle potential errors.

---

This Angular with Firebase Database provides a solid foundation for building dynamic and real-time web applications. By understanding the key components and expanding on the basic functionality, you can create powerful and engaging user experiences.

---

🎉 As you can see it's super easy to use this functionality and I'm so happy about it. 😄

You can [follow me on GitHub](https://github.com/gioboa), where I'm creating cool projects.

I hope you enjoyed this article, don't forget to give ❤️.
Bye 👋

<!-- ::user id="gioboa" -->
