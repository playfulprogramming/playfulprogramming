## Timings - The Bane of any JavaScript developer, now with `ViewChild`

[ADDLINK: At the start of the section about `ViewChild`](), I asked you to temporarily set aside the `static` prop and what it does to ensure the concepts are grasped properly. I think it's a good time to cover the prop in further detail.

While the `ViewChild` and `ContentChild` properties are very good at what they do, they can be confusing when it comes to what lifecycle methods they're available in. This is partially why I've been using `ngAfterViewInit` and `static: false` for the examples thus far.

Take the following example and see if you can guess what these `console.log`s are going to output:


```typescript
@Component({
  selector: 'app',
  template: `
  <div #divToView>At Root</div>
  <ng-template [ngTemplateOutlet]="templateToOutlet"
  <ng-template #templateToOutlet>
    <div #childToView>In Template</div>
  </ng-template>
  `
})
export class HelloComponent implements OnInit, AfterViewInit {
  @ViewChild('childToView') childToView;
  @ViewChild('divToView') divToView;

  ngOnInit() {
    console.log("OnInit: " + this.divToView.nativeElement.innerText);
    console.log("OnInit: " + this.childToView.nativeElement.innerText);
  }

  ngAfterViewInit() {
    console.log("AfterView: " + this.divToView.nativeElement.innerText);
    console.log("AfterView: " + this.childToView.nativeElement.innerText);
  }
}
```

Totally lost? 



Think you got it? 



Last chance, go on and properly try it.




```diff
OnInit: At Root
- ERROR TypeError: Cannot read property 'nativeElement' of undefined
AfterView: At Root
AfterView: In Template
```


Weird, isn't it? Even though we're loading up the template immediately, and passing it by template reference variable, it still is `undefined` at the time of the `ngOnInit`.

The reasoning behind this is that the intended query result is nested inside of a template. This template _This template creates an "embedded view"_, an injected view created from a template when said template is rendered. This embedded view is difficult to see from anything above it in the parent view, and is only exposed properly after change detection is ran. Because change detection is ran after `ngOnInit`, it is `undefined` until the `ngAfterViewInit` lifecycle method.

>  If you understood that, go get yourself some ice-cream, you totally deserve it. If you didn't, that's okay! We all learn at different paces and I'm sure this post could be written a dozen other ways - maybe try re-reading some stuff, tinking with code, or asking any questions you might have from myself or others.

As a result, **if you have your code inside of a template that's being rendered that you want to grab using `ViewChild`/`ContentChild`  - you will need to use an `ngAfterViewInit` rather than a `ngOnInit`.** For similar reasons (change detection being a tricky thing as it is), **you'll need to access the plural APIs ( `ViewChildren`/`ContentChildren`) with the `ngAfterViewInit` lifecycle as well.**

**This also effects `*ngIf` and `*ngFor` structural directives**, so if you've recently added one of those to your template, and have noticed that you've had to switch your lifecycle methods to using `ngAfterViewInit`, you have a bit of an explanation ([as structural directives use templates internally](#structural-directives-what-sorcery-is-this))

#### Great Scott - You Control The Timing!

While this behavior can be a bit confusing, Angular 8 brought an option to the `ViewChild` and `ContentChild` APIs to make this a bit easier to manage mentally. While **these APIs won't enable use of templated queries in `ngOnInit`**, it will make bugs when adding templated queries (such as `ngIf`) less likely to create new bugs.

For example, if you'd like to force all queries to not run until `ngAfterViewInit`, regardless of using templated views, you can enable that with the `{static: false}` option configuration:

```typescript
@ContentChild(ComponentHere, {read: ElementRef, static: false}) foo: ElementRef;
```

However, if you'd like to try to disallow any templated views from being accessed by a query, you can pass the `static: true` option:

```typescript
@ContentChild(ComponentHere, {read: ElementRef, static: true}) foo: ElementRef;
```


Keep in that if you don't define a `static` prop, it will have the same API behavior as it did in the past. Additionally, because `ContentChildren`/`ViewChildren` don't have the same API nuance, the `static` option prop does not affect those APIs.

# Why

But it might seem silly to be using to use `ViewChild` for a template reference variable 