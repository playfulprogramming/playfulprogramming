---
{
  title: "Angular Internals: Lifecycle Methods and Effect Timings",
  description: "",
  published: "2024-12-08T21:52:59.284Z",
  tags: ["angular", "javascript", "webdev"],
  license: "cc-by-4",
  collection: "Angular Internals",
  order: 4,
}
---

All production Angular codebases, using [signals](/posts/what-are-signals) or not, have to manage [side effects](/posts/ffg-fundamentals-side-effects) in one way or another.

In modern Angular projects using signals, that comes in flavor of two APIs:

- `effect`
- `afterRenderEffect`

And in older Angular projects, this comes via lifecycle methods:

- `ngOnInit`
- `ngOnChanges`
- `ngOnDestroy`
- `ngDoCheck`
- `ngAfterContentInit`
- `ngAfterContentChecked`
- `ngAfterViewInit`
- `ngAfterViewChecked`

However, both of these methods of effect handling come with one major similarity; they both integrate into a component's lifecycle in one way or another.

When does `ngOnChanges` run in comparison to `afterRenderEffect`? Why does `ngDoCheck` seem to run more often than `ngOnInit`?

While the answer to these can look simple on the surface, let's dive into Angular's source code to figure out _why_ they run when they do.

To start this though, we need to understand a bit of terminology about Angular's internal source code.

# Angular Internals Aside

> **GPT SAYS:**
>
> An LView and a TView are both internal data structures used in Angular's Ivy rendering engine to manage and render views. Here is a brief explanation of each and their differences:
>
> **LView**
>
> - Instance-specific: An LView represents a specific instance of a view. Each embedded view and component view has its own LView.
> - Dynamic Data: It stores dynamic data needed to process the instructions as they are invoked from the template, such as the context, flags, and references to child views.
> - Array Structure: It is implemented as an array where each index has a specific meaning (e.g., HOST, TVIEW, FLAGS, etc.).
> - Lifecycle Management: It keeps track of lifecycle hooks, listeners, and other runtime-specific information.
>
> **TView**
>
> - Static Data: A TView contains static data that is shared between all instances of a given type of view. This includes the template function, directive definitions, and other metadata.
> - Blueprint: It acts as a blueprint for creating LView instances. The TView is used to initialize the LView with the necessary static data.
> - Type: It has a type (Root, Component, or Embedded) that indicates what kind of view it represents.
> - First Pass Flags: It includes flags to indicate whether the view has been processed in creation mode or update mode.
>
> Key Differences
>
> - Purpose: LView is for instance-specific data and runtime management, while TView is for static data and template definitions.
> - Mutability: LView is mutable and changes as the view is processed, whereas TView is immutable and shared across instances.
> - Structure: LView is an array with specific indices for different pieces of data, while TView contains metadata and static information about the view.
>
> Here is a simplified example to illustrate the relationship:
>
> ```typescript
> // TView: Static data for a component
> const tView: TView = {
> 	type: TViewType.Component,
> 	blueprint: [], // Blueprint for creating LView instances
> 	template: myComponentTemplate,
> 	firstCreatePass: true,
> 	firstUpdatePass: true,
> 	data: [],
> 	// Other static properties...
> };
>
> // LView: Instance-specific data for a component
> const lView: LView = [
> 	null, // HOST
> 	tView, // TVIEW
> 	LViewFlags.CreationMode, // FLAGS
> 	null, // PARENT
> 	null, // NEXT
> 	null, // T_HOST
> 	// Other dynamic properties...
> ];
> ```
>
> In this example, tView contains the static template and metadata, while lView is an instance that uses tView as a blueprint to manage the specific state and data for a particular view instance.

How can a template have multiple instances?

> In Angular, a template can have multiple instances through the use of structural directives like *ngIf, *ngFor, and \*ngTemplateOutlet. These directives allow you to create and manage multiple instances of a template dynamically.
>
> ```typescript
> @Component({
> 	selector: "app-example",
> 	template: `
> 		<ng-template #templateRef>
> 			<div>This is a template instance.</div>
> 		</ng-template>
>
> 		<ng-container *ngTemplateOutlet="templateRef"></ng-container>
> 		<ng-container *ngTemplateOutlet="templateRef"></ng-container>
> 	`,
> })
> export class ExampleComponent {}
> ```
>
> In these examples, the directives manage the creation and destruction of LView instances for each template instance, allowing Angular to render multiple instances of the same template dynamically.

