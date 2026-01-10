---
{
title: "Firebase Authentication with Angular 19",
published: "2025-02-21T09:22:10Z",
edited: "2025-03-14T08:25:07Z",
tags: ["firebase", "angular", "frontend", "webdev"],
description: "Firebase Authentication provides a robust and easy-to-implement backend service for user...",
originalLink: "https://dev.to/this-is-angular/firebase-authentication-with-angular-19-ief",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

Firebase Authentication provides a robust and easy-to-implement backend service for user authentication in your Angular applications.

It supports various authentication methods, including email/password, social logins (Google, Facebook, etc.), and phone authentication.

This guide will walk you through setting up Firebase Authentication, integrating it with your Angular project, and exploring various authentication methods, best practices, and common scenarios.

> Think of Firebase as your application's secure entry point, like a bouncer at a club. Before anyone can access the exclusive features inside (your app's data and functionality), they need to present valid credentials. Setting up Firebase is like hiring this bouncer and giving them the instructions for verifying guest identities.

## Setting Up Firebase in Your Angular Project

- If you don't already have one, create a Firebase project in the Firebase console (console.firebase.google.com).

- In the Firebase console, navigate to your project, click "Add app," and select "Web." Follow the instructions to register your Angular app.
  You'll receive a configuration object containing API keys and other necessary information.

- In your Angular project, install the Firebase dependency using npm:

```bash
npm install @angular/fire
```

- Import the necessary Firebase modules and initialize the Firebase app in your `app.config.ts` file:

```typescript
import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { environment } from '../environments/environments';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideAnimationsAsync(),
    provideHttpClient(),
  ]
};
```

Ensure your `environment.firebase` (in `environment.ts` and `environment.prod.ts`) contains your Firebase configuration object:

```typescript
export const environment = {
    production: false,
    firebase: {
        apiKey: "-----",
        authDomain: "-----",
        projectId: "-----",
        storageBucket: "-----",
        messagingSenderId: "-----",
        appId: "-----",
    }
};
```

---

## Email/Password Authentication

This is the most common authentication method.

- Creating a dedicated service helps organize your code and promotes reusability. Create a file named `auth.service.ts`:

```typescript
import { Injectable } from '@angular/core';
import {
  Auth,
  browserSessionPersistence,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  user,
  User,
} from '@angular/fire/auth';
import { setPersistence } from 'firebase/auth';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(private firebaseAuth: Auth) {
    this.setSessionStoragePersistence();
    this.user$ = user(this.firebaseAuth);
  }

  private setSessionStoragePersistence(): void {
    setPersistence(this.firebaseAuth, browserSessionPersistence);
  }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(() => {
      //
    });
    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth).then(() => {
      sessionStorage.clear();
    });
    return from(promise);
  }
}
```

- Inject the `AuthService` into your components

```typescript
import { Component, inject } from '@angular/core';
import {
  FormsModule,
  Validators,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { AuthService } from './service/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-login',
  standalone:true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styles: '',
})
export class LoginComponent {
  error: boolean = false;
  fb: FormBuilder = inject(FormBuilder);
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  form = this.fb.nonNullable.group({
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ],
    ],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    const rawForm = this.form.getRawValue();
    this.authService.login(rawForm.email, rawForm.password).subscribe({
      next: () => {
        this.router.navigateByUrl('/protected-content');
      },
      error: (error) => {
        this.error = true;
        console.error('Email/Password Sign-In error:', error);
      },
    });
  }

  guestLogin(): void {
    const values = { email: 'guest@mail.uk', password: 'fake_password' };
    this.form.patchValue(values);
    const subscription = this.form.valueChanges.subscribe(() => {
      if (this.form.valid) {
        subscription.unsubscribe();
        this.onSubmit();
      }
    });
  }
}
```

## Key Considerations

- Error Handling: Always include error handling to provide helpful feedback to the user and gracefully handle authentication failures. Firebase provides detailed error codes that you can use to customize your error messages.
- Security Best Practices: Never store sensitive information like API keys directly in your client-side code. Use environment variables or server-side functions to protect your credentials.
- Observables: Use observables to react to changes in the authentication state, enabling you to dynamically update your UI based on whether a user is logged in or not.
- Asynchronous Operations: Firebase authentication methods are asynchronous, so always use async/await or promises to handle the results.

---

## Social Logins

Firebase simplifies integrating social login providers. Enable the desired providers in your Firebase console's Authentication tab.  Here's an example of Google Sign-In:

```typescript
async onGoogleSignIn(): Promise<void> {
  try {
    await this.authService.googleLogin();
    this.router.navigateByUrl('/main');
  } catch (error) {
    console.error('Google Sign-In error:', error);
  }
}

---

async googleLogin(): Promise<void> {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(this.firebaseAuth, provider);
    const user = result.user;
    if (!user) {
      throw new Error('Google-Login error');
    }
  } catch (error) {
    console.error('Google-Login error:', error);
    throw error;
  }
}
```

---

## Protecting Routes

Use Angular's route guards to protect routes that require authentication:

```typescript
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    map((user) => {
      if (user) {
        return true;
      } else {
        router.navigate(['']);
        return false;
      }
    })
  );
};
```

Then, apply the guard in your routing module:

```typescript
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './login.component';
import { ProtectedContentComponent } from './protected-content.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'protected-content',
    component: ProtectedContentComponent,
    canActivate: [authGuard], 👈
  },
  { path: '**', redirectTo: '' },
];
```

---

## Managing User State and Data

Use the `user$` observable in your components to react to authentication state changes and display user-specific content:

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from './service/auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-protected-content',
  standalone: true,
  template: `
    <div *ngIf="user$ | async as user">
      <p>Welcome, {{ user.email }}!</p>
      <button (click)="signOut()">Sign Out</button>
    </div>
  `,
  styleUrls: ['./profile.component.css'],
  imports: [AsyncPipe, CommonModule]
})
export class ProtectedContentComponent implements OnInit {
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  user$ = this.authService.user$;

  ngOnInit(): void {}

  async signOut() {
    try {
      await this.authService.logout();
      console.log('User signed out');
      this.router.navigateByUrl('/');
    } catch (error) {
      console.error('Sign out error:', error);
      // Handle the error appropriately, e.g., show a message to the user
    }
  }
}
```

---

This comprehensive guide covers the essentials of Firebase Authentication with Angular.  By implementing these techniques, you can secure your application and provide a seamless user experience.  Remember to consider the security implications of authentication and always handle user data responsibly.  As you progress, explore the advanced features of Firebase Authentication to tailor the authentication flow to your specific needs.

---

🎉 As you can see it's super easy to use this functionality and I'm so happy about it. 😄

You can [follow me on GitHub](https://github.com/gioboa), where I'm creating cool projects.

I hope you enjoyed this article, don't forget to give ❤️.
Bye 👋

{% embed https://dev.to/gioboa %}
