---
{
  title: "Angular v22: @boundary, Multi-Case Switch, and Inline Arrow Functions",
  description: "Angular v22 makes the template layer a resilient, type-safe environment in its own right: crash isolation with @boundary, exhaustive union checking with @default never, and officially-blessed inline arrow functions.",
  published: '2026-06-11',
  tags: ["angular", "typescript", "webdev"],
  license: 'cc-by-4',
  originalLink: "https://medium.com/@giorgio.galassi/angular-v22-boundary-multi-case-switch-and-inline-arrow-functions-9293380f333b"
}
---

Let's be honest: Angular templates have been the quiet achiever of the framework's renaissance. While everyone was rightly excited about [Signals](https://angular.dev/guide/signals), [zoneless change detection](https://angular.dev/guide/experimental/zoneless), and [`httpResource`](https://medium.com/@giorgio.galassi/angular-v19-understanding-the-new-httpresource-api-837e1dadc990), the template layer was grinding away in the background, getting smarter with every release — [`@let`](https://medium.com/@giorgio.galassi/angular-v18-introducing-let-a-new-way-to-declare-variables-and-do-logic-in-templates-8b3f4d196b23), [`@defer`](https://medium.com/@giorgio.galassi/angular-v18-understanding-defer-blocks-triggers-and-deferrable-views-part-1-5a5dfaf52cd2), [control flow blocks](https://angular.dev/guide/templates/control-flow). Angular v22 just changed the conversation again. Two features shipped, and one more is on the way — and at least one of them solves a problem that's been causing production headaches for years.

Let's break them down.

---

## `@boundary` + `@error` — The Error Boundary Angular Always Needed

If you've spent any time debugging production Angular apps, you've seen it: one component crashes during change detection, and the entire page goes white. Not just that component. The whole page.

`@boundary` is Angular's answer to this. It's an error boundary primitive being built directly into the template syntax. Wrap any component in it and you get full isolation — if that subtree crashes, the rest of the page keeps rendering. Pair it with an `@error` block and you decide exactly what the user sees instead, and you even get access to the error object.

```html
@boundary {
  <app-promotional-widget />
} @error (let err) {
  <!-- err contains the caught error -->
  <app-default-promo-widget />
}
```

This is the pattern React developers have had with `ErrorBoundary` for years. Angular is building it as a first-class template primitive — no wrapper components, no custom error handlers, no third-party libraries. And if `@error` looks familiar, that's because you've already seen it in [`@defer`](https://medium.com/@giorgio.galassi/angular-v18-understanding-defer-blocks-triggers-and-deferrable-views-part-1-5a5dfaf52cd2) — same concept, same block name, now elevated to a standalone boundary primitive.

> **Availability:** `@boundary` was first announced at Google I/O 2026 and is currently in active development starting from Angular v22. It was not shipped in v22 stable — expect it as developer preview in v22.1 or v23. Keep an eye on it, but don't wait for it in production just yet.

The implications go beyond "nice to have." In any app with dynamic or third-party widgets, real-time data feeds, or user-generated content blocks, `@boundary` will be the difference between a degraded experience and a broken one.

---

## Multi-Case Switch + Exhaustive Type Checking

The `@switch` block already made Angular templates cleaner when it arrived — but it had a limitation: one case, one branch. If you wanted two values to render the same UI, you needed duplicate branches or a workaround.

That's gone now. Multiple cases can share a single branch:

```html
@switch (status) {
  @case ('pending')
  @case ('queued') {
    <status-badge type="waiting" />
  }
  @case ('active') {
    <status-badge type="running" />
  }
  @default {
    <status-badge type="unknown" />
  }
}
```

But the more interesting addition is exhaustive type checking via `@default never`. When your switch expression is a TypeScript union type, adding `@default never` causes a compile-time error if the union grows a new member that isn't handled.

The feature originally shipped in v21.2 for simple discriminants. Angular v22 extends it to nested property access — you just pass the discriminant explicitly:

```html
@let data = chartData();
@switch (data.type) {
  @case ('line-chart') {
    <line-chart [data]="data" />
  }
  @case ('bar-chart') {
    <bar-chart [data]="data" />
  }
  @default never(data);
}
```

For simple signals it still works without the argument:

```html
@switch (userRole()) {
  @case ('admin') { ... }
  @case ('editor') { ... }
  @case ('viewer') { ... }
  @default never;
}
```

This moves an entire class of runtime bugs — the "we added a new role and forgot to update the UI" kind — into compile time. That's a meaningful DX win, now covering the full range of switch patterns.

---

## Inline Arrow Functions — Finally Official

This one might feel smaller, but the signal it sends matters. The Angular team has officially said: inline arrow functions in templates are fine for short, non-complex expressions.

Previously, the guidance was to push any logic into the component class, even a simple `(item) => item.active`. That discipline made sense when templates were re-evaluated aggressively, but in a signal-driven, [OnPush](https://angular.dev/best-practices/skipping-subtrees)-default world, the calculus changes.

```html
@for (user of users(); track user.id) {
  <user-card [isAdmin]="roles().some(r => r.userId === user.id)" />
}
```

No more moving a one-liner to the component just to satisfy the "no logic in templates" rule. The team drew a clear line: short and non-complex is fine. Complex transformations still belong in [`computed()`](https://medium.com/@giorgio.galassi/angular-v19-computed-vs-linkedsignal-signals-3130b70861b8) or component methods. That's a reasonable boundary, and it's one less friction point when writing clean, readable templates.

---

## What This Means for Your Next Project

Angular v22 stable dropped the week of June 3, 2026. With it:

- `@default never` for exhaustive switch checking, improved in v22 to work on nested property access too (`@default never(entity)`)
- Inline arrow functions — clean up those unnecessary component methods with confidence
- `@boundary` + `@error` in active development, coming as developer preview in v22.1 or v23

The template layer is no longer just syntactic sugar on top of component logic. It's becoming a resilient, type-safe environment in its own right. When `@boundary` lands, Angular templates will have everything: crash isolation, exhaustive union safety at compile time, and signal-aligned ergonomics for everyday expressions.

---

If you want to go deeper on the template features that got us here, check out my previous articles:

- [Angular v18 — Introducing `@let`](https://dev.to/ggalassi/angular-v18-introducing-let-syntax-a-new-way-to-declare-variables-and-do-logic-in-templates-3k1i)
- [Understanding `@defer` — Part 1 (v18+)](https://dev.to/ggalassi/angular-v18-understanding-defer-blocks-triggers-and-deferrable-views-part-1-1m56)
- [Understanding `@defer` — Part 2 (v19+)](https://dev.to/ggalassi/angular-v19-understanding-defer-blocks-triggers-and-deferrable-views-part-2-31kj)

---

If you found this helpful, follow me here and on [LinkedIn](https://www.linkedin.com/in/giorgiogalassi/) for more deep dives into Angular, web performance, and modern frontend development.

See you in the next one! 🤙🏻
— G.
