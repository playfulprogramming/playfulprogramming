---
{
title: "Push Notifications in Angular 19 with Firebase Cloud Messaging",
published: "2025-02-28T09:17:28Z",
edited: "2025-03-14T08:24:58Z",
tags: ["angular", "firebase", "frontend", "typescript"],
description: "Push notifications are a powerful way to re-engage users, deliver timely updates, and drive traffic...",
originalLink: "https://dev.to/this-is-angular/push-notifications-in-angular-19-with-firebase-cloud-messaging-3o3a",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

Push notifications are a powerful way to re-engage users, deliver timely updates, and drive traffic to your application. Firebase Cloud Messaging (FCM) provides a reliable and scalable solution for implementing push notifications on web, Android, and iOS.

This article will guide you through integrating FCM into a brand new Angular 19 project.

> **Prerequisites:**
- Node.js and npm installed
- Angular CLI installed (`npm install -g @angular/cli`)
- A Google account
- Basic familiarity with Angular

## Create a New Angular Project

Let's start by generating a fresh Angular 19 project:

```bash
ng new angular-fcm-demo
cd angular-fcm-demo
```

Choose the options that best suit your needs. For simplicity, I'll typically select "CSS" for styling and say "no" to server-side rendering (SSR).

## Set Up a Firebase Project

- Go to the [Firebase Console](https://console.firebase.google.com/) and sign in with your Google account.
- Click "Add project".
- Enter a project name (e.g., "Angular FCM Demo").
- Follow the prompts to configure Google Analytics (optional but recommended).
- Click "Create project".

Once your project is ready, you'll be redirected to the Firebase project dashboard.

## Register Your Web App with Firebase

- In the Firebase Console, click the web icon (`</>`) to add Firebase to your web app.
- Give your app a nickname (e.g., "Angular Web App").
- Check the box next to "Set up Firebase Hosting" (optional).
- Click "Register app".

Firebase will provide you with a configuration object similar to this:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

> **Important:** Copy this `firebaseConfig` object. You'll need it in the next step.

## Install and Initialize Firebase in Your Angular App

Install the necessary Firebase module:

```bash
npm install @angular/fire
```

Create a new file, `src/environments/environment.ts`, and add your Firebase configuration:

```typescript
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
  }
};
```

Import `@angular/fire` and initialize Firebase in your `app.config.ts`:

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { routes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideMessaging(() => getMessaging()),
  ],
};
```

## Create a Service Worker

> Service workers are essential for handling push notifications in the background.

Install the necessary Service Worker module:

```bash
npm i @angular/service-worker
```

Create a `firebase-messaging-sw.js` file in the `src` directory.

```javascript
importScripts(
  "https://www.gstatic.com/firebasejs/11.4.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/11.4.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "----",
  authDomain: "----",
  projectId: "----",
  storageBucket: "----",
  messagingSenderId: "----",
  appId: "----",
};

const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
```

Go to project root directory, and find angular.json.
Add this line in assets:

```
"src/firebase-messaging-sw.js"
```

> **Important Considerations for Service Workers:**
*   Service workers *must* be served over HTTPS (except for `localhost` during development).
*   This JavaScript file won't be transpiled, so it needs to be valid plain JavaScript.

## Configure @angular/fire

Now, let's use @angular/fire to handle the token and notifications.
Here is my minimal example in `app.component.ts`.

> To improve security, FCM requires a VAPID key for web push.
- In the Firebase Console, go to "Project settings" > "Cloud Messaging".
- Scroll down to "Web push certificates".
- If you don't have a key pair, click "Generate Key Pair".
Firebase will create and display your VAPID key.

```typescript
import { Component, OnInit } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
import { getMessaging, getToken, onMessage } from '@angular/fire/messaging';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  template: `<p>Hi!</p>`,
})
export class AppComponent implements OnInit {
  private messaging: any;

  ngOnInit(): void {
    const app = initializeApp(environment.firebaseConfig);
    this.messaging = getMessaging(app);
    this.requestPermission();

    onMessage(this.messaging, (payload) => {
      alert(JSON.stringify(payload));
      // ...
    });
  }

  requestPermission() {
    console.log('Requesting permission...');
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        getToken(this.messaging, {
          vapidKey: environment.firebaseConfig.vapidKey,
        })
          .then((currentToken: string) => {
            if (currentToken) {
              console.log(currentToken);
            } else {
              console.log(
                'No registration token available. Request permission to generate one.'
              );
            }
          })
          .catch((err: any) => {
            console.log(err);
          });
      }
    });
  }
}
```

## Serve Your Application

```bash
npm start
```

Navigate to `localhost:4200` to check your app and enable notifications.

## Test Push Notifications

- Open the Firebase Console.
- Go to "Cloud Messaging".
- Click "Send your first message".
- Enter a notification title and text.
- Click "Send test message".
- Enter the registration token that you logged in the console.
- Click "Test".

You should receive a push notification in your browser!

## Troubleshooting

* **Permissions:** Ensure that the user has granted permission for notifications.
* **Clear Cache:** Clear your browser's cache and cookies to ensure you're using the latest version of your service worker.

## Conclusion

This guide has provided a comprehensive steps of integrating Firebase Cloud Messaging into an Angular 19 application.
By following these steps, you can enable push notifications and improve user engagement.

[Here](https://github.com/gioboa/angular-firebase-cloud-messaging) is the code.

---

Good luck, and happy coding! 🎉
Need help? Ask away in the comments!
