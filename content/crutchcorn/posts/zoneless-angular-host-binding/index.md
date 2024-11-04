---
{
  title: "How does Zoneless Angular Work?",
  description: "",
  published: "2024-11-08T21:52:59.284Z",
  tags: ["angular", "javascript", "webdev"],
  license: "cc-by-4",
}
---



```angular-ts
@Component({
  selector: 'app-root',
  standalone: true,
  // Must not be `OnPush` to demonstrate this behavior working
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

This demo works with `Zone.js` used in the app, but doesn't work with `provideExperimentalZonelessChangeDetection` passed. Why?

Well, it's because:

- Zone.js patches `EventTarget` to call `tick`
- Enabling the Zoneless provider removes this `EventTarget` patch

But wait, if this is true, how does _this_ code work with no Zoneless change detection?

```angular-ts
@Component({
  selector: 'app-root',
  standalone: true,
  // Must not be `OnPush` to demonstrate this behavior working
  template: `<button (click)="add()">{{ count }}</button>`,
})
export class AppComponent implements AfterViewInit {
  count = 0;

  add() {
    this.count++;
  }
}
```

Surely, Angular must be notified when the user clicks on the event?

Well, it does, but it doesn't do so using `EventTarget`.

# Angular 

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

# Takeaway

If we apply what we learned while exploring Angular's source code, we can see the differences between how Zone.js is able to 



**Zone.js works by patching `EventTarget.prototype.addEventListener` itself, while `provideExperimentalZonelessChangeDetection` works by hooking into the compiler to track usage of `(event)` bindings. This binding then, in turn, calls the `markViewDirty` hook to update change detection.**

