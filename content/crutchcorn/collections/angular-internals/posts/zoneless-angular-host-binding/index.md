---
{
  title: "How does Zoneless Angular Work?",
  description: "In the future Angular will not have Zone.js enabled by default and will not need it for change detection. But how will that work in a technical sense?",
  published: "2024-11-08T21:52:59.284Z",
  tags: ["angular", "javascript", "webdev"],
  license: "cc-by-4",
  order: 3
}
---

> **Warning:**
>
> This article talks in-depth about technical specifics of [the `provideExperimentalZonelessChangeDetection` experiment](https://angular.dev/api/core/provideExperimentalZonelessChangeDetection) present in Angular 18. The mechanisms discussed in this article are likely to change before this experiment is made production-ready.

Recently [I was live on my Twitch stream coding away](https://twitch.tv/crutchcorn) until I got massively [nerd sniped](https://xkcd.com/356/) away from my discussion.

One of my viewers asked me:

> How does Zoneless bind to events if [Zone.js is supposed to be the one monkey-patching `EventTarget`](/posts/angular-internals-zonejs#zone-patch-intro)?

I originally thought that the Zoneless strategy offered by [`provideExperimentalZonelessChangeDetection`](https://angular.dev/api/core/provideExperimentalZonelessChangeDetection) didn't do any kind of event binding, but to my surprise the following code works fine without Zone.js:

```angular-ts
import { bootstrapApplication } from "@angular/platform-browser";
import {
	ChangeDetectionStrategy,
	Component,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";

@Component({
	selector: "app-root",
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<button (click)="add()">{{ count }}</button>`,
})
export class AppComponent {
	count = 0;

	add() {
		this.count++;
	}
}

bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()],
});
```

<iframe data-frame-title="Zoneless Event Bind Simple - StackBlitz" src="pfp-code:./zoneless-event-bind-simple-1?template=node&embed=1&file=src%2Fmain.ts"></iframe>

So wait, if Zone.js isn't here to patch `EventTarget`, then what is?

# Confirming that `Zone.js` is disabled

Let's first double-check something; let's make sure that Zone.js is honestly and truly disabled in our code sample.

If it were enabled, we'd expect any kind of `addEventListener` to trigger change detection. Taking another look and sure enough, a `addEventListener` added after-the-template compilation still triggers change detection when Zone.js is imported:

```angular-ts
import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";
import { AfterViewInit, Component, ElementRef, viewChild } from "@angular/core";

@Component({
	selector: "app-root",
	standalone: true,
	// Must not be `OnPush` to demonstrate this behavior working
	template: `<button #el>{{ count }}</button>`,
})
export class AppComponent implements AfterViewInit {
	count = 0;

	el = viewChild.required<ElementRef>("el");

	ngAfterViewInit() {
		// Can't be OnPush is because we're not properly marking this component
		// as a dirty one for checking, so OnPush bypasses checking this node.
		this.el()!.nativeElement.addEventListener("click", this.add.bind(this));
	}

	add() {
		this.count++;
	}
}

bootstrapApplication(AppComponent);
```

<iframe data-frame-title="Zone.js addEventListener - StackBlitz" src="pfp-code:./zone-js-add-event-listener-2?template=node&embed=1&file=src%2Fmain.ts"></iframe>

Now if we remove Zone.js using `provideExperimentalZonelessChangeDetection`, we'd expect this demo to break the intended functionality:

```angular-ts
@Component({
  selector: 'app-root',
  standalone: true,
  template: `<button #el>{{ count }}</button>`,
})
export class AppComponent implements AfterViewInit {
  count = 0;

  el = viewChild.required<ElementRef>('el');

  ngAfterViewInit() {
  	// Can't be OnPush is because we're not properly marking this component
  	// as a dirty one for checking, so OnPush bypasses checking this node.
    this.el()!.nativeElement.addEventListener('click', this.add.bind(this));
  }

