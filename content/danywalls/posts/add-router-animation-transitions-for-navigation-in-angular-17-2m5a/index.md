---
{
title: "Add Router Animation Transitions for Navigation in Angular 17",
published: "2023-12-13T15:03:34Z",
edited: "2023-12-13T15:03:44Z",
tags: ["angular", "typescript", "frontend", "webdev"],
description: "I'm constantly exploring ways to improve user interaction on websites. Recently, while building a...",
originalLink: "https://www.danywalls.com/add-router-animation-transitions-for-navigation-in-angular-17",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

I'm constantly exploring ways to improve user interaction on websites. Recently, while building a store demo, I thought of enhancing the user experience when navigating between product pages. This led me to play with fantastic feature in Angular 17: "View Transitions."

### **What are Page Transitions?**

Page transitions are animations or visual effects that occur when a user moves from one webpage to another. These transitions make the navigation experience smoother and more engaging. [Here’s a basic guide to web animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations) that can help you understand the fundamentals.

### **Implementing Page Transitions in Angular**

Angular 17 help us to use transitions thanks to `withViewTransitions`, function Let's explore how to implement them in our project.

### Add withViewTransitions to the Router

First, we need to enable the page transition feature in our Angular project. Open the `app.config.ts` file and update the `provideRouter` function:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withFetch()),
  ],
};
```

This code snippet activates the 'Page Transitions' feature. [Angular’s official router documentation](https://angular.io/guide/router) provides more details on how routing works in Angular.

### Define Transitions

The magic of transitions is defined by two special selectors: `::view-transition-old(root)` and `::view-transition-new(root)`.

- `::view-transition-old`: This applies to the current page before navigating to the next.

- `::view-transition-new`: This applies to the new page that's about to be displayed.

If you’re new to CSS animations, [this CSS animation tutorial](https://www.w3schools.com/css/css3_animations.asp) will be useful.

### Create Basic Animations

Creating animations might seem challenging, but with the right tools, it's quite manageable. I used a [CSS Keyframe Animation Generator](https://webcode.tools/css-generator/keyframe-animation) to create basic enter and exit animations.

```css
@keyframes enter {
  0% {
    opacity: 0;
    transform: translateY(-50px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes exit {
  0% {
    opacity: 1;
    transform: scale(1);
  }

  100% {
    opacity: 0;
    transform: scale(0.6);
  }
}
```

Assign these animations to the respective selectors:

```css
::view-transition-old(root) {
  animation: exit 2s ease 0s 1 normal forwards;
}

::view-transition-new(root) {
  animation: enter 3s ease 0s 1 normal forwards;
}
```

After saving these changes, your website will now have smooth and visually appealing transitions between pages!

![Image description](./kul9s1l2b4ra5l3uj1ea.gif)

### **Conclusion**

Angular 17 make easy add page transitions are a great way to achieve this. By following these steps, you can create engaging animations that make your website more interactive and enjoyable.

For further reading and examples, check out [Angular’s animation guide](https://angular.io/guide/animations) and [this comprehensive tutorial on page transitions](https://css-tricks.com/native-like-animations-for-page-transitions-on-the-web/).
