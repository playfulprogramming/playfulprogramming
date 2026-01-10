---
{
title: "Create configurable Angular guards",
published: "2023-08-09T23:03:27Z",
edited: "2023-08-09T23:03:46Z",
tags: ["angular", "webdev", "javascript", "router"],
description: "When building web application, from time to time we have to protect routes from unauthorized access....",
originalLink: "https://medium.com/@eneajahollari/create-configurable-angular-guards-11800f84d90a",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

When building web application, from time to time we have to protect routes from unauthorized access. In Angular, we can do this by using router guards.

*This is not an intro to Angular guards, so if you are not familiar with them, you can read more about them in the [official documentation](https://angular.io/guide/router#preventing-unauthorized-access).*

In this article, we will see how we can create configurable Angular guards. We will create a guard that will check if the logged in user has a specific role, and if not, it will redirect the user to an unauthorized page.

We will use a fake **AuthService** that will have a method to check if the logged in user has a specific role.

```ts
// auth.service.ts
export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  userRole = ROLES.ADMIN;

  hasRole(role: string): boolean {
    return this.userRole === role;
  }
}
```

Before Angular 14 we had class based guards, and a basic solution for our problem would be to create a class based guard for each role and apply it to the routes that we want to protect.

But, this solution is not very flexible, because we have to create a new guard for each role, and if we want to add a new role, we have to create a new guard and apply it to the routes that we want to protect.

This is not very convenient, and it can lead to code duplication.

It would look something like this:

```ts
// admin.guard.ts
@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  authService = inject(AuthService);
  router = inject(Router);

  canActivate(): boolean | UrlTree {
    const hasAccess = this.authService.hasRole(ROLES.ADMIN);
    return hasAccess ? true : this.router.createUrlTree(['/unauthorized']);
  }
}
```

```ts
// manager.guard.ts
@Injectable({ providedIn: 'root' })
export class ManagerGuard implements CanActivate {
  authService = inject(AuthService);
  router = inject(Router);

  canActivate(): boolean | UrlTree {
    const hasAccess = this.authService.hasRole(ROLES.MANAGER);
    return hasAccess ? true : this.router.createUrlTree(['/unauthorized']);
  }
}
```

And then we would apply the guards to the routes that we want to protect:

```ts
// routes.ts
export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  { path: 'manager', component: ManagerComponent, canActivate: [ManagerGuard] },
  { path: 'unauthorized', component: NotAuthorizedComponent },
];
```

As we can see, we have a lot of duplicated code! Let's improve this by creating a configurable guard.

## Configurable class-based guard

Angular Router provides a **data** field in the route that we can use to pass data to the guard. We can use this **data** field to pass the role that we want to check. This way, we can create a single guard that will check the role that we pass in the data field.

```ts
// role.guard.ts
@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  authService = inject(AuthService);
  router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    // Get the role from the route data
    const role = route.data.role;
    const hasAccess = this.authService.hasRole(role);
    return hasAccess ? true : this.router.createUrlTree(['/unauthorized']);
  }
}
```

And then we would apply the guard to the routes that we want to protect:

```ts
// routes.ts
export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { 
    path: 'admin', 
    component: AdminComponent, 
    canActivate: [RoleGuard], 
    data: { role: ROLES.ADMIN },
  },
  { 
    path: 'manager', 
    component: ManagerComponent,
    canActivate: [RoleGuard],
    data: { role: ROLES.MANAGER },
  },
  { path: 'unauthorized', component: NotAuthorizedComponent },
];
```

The code is much cleaner now, and we don't have any duplicated code. But, the only issue with this approach is that is not typechecked. We can pass any string in the data field, and the guard will not complain. We can improve this creating an interface for the data field, and then we can use this interface to type the data field.

```ts
interface RoleGuardData {
  role: 'ADMIN' | 'MANAGER'; // We can add more roles here or infer them from the AuthService
}

// And then we can use this interface to type the data field:

export const routes: Routes = [
  { 
    // ...
    data: { role: ROLES.MANAGER } as RoleGuardData,
  },
];
```

Now, if we try to pass a string that is not a valid role, we will get a type error.

## Configurable function-based guard

In Angular 14, we got function-based guards. This means that we can create a function that will return a guard. This is very useful because we can create a function that will return a guard for a specific role, and then we can apply this function to the routes that we want to protect.

```ts
// role.guard.ts
export const roleGuard = (role: 'MANAGER' | 'ADMIN'): CanActivateFn => {
  const guard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const hasAccess = authService.hasRole(role);
    return hasAccess ? true : router.createUrlTree(['/unauthorized']);
  };

  return guard;
};
```

And then we would apply the function to the routes that we want to protect:

```ts
// routes.ts
export const routes: Routes = [
  { 
    path: 'admin', 
    component: AdminComponent, 
    canActivate: [roleGuard(ROLES.ADMIN)],
  },
  { 
    path: 'manager', 
    component: ManagerComponent,
    canActivate: [roleGuard(ROLES.MANAGER)],
  },
];
```

When using function-based guards, we don't have to worry about typechecking, because we can infer the role from the function parameter and pass it to the AuthService.

## How to test the guards

We can test the guards by creating a mock AuthService, but in our case we can use the real AuthService because it's already a fake service.

```ts
// role.guard.spec.ts
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { ROLES, AuthService } from './auth.service';
import { RoleGuard } from './role.guard';

describe('RoleGuard', () => {
  let router: Router;
  let guard: RoleGuard;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [RoleGuard, AuthService],
    });
    
    router = TestBed.inject(Router);
    guard = TestBed.inject(RoleGuard);
    authService = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true if the user has the role', () => {
    authService.userRole = ROLES.ADMIN; // Set the user role
    const route = { data: { role: ROLES.ADMIN } } as unknown as ActivatedRouteSnapshot;
    expect(guard.canActivate(route)).toBeTrue();
  });

  it('should return /unauthorized if the user does not have the role', () => {
    authService.userRole = ROLES.ADMIN; // Set the user role
    const route = { data: { role: ROLES.MANAGER } } as unknown as ActivatedRouteSnapshot;
    const unauthorizedUrlTree = router.createUrlTree(['/unauthorized']);
    expect(guard.canActivate(route)).toEqual(unauthorizedUrlTree);
  });
});
```

And here's the test for the function-based guard:

```ts
// role.guard.spec.ts
describe('RoleGuard', () => {
  it('allows user to navigate to route if he has access', async () => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideRouter([
          {path: 'admin', component: AdminComponent, canActivate: [roleGuard(ROLES.ADMIN)]},
        ]),
      ],
    });
    const authService = TestBed.inject(AuthService);
    const harness = await RouterTestingHarness.create();

    authService.userRole = ROLES.ADMIN;
    let instance = await harness.navigateByUrl('/admin');
    expect(instance).toBeInstanceOf(AdminComponent);
  });

  it('redirects to unauthorized if the user doesnt have access', async () => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideRouter([
          {path: 'manager', component: ManagerComponent, canActivate: [roleGuard(ROLES.MANAGER)]},
          {path: 'unauthorized', component: NotAuthorizedComponent},
        ]),
      ],
    });

    const authService = TestBed.inject(AuthService);
    const harness = await RouterTestingHarness.create();

    authService.userRole = ROLES.ADMIN;
    let instance = await harness.navigateByUrl('/manager');
    expect(instance).toBeInstanceOf(NotAuthorizedComponent);
  });
});
```

I changed the testing way for the functional based guard to use the **RouterTestingHarness** because it's easier to think about the test this way (at least for me).

That's it!

Thanks for reading!

---

I tweet a lot about Angular (latest news, videos, podcasts, updates, RFCs, pull requests and so much more). If you’re interested about it, give me a follow at [@Enea\_Jahollari](https://twitter.com/Enea_Jahollari). Give me a follow on [dev.to](https://dev.to/eneajaho) if you liked this article and want to see more like this!
