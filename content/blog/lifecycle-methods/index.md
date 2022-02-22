---
{
    title: "Lifecycle Methods",
    description: "",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 4,
    series: "The Framework Field Guide"
}
---

While these frameworks' ability to render dynamic HTML is a powerful ability that helps make their usage so widespread, it's only telling half of the story of their capabilities. In particular, lifecycle methods are a way to attach JavaScript logic to specific behaviors these components have.

While [we lightly touched on one of these lifecycle methods in chapter 1](/posts/intro-to-components#Intro-to-Lifecycles), there are many others that come into play.

Let's start by recapping what we already know.

# Render Lifecycle

When we introduced components, we touched on the [concept of "rendering"](/posts/intro-to-components#Rendering-the-app). This occurs when a component is drawn on screen.

This occurs at first when the user loads a page, but also when shown or hidden using a [conditional render, which we touched on last chapter](/posts/dynamic-html#Conditional-Branches).

Say we have the following code:



<!-- tabs:start -->

## React

```jsx {1-3,15}
const Child = () => {
	useEffect(() => {
        console.log("I am rendering");
    }, []);

    return <p>I am the child</p>
}

const Parent = () => {
  const [showChild, setShowChild] = useState(true);
  
  return <div>
  	<button onClick={() => setShowChild(!showChild)}>
  		Toggle Child
  	</button>
    {showChild && <Child/>}
  </div>
}
```

React works slightly differently from the other frameworks we're looking at in this series. In particular, while there's an alternative way of writing React components called "class components" which does have traditional lifecycle methods, the way we're writing components — called "functional components" — does not.

Instead of a direct analogous, React's functional components have a different API [called "Hooks"](https://reactjs.org/docs/hooks-intro.html). These Hooks can then be used to recreate similar effects to lifecycle methods.

For example, in the above code we're using `useEffect` with an empty array as the second argument in order to create a [side effect](// TODO: Link to glossary) that runs only once per render.

We'll touch on what a side effect is and what the empty array is doing in just a moment.

## Angular

```typescript {7,22-26}
@Component({
  selector: 'parent',
  template: `
  <div>
  	<button (click)="setShowChild()">
  		Toggle Child
  	</button>
    <child *ngIf="showChild"></child>
  </div>
  `,
})
export class ParentComponent {
  showChild = true;
  setShowChild() {
    this.showChild = !this.showChild;
  }
}

@Component({
  selector: 'child',
  template: '<p>I am the child</p>',
})
export class ChildComponent implements OnInit {
  ngOnInit() {
    console.log('I am rendering');
  }
}
```

Angular's version of the "rendered" lifecycle method is called "OnInit". Each of Angular's lifecycle methods are prepended with `ng` and require you to add `implements` to your component class.

Angular then runs these methods when the related lifecycle event occurs.

If you forget the `implements`, your lifecycle method will not run when you expect it to. 

## Vue

```javascript {2-4,14}
const Child = {
  template: `<p>I am the child</p>`,
  mounted() {
    console.log('I am rendering');
  },
};

const Parent = {
  template: `
  <div>
  	<button @click="setShowChild()">
  		Toggle Child
  	</button>
    <child v-if="showChild"></child>
  </div>
  `,
  components: {
    Child: Child,
  },
  data() {
    return {
      showChild: false,
    };
  },
  methods: {
    setShowChild() {
      this.showChild = !this.showChild;
    },
  },
};
```

Despite Vue's lifecycle methods being called "methods", they do not live in the "methods" object on a component.

Instead, they live at the root of the component declaration and are called by Vue itself when a lifecycle event occurs.

<!-- tabs:end -->










----

- Lifecycle methods
    - Mounted/rendered
    - Unmounted/unrendered
    - On Updated
        - Compare old vs new
    - Others
        - ngAfterViewInit
        - BeforeUpdated/BeforeMounted
    - Include graphs for each framework
