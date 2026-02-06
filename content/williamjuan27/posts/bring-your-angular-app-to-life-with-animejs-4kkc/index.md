---
{
title: "Bring Your Angular App to Life with Anime.js",
published: "2025-08-19T13:57:42Z",
edited: "2025-08-20T12:31:50Z",
tags: ["angular", "animejs", "webdev", "tutorial"],
description: "With recent updates to the Angular framework, it is now recommended to move away from the...",
originalLink: "https://williamjuan.dev/blog/bring-your-angular-app-to-life-with-animejs",
coverImg: "cover-image.png",
socialImg: "social-image.png",
collection: "Animations in Angular",
order: 6
}
---

With recent updates to the Angular framework, it is now [recommended](https://angular.dev/guide/animations/migration) to move away from the `@angular/animations` package in favor of simpler alternatives using CSS or JavaScript. Many common animations can be accomplished with a pure CSS solution, however, JavaScript may be necessary for more complex animations. Additionally, third-party libraries, such as the CSS-based [Animate.css](https://animate.style/) or the JavaScript-based [Anime.js](https://animejs.com/), [GSAP](https://gsap.com), and [Popmotion](https://popmotion.com), can be utilized for more advanced use cases.

This post will explore how to integrate and utilize [Anime.js](https://animejs.com/), a fast and versatile JavaScript animation library, in an Angular application.

```bash
npm i --save animejs
```

## Setup Element to Animate

To animate an element from your template, you will need to give it an id (`#box` in the code snippet below) so you can access them from your typescript file. Start with creating a box with some basic styling as follows:

```html
<!-- app.component.html -->
<div class="animation-demo-container">
  <div class="card-container">
    <div #box class="demo-card"></div>
  </div>
</div>
```

Add the following styling:

```css
// app.component.scss

.animation-demo-container {
    display: flex;
    flex-direction: column;
    border-radius: 0.5rem;
    border-width: 1px;
    border-color: rgb(14 116 144);
    background-color: rgb(30 41 59);
    min-height: 350px;
    .card-container {
        flex-grow: 1;
        padding: 1.25rem;
        .demo-card {
            height: 10rem;
            width: 10rem;
            border-radius: 0.5rem;
            border-width: 1px;
            background-color: rgb(125 211 252);
        }
    }
}
```

## Setup Animation Controls

Add 3 buttons to the template to start a simple animation, a bounce animation, and another button play/pause the animations:

```html
<!-- app.component.html -->
<div class="animation-demo-container">
  <div class="card-container">
    <div #box class="demo-card"></div>
  </div>

  <!-- add the following 👇 -->
  <div class="demo-controller-container">
    <button class="demo-button" (click)="animateDefaultCard()" [disabled]="isAnimating()">Default</button>
    <button class="demo-button" (click)="animateSpringCard()" [disabled]="isAnimating()">Bounce</button>
    @if (isAnimating()) {
      <button class="demo-button" (click)="playPause()">{{
        isPaused() ? 'Play' : 'Pause'
        }}</button>
    }
  </div>
</div>

```

Add styling to the buttons:

```css
// app.component.scss

.animation-demo-container {
    display: flex;
    flex-direction: column;
    border-radius: 0.5rem;
    border-width: 1px;
    border-color: rgb(14 116 144);
    background-color: rgb(30 41 59);
    min-height: 350px;
    .card-container {
        flex-grow: 1;
        padding: 1.25rem;
        .demo-card {
            height: 10rem;
            width: 10rem;
            border-radius: 0.5rem;
            border-width: 1px;
            background-color: rgb(125 211 252);
        }
    }
    // add the following 👇
    .demo-controller-container {
        display: flex;
        flex-direction: row;
        gap: 0.75rem;
        border-radius: 0 0.5rem 0.5rem 0;
        background-color: rgb(14 116 144);
        padding: 1rem 1.25rem;
        .demo-button {
            border-radius: 0.25rem;
            background-color: rgb(255 255 255);
            padding: 0.5rem 0.75rem;
            font-weight: 500;
        }
    }
}

```

## Add AnimeJS Animation

Start with using the `ViewChild` decorator to access the target element:

```js
// app.component.ts

// Update this 👇
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  // Add this 👇
  @ViewChild('box') box!: ElementRef;

}
```

Next, add two `signal` variables - `isAnimating` and `isPaused` to track the animation state

```js
// app.component.ts

// Update this 👇
import { Component, ElementRef, signal, ViewChild } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('box') box!: ElementRef;

  // Add this 👇
  isAnimating = signal<boolean>(false)
  isPaused = signal<boolean>(false)
}

```

Create an `_animateCard` function that will trigger the AnimeJS animation. This function accepts an easing parameter to set the animation's easing configuration.

```js
// app.component.ts

import { Component, ElementRef, signal, ViewChild } from '@angular/core';

// Add this 👇
import { animate, EasingParam, JSAnimation } from 'animejs';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('box') box!: ElementRef;

  isAnimating = signal<boolean>(false)
  isPaused = signal<boolean>(false)

  // Add this 👇
  private _animeAnimation: JSAnimation | undefined = undefined

  // Add this 👇
  private _animateCard(ease: EasingParam): void {
    if (this.isAnimating()) {
      return
    }
    this.isAnimating.set(true)
    this.isPaused.set(false)
    this._animeAnimation = animate(this.box.nativeElement, { 
      x: 250,
      duration: 400,
      ease: 'out'
    })
    this._animeAnimation
      .then(() => {
        this._animeAnimation = animate(
          this.box.nativeElement, {
            x: 0,
            duration: 500,
            ease,
          }
        )
        this._animeAnimation
          .then(() => {
            this.isAnimating.set(false)
          })
          .catch(() => {
            this.isAnimating.set(false)
          });
      })
      .catch(() => {
        this.box.nativeElement.x = 0;
        this.isAnimating.set(false)
      });
  }  
}

```

Create a function to play and pause the animation. This function will perform the checks and set the `isAnimating` and `isPaused` variables depending on the current state of the animation. If the animation is playing, it'll enable the ability to pause the animation and if it's not playing, it'll start the animation.

```js
// app.component.ts

import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { animate, EasingParam, JSAnimation } from 'animejs';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('box') box!: ElementRef;

  isAnimating = signal<boolean>(false)
  isPaused = signal<boolean>(false)

  private _animeAnimation: JSAnimation | undefined = undefined

  // Add this 👇
  playPause(): void {
    if (!this._animeAnimation) {
      return;
    }
    if (this.isAnimating()) {
      if (this.isPaused()) {
        this._animeAnimation.resume()
        this.isPaused.set(false)
      } else {
        this._animeAnimation.pause()
        this.isPaused.set(true)
      }
    }
  }
  
  private _animateCard(ease: EasingParam): void {
    if (this.isAnimating()) {
      return
    }
    this.isAnimating.set(true)
    this.isPaused.set(false)
    this._animeAnimation = animate(this.box.nativeElement, { 
      x: 250,
      duration: 400,
      ease: 'out'
    })
    this._animeAnimation
      .then(() => {
        this._animeAnimation = animate(
          this.box.nativeElement, {
            x: 0,
            duration: 500,
            ease,
          }
        )
        this._animeAnimation
          .then(() => {
            this.isAnimating.set(false)
          })
          .catch(() => {
            this.isAnimating.set(false)
          });
      })
      .catch(() => {
        this.box.nativeElement.x = 0;
        this.isAnimating.set(false)
      });
  }  
}

```

Lastly, add the `animateDefaultCard` and `animateSpringCard` functions that will call the `_animateCard` function with their respective easing configuration.

```js
// app.component.ts

import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { animate, EasingParam, JSAnimation } from 'animejs';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('box') box!: ElementRef;

  isAnimating = signal<boolean>(false)
  isPaused = signal<boolean>(false)

  private _animeAnimation: JSAnimation | undefined = undefined

  // Add this 👇
  animateDefaultCard(): void {
    this._animateCard('easeInOut');
  }

    // Add this 👇
  animateSpringCard(): void {
    this._animateCard('outBounce');
  }

  playPause(): void {
    if (!this._animeAnimation) {
      return;
    }
    if (this.isAnimating()) {
      if (this.isPaused()) {
        this._animeAnimation.resume()
        this.isPaused.set(false)
      } else {
        this._animeAnimation.pause()
        this.isPaused.set(true)
      }
    }
  }
  
  private _animateCard(ease: EasingParam): void {
    if (this.isAnimating()) {
      return
    }
    this.isAnimating.set(true)
    this.isPaused.set(false)
    this._animeAnimation = animate(this.box.nativeElement, { 
      x: 250,
      duration: 400,
      ease: 'out'
    })
    this._animeAnimation
      .then(() => {
        this._animeAnimation = animate(
          this.box.nativeElement, {
            x: 0,
            duration: 500,
            ease,
          }
        )
        this._animeAnimation
          .then(() => {
            this.isAnimating.set(false)
          })
          .catch(() => {
            this.isAnimating.set(false)
          });
      })
      .catch(() => {
        this.box.nativeElement.x = 0;
        this.isAnimating.set(false)
      });
  }  
}

```

## Conclusion

This approach offers a powerful alternative to the `@angular/animations` package, giving you precise control over animation properties, timing, and easing. The example we walked through is just a starting point. The library's versatility opens up possibilities for complex, choreographed sequences. Try experimenting with different properties and easing functions to bring your UI to life!

Try it yourself! A live demo and more examples with other libraries are available in the [Angular Animation Explorer](https://williamjuan027.github.io/angular-animations-explorer/post/third-party-libs/animejs).
