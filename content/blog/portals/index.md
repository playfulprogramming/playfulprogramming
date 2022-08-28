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



// TODO: Write this





# Using Local Portals

// TODO: Write this



<!-- tabs:start -->

## React

// TODO: Write this

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
  <div #portalContent>Hello, this is a DOM portal</div>
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

<!-- tabs:end -->

// TODO: Write this





# Global Portals

// TODO: Write this

<!-- tabs:start -->

## React

// TODO: Write this

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

// TODO: Write this

<!-- tabs:end -->

// TODO: Write this

