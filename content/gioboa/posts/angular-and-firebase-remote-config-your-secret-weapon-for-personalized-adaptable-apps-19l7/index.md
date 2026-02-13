---
{
title: "Angular and Firebase Remote Config: Your Secret Weapon for Personalized & Adaptable Apps",
published: "2025-03-11T06:46:00Z",
edited: "2025-03-14T08:24:48Z",
tags: ["firebase", "angular", "frontend", "webdev"],
description: "In today's rapidly evolving digital landscape, adaptability is key to success. Applications need to...",
originalLink: "https://dev.to/playfulprogramming-angular/angular-and-firebase-remote-config-your-secret-weapon-for-personalized-adaptable-apps-19l7",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

In today's rapidly evolving digital landscape, adaptability is key to success. Applications need to be flexible, allowing for quick adjustments to features, content, and even user experiences without the need for frequent deployments.

[Firebase Remote Config](https://firebase.google.com/) provides this dynamic control, empowering you to modify your application's behavior on the fly.

## What is Firebase Remote Config?

Firebase Remote Config is a cloud service that allows you to define parameters within your application and update their values remotely, without requiring users to download a new version of your app. It allows you to have a versioned history of all your config changes and this feature it's really amazing because you can easily do a rollback to a particular configuration with one click.

> Think of it as a powerful configuration file hosted in the cloud that your application can access and react to in real-time.

This enables a range of functionalities, including:

- Feature Flags: Enable or disable features for specific user segments or during particular time periods.
- Content Management: Update promotional messages, change in-app text, modify image URLs, and adjust other content elements dynamically.
- Targeted User Experiences: Deliver personalized content and features based on user demographics, behavior, device type, and preferences.
- Emergency Fixes: Quickly disable problematic features or adjust configurations in response to unexpected issues.
- A/B Testing: Experiment with different versions of your app and track user behavior to optimize performance and engagement.

> The core concept revolves around defining default values within your Angular application and then overriding them with values stored in the Firebase Console.
> When your application starts or at specified intervals, it fetches the latest values from Remote Config, allowing you to dynamically adjust its behavior.

## Integrating Firebase Remote Config with Angular

Now, let's walk through the process of integrating Firebase Remote Config into your Angular 19 application.

Setting up your Firebase Project:

- If you haven't already, create a new project in the [Firebase Console](https://console.firebase.google.com/).
- Add your Angular application to your Firebase project by following the instructions provided in the Firebase Console.
- Enable the Remote Config service in the Firebase Console.
- Create parameters with default values in the Firebase Remote Config section of the Firebase Console.
  For example: `feature_new_checkout` (Boolean, Default: false)

## Installing AngularFire

In your Angular project, install @angular/fire dependency using npm:

```bash
npm install @angular/fire
```

Import the necessary Firebase modules and initialize the Firebase app in your app.config.ts file. The provided code already includes the necessary setup for Firebase App, Remote Config, and the `RemoteConfigService`.

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {
  getRemoteConfig,
  provideRemoteConfig,
} from '@angular/fire/remote-config';
import { routes } from './app.routes';
import { RemoteConfigService } from './config.service';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    RemoteConfigService,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideRemoteConfig(() => getRemoteConfig()),
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

This code ensures that Firebase is initialized when your Angular application starts and that the `RemoteConfigService` is available for injection into other components.

## Defining Default Values in `firebase.json`

Create a file named `firebase.json` in the root of your Angular project. This file will contain the default values for your Remote Config parameters and it's crucial so the app has values to use if it cannot connect to Firebase.

```json
{
  "feature_new_checkout": false
}
```

## Remote Config Service

This service encapsulates the logic for interacting with Firebase Remote Config. The provided code offers a solid foundation. Let's break it down and enhance it further.

```typescript
import { Injectable } from '@angular/core';
import {
  RemoteConfig,
  getRemoteConfig,
  fetchAndActivate,
  getValue,
} from 'firebase/remote-config';
import { inject } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import defaultConfig from '../../firebase.json';

@Injectable({
  providedIn: 'root',
})
export class RemoteConfigService {
  private remoteConfig: RemoteConfig;
  private app: FirebaseApp = inject(FirebaseApp);

  constructor() {
    this.remoteConfig = getRemoteConfig(this.app);
    this.remoteConfig.defaultConfig = { ...defaultConfig };
    this.remoteConfig.settings.minimumFetchIntervalMillis = 3600000;
  }

  async initializeConfig(): Promise<void> {
    try {
      await fetchAndActivate(this.remoteConfig);
      console.log('Remote config fetched and activated');
    } catch (error) {
      console.error('Error fetching remote config:', error);
    }
  }

  getConfigValue(key: string) {
    return getValue(this.remoteConfig, key);
  }
}
```

`RemoteConfig, getRemoteConfig, fetchAndActivate, getValue` are the key functions from the Firebase Remote Config SDK.

- inject(FirebaseApp): This injects the initialized Firebase App instance into the service.
- getRemoteConfig(this.app): This retrieves the Remote Config instance associated with the Firebase App.
- this.remoteConfig.defaultConfig = { ...defaultConfig }: This line sets the default values for your Remote Config parameters. The `defaultConfig` object is imported from `firebase.json`.

> It's crucial to have default values in your app so that it functions correctly even if it cannot reach the Remote Config service.

- minimumFetchIntervalMillis = 3600000: This sets the minimum interval (in milliseconds) between Remote Config fetches. A value of 3600000 (1 hour) is a good starting point for most applications.

> Setting this too low can lead to excessive network requests and potential throttling.

- initializeConfig: This asynchronous function fetches the latest Remote Config values from the Firebase server and activates them.

- fetchAndActivate: fetches and applies the new configuration.

- getConfigValue: This function retrieves a specific Remote Config value based on its key. It returns a `RemoteConfigValue` object, which can then be converted to the desired data type (string, number, boolean).

## Using Remote Config Values

```typescript
import { Component, inject } from '@angular/core';
import { RemoteConfigService } from './config.service';

@Component({
  selector: 'app-root',
  template: `
    <h1>Angular and Firebase Remote Config</h1>
    <span>Check the console to see the loaded config.</span>
  `,
})
export class AppComponent {
  private remoteConfig = inject(RemoteConfigService);

  async ngOnInit() {
    await this.remoteConfig.initializeConfig();
    const config = this.remoteConfig.getConfigValue('feature_new_checkout');
    console.log('Config: ' + config.asString());
  }
}
```

`RemoteConfigService` is injected into the component and in the `ngOnInit` lifecycle hook you can call `initializeConfig()` to fetch and activate the latest Remote Config values.

## Running Your Application

Start your Angular development server:

```bash
ng serve
```

Open your browser and navigate to `http://localhost:4200/`. You should see the fetched config in the console.

## Modifying Values in the Firebase Console

- Go to the Firebase Console and navigate to the Remote Config section.
- Change the value of `feature_new_checkout` to `true`.
- Click "Publish changes".

## Observing the Changes

Refresh your Angular application in the browser. After a short delay (up to the `minimumFetchIntervalMillis`), you should see the holiday sale section appear with the updated values from the Firebase Console.

> If you don't see the changes immediately, wait for the fetch interval to expire.

### Important Considerations and Best Practices

- Data Types: Be mindful of data types when retrieving Remote Config values. Use the appropriate `as...()` method to convert the `RemoteConfigValue` to the correct type.
- Caching: Remote Config automatically caches values to reduce network requests and improve performance. Adjust the `minimumFetchIntervalMillis` setting to balance freshness and performance.
- Parameter Naming: Use descriptive and consistent parameter names to improve readability and maintainability.

### Conclusion

Firebase Remote Config is a powerful tool that can significantly enhance the flexibility and adaptability of your Angular applications. By leveraging Remote Config, you can dynamically adjust features, content, and user experiences without requiring frequent app updates, leading to increased engagement, improved performance, and reduced development cycles.

By following the steps outlined in this article you can seamlessly integrate Firebase Remote Config into your Angular projects and unlock its full potential.

---

Happy coding! 🎉
Need help? Ask away in the comments!