  add() {
    this.count++;
  }
}
```

<iframe data-frame-title="Zoneless addEventListener - StackBlitz" src="pfp-code:./zoneless-add-event-listener-3?template=node&embed=1&file=src%2Fmain.ts"></iframe>

Sure enough, this is the case. Why does this demo break?

Well, it's because:

- Zone.js patches `EventTarget` to call `tick`
- When we remove Zone.js from our bundle to make our app Zoneless, it removes this `EventTarget` patch

But wait, if this is true, how does the first code sample work with no Zoneless change detection? Surely, Angular must be notified when the user clicks on the event?

Well, it does, but it doesn't do so using `EventTarget`.

# How does Angular bind to events?

Let's look at how Angular triggers `addEventListener`. First, [we look at `DomEventsPlugin` which is the actual code that called `element.addEventListener`](https://github.com/angular/angular/blob/6819d6abf3381383d3b5e25e04d1866b7438fca8/packages/platform-browser/src/dom/events/dom_events.ts#L26-L29):

```typescript
@Injectable()
export class DomEventsPlugin extends EventManagerPlugin {
  // ...

  override addEventListener(element: HTMLElement, eventName: string, handler: Function): Function {
    element.addEventListener(eventName, handler as EventListener, false);
    return () => this.removeEventListener(element, eventName, handler as EventListener);
  }

  // ...
}
```

Then, [it's called from `EventManager`](https://github.com/angular/angular/blob/6819d6abf3381383d3b5e25e04d1866b7438fca8/packages/platform-browser/src/dom/events/event_manager.ts#L61-L64):

```typescript
@Injectable()
export class EventManager {
  // ...
  
  addEventListener(element: HTMLElement, eventName: string, handler: Function): Function {
    const plugin = this._findPluginFor(eventName);
    return plugin.addEventListener(element, eventName, handler);
  }
    
  // ...
}
```

> Angular makes this event manager more generic to replace [the handling of events like `panstart` from Hammer.js](https://angular.dev/api/platform-browser/HammerModule?tab=description)

[This is then called from `DefaultDomRenderer2`, which is the default for web apps](https://github.com/angular/angular/blob/6819d6abf3381383d3b5e25e04d1866b7438fca8/packages/platform-browser/src/dom/dom_renderer.ts#L341-L361):

```typescript
class DefaultDomRenderer2 implements Renderer2 {
  // ...
    
  listen(
    target: 'window' | 'document' | 'body' | any,
    event: string,
    callback: (event: any) => boolean,
  ): () => void {
    // ...

    return this.eventManager.addEventListener(
      target,
      event,
      this.decoratePreventDefault(callback),
    ) as VoidFunction;
  }
}
```

Which is called [from the renderer's implementation of `listener`](https://github.com/angular/angular/blob/6819d6abf3381383d3b5e25e04d1866b7438fca8/packages/core/src/render3/instructions/listener.ts#L218-L220):

```typescript
export function listenerInternal(
  tView: TView,
  lView: LView<{} | null>,
  renderer: Renderer,
  tNode: TNode,
  eventName: string,
  listenerFn: (e?: any) => any,
  eventTargetResolver?: GlobalTargetResolver,
): void {
    // ...
    listenerFn = wrapListener(tNode, lView, context, listenerFn);
    // ...
    const cleanupFn = renderer.listen(target as RElement, eventName, listenerFn);
    // ...
}
```

Notice here, how we're wrapping the `listenerFn` with `wrapListener`. [As it turns out, this wrapper calls `markViewDirty`, which triggers change detection for the component](https://github.com/angular/angular/blob/6819d6abf3381383d3b5e25e04d1866b7438fca8/packages/core/src/render3/instructions/listener.ts#L309):

```typescript
function wrapListener(
  tNode: TNode,
  lView: LView<{} | null>,
  context: {} | null,
  listenerFn: (e?: any) => any,
): EventListener {
  // ...
  return function wrapListenerIn_markDirtyAndPreventDefault(e: any) {
 	// ...
    markViewDirty(startView, NotificationSource.Listener);
	// ...
}
```

# What we learned

If we apply what we learned while exploring Angular's source code, we can see the differences between how Zone.js and Zoneless apps bind to events in the template.

**Zone.js works by patching `EventTarget.prototype.addEventListener` itself, while `provideExperimentalZonelessChangeDetection` works by hooking into the compiler to track usage of `(event)` bindings. This binding then, in turn, calls the `markViewDirty` hook to update change detection.**

That's all for today, but if you'd like to learn more about Angular and how to use it, check out [my book that teaches Angular from beginning to end: The Framework Field Guide.](https://framework.guide)

