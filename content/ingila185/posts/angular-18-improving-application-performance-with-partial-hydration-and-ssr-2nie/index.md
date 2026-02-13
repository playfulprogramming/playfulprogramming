---
{
title: "Improving Core Web Vitals including LCP and CLS with Partial Hydration in Angular 18",
published: "2024-10-05T13:56:01Z",
edited: "2024-10-08T04:38:08Z",
tags: ["angular", "webdev", "javascript", "typescript"],
description: "Angular 18 introduced Partial Hydration in ng-conf 2024, a powerful technique that significantly...",
originalLink: "https://dev.to/playfulprogramming-angular/angular-18-improving-application-performance-with-partial-hydration-and-ssr-2nie",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

Angular 18 introduced Partial Hydration in [ng-conf 2024](https://www.angulartraining.com/daily-newsletter/recap-of-ng-conf-2024/), a powerful technique that significantly improves application performance in conjunction with Server-Side Rendering (SSR). This article dives into the concept of partial hydration, its benefits, and how it leverages deferrable views introduced in [Angular 17](https://v17.angular.io/docs).

According to [Angular Roadmap:](https://angular.dev/roadmap)

> We’re already seeing significant improvements to Core Web Vitals, including LCP and CLS. In lab tests, we consistently observed 45% better LCP of a real-world app.

## Why Partial Hydration and SSR Matter

Traditional Angular applications often suffer from a performance bottleneck when loading all JavaScript upfront. This can significantly impact the initial load time, especially for large and performance-critical applications. By strategically reducing the amount of JavaScript loaded at the start, we can drastically enhance user experience.

## Partial Hydration: A Smarter Approach to SSR

Partial hydration builds upon the foundation of [deferrable views](https://next.angular.dev/guide/defer), introduced in Angular 17. Instead of rendering a simple placeholder on the server, Angular can now render the main content of a designated block marked with @defer. Here's how it works:

1. **Server-side Rendering:** The server renders the essential content of the application along with the @defer block containing the component.
2. **Client-side Hydration:** When the application runs on the client, Angular downloads the necessary JavaScript for the deferred component.
3. **Selective Activation:** The deferred component only becomes interactive when it meets specific conditions, like entering the user's viewport.

This approach offers several advantages:

- **Faster Initial Load Times**: By deferring unnecessary JavaScript, users experience a quicker initial page load.
- **Improved Perception:** The application feels more responsive as core functionalities are available instantly.
- **Reduced Data Consumption:** Smaller initial JavaScript payloads translate to lower data usage.

## Enabling Partial Hydration

Utilizing partial hydration is going to be straightforward as mentioned in [the Angular blog](https://blog.angular.dev/angular-v18-is-now-available-e79d5ac0affe). Here's a potential example:

```
{
  @defer (render on server; on viewport) {
    <my-deferrable-component></my-deferrable-component>
  }
}
```

In this example:

- `my-deferrable-component` is rendered on the server.
- Client-side, Angular downloads the required JavaScript for the component.
- Interaction with `my-deferrable-component` only occurs when it enters the viewport, optimizing rendering and performance.

## Conclusion

Partial hydration is one of the most requested features of Angular that empowers Angular developers to create performant and user-friendly applications. By strategically deferring component hydration based on user interaction or visibility,  Angular 18 ensures a smooth and responsive user experience, especially for complex and data-heavy applications.
