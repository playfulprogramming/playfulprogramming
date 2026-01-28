---
{
title: "AnimationRenderer: listening and playing",
published: "2023-01-02T10:59:34Z",
tags: ["angular", "webdev", "typescript", "javascript"],
description: "In the first two articles of this series we learned how AnimationRendererFactory generates its...",
originalLink: "https://dev.to/this-is-angular/animationrenderer-listening-and-playing-4i3a",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "Deep dive into Angular animations framework",
order: 3
}
---

In the first two articles of this series we learned how *AnimationRendererFactory* generates its renderers.
Now we're gonna look at what "animating rendering transition" means concretely.

---

## Animations: Transition vs Timeline

This series focuses on *transition animations*, declarative ones executed during state changes of an element.
There's another type of animation available in Angular: *timeline animation* ones, that can be explicitly issued after having built a dedicated player following the flow started by [**AnimationBuilder**](https://angular.io/api/animations/AnimationBuilder) class.
These two flavours share big part of animation lifecycle but differ in some details, thus they need to notify their nature to common gears.
In the end they both rely on elements' properties for their job: transitions expecting to find them declared in templates, while programmatic ones translating command issued by the player in DOM nodes' properties.
To distinguish between the two, the framework defines a simple "contract":

- **transition animations properties** will be prepended by a single **`@`** character (explictly added by the coder during template writing, `[@yourAnimationName]="yourCompProp"`)
- **timeline animations properties** will automatically come prepended by two **`@@`** characters by [**RendererAnimationPlayer**](https://github.com/angular/angular/blob/470738c8f775145630a07be783e50dac5d2194e5/packages/platform-browser/animations/src/animation_builder.ts#L46).
  ```ts
  ```

function issueAnimationCommand(
renderer: AnimationRenderer, element: any, id: string, command: string, args: any\[]): any {
return renderer.setProperty(element, `@@${id}:${command}`, args);
}

````

Even in this article we will not study timeline animations, but this preamble was due because at some point the classes we're going to examine will execute the checks to route flow in the right path.

## AnimationRenderer overrides: entry points to animation flow 
Our _AnimationRendererFactory_ detected some triggers declared inside `@Component` metadata and generated an instance of [**AnimationRenderer**](https://github.com/angular/angular/blob/27da7338ea8f3bf5336d77ed1877cfa6a1974d52/packages/platform-browser/animations/src/animation_renderer.ts#L243).
Looking at the code, we notice that it extends the "dumb" _BaseAnimationRenderer_ class covered in this series' first article.
It adds two important overrides: **setProperty** and **listen**.
First one is **Renderer2**'s method to add/change DOM nodes' properties, that as we already explained, is the way the framework uses to trigger animation flow.
The latter instead, set an event listener on DOM nodes, and will be used by the framework to issue eventual callbacks we defined (for _transition animations_, think about **start** and **done** phases' output).

Let's see its constructor:
```ts
export class AnimationRenderer extends BaseAnimationRenderer implements Renderer2 {
  constructor(
      public factory: AnimationRendererFactory, namespaceId: string, delegate: Renderer2,
      engine: AnimationEngine, onDestroy?: () => void) {
    super(namespaceId, delegate, engine, onDestroy);
    this.namespaceId = namespaceId;
  }
  ...
````

It injects:

- a reference to its factory, but this is only used for some kind of optimization we will not investigate in this article ([here](https://github.com/angular/angular/commit/6cb93c1fac669de591dfa0cb8380381ee1a23506) you can find relative commit, if you're curious).
- the `namespaceId` uniquely identifying this renderer and extensively explained in previous article
- a delegate *\*DOMRenderer* for non-animated tasks
- an *AnimationEngine* in charge of checking the nature of the animation and routing it to dedicated engine (*TransitionAnimationEngine* or *TimelineAnimationEngine*)
- a destruction callback

That's all it needs to do its job.

## setProperty(...): fire up this thing!

#### AnimationRenderer

We already told every animation starts with a change in the value of some dedicated DOM nodes properties, applied by *AnimationRenderer*'s **setProperty** override:

```ts
override setProperty(el: any, name: string, value: any): void {
  if (name.charAt(0) == ANIMATION_PREFIX) {
    if (name.charAt(1) == '.' && name == DISABLE_ANIMATIONS_FLAG) {
      value = value === undefined ? true : !!value;
      this.disableAnimations(el, value as boolean);
    } else {
      this.engine.process(this.namespaceId, el, name.slice(1), value);
    }
  } else {
    this.delegate.setProperty(el, name, value);
  }
}
```

It accepts the expected arguments: the element to which applying the property, the name of the property and its value.
Let's examine its logic:

- first it checks if property is actually an animation binding, verifying its name starts with an *ANIMATION\_PREFIX*, namely a `@` character.
  Otherwise, the call is passed to delegated native *\*DOMRenderer*
- if the binding turns out as an animation one, code will look for a disabling instruction, that could have been issued assigning to the node a property named `@.disabled`. So for optimization it first checks for a dot character `.` following `@`, and after that for the string `disabled`. If found, it will ask the engine to disable any animation for that element and its children
- when the binding is an actual animation request instead, [**AnimationEngine**](https://github.com/angular/angular/blob/f58ad86e51817f83ff18db790a347528262b850b/packages/animations/browser/src/render/animation_engine_next.ts#L71)' *process* method is called, passing as arguments:
  - specific *namespaceId*
  - the element
  - name of the property **stripped of its first `@` character**
  - new value to be assigned to the property

#### AnimationEngine

Here's how **AnimationEngine** processes the call.
Remember that *AnimationRenderer* already stripped first `@` char.

```ts
process(namespaceId: string, element: any, property: string, value: any) {
  if (property.charAt(0) == '@') {
    const [id, action] = parseTimelineCommand(property);
    const args = value as any[];
    this._timelineEngine.command(id, element, action, args);
  } else {
    this._transitionEngine.trigger(namespaceId, element, property, value);
  }
}
```

- it immediately checks first character of the property name:
  - if it's again a `@` character, we are facing a *timeline animations* request, that as we already seen gets constructed with the structure `@@${id}:${command}`. Calling *parseTimelineCommand*, property name gets tokenized stripping remaining leading `@` and using colon char `:` as separator, extracting *id* of the specific [**BrowserAnimationFactory**](https://github.com/angular/angular/blob/470738c8f775145630a07be783e50dac5d2194e5/packages/platform-browser/animations/src/animation_builder.ts#L36) and the name of the command to be executed. Value of the property (if any) gets passed as array of arguments to the command
  - if received property's first character is anything but `@`, we're surely dealing with a *transition animation*, thus the code passes the request to [**TransitionAnimationEngine**](https://github.com/angular/angular/blob/f58ad86e51817f83ff18db790a347528262b850b/packages/animations/browser/src/render/transition_animation_engine.ts#L527)'s *trigger* method, responsible of bootstrapping the logic of [**TransitionAnimationNamespace**](https://github.com/angular/angular/blob/f58ad86e51817f83ff18db790a347528262b850b/packages/animations/browser/src/render/transition_animation_engine.ts#L112) related method.
    This one, after a really complex logic aiming at collecting and enqueueing all possible involved animations on the elements of its pertinence, will call one or more *TransitionAnimationPlayer*.

## listen(...): catch that animation event!

#### AnimationRenderer

Whatever the nature of our animation, we could have setup some operations to be executed just before or after the animation has been played (and in case of *timeline animations*, before or after player gets explicitly destroyed too).
To achieve this goal we assign callbacks to some listeners exposed by the framework.
For *transition animations* we can bind desired functions to some *phase* outputs in template, in the form `(@yourAnimationName.start)="yourFunction()"` or `(@yourAnimationName.done)="yourFunction()"`.
A rule similar to the one we observed for `setProperties` has to be obliged:

- **transition animations events** have to be prepended by a single **`@`** character
- **timeline animations events** will automatically come prepended by two **`@@`** characters by [**RendererAnimationPlayer**](https://github.com/angular/angular/blob/470738c8f775145630a07be783e50dac5d2194e5/packages/platform-browser/animations/src/animation_builder.ts#L56).
  ```ts
  ```

private \_listen(eventName: string, callback: (event: any) => any): () => void {
return this.\_renderer.listen(this.element, `@@${this.id}:${eventName}`, callback);
}

````
These events will be caught by **AnimationRenderer**'s _listen_ method, that we're going to analyze:
```ts
override listen(
    target: 'window'|'document'|'body'|any, eventName: string,
    callback: (event: any) => any): () => void {
  if (eventName.charAt(0) == ANIMATION_PREFIX) {
    const element = resolveElementFromTarget(target);
    let name = eventName.slice(1);
    let phase = '';
    // @listener.phase is for trigger animation callbacks
    // @@listener is for animation builder callbacks
    if (name.charAt(0) != ANIMATION_PREFIX) {
      [name, phase] = parseTriggerCallbackName(name);
    }
    return this.engine.listen(this.namespaceId, element, name, phase, event => {
      const countId = (event as any)['_data'] || -1;
      this.factory.scheduleListenerCallback(countId, callback, event);
    });
  }
  return this.delegate.listen(target, eventName, callback);
}
````

It accepts three arguments:

- target on which listen for the event
- name of the event
- function to be executed

Now, its logic:

- first check is something we already saw on `setProperty` implementation: look at first character of the event name, if it doesn't start with a `@` character, it's not an animation event, so its management can be passed to delegated native *\*DOMRenderer*
- target gets processed in case it comes as a string, and its respective HTML element gets returned (at least for *transition animations* I can't see when this can happen, considering listener is added by Angular template parser, and that *window*, *document* and *body* elements are outside its control. Whoever should know better is welcome in comments)
- first `@` character gets stripped from event name
- first character of current name event (just stripped of the mandatory `@` one) gets checked again, because:
  - if it's **not** another `@` char, it means we got a *transition animation* event, so we need to tokenize it:
    - on the left of dot character `.` we got our *trigger* name
    - on right side there's the name of its phase for which we want to register a listener

  - if instead a second `@` char is found, the name gets passed down the chain as-is, ditching manipulation task to **AnimationEngine** as we'll see later
- now we're good to call **AnimationEngine**'s *listen* method passing as its arguments:
  - namespaceId proper of this renderer
  - element resolved as explained
  - name of the event (extracted from original one for *transition animations*, or completely cloned for *timeline animations*)
  - name of the phase (again extracted, or just an empty string for *timeline* ones)
  - a wrapper function around our real callback scheduling it on *microtask*, but for the sake of simplicity in this article we will consider as if it received just our callback directly

#### AnimationEngine

As for *setProperty* call chain,the role of **AnimationEngine** in even listening is just a little more than the one of a "router" to the correct specific engine:

```ts
listen(
    namespaceId: string, element: any, eventName: string, eventPhase: string,
    callback: (event: any) => any): () => any {
  // @@listen
  if (eventName.charAt(0) == '@') {
    const [id, action] = parseTimelineCommand(eventName);
    return this._timelineEngine.listen(id, element, action, callback);
  }
  return this._transitionEngine.listen(namespaceId, element, eventName, eventPhase, callback);
}
```

There's a check on event name's first character that we should used to, now:

- if that's `@`, it means it has not been tokenized by caller **AnimationRenderer**'s *listen* method and that we're processing a *timeline animation event*, so
  - proceed to strip leading `@`
  - split remaining string using colon `:` as separator to get *id* of the player and name of *action* to perform
  - call dedicated [**TimelineAnimationEngine**](https://github.com/angular/angular/blob/f58ad86e51817f83ff18db790a347528262b850b/packages/animations/browser/src/render/timeline_animation_engine.ts#L25)'s *listen* method, that will take care of selecting right event's callback registered for specified player
- otherwise we can pass it as-is as argument of [**TransitionAnimationEngine**](https://github.com/angular/angular/blob/f58ad86e51817f83ff18db790a347528262b850b/packages/animations/browser/src/render/transition_animation_engine.ts#L527) version of *listen* method, that after fetching the right **AnimationTransitionNamespace** instance by the *namespaceId* it received, will call its *listen* method, the one actually responsible of adding the listener to the array bound to that element.

---

I hope at this point the reader has at least a shallow understanding of transition animation registering flow in Angular.
I purposely left out some implementation details, and stopped digging down call chain before entering the real execution logic of players and callbacks, because that would have been confusing for you at least as much as it is for me.
My intent was to write just about concepts I correctly grasped but, as usual, I'm open to any review suggested in comments.

Thanks for reading!
