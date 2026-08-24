---
{
    title: "Angular Route Guards for Web & Mobile Auth",
    description: "Learn how to use Angular route guards for authenticating & authorizing access to certain child and parent routes.",
    published: '2018-07-13T22:12:03.284Z',
    tags: ['angular'],
    license: 'cc-by-4',
    originalLink: "https://www.thepolyglotdeveloper.com/2018/07/angular-route-guards-authorization-web-mobile-application/"
}
---

You’re about to release your new Angular web app. It’s a photo  sharing site and you want to test it, so you send a link to it to your  hacker sister. She’s always messing with your stuff and she found out  the URL to your admin page you added to your web app. Before you know  it, she’s flushed your database using a button on that admin page that  you didn’t restrict access to. Not a problem when using development data - but I’m sure your users wouldn’t be any too keen on a service where  they lost all of their data. Let’s fix that

## Component Checks

The most basic way to restrict a user’s access to any given page is to use  logic that will run at the load time of the component and redirect the  user if needed. Given [Angular’s lifecycle hooks](https://angular.dev/guide/components/lifecycle), we can use `ngOnInit` in order to do so.

```javascript
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MyAuthService} from '../../core/auth/auth.service';

@Component({
    selector: 'super-secret-component',
    templateUrl: '<comp-here></comp-here>',
    styles: []
})
export class SecretComponent implements OnInit {

    constructor(private myAuthService: MyAuthService, private router: Router) { }

    ngOnInit() {
        this.myAuthService.checkAuth().subscribe(isAllowed => {
            if (!isAllowed) {
                this.router.navigate(['/']);
            }
        })
    }

}
```

This code sample is pretty straightforward - on  loading the component, let’s go ahead and check that the user is allowed to see the page, if not - let’s move them to somewhere they are allowed to see. You could even add a snackbar to let them know that they’re  trying to access something they shouldn’t, maybe move them to a login  page? It’s fairly customizable.

This works perfectly fine if  there’s a single route you’d like to restrict users from being able to  see, but perhaps you’d like to lockdown an entire module’s routes (or  just a route with child routes) or there are many different routes you’d like to protect in a similar way. Of course, you could always copy and  paste the code we’ve made before, but Angular actually provides a much  easier, cleaner way of doing so.

## Introducing: Route Guards

In essence, a route guard is simply a check to tell if you’re allowed to view a page or not. It can be added to any route using `canActivate` (a fairly verbose property, I’d say) with a custom interface that follows [Angular’s CanActivate API](https://angular.dev/api/router/CanActivate). The most simplistic example of a router guard is as follows:

```javascript
// route.guard.ts
import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable()
export class RouteGuard implements CanActivate {

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return true;
    }

}
// route-routes.module.ts
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {RouteComponent} from './posts.component';
import {RouteGuard} from '../core/route.guard';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: RouteComponent,
        canActivate: [RouteGuard]
    }
];

export const routeRoutedComponents = [
    RouteComponent
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RouteRoutingModule { }
```

As you can see from the typing of `canActivate`, Angular is fairly lenient with what you need to return in order to let a user to access the page or not - it accepts a `Promise` or `Observable` of a `boolean` or even just a `boolean` itself as a return value. This guard has limited value currently, because it always returns `true` regardless of any parameters or changes. However, if we replace the `canActivate` method with something a little more useful, we can easily add back the functionality our old `ngOnInit` had:

```javascript
canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.myAuthService.checkAuth();
}
```

Tada! We suddenly have the same logic as before! We can now remove the `ngOnInit` from the previously added route, and keep things just as secure as before! Because we can return an `Observable`, we can even use `Observable` `pipes` like so:

```javascript
return this.myAuthService.checkAuth().pipe(tap(allowed => {
    if (allowed) {
        this.snackBar.open("Welcome back!");
    }
}));
```

Of course, it might not be the best bet to add  this logic in a guard, but it’s still representative of what you’re  capable of doing inside of a guard.

## Children Guarding

When I first learned about this, I thought it was the coolest thing in the  world. I started adding it to all of my routes. Next thing I knew, I was adding it to all my routes I wanted protected in some form or another.

```javascript
[
    { path: '', pathMatch: 'full', component: RouteComponent, canActivate: [RouteGuard] },
    { path: 'list', component: RouteComponent, canActivate: [RouteGuard] },
    { path: 'detail/:id', component: RouteComponent, canActivate: [RouteGuard] }
];
```

This isn’t too bad alone - but when you have  hundreds of routes on a large scale project, this easily becomes  unmanageable. I also had times when I wanted to add additional security  to a route’s children, for example a dashboard page that included some  admin routes that I wanted to lock down. This is where child guards come into play.

Child guards do exactly what you think they would. They add an additional guard for children. They use a similar API as `canActivate`, and the reference to that API can be found [here](https://angular.dev/api/router/CanActivateChild). So, if I were to add the following guard to my child routes:

```javascript
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable()
export class ChildGuard implements CanActivateChild {
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        console.log('This child was activated!');
        return true;
    }
}
```

It would console log ‘This child was activated’ every time you accessed a child route. How do you apply this to your routes?

```javascript
[
    { path: '', canActivateChild: [ChildGuard], children: [
        { path: '', pathMatch: 'full', component: RouteComponent, canActivate: [RouteGuard] },
        { path: 'list', component: RouteComponent, canActivate: [RouteGuard] },
        { path: 'detail/:id', component: RouteComponent, canActivate: [RouteGuard] }      
    ]}
];
```

However, I’m sure you’re wondering what happens if you apply a `canActivate` alongside a `canActivateChild`. If you were to change the code so the `canActivate` runs a `console.log('This is the canActivate!')` and your routes were to look like this:

```javascript
[
    { path: '', canActivate: [ActivateGuard], canActivateChild: [ChildGuard], children: [
        { path: '', pathMatch: 'full', component: RouteComponent },
        { path: 'list', component: RouteComponent },
        { path: 'detail/:id', component: RouteComponent }
    ]}
];
```

And accessed the `list` route, your  console would output ‘This is the canActivate!’ and then ‘This child was activated!’. Of course, this has limited application when making an  empty route without a component to load (that’s not a child), but it’s  massively helpful when you have a component in the parent route such as  this:

```javascript
[
    {
        path: '',
        canActivate: [AuthenticationGuard],
        canActivateChild: [AuthorizationGuard],
        children: [
            { path: 'admin', component: AdminComponent },
        ]
    }
];

// NOT SHOWN: AuthenticationGuard and AuthorizationGuard. Just pretend they're code that checks what you think they would, based on the names (remember, authentication is if the user is who they say they are [AKA logged in]; authorization is making sure they have the right access [AKA if they're admin])
```

In this example, when you access the `''` path, you’ll make sure the user is authenticated, but doesn’t care  about authorization. However, when you access a child of that path (in  this example, `'admin'`), it will check both authentication AND authorization.

### Route Data

But let’s say that I wanted to be able to change my child route based on  information that I’ve stored about that particular route. For example, I typically layout my breadcrumbs by using a `data` property on my routes like such:

```javascript
[
    {
        path: '',
        canActivateChild: [ChildGuard],
        component: RouteComponent,
        data: {
            title: 'Main Page'
        },
        children: [
            { path: 'list', component: RouteComponent, data: {title: 'List Page'} },
            { path: 'detail/:id', component: RouteComponent, data: {title: 'Detail Page'} }
        ]
    }
];
```

If I wanted to be able to add a welcome message for each page that printed their `title` on every route you accessed, you could add that logic to a `ChildGuard` logic.

```javascript
canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean { // The return type has been simplified
    console.log(childRoute.data.title);
    return true;
}
```

Because the first argument to `canActivateChild` is an `ActivatedRouteSnapshot`, you can grab [any of the methods or properties from the API](https://angular.dev/api/router/ActivatedRouteSnapshot) from the routes that are currently being called. However, something  you’ll probably want to keep in mind is that this will occur once for  every single child route being called.

## Lazy Loading

Because lazy loading using `loadChildren` is still considered a child route, all of the same rules from [Children Guarding](https://www.thepolyglotdeveloper.com/2018/07/angular-route-guards-authorization-web-mobile-application/#ChildrenGuarding) still apply. However, there are more tricks that are available for lazy loaded routes that are not otherwise available.

### Can Load

The [API for canLoad](https://angular.dev/api/router/CanLoad) looks very similar to what we’ve seen before with `canActivate` and `canActivateChild`.

```javascript
import {Injectable} from '@angular/core';
import {Route, CanLoad} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable()
export class LoadGuard implements CanLoad {

    canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
        return true;
    }

}
```

Much like before, if we were to add it on a lazy loaded route:

```javascript
[
    {
        canLoad: [LoadGuard],
        path: '',
        loadChildren: './feature.module#FeatureModule'
    }
]
```

It would prevent the route from loading if the return was `false`. However, the bigger difference between, say, `canActivateChild`, is how it interacts with the other methods shown here.

Let’s say we have some routes shown like this:

```javascript
[
    {
        path: '',
        canActivate: [AuthenticationGuard],
        canActivateChild: [AuthorizationGuard],
        children: [{
            canLoad: [LoadGuard],
            path: 'feature',
            loadChildren: './feature.module#FeatureModule'
        }, {
            path: 'otherfeature',
            component: RouteComponent
        }]
    }
];
```

In this example, if you access the `''` route, only the `AuthenticationGuard` would be called. Meanwhile, if you accessed the `'otherfeature'` route, you would load the `AuthenticationGuard`, THEN call the `AuthorizationGuard`. What order would you think the guards would load for the `'feature'` route? The answer might be a little more tricky than you expect.

The answer? `canLoad` runs first. Before `AuthenticationGuard` and before `AuthorizationGuard`. It also, unlike the other two, prevents the entire loading of the  route. The advantage here is that you can stop the loading of a  lazy-loaded route before doing any checks you’d want to run to prevent.  This would increase performance greatly in situations where you’d block  the loading of a page and it would be much more secure. After `canLoad` runs, then the other two run in order as they would before

## Wrap Up

Just like anything else, an Angular Router Guard is a tool. It has many uses that are really only restricted by how you’re able to utilize that  tool. You’re able to do service calls, logic changes, and more in order  to restrict access to a page. However, it’s not a one-tool-fits-all  solution. There will be times that a [resolver](https://angular.dev/api/router/Resolve) might be able to help better, or sometimes even component logic might  fit your use-case better. That being said, Guards are incredibly helpful when the time comes to use them
