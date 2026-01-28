---
{
title: "Exploring Routes Rendering Modes in Angular",
published: "2025-02-10T09:37:27Z",
tags: ["angular", "webdev", "javascript", "typescript"],
description: "Over the last few years, Angular has grown through some significant and important changes. One of...",
originalLink: "https://newsletter.unstacked.dev/p/exploring-routes-rendering-modes",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

Over the last few years, Angular has grown through some significant and important changes. One of those changes was incorporating server-side rendering into Angular instead of a library like it used to be with Angular Universal, the predecessor of Angular SSR (`@angular/ssr`).

Now, every angular application, out of the box, by default, uses SSR, which is an opt-out feature. For most people, when building Angular apps, it either needs to be server-side rendered or not; for instance, a dashboard behind a login wall doesn’t need SSR, while an e-commerce site needs it.

However, there are applications where there are some pages that are behind a login wall, and some public routes. If we circle back to our e-commerce site example, checkout pages, order pages, etc., are such examples that are probably behind a login wall, while product pages are public.

If you enable SSR on such a route behind a login wall, and someone visits the page, Angular will render the login page (or wherever the Auth Guards redirect them). When the page is loaded, Angular will determine the user is logged in and redirect them back to the actual page, as shown below:

![Image description](./6qzt44i5bxbq17hvys5v.gif)

This means the user will see a flash on the login page before seeing the actual page. This happens because, in our case, the authentication context is only available on the browser, not the server, and hence, on the server, the user is not logged in, but on the browser, the user is.

If you encountered this, like I did, before Angular 19, you would have to disable SSR, as that’s not an optimal user experience. However, the Angular team introduced in Angular 19 the concept of render modes for individual routes, or what is called hybrid rendering.

Instead of all routes either being client-side rendered (CSRd) or server-side rendered (SSRd), you can now choose what to do for each route. On top of that, they also added the ability to perform static site generation (SSG) for individual routes.

Let’s see some code.

## Setting Up Server Routes Manually

Please note that this feature is in [developer preview](https://angular.dev/reference/releases#developer-preview), so use it cautiously. For more information on what this means, please check out the following link on Angular versioning [here](https://angular.dev/reference/releases).

Before we can go any further, ensure you are on Angular 19. Angular has introduced a concept for Server Routes in which you can declare what to do for certain routes. To take the example above, we have two routes, as shown below:

```
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [redirectIfNotLoggedInGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [redirectIfLoggedInGuard],
  },
];
```

For the above route configuration, we can add server route configurations using the path and the render mode we need. I chose to store them next to each other, but it can also live in its server routes file - whatever floats your boat.

```
...
import { RenderMode, ServerRoute } from '@angular/ssr';

...

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Client,
  },
  {
    path: 'login',
    renderMode: RenderMode.Server,
  },
];
```

The render mode accepts one of three values, `RenderMode.Client`, `RenderMode.Server`, and `RenderMode.Prerender`. For our very simple example above, we are `RenderMode.Client` for the home page, so it will not be server-side rendered, and then `RenderMode.Server` for the login page, it will be server-side rendered.

Please note, for now, you have to add all routes to the Server Routes.

Once we set up our routes, we finally need to provide the server routes in our app config so that Angular can use them. We achieve this by using the `provideServerRouting` function and passing in the server routes we configured.

```
...
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRouting } from '@angular/ssr';
...

export const appConfig: ApplicationConfig = {
  providers: [
    ...
    provideServerRouting(serverRoutes),
    provideRouter(routes),
    ...
  ],
};
```

And that’s it. If we circle back to our example, you can see that the login page flash is completely gone.

![Image description](./dzvbv2cup3841qvgdnmb.gif)

You can find the code for the above application [here](https://github.com/unstacked-labs/angular-router-render-modes-demo).

### Setting Up For New Projects

Of course, this is Angular we are talking about. With the magic of schematics, you can automate the above process; you will only have to configure your routes.

If you are starting a new project, Angular provides a flag `--server-routing` that enables this for the new project when setting it up.

```
ng add @angular/ssr --server-routing
```

### Conclusion

In this brief article, we looked at Rendering Modes in Angular and how we can use them to provide a better user experience for our users. Before this, your options were limited; you could either use SSR or not use SSR if it broke the UX of your users. But with render modes, you can enable SSR where it makes sense, Prerender pages that make sense and CSR pages that make sense, ensuring a much better user experience for our users.

That’s it from me, and until next time, happy coding.
