---
{
title: "CSS Animation Events in Angular",
published: "2022-03-18T01:51:18Z",
edited: "2022-04-04T09:39:49Z",
tags: ["angular", "css", "animations"],
description: "CSS animations emit events that we can listen to using Javascript. There are slight differences in...",
originalLink: "https://williamjuan.dev/blog/css-animation-events-in-angular",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "14719",
order: 1
}
---

CSS animations emit events that we can listen to using Javascript. There are slight differences in how we attach event listeners between a vanilla project and an Angular project. Let's start with the list of available events.

- `animationstart` - Emitted when the animation starts
- `animationend` - Emitted when the animation completes
- `animationiteration` - Emitted when an iteration of animation ends and another one begins. This event only fires for the `n - 1` iteration - the last iteration of animation will fire the `animationend` event instead.

> Notice that the event names are all in lowercase and not camel-case

## General Usage

To listen to these events, we will need to attach an event listener to the element with the transition using `addEventListener`. `addEventListener` is a global event listener not specific to just animations or transitions. We can then pass any of the events from the [list of available events](https://developer.mozilla.org/en-US/docs/Web/API/Event) to listen to any of them.

## Approach 1: Using `addEventListener`

The regular Javascript approach functions the same way in an Angular project. The only difference between their usage is how Angular accesses the target element. Instead of accessing the target element using `getViewById`, we can use Angular's `ViewChild` decorator.

```html
<!-- src/app/app.component.html -->

<div #targetElement></div>
```

```typescript
// src/app/app.component.ts

import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  @ViewChild('targetElement') targetElement: targetElement;
}
```

After getting the reference to the target element, we can attach an event listener using the `addEventListener` function.

```typescript
// src/app/app.component.ts

import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  @ViewChild('targetElement') targetElement: ElementRef;

 ngAfterViewInit(): void {
    this.listenToAnimationStart();
    this.listenToAnimationEnd();
    this.listenToAnimationIteration();
  }

  ngOnDestroy(): void {
     this.targetElement.nativeElement.removeEventListener('animationstart');
     this.targetElement.nativeElement.removeEventListener('animationend');
     this.targetElement.nativeElement.removeEventListener('animationiteration');
  }

  listenToAnimationStart(): void {
     this.targetElement.nativeElement.addEventListener('animationstart', () => {
        console.log('animation started');
     })
  }

  listenToAnimationEnd(): void {
     this.targetElement.nativeElement.addEventListener('animationend', () => {
        console.log('animation ended');
     })
  }

  listenToAnimationIteration(): void {
     this.targetElement.nativeElement.addEventListener('animationiteration', () => {
        console.log('animation iteration');
     })
  }
}
```

With this approach, we would also need to make sure that we are cleaning up the event listeners after the component is destroyed to avoid memory leaks (See `ngOnDestroy` in the code above).

## Approach 2: Using Angular's event listener

Angular also let us handle these types of events directly in our template. This reduces the amount of boilerplate and manual clean-up that we would need to do.

Let's convert the event listener from the previous approach. Instead of giving the element an id, we'll directly add the event names enclosed in parentheses and bind it to a function that will be called when the event is fired.

```html
<!-- src/app/app.component.html -->
<div
  (animationstart)="onAnimationStart()"
  (animationend)="onAnimationEnd()"
  (animationiteration)="onAnimationInteration()"
></div>
```

In our component file, add the `onAnimationStart`, `onAnimationEnd`, and `onAnimationInteration` functions.

```typescript
// src/app/app.component.ts

import { Component } from '@angular/core';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {

  onAnimationStart(): void {
      console.log('animation started');
  }

  onAnimationEnd(): void {
     console.log('animation ended');
  }

  onAnimationInteration(): void {
    console.log('animation iteration');
  }
}
```

## Wrapping Up

Both approaches have their pros and cons. Although the first approach (`addEventListener`) is more verbose, it does come with some additional functionalities by letting us pass options to configure how the event listener works. It provides more control of the phase when the listener is activated. This combined with rxjs observables gives us even more control if we need to combine multiple event sources.

If you are interested in more content like this or have any questions, let me know in the comments or tweet me at [@williamjuan27](https://twitter.com/williamjuan27)
