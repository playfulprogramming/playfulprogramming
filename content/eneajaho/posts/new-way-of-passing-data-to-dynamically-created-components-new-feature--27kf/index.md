---
{
title: "New way of passing data to dynamically created components (New Feature 🎉)",
published: "2023-04-19T15:11:15Z",
edited: "2023-04-19T15:15:00Z",
tags: ["angular", "input", "v16", "dynamiccomponents"],
description: "Topics covered in this article:    How it works today How it can be done in Angular v16 How...",
originalLink: "https://eneajahollari.medium.com/new-way-of-passing-data-to-dynamically-created-components-new-feature-1d7e807b30f5",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

### Topics covered in this article:

- How it works today
- How it can be done in Angular v16
- How to migrate to the new API
- How to test it
- Caveats

### How it works today

When working with Angular, we often need to render dynamic components. For example, we might want to render a component based on the user's input. In order to do that, we can use `NgComponentOutlet` directive.

So, we will take a look at how we can pass data to dynamically created components using `NgComponentOutlet` directive today.

Example:
Let's say we need to show a component based on the type we choose in a dropdown.

In order to pass data to dynamic components rendered by NgComponentOutlet directive, we have to:

- Create an injection token
- Create a new injector
- Pass the data in the injector using the injection token.
- Pass the injector to the `NgComponentOutlet` directive.
- Use the injection token to get the data in the dynamic component.

So, first we need to create an injection token.

```typescript
export interface DynamicData {
  url: string;
  updated: (changes: any) => void; // callback to update the data
}

export const DATA_TOKEN = new InjectionToken<DynamicData>("data");
```

Now, let's take a look at our dynamic components, `ImageComponent` and `VideoComponent`, and how we can use the injection token to get the data in the dynamic component.

```typescript
@Component({
  template: `
    <img [src]="data.url" />
    <button (click)="data.updated({ url: 'https://angular.io' })">Update</button>
  `,
})
export class ImageComponent {
    data = inject(DATA_TOKEN); // will be of type DynamicData
}

@Component({
  template: `
    <video [src]="data.url" controls></video>
    <button (click)="data.updated({ url: 'https://angular.io' })">Update</button>
  `,
})
export class VideoComponent {
    data = inject(DATA_TOKEN); // will be of type DynamicData
}
```

Pretty "complex" usecase I know, but this is just for demonstration purposes.

Now, let's take a look at how we can use the `NgComponentOutlet` directive to render the dynamic components.

```typescript
@Component({
  template: `
    <label for="type">Type</label>
    <select [ngModel]="selectedType" (ngModelChanges)="changeType($event)" name="type">
      <option value="image">Image</option>
      <option value="video">Video</option>
    </select>

    <ng-container *ngComponentOutlet="selectedItem.component; injector: selectedItem.injector" />
  `,
})
export class ParentComponent {
  private readonly injector = inject(Injector);

  items = {
    image: {
      component: ImageComponent,
      injector: Injector.create({
        parent: this.injector,
        providers: [{
            provide: DATA_TOKEN,
            useValue: {
              url: "https://angular.io/assets/images/logos/angular/angular.png",
              updated: (changes: any) => console.log("Image changes", changes),
            },
        }],
      }),
    },
    video: {
      component: VideoComponent,
      injector: Injector.create({
        parent: this.injector,
        providers: [{
            provide: DATA_TOKEN,
            useValue: {
              url: "https://www.youtube.com/watch?v=QH2-TGUlwu4",
              updated: (changes: any) => console.log("Video changes", changes),
            },
        }],
      }),
    },
  };

  selectedType: "image" | "video" = "image";
  selectedItem = this.items[this.selectedType];

  changeType(type: "image" | "video") {
    this.selectedType = type;
    this.selectedItem = this.items[this.selectedType];
  }

}
```

As you can see, we have to create a new injector for each dynamic component, register the data we want to pass to the injection token and then and pass it to the `NgComponentOutlet` directive using the `selectedItem`. We also pass an `updated` callback to the value. This callback is used to update the data in the parent component (in our case it just logs). So, it will work like an event emitter (output).

Yeah! This is a lot of boilerplate code 😬.

But, it's getting better in Angular v16 🥳.

### How it can be done in Angular v16

In Angular v16, we can pass data to dynamically created components using the `NgComponentOutlet` directive using the `inputs` property 🤩.

First thing we will do is to covert our `ImageComponent` and `VideoComponent` to use the @Input() decorator.

```typescript
@Component({
  template: `
    <img [src]="url" />
    <button (click)="updated({ url: 'https://angular.io' })">Update</button>
  `,
})
export class ImageComponent {
  @Input() url: string;
  @Input() updated: (changes: any) => void;
}

@Component({
  template: `
    <video [src]="url" controls></video>
    <button (click)="updated({ url: 'https://angular.io' })">Update</button>
  `,
})
export class VideoComponent {
  @Input() url: string;
  @Input() updated: (changes: any) => void;
}
```

It's pretty simple, right?

Now, let's take a look at how we can use the `inputs` property to pass data to dynamically created components.

```typescript
@Component({
  template: `
    <label for="type">Type</label>
    <select [ngModel]="selectedType" (ngModelChanges)="changeType($event)" name="type">
      <option value="image">Image</option>
      <option value="video">Video</option>
    </select>

    <ng-container *ngComponentOutlet="selectedItem.component; inputs: selectedItem.inputs" />
  `,
})
export class ParentComponent {

  items = {
    image: {
      component: ImageComponent,
      inputs: {
        url: "https://angular.io/assets/images/logos/angular/angular.png",
        updated: (changes: any) => console.log("Image changes", changes),
      },
    },
    video: {
      component: VideoComponent,
      inputs: {
        url: "https://www.youtube.com/watch?v=QH2-TGUlwu4",
        updated: (changes: any) => console.log("Video changes", changes),
      },
    },
  };

  selectedType: "image" | "video" = "image";
  selectedItem = this.items[this.selectedType];

  changeType(type: "image" | "video") {
    this.selectedType = type;
    this.selectedItem = this.items[this.selectedType];
  }

}
```

As you can see, we can pass the data directly to the `inputs` property. No need to create a new injector and register the data in the injector. We can also do the same trick with the callback to update the data in the parent component.

### How to migrate to the new approach

If you are using the old approach, you can migrate to the new approach by doing the following:

1. Convert your dynamic components to use the `@Input()` decorator instead of the `inject()` function.

Before:

```typescript
@Component({})
export class ImageComponent {
    data = inject(DATA_TOKEN); 
}
```

After:

```typescript
@Component({})
export class ImageComponent {
    @Input() data: DynamicData;
}
```

2. Pass the data directly to the `inputs` property of the `NgComponentOutlet` directive.

Before:

```typescript
@Component({
    template: `
        <ng-container *ngComponentOutlet="item.component; injector: item.injector" />
    `,
})
export class ParentComponent {
  private readonly injector = inject(Injector);

  items = {
    image: {
      component: ImageComponent,
      injector: Injector.create({
        parent: this.injector,
        providers: [{
            provide: DATA_TOKEN,
            useValue: {
              url: "https://angular.io/assets/images/logos/angular/angular.png",
              updated: (changes: any) => console.log("Image changes", changes),
            },
        }],
      }),
    },
  };
}
```

After:

```typescript
@Component({
    template: `
        <ng-container *ngComponentOutlet="item.component; inputs: item.inputs" />
    `,
})
export class ParentComponent {
  items = {
    image: {
      component: ImageComponent,
      inputs: {
        data: {
          url: "https://angular.io/assets/images/logos/angular/angular.png",
          updated: (changes: any) => console.log("Image changes", changes),
        },
      },
    },
  };
}
```

3. Remove the injected `Injector` from the parent component but also the InjectionToken created to pass the data to the dynamic component.

### How to test it

To test the new approach, we will use the `TestBed` to create a test module and then create a test component that uses the `NgComponentOutlet` directive.

```typescript
describe('ParentComponent', () => {
  let component: ParentComponent;
  let fixture: ComponentFixture<ParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParentComponent, ImageComponent, VideoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display image by default', () => {
    const imageElement = fixture.debugElement.query(By.css('img'))
      .nativeElement as HTMLImageElement;
    expect(imageElement.src).toBe(
      'https://angular.io/assets/images/logos/angular/angular.png'
    );
  });

  it('should switch to video', () => {
    // select video option from the dropdown
    const selectElement = fixture.debugElement.query(By.css('select'))
      .nativeElement as HTMLSelectElement;
    selectElement.value = 'video';
    selectElement.dispatchEvent(new Event('change'));

    fixture.detectChanges();

    const videoElement = fixture.debugElement.query(By.css('video'))
      .nativeElement as HTMLVideoElement;
    expect(videoElement.src).toBe(
      'https://www.youtube.com/watch?v=QH2-TGUlwu4'
    );
  });

  it('should update image data', () => {
    spyOn(console, 'log');

    const imageUpdateButton = fixture.debugElement.query(By.css('button'));
    imageUpdateButton.triggerEventHandler('click', null);

    expect(console.log).toHaveBeenCalledWith('Image changes', {
      url: 'https://angular.io',
    });
  });

  it('should update video data', () => {
    spyOn(console, 'log');

    const selectElement = fixture.debugElement.query(By.css('select'))
      .nativeElement as HTMLSelectElement;
    selectElement.value = 'video';
    selectElement.dispatchEvent(new Event('change'));

    fixture.detectChanges();

    const videoUpdateButton = fixture.debugElement.query(By.css('button'));
    videoUpdateButton.triggerEventHandler('click', null);

    expect(console.log).toHaveBeenCalledWith('Video changes', {
      url: 'https://angular.io',
    });
  });
});
```

*If our testing approach is just testing only what we see on the screen, then the tests should not change at all. We are still testing the same thing. We are just using a different approach to create the dynamic components.*

### Caveats

We are used to use the @Output() decorator to tell Angular that we want to listen to an event from the child component. But the `NgComponentOutlet` directive won't support the `@Output()` decorator or add an outputs field. So, we are left with the callback approach to notify the parent component about the changes in the child component.

### Conclusion

I hope you enjoyed this article, and I hope that you will find this new feature useful.

If you have any questions or suggestions, feel free to leave a comment below.

This is the PR (community contribution) that implements the feature: https://github.com/angular/angular/pull/49735

Thanks to [HyperLife1119](https://github.com/HyperLife1119) 😎

Thanks for reading!

---

<iframe src="https://x.com/Enea_Jahollari/status/1648702729634586624"></iframe>

I tweet a lot about Angular (latest news, videos, podcasts, updates, RFCs, pull requests and so much more). If you’re interested about it, give me a follow at [@Enea\_Jahollari](https://twitter.com/Enea_Jahollari). Give me a follow on [dev.to](https://dev.to/eneajaho) if you liked this article and want to see more like this!
