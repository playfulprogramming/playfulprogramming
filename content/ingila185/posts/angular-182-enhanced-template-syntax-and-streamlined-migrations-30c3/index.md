---
{
title: "Angular 18.2: Enhanced Template Syntax and Streamlined Migrations",
published: "2024-08-21T23:43:15Z",
edited: "2024-09-03T10:42:32Z",
tags: ["angular", "webdev", "javascript", "programming"],
description: "Angular 18.2 has arrived, and while it may be a minor release, it holds some valuable improvements...",
originalLink: "https://dev.to/this-is-angular/angular-182-enhanced-template-syntax-and-streamlined-migrations-30c3",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

Angular 18.2 has arrived, and while it may be a minor release, it holds some valuable improvements that enhance developer experience. This article delves into these exciting features, focusing on the refined @let syntax and the introduction of new migration schematics.

## @let Improves

The @let syntax, a personal favorite among many Angular developers, continues to evolve in 18.2. It offers two distinct approaches to defining template variables, bringing greater flexibility and readability to your code:

**Dynamic @let:** Embrace the ability to utilize template reference variables within @for and @if directives. Imagine effortlessly accessing a form's value within the template:

```
<input #myForm name="my-from" [maxlength]="maxLength" />
@let formValue = myForm.value
```

**Async @let:** In previous versions, accessing the latest value emitted from an observable required an ngIf directive.

```
@if ({ tasks:  tasks$ | async }; as taskData) {

//shows the @if block before the 1st tasks$ emit
 @for (task of taskData.tasks; track task.id) {
    [...]
  } @empty {
    No Tasks pending.
  }
}

```
Now, achieve the same result with fewer lines and improved clarity

```
@let tasks = tasks$ | async;
@for (task of tasks; track task.id) {
  [...]
}
@empty {
  No Tasks pending.
}
```

Remember, @let variables are read-only and cannot be reassigned. However, their values will automatically update with each change detection cycle. While using the same names within the template and class component is technically possible, the long-term implications of this practice require further exploration.

## Migration Made Easy: New Schematics in Town

Starting with Angular 17, we encountered three primary migration schematics:

- Template syntax control flow: `ng g @angular/core:control-flow`
- New app builder: `ng update @angular/cli --name use-application-builder`
- Standalone components: `ng g @angular/core:standalone`

Angular 18.2 expands this toolkit with even more helpful tools:

- **Standalone component route conversion:** Craft lazy-loaded routes from standalone components with ease using `ng g @angular/core:route-lazy-loading`.
- **DI migration:** Simplify the transition from constructor-based dependency injection to the new functional inject() approach with `ng g @angular/core:inject-migration`.

## Conclusion and Looking Ahead

Angular 18.2 may be a minor release, but it offers significant improvements for those who enjoy working with `@let` and appreciate streamlined migration processes. As we eagerly anticipate the major features planned for Angular 19 in November 2024, version 18.3, arriving in the next six weeks, promises to be another exciting stepping stone. So, keep calm, keep coding, and embrace the advancements in Angular!


