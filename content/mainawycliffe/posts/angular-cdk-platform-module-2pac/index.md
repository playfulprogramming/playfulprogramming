---
{
title: "Angular CDK - Platform Module",
published: "2021-03-08T16:46:09Z",
tags: ["angular", "webdev", "javascript", "typescript"],
description: "In this article, we are going to take a look at the Platform Module from Angular CDK. The platform mo...",
originalLink: "https://mainawycliffe.dev/blog/angular-cdk-platform-module",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

In this article, we are going to take a look at the Platform Module from Angular CDK. The platform module provides you with information about the current platform where your web app is running on, such as OS, Browser, Rendering Engine, etc. It also gives you information on the features the platform supports such as scroll behavior.

This enables you to identify the platform where your app is running on and modify the behavior of your Angular app appropriately. The CDK Platform Module makes the following information available to you:

- Is Android - Whether the OS is Android
- Is iOS - Whether the OS is iOS
- Is Firefox - Whether the browser is Firefox
- Is Edge - Whether the browser is Edge
- Is Safari - Whether the browser is Safari
- Is Blink - Whether the rendering engine is Blink
- Is Webkit - Whether the rendering engine is WebKit
- Is Trident - Whether the rendering engine is [Trident](https://wikivisually.com/wiki/Trident_(software))
- Supported Input Types - A list of input form field types supported by the browser i.e. number, password, radio, range, reset, search, submit, tel, text, time, url, etc.
- Whether the browsers supports [Scroll Behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior) -
- And Whether the browser supports [passive event listeners](https://web.dev/uses-passive-event-listeners/).

## Installation

**Using yarn:**

```sh
$ yarn add @angular/cdk
```

Install @angular/cdk using yarn

**Using NPM:**

```sh
$ npm install @angular/cdk
```

Install @angular/cdk using npm

## Usage

First, we will need to import the `PlatformModule` from `@angular/cdk/platform` inside our app module, as shown below:

```typescript
// other imports
import { PlatformModule } from '@angular/cdk/platform';

@NgModule({
  declarations: [
    AppComponent,
    // ... components
  ],
  imports: [
  	// ... other modules
    PlatformModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

> **NB:** If you are using feature or shared modules, you will need to import `PlatformModule` inside the module where the component using it is located.

Then, we are going to inject the `Platform` service into the component where we want to use the platform information.

```typescript
import { Platform } from '@angular/cdk/platform';
// ... other imports

@Component({
 // ... component metadata
})
export class Component  {
  constructor(private platform: Platform) {}
}
```

And finally, we can determine the browser platform information as shown below.

```typescript
this.platform.ANDROID; // check if OS is android
this.platform.FIREFOX // check if Browser is Firefox
this.platform.IOS; // check if OS is iOS
this.platform.BLINK; // check if render engine is Blink
this.platform.isBrowser; // check if the app is being rendered on the browser
```

For an up-to-date reference for the API, please refer to the official docs [here](https://material.angular.io/cdk/platform/api).

## Example

We are going to implement a share functionality for our web app, where on mobile devices i.e. iOS and Android, we will use native share while on Desktop, we will use share buttons for each Social Media Platform.

We will use the `PlatformModule` to determine if the user is on `iOS` and `Android`, and then we will use the [WebShare API](https://web.dev/web-share/). For other devices i.e. Desktop, we will just show a simple twitter share button instead. Here is what our component looks like:

```typescript
import { Platform } from '@angular/cdk/platform';

@Component({
  selector: 'app-social-share',
  templateUrl: './social-share.component.html',
  styleUrls: ['./social-share.component.scss'],
})
export class SocialShareComponent implements OnInit {
  @Input()
  shareUrl: string;

  @Input()
  title: string;

  @Input()
  text: string;

  @Input()
  hashtags: string;

  tweetShareUrl: string;

  isNativeShareSupported = false;

  constructor(private platform: Platform) {}

  ngOnInit(): void {
    // show native share if on Android and IOS and if it is supported
    this.isNativeShareSupported =
      navigator.share && (this.platform.ANDROID || this.platform.IOS);
    const baseUrl = 'https://twitter.com/intent/tweet';
    this.tweetShareUrl = `${baseUrl}?url=${this.shareUrl}&via=mwycliffe_dev&text=${this.title}&hashtags=${this.hashtags}`;
  }

  async nativeShare() {
    if (navigator.share) {
      await navigator.share({
        title: this.title,
        text: this.text.substr(0, 200),
        url: this.shareUrl,
      });
    }
  }
}
```

Our share component above, has a property named `isNativeShareSupported` - which is a `boolean`. We are checking whether the current browser supports native share, and the platform is iOS or Android before setting that property to true. And then we can use this property to show the correct UI, as shown below:

```html
<ng-container *ngIf="isNativeShareSupported; else showSocialShareButton">
  <a (click)="nativeShare()" class="space-x-2">
    <span>Share this article</span>
  </a>
</ng-container>

<ng-template #showSocialShareButton>
  Share on this article: <a target="_blank" [href]="tweetShareUrl">Twitter</a>
</ng-template>
```

## Conclusion

In this article, we have learned how to use CDK `Platform Module` to check the platform details in which our app is running on. This is a simple and quite useful way of modifying the behavior of your Angular app based on the platform being used. This can lead to an improved UX as you can enable enhanced features to users with access to them while providing a decent fallback to users without access to the enhanced features.

### Links

- CDK Documentation on Platform Module - [Link](https://material.angular.io/cdk/platform/overview).
- Integrate with the OS sharing UI with the Web Share API - [Link](https://web.dev/web-share/).
- Does not use passive listeners to improve scrolling performance - [Link](https://web.dev/uses-passive-event-listeners/).
- scroll-behavior - [Link](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior).
- How to build a reusable Modal Overlay/Dialog Using Angular CDK - [Link](https://mainawycliffe.dev/blog/how-to-build-a-reusable-modal-overlay-dialog-using-angular-cdk).
- Building a Custom Stepper using Angular CDK - [Link](https://indepth.dev/posts/1284/building-a-custom-stepper-using-angular-cdk).