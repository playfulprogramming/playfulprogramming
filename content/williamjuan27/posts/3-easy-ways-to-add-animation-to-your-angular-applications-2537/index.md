---
{
title: "3 Easy Ways to Add Animation to your Angular Applications",
published: "2021-09-14T12:50:18Z",
edited: "2021-09-22T13:22:11Z",
tags: ["angular", "animations", "css"],
description: "Animations add life to your application and can greatly increase your app's overall user experience....",
originalLink: "https://williamjuan.dev/blog/3-easy-ways-to-add-animation-to-your-angular-applications",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "14719",
order: 1
}
---

Animations add life to your application and can greatly increase your app's overall user experience. Animation is a complex topic and can be intimidating to many. However, adding animations to your Angular apps doesn't have to be difficult. I'm going to show you 3 easy ways you can add animations to your apps along with some additional resources to make the process even easier.

This blog post is meant to be a short introduction to animations for Angular. If you are looking for more advanced content, check out my [Indepth Guide to Animation in Angular](https://indepth.dev/posts/1285/in-depth-guide-into-animations-in-angular) on indepth.dev or my [Angular Animation Explorer](https://williamjuan027.github.io/angular-animations-explorer/) project. Those include more advanced use cases and covers topics such as performance, debugging, and more.

## CSS Keyframes and Transitions

Since Angular runs on browsers and utilizes HTML and CSS, we can leverage CSS animations in our Angular application the same way a regular non-Angular application would. The animation would be defined in our CSS file either as a `transition` or `keyframes` and is triggered by adding the class containing this animation.

Adding an expanding animation via the `transition` property would look like this:

```css
#targetElement {
  transition: tranform 0.5s;
}

#targetElement.expand {
  transform: scale(1.1);
}
```

> CSS `transition` is ideal for simple animation that has a from and to state (hence the name - transition)

To use this in our template, we would bind the class `expand` to a property that will conditionally add and remove the class to trigger the animation defined. Let's add a variable `shouldExpand` that will be set to `true` when we want to run the animation. We can use Angular's class binding and set it equal to the variable like this:

```html
<div #targetElement [class.expand]="shouldExpand"></div>
```

CSS keyframes animation, on the other hand, gives us more granular control over our animation - letting us decide what goes on at each keyframe throughout the animation. This is ideal for creating more complex animations that require intermediate steps within the animation and involves some kind of looping - finite/infinite.

Let's look at the same expand animation example, and transform it from a transition to a keyframe animation:

```css
#targetElement.expand {
  animation: expand 0.5s;
}

@keyframes expand {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
}
```

We can then bind the `expand` class to a variable to conditionally trigger the animation:

```html
<div #targetElement [class.expand]="shouldExpand"></div>
```

> Both transition and keyframe animations also come with events that we can hook into. Depending on which one you use, we can use either `animationend` or `transitionend` to listen to the animation end event.

An advantage of this approach is that it lets us utilize any CSS animation library that works off of the same concept of adding and removing classes. Some of the more popular libraries that work this way are [animate.css](https://daneden.github.io/animate.css/) and [magic.css](https://www.minimamente.com/project/magic/). Chris Coyier has an amazing [article](https://css-tricks.com/css-animation-libraries/) on CSS Tricks that lists more of these if you are interested.

## Web Animation APIs

Web Animation APIs, also known as WAAPI fills the gap between declarative CSS animations and transitions, and dynamic JavaScript animations. At the time this was written, WAAPI is supported by Firefox 48+ and Chrome 36+. It also has a comprehensive and robust polyfill, making it safe to use in production today.

If you've used WAAPI in any Javascript project before, this section is going to look familiar. In plain Javascript, if we want to access an element in the DOM, we would typically give the element an `id` and use `document.getElement.byId` with the element's `id` to get a reference to the element. In Angular, we can use the template reference variable (`#`) instead and get its reference by using Angular's `ViewChild` decorator.

Let's first start with creating the `div` that we will animate and give it a reference variable of `targetElement`:

```html
<div #targeElement></div>
```

To access this element, use the `ViewChild` decorator and pass in the reference variable assigned to our element (`#targetElement`):

```typescript
import { ViewChild, ElementRef } from '@angular/core';

@ViewChild('targetElement') targetElement: ElementRef;
```

To animate this element, call the `animate` function on the element's `nativeElement` property and pass in the animation array and the animation timing properties:

```typescript
startAnimation(): void {
  this.targetElement.nativeElement.animate(this.getShakeAnimation(), this.getShakeAnimationTiming());
}

getShakeAnimation() {
    return [
      { transform: 'rotate(0)' },
      { transform: 'rotate(2deg)' },
      { transform: 'rotate(-2deg)' },
      { transform: 'rotate(0)' },
    ];
  }

getShakeAnimationTiming() {
    return {
      duration: 300,
      iterations: 3,
    };
  }
```

WAAPI also comes with some handy utility properties and functions that we can use in our Angular application the same way you would do in a regular vanilla application. These include functions to pause, cancel, and reverse the current animation and some event handlers such as `oncancel` and `onfinish`. You can read more about these APIs in [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Animation).

## Angular Animations

Angular animations (`@angular/animations`) is a powerful module that comes with Angular which provides a DSL (domain-specific language) for defining web animation sequences for HTML elements as multiple transformations over time. Angular animations use the native Web Animations API, and fall back to CSS keyframes if the Web Animations API is not supported in the user's browser.

Angular animations are based on CSS web transition functionality, which means that anything that can be styled or transformed natively through CSS, can also be styled and transformed using Angular animations. This provides us with animations that have CSS-like performance that fits in nicely with Angular.

Animations using Angular's `BrowserAnimationModule` go through 4 steps. I like to think of this as being comprised of a series of questions - why, what, where, and how, the answers of which being what governs the animation’s behavior:

- Evaluate data binding expression - tells Angular which animation state the host element is assigned to (why)
- Data binding target tells Angular which animation target defines CSS styles for the elements state (what)
- State tells Angular which CSS styles should be applied to the element (where)
- Transition tells Angular how it should apply the specified CSS styles when there is a state change (how)

To use `@angular/animations` in our application, we will have to import `BrowserAnimationsModule` and add it to the module's imports array:

```typescript
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
  imports: [BrowserAnimationsModule],
})
export class AppModule {}
```

Angular Animations can be used for a lot of different use cases, I use them for entering/leave, state changes, and stagger animations. Let me show you a basic example of what an enter/leave animation looks like.

Define our animations and add them to the `animations` array in our component decorator:

```typescript
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
    ...
    animations: [
        trigger('fadeSlideInOut', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(10px)' }),
                animate('500ms', style({ opacity: 1, transform: 'translateY(0)' })),
            ]),
            transition(':leave', [
                animate('500ms', style({ opacity: 0, transform: 'translateY(10px)' })),
            ]),
        ])
    ],
})
```

We can then use the name of the `trigger` (`fadeSlideInOut` in the snippet above) prefixed with the `@` symbol in our template to run our animation as the element is being added (`:enter` block of the animation) and removed (`:leave` block of the animation) from the DOM.

```html
<div *ngIf="show" @fadeSlideInOut>...</div>
```

You can learn more about Angular Animations from Angular's [official docs](https://angular.io/guide/animations) or in the basic and advanced section of [Angular Animations Explorer](https://williamjuan027.github.io/angular-animations-explorer)

## Conclusion

This brings us to the end of the post. I hope you enjoyed this short introduction to animations in Angular. If you want to learn more about each of these, check out this [reference](https://williamjuan027.github.io/angular-animations-explorer), complete with live demos of each technique and more. If you are interested in more content like this or have any questions let me know in the comments or tweet me at [@williamjuan27](https://twitter.com/williamjuan27)