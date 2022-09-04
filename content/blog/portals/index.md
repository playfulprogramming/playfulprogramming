---
{
    title: "Portals",
    description: "",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 15,
    series: "The Framework Field Guide"
}
---

[Despite some some UX headaches modals can introduce into an app](modalzmodalzmodalz.com/), they're still a widely used UI element in many applications today.

While building sufficiently useful modals can be a challenging task, a rudimentary modal can be completed even without JavaScript.

Let's use some CSS and HTML in order to build a basic modal:

```html
<div>
  <div id="body">
    <p>This is some text, pretend it's an app back here</p>
  </div>
  <div id="modal-container">
    <div id="modal">This is a modal</div>
  </div>
</div>

<style>
#modal-container {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
}

#modal {
  background: white;
  border: 1px solid black;
  padding: 1rem;
  border-radius: 1rem;
}
</style>
```

![A modal that's focused in the foreground, with a semi-transparent black background that dims all other elements](./initial_modal.png)

Tada! 🎉 Now we have a fairly basic modal to display whatever HTML we want inside.

But let's say that we keep building out the page. As we do, we might, for example, want to have a `footer` beneath our main page's content.

```html
<template>
  <div id="body" style="min-height: 50vh">
    <p>This is some text, pretend it's an app back here</p>
  </div>
  <div id="modal-container">
    <div id="modal">This is a modal</div>
  </div>
  <footer style="min-height: 50vh">App Name</footer>
</template>

<style>
#modal-container {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
}

#modal {
  background: white;
  border: 1px solid black;
  padding: 1rem;
  border-radius: 1rem;
}

footer {
  position: relative;
  background: lightblue;
  padding: 1rem;
}
</style>
```

At first glance, this might look like it's been successful, but let's take a look at the rendered output:

![The footer is on top of the modal, instead of beneath it](./partially_hidden_modal.png)

Oh dear! Why is the footer rendered above the modal?

Well, my friends, the modal is rendering under the footer due to something called "The Stacking Context".

# What is the stacking context?

// TODO: Write

# What is a JavaScript portals?


// TODO: Write

Z-index example



https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context

https://www.joshwcomeau.com/css/stacking-contexts/

https://philipwalton.com/articles/what-no-one-told-you-about-z-index/



# Using Local Portals

// TODO: Write this



<!-- tabs:start -->

## React

// TODO: Write this

```jsx
import React, { useMemo, useState } from 'react';
import ReactDOM from 'react-dom';

export default function App() {
  const [portalRef, setPortalRef] = useState(null);

  const portal = useMemo(() => {
    if (!portalRef) return null;
    return ReactDOM.createPortal(<div>Hello, world!</div>, portalRef);
  }, [portalRef]);

  return (
    <>
      <div
        ref={(el) => setPortalRef(el)}
        style={{ height: '100px', width: '100px', border: '2px solid black' }}
      >
        <div />
      </div>
      {portal}
    </>
  );
}
```



## Angular

While the other frameworks have something akin to a portal system built into their frameworks' core, Angular does not. Instead, the Angular team maintains a library called "Angular CDK" in order to have shared UI code for utilities such as portals.

To use the Angular CDK, you'll first need to install it into your project:

```
npm i @angular/cdk
```

From here, we can import components and utilities directly from the CDK.

```typescript
import { PortalModule } from '@angular/cdk/portal';
import { DomPortal } from '@angular/cdk/portal';

@Component({
  selector: 'my-app',
  template: `
  <div style="height: 100px; width: 100px; border: 2px solid black;">
    <ng-template [cdkPortalOutlet]="domPortal"></ng-template>
  </div>
  <div #portalContent>Hello, world!</div>
  `,
})
class AppComponent implements AfterViewInit {
  @ViewChild('portalContent') portalContent: ElementRef<HTMLElement>;

  domPortal: DomPortal<any>;

  ngAfterViewInit() {
    // This is to avoid an:
    // "Expression has changed after it was checked"
    // error when trying to set domPortal
    setTimeout(() => {
      this.domPortal = new DomPortal(this.portalContent);
    });
  }
}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, PortalModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

### Rendering `ng-template`

There might be a flash of the `div` on screen before our `ngAfterViewInit` occurs. As such, we may want to use an `ng-template`:

// TODO: Write

```typescript
import { PortalModule, TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'my-app',
  template: `
  <div style="height: 100px; width: 100px; border: 2px solid black;">
    <ng-template [cdkPortalOutlet]="domPortal"></ng-template>
  </div>
  <ng-template #portalContent>Hello, this is a template portal</ng-template>
  `,
})
class AppComponent implements AfterViewInit {
  @ViewChild('portalContent') portalContent: TemplateRef<unknown>;

  viewContainerRef = inject(ViewContainerRef);
  domPortal: TemplatePortal<any>;

  ngAfterViewInit() {
    // This is to avoid an:
    // "Expression has changed after it was checked"
    // error when trying to set domPortal
    setTimeout(() => {
      this.domPortal = new TemplatePortal(
        this.portalContent,
        this.viewContainerRef
      );
    });
  }
}
```





## Vue

// TODO: Write this

```vue
<!-- App.vue -->
<script setup>
import { ref } from 'vue'

const portalContainerEl = ref(null)
</script>

<template>
  <div style="height: 100px; width: 100px; border: 2px solid black">
    <div ref="portalContainerEl"></div>
  </div>
  <div v-if="portalContainerEl">
    <Teleport :to="portalContainerEl">Hello, world!</Teleport>
  </div>
</template>
```

We need this `v-if` in order to ensure that `portalContainerEl` has already been rendered and is ready to project content.

<!-- tabs:end -->

// TODO: Write this





# Application-Wide Portals

// TODO: Write this

<!-- tabs:start -->

## React

// TODO: Write this

```jsx
import React, { useState, createContext, useContext } from 'react';
import ReactDOM from 'react-dom';

// We start by creating a context name
const PortalContext = React.createContext();

function ChildComponent() {
  const portalRef = useContext(PortalContext);
  if (!portalRef) return null;
  return ReactDOM.createPortal(<div>Hello, world!</div>, portalRef);
}

export default function App() {
  const [portalRef, setPortalRef] = useState(null);

  return (
    <PortalContext.Provider value={portalRef}>
      <div
        ref={(el) => setPortalRef(el)}
        style={{ height: '100px', width: '100px', border: '2px solid black' }}
      >
        <div />
      </div>
      <ChildComponent />
    </PortalContext.Provider>
  );
}
```



## Angular

We can use a basic service to share our instance of a `Portal` between multiple components, parent and child alike.

```typescript
import { Portal, PortalModule, TemplatePortal } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root',
})
class PortalService {
  portal: Portal<any> | null = null;
}

@Component({
  selector: 'modal',
  template: `
  <ng-template #portalContent>Test</ng-template>
  `,
})
class ModalComponent implements OnDestroy {
  @ViewChild('portalContent') portalContent: TemplateRef<unknown>;

  viewContainerRef = inject(ViewContainerRef);
  domPortal: TemplatePortal<any>;

  portalService = inject(PortalService);

  ngAfterViewInit() {
    // This is to avoid an:
    // "Expression has changed after it was checked"
    // error when trying to set domPortal
    setTimeout(() => {
      this.portalService.portal = new TemplatePortal(
        this.portalContent,
        this.viewContainerRef
      );
    });
  }

  ngOnDestroy() {
    this.portalService = null;
  }
}

@Component({
  selector: 'my-app',
  template: `
  <div style="height: 100px; width: 100px; border: 2px solid black;" *ngIf="portalService.portal">
    <ng-template [cdkPortalOutlet]="portalService.portal"></ng-template>
  </div>
  <modal></modal>
  `,
})
class AppComponent {
  portalService = inject(PortalService);
}
```





## Vue

```
<!-- App.vue -->
<script setup>
import { ref, provide } from 'vue'
import Child from './Child.vue'

const portalContainerEl = ref(null)
provide('portalContainerEl', portalContainerEl)
</script>

<template>
  <div style="height: 100px; width: 100px; border: 2px solid black">
    <div ref="portalContainerEl"></div>
  </div>
  <Child />
</template>
```



<!-- tabs:end -->

// TODO: Write this



# HTML-Wide Portals

// TODO: Write

<!-- tabs:start -->

## React

// TODO: Write

Alternatively, `ReactDOM.createPortal` supports passing an arbitrary HTML DOM node, such as `html.body`:

```jsx
import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';

function ChildComponent() {
  const bodyEl = useMemo(() => {
    return document.querySelector('body');
  }, []);
  return ReactDOM.createPortal(<div>Hello, world!</div>, bodyEl);
}

export default function App() {
  return <ChildComponent />;
}
```

## Angular

// TODO: Write

Can't do this

## Vue

// TODO: Write

```vue
<!-- Child.vue -->
<script setup></script>

<template>
  <Teleport to="body">Hello, world!</Teleport>
</template>
```

```vue
<!-- App.vue -->
<script setup>
import Child from './Child.vue'
</script>
    
<template>
  <Child />
</template>
```



<!-- tabs:end -->
