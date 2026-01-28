---
{
title: "Why and When Use Ng-template, NgContent, and NgContainer in Angular",
published: "2023-04-13T16:48:41Z",
edited: "2023-06-01T17:29:37Z",
tags: ["angular", "javascript", "frontend", "programming"],
description: "When I started to play with templates and dynamic content in angular, I get surprised by multiple...",
originalLink: "https://www.danywalls.com/why-and-when-use-ng-template-ngcontent-and-ngcontainer-in-angular",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

When I started to play with templates and dynamic content in angular, I get surprised by multiple directives in angular to work with it ng-template, ng-container, and ng-content. Each one is pretty similar initially; each has exceptional use cases and features that set them apart.

I'll be showcasing various scenarios for ng-template, ng-container, and ng-content, complete with helpful examples to illustrate the appropriate use of each directive. But first, let's briefly explain each one:

- `ng-template` help to define a template that can be reused multiple times within an Angular component.

- `ng-container` when we need to group elements without adding additional nodes to the DOM.

- `ng-content` is used to render content dynamically that is passed in from the parent component.

## **ng-template**

`ng-template` defines a template block that can be used to render content dynamically. It provides a way to define an HTML code that can be reused multiple times within an Angular component.

For example, one everyday use case for `ng-template` is to render conditional content with `ngIf` or `ngSwitch` directives.

```xml
<ng-template #myTemplate>
  <div *ngIf="hasBalance">
    <p>Your amount is 5000€.</p>
  </div>
  <div *ngIf="!hasBalance">
    <p>Sorry, no balance.</p>
  </div>
</ng-template>
```

In this example, we define a template block that contains two `div` elements with `*ngIf` directives. The `*ngIf` directives will render one of the `div` elements based on the value of `hasBalance`.

Also, we can use this template block in multiple places within our component in a `ng-container` element:

```xml
<ng-container *ngTemplateOutlet="myTemplate"></ng-container>
```

## **ng-container**

`ng-container` help to group elements without adding additional nodes to the DOM. It is often used with structural directives like `*ngIf`, `*ngFor`, and `*ngSwitch`.

One common use case for `ng-container` is to apply a structural directive to multiple elements without wrapping them in an additional HTML tag for example:

```xml
  <div *ngIf="hasBalance">
    <p>Your amount is 5000€.</p>
  </div>
  <div *ngIf="!hasBalance">
    <p>Sorry, no balance.</p>
  </div>
```

In this example, we have two `div` elements with `*ngIf` directives. However, if we wanted to apply the `*ngIf` directive to both elements, we would need to wrap them in an additional HTML tag like this:

```typescript
<div *ngIf="activeSession">
  <div *ngIf="hasBalance">
    <p>Your amount is 5000€.</p>
  </div>
  <div *ngIf="!hasBalance">
    <p>Sorry, no balance.</p>
  </div>
</div>
```

The extra `div` element is not necessary. Instead, we can use an `ng-container` element to group the `div` elements together without adding a tag:

```typescript
<ng-container *ngIf="activeSession">
  <div *ngIf="hasBalance">
    <p>Your amount is 5000€.</p>
  </div>
  <div *ngIf="!hasBalance">
    <p>Sorry, no balance.</p>
  </div>
</ng-container>
```

We use the `ng-container` Group the \`div\` elements together without adding an HTML tag.

## **ng-content**

`ng-content` is an easy way to dynamically render content passed in from the parent component. It allows a parent component to inject content into a child component's template.

One common use case for `ng-content` is to create a reusable component that can accept different content based on usage. For example:

```typescript
@Component({
  selector: 'app-alert',
  template: `
    <div class="alert alert-{{type}}">
      <ng-content></ng-content>
    </div>
  `
})
export class AlertComponent {
  @Input() type: string;
}
```

We define an `AlertComponent` accepts a `type` input and uses `ng-content` to render the content passed in from the parent component. The parent component can use this component like this:

```xml
<app-alert type="success">
  <p>Success!</p>
</app-alert>

<app-alert type="danger">
  <p>Something went wrong!</p>
</app-alert>
```

In this example, we use them `AlertComponent` to display success and error messages. The content inside the component is injected into the template using `ng-content`.

## **Conclusion**

In conclusion, ng-template, ng-container, and ng-content are three commonly used directives in Angular templates. Although they may appear similar initially, each one has a unique purpose and function.

I hope these examples and scenarios assist you in selecting and utilizing each one as needed.

Photo by Kelly Sikkema on Unsplash