Let's begin:

# Lifecycle Hooks Setup

---

https://github.com/angular/angular/blob/92f30a749d676a290f5e173760ca29f0ff85ba8c/packages/core/src/render3/hooks.ts#L53-L76

```typescript
export function registerPreOrderHooks(
	directiveIndex: number,
	directiveDef: DirectiveDef<any>,
	tView: TView,
): void {
	ngDevMode && assertFirstCreatePass(tView);
	const { ngOnChanges, ngOnInit, ngDoCheck } = directiveDef.type
		.prototype as OnChanges & OnInit & DoCheck;

	if (ngOnChanges as Function | undefined) {
		const wrappedOnChanges = NgOnChangesFeatureImpl(directiveDef);
		(tView.preOrderHooks ??= []).push(directiveIndex, wrappedOnChanges);
		(tView.preOrderCheckHooks ??= []).push(directiveIndex, wrappedOnChanges);
	}

	if (ngOnInit) {
		(tView.preOrderHooks ??= []).push(0 - directiveIndex, ngOnInit);
	}

	if (ngDoCheck) {
		(tView.preOrderHooks ??= []).push(directiveIndex, ngDoCheck);
		(tView.preOrderCheckHooks ??= []).push(directiveIndex, ngDoCheck);
	}
}
```

---

# Effect Setup

Let's take a break frrom lifecycle methods for a moment to talk about `effect`.

First, let's talk about `forceRoot`:

https://next.angular.dev/api/core/effect#effect_0

> Angular has two different kinds of effect: component effects and root effects. Component effects are created when `effect()` is called from a component, directive, or within a service of a component/directive. Root effects are created when `effect()` is called from outside the component tree, such as in a root service, or when the `forceRoot` option is provided.
>
> The two effect types differ in their timing. Component effects run as a component lifecycle event during Angular's synchronization (change detection) process, and can safely read input signals or create/destroy views that depend on component state. Root effects run as microtasks and have no connection to the component tree or change detection.

---

https://github.com/angular/angular/blob/92f30a749d676a290f5e173760ca29f0ff85ba8c/packages/core/src/render3/reactivity/effect.ts#L148-L207

```typescript
export function effect(
	effectFn: (onCleanup: EffectCleanupRegisterFn) => void,
	options?: CreateEffectOptions,
): EffectRef {
	// ...

	if (viewContext !== null && !options?.forceRoot) {
		// This effect was created in the context of a view, and will be associated with the view.
		node = createViewEffect(viewContext.view, notifier, effectFn);
		// ...
	} else {
		// This effect was created outside the context of a view, and will be scheduled independently.
		node = createRootEffect(effectFn, injector.get(EffectScheduler), notifier);
	}

	// ...

	return new EffectRefImpl(node);
}
```

---

https://github.com/angular/angular/blob/92f30a749d676a290f5e173760ca29f0ff85ba8c/packages/core/src/render3/reactivity/effect.ts#L325-L341

```typescript
export function createViewEffect(
	view: LView,
	notifier: ChangeDetectionScheduler,
	fn: (onCleanup: EffectCleanupRegisterFn) => void,
): ViewEffectNode {
	// ...

	view[EFFECTS] ??= new Set();
	view[EFFECTS].add(node);

	// ...
	return node;
}
```

---

This gets added to the `LView`:

```typescript
export interface LView<T = unknown> extends Array<any> {
	// ...
	[EFFECTS]: Set<ViewEffectNode> | null;
	// ...
}
```

Now that we've seen how both the basic lifecyle methods and effects are registered, let's see how they're called:

# Timing Execution

---

https://github.com/angular/angular/blob/92f30a749d676a290f5e173760ca29f0ff85ba8c/packages/core/src/render3/instructions/change_detection.ts#L189-L375

```typescript
export function refreshView<T>(
	tView: TView,
	lView: LView,
	templateFn: ComponentTemplate<{}> | null,
	context: T,
) {
	// ...

	const hooksInitPhaseCompleted =
		(flags & LViewFlags.InitPhaseStateMask) ===
		InitPhaseState.InitPhaseCompleted;

	// execute pre-order hooks (OnInit, OnChanges, DoCheck)
	// PERF WARNING: do NOT extract this to a separate function without running benchmarks
	if (!isInCheckNoChangesPass) {
		if (hooksInitPhaseCompleted) {
			const preOrderCheckHooks = tView.preOrderCheckHooks;
			if (preOrderCheckHooks !== null) {
				executeCheckHooks(lView, preOrderCheckHooks, null);
			}
		} else {
			const preOrderHooks = tView.preOrderHooks;
			if (preOrderHooks !== null) {
				executeInitAndCheckHooks(
					lView,
					preOrderHooks,
					InitPhaseState.OnInitHooksToBeRun,
					null,
				);
			}
			incrementInitPhaseFlags(lView, InitPhaseState.OnInitHooksToBeRun);
		}
	}
	// ...

	runEffectsInView(lView);

	// ...

	// execute content hooks (AfterContentInit, AfterContentChecked)
	// PERF WARNING: do NOT extract this to a separate function without running benchmarks
	if (!isInCheckNoChangesPass) {
		if (hooksInitPhaseCompleted) {
			const contentCheckHooks = tView.contentCheckHooks;
			if (contentCheckHooks !== null) {
				executeCheckHooks(lView, contentCheckHooks);
			}
		} else {
			const contentHooks = tView.contentHooks;
			if (contentHooks !== null) {
				executeInitAndCheckHooks(
					lView,
					contentHooks,
					InitPhaseState.AfterContentInitHooksToBeRun,
				);
			}
			incrementInitPhaseFlags(
				lView,
				InitPhaseState.AfterContentInitHooksToBeRun,
			);
		}
	}

	// ...

	const viewQuery = tView.viewQuery;
	if (viewQuery !== null) {
		executeViewQueryFn<T>(RenderFlags.Update, viewQuery, context);
	}

	// execute view hooks (AfterViewInit, AfterViewChecked)
	// PERF WARNING: do NOT extract this to a separate function without running benchmarks
	if (!isInCheckNoChangesPass) {
		if (hooksInitPhaseCompleted) {
			const viewCheckHooks = tView.viewCheckHooks;
			if (viewCheckHooks !== null) {
				executeCheckHooks(lView, viewCheckHooks);
			}
		} else {
			const viewHooks = tView.viewHooks;
			if (viewHooks !== null) {
				executeInitAndCheckHooks(
					lView,
					viewHooks,
					InitPhaseState.AfterViewInitHooksToBeRun,
				);
			}
			incrementInitPhaseFlags(lView, InitPhaseState.AfterViewInitHooksToBeRun);
		}
	}

	// ...
}
```

---

As you may have guessed, the code for `runEffectsInView` executes the effects present in `view[EFFECTS]`:

https://github.com/angular/angular/blob/main/packages/core/src/render3/reactivity/view_effect_runner.ts#L11-L43

```typescript
export function runEffectsInView(view: LView): void {
	// ...

	for (const effect of view[EFFECTS]) {
		// ...
		// `runEffectsInView` is called during change detection, and therefore runs
		// in the Angular zone if it's available.
		if (effect.zone === null || Zone.current === effect.zone) {
			effect.run();
		} else {
			effect.zone.run(() => effect.run());
		}
	}

	// ...
}
```

Which runs all of the `effect` and `afterRenderEffect` method usages.

# Quiz and Demo

<iframe data-frame-title="Timings No Conditional - StackBlitz" src="pfp-code:./timings-no-conditional?template=node&embed=1&file=src%2Fmain.ts"></iframe>

However, if you add a control flow block like `@if (bool) {}`, we can see the results change:

<iframe data-frame-title="Timings Conditional - StackBlitz" src="pfp-code:./timings-conditional?template=node&embed=1&file=src%2Fmain.ts"></iframe>
