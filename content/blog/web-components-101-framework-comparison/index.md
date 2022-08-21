---
{
    title: "Web Components 101: Framework Comparison",
    description: "While web components can be used standalone, they're paired best with a framework. With that in mind, which is the best and why?",
    published: '2021-12-02T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['lit', 'vue', 'react', 'angular'],
    attached: [],
    license: 'coderpad',
    originalLink: 'https://coderpad.io/blog/web-components-101-framework-comparison/',
    series: "Web Components 101",
    order: 4
}
---

Alright alright, I know for a lot of the last article seemed like a big ad for Lit. That said, I promise I’m not unable to see the advantages of other frameworks. Lit is a tool in a web developer’s toolbox. Like any tool, it has its pros and cons: times when it’s the right tool for the job, and other times when it’s less so.

That said, I’d argue that using an existing framework is more often the better tool for the job than vanilla web components.

To showcase this, let’s walk through some of these frameworks and compare and contrast them to home-growing web components.

# Pros and Cons of Vanilla Web Components

While web frameworks are the hot new jazz - it’s not like we couldn’t make web applications before them. With the advent of W3C standardized web components (without Lit), doing so today is better than it’s ever been.

Here are some pros and cons of Vanilla JavaScript web components:

<table class="wp-block-table">     <tbody>         <tr>             <th>                 Pros             </th>             <th>                 Cons             </th>         </tr>         <tr>             <td>                 <ul>                     <li><span>No framework knowledge required</span></li>                     <li><span>Less reliance on framework</span></li>                 </ul>                 <ul>                     <li><span>Maintenance</span></li>                     <li><span>Bugs</span></li>                     <li><span>Security issues</span></li>                 </ul>                 <ul>                     <li><span>Smaller “hello world” size</span></li>                     <li><span>More control over render behavior</span></li>                 </ul>             </td>             <td>                 <ul>                     <li><span>Re-rendering un-needed elements is slow</span></li>                     <li><span>Handling event passing is tricky</span></li>                     <li><span>Creating elements can be overly verbose</span></li>                     <li><span>Binding to props requires element query</span></li>                     <li><span>You’ll end up building Lit, anyway</span></li>                 </ul>             </td>         </tr>     </tbody> </table>

To the vanilla way of doing things’ credit, there’s a bit of catharsis knowing that you’re relying on a smaller pool of upstream resources. There’s also a lessened likelihood of some bad push to NPM from someone on the Lit team breaking your build.

Likewise - for smaller apps - you’re likely to end up with a smaller output bundle. That’s a huge win!

For smaller applications where performance is critical, or simply for the instances where you need to be as close to the DOM as possible, vanilla web components can be the way to go.

That said, it’s not all roses. After all, this series has already demonstrated that things like event passing and prop binding are verbose compared to Lit. Plus, things may not be as good as they seem when it comes to performance.

## Incremental Rendering

On top of the aforementioned issues with avoiding a framework like Lit, something we haven’t talked about much is incremental rendering. A great example of this would come into play if we had an array of items we wanted to render, and weren’t using Lit.

Every time we needed to add a single item to that list, our `innerHTML` trick would end up constructing a new element for every single item in the list. What’s worse is that every subelement would render as well!

This means that if you have an element like this:

```html
<li><a href=”https://example.com”><div class=”flex p-12 bg-yellow”><span>Go to this location</span></div></a></li>
<li><a href=”https://example.com”><div class=”flex p-12 bg-yellow”><span>Go to this location</span></div></a></li>
```

And only needed to update the text for a single item in the list, you’d end up creating 4 more elements for the item you wanted to update… On top of recreating the 5 nodes (including the [Text Node](https://developer.mozilla.org/en-US/docs/Web/API/Text)) for every other item in the list.

## Building Your Own Framework

As a result of the downsides mentioned, many that choose to utilize vanilla web components often end up bootstrapping their own home-grown version of Lit.

Here’s the problem with that: You’ll end up writing Lit yourself, sure, but with none of the upsides of an existing framework.

This is the problem with diving headlong into vanilla web components on their own. Even in our small examples in the article dedicated to vanilla web components, we emulated many of the patterns found within Lit. Take this code from the article:

```html
<script>
  class MyComponent extends HTMLElement {
    todos = [];

    connectedCallback() {
      this.render();
    }
   
    // This function can be accessed in element query to set internal data externally
    setTodos(todos) {
      this.todos = todos;
      this.clear();
      this.render();
    }

    clear() {
      for (const child of this.children) {
        child.remove();
      }
    }
   
    render() {
      this.clear();
   
      // Do logic
    }
   
  }

  customElements.define('my-component', MyComponent);
</script>
<script>  class MyComponent extends HTMLElement {    todos = [];     connectedCallback() {      this.render();    }       // This function can be accessed in element query to set internal data externally    setTodos(todos) {      this.todos = todos;      this.clear();      this.render();    }     clear() {      for (const child of this.children) {        child.remove();      }    }       render() {      this.clear();         // Do logic    }     }   customElements.define('my-component', MyComponent);</script>
```

Here, we’re writing our own `clear` logic, handling dynamic value updates, and more.

The obvious problem is that we’d then have to copy and paste most of this logic in many components in our app. But let’s say that we were dedicated to this choice, and broke it out into a class that we could then extend.

Heck, let’s even add in some getters and setters to make managing state easier:

```html
<script>
  // Base.js
  class OurBaseComponent extends HTMLElement {
    connectedCallback() {
      this.doRender();
    }

    createState(obj) {
        return Object.keys(obj).reduce((prev, key) => {
            // This introduces bugs
            prev["_" + key] = obj[key];
            prev[key] = {
                get: () => prev["_" + key],
                set: (val) => this.changeData(() => prev["_" + key] = val);
            }
        }, {})
    }
   
    changeData(callback) {
      callback();
      this.clear();
      this.doRender();
    }

    clear() {
      for (const child of this.children) {
        child.remove();
      }
    }
   
    doRender(callback) {
      this.clear();
      callback();
    }   
  }
</script>
<script>  // Base.js  class OurBaseComponent extends HTMLElement {    connectedCallback() {      this.doRender();    }     createState(obj) {        return Object.keys(obj).reduce((prev, key) => {            // This introduces bugs            prev["_" + key] = obj[key];            prev[key] = {                get: () => prev["_" + key],                set: (val) => this.changeData(() => prev["_" + key] = val);            }        }, {})    }       changeData(callback) {      callback();      this.clear();      this.doRender();    }     clear() {      for (const child of this.children) {        child.remove();      }    }       doRender(callback) {      this.clear();      callback();    }     }</script>
```

Now our usage should look fairly simple!

```html
<script>
  // MainFile.js
  class MyComponent extends OurBaseComponent {
    state = createState({todos: []});

    render() {
        this.doRender(() => {
            this.innerHTML = `<h1>You have ${this.state.todos.length} todos</h1>`
        })
    }
  }

  customElements.define('my-component', MyComponent);
</script>
<script>  // MainFile.js  class MyComponent extends OurBaseComponent {    state = createState({todos: []});     render() {        this.doRender(() => {            this.innerHTML = `<h1>You have ${this.state.todos.length} todos</h1>`        })    }  }   customElements.define('my-component', MyComponent);</script>
```

That’s only 13 lines to declare a UI component!

Only now you have a bug with namespace collision of state with underscores, your `doRender` doesn’t handle async functions, and you still have many of the downsides listed below!

You could work on fixing these, but ultimately, you’ve created a basis of what Lit looks like today, but now you’re starting at square one. No ecosystem on your side, no upstream maintainers to lean on.

# Pros and Cons of Lit Framework

With the downsides (and upsides) of vanilla web components in mind, let’s compare the pros and cons of what building components using Lit looks like:

<table class="wp-block-table">     <tbody>         <tr>             <th>                 Pros             </th>             <th>                 Cons             </th>         </tr>         <tr>             <td>                 <ul>                     <li><span>Faster re-renders* that are automatically                             handled</span></li>                     <li><span>More consolidated UI/logic</span></li>                     <li><span>More advanced tools after mastery</span></li>                     <li><span>Smaller footprint than other frameworks</span></li>                 </ul>             </td>             <td>                 <ul>                     <li><span>Framework knowledge required</span></li>                     <li><span>Future breaking changes</span></li>                     <li><span>Not as widely known/used as other frameworks (Vue,                             React, Angular)</span></li>                 </ul>                 <p><span></span></p>             </td>         </tr>     </tbody> </table>

While there is some overlap between this list of pros and cons and the one for avoiding Lit in favor of home-growing, there’s a few other items here.

Namely, this table highlights the fact that Lit isn’t the only framework for building web components. There’s huge alternatives like React, Vue, and Angular. These ecosystems have wider adoption and knowledge than Lit, which may make training a team to use Lit more difficult.

However, Lit has a key advantage over them, ignoring being able to output to web components for a moment - we’ll come back to that.

Even compared to other frameworks, Lit is uniquely lightweight.

Compare the bundle sizes of Vue - a lightweight framework in it’s own right - compared to Lit.

![Lit weighs in at 16.3 kilobytes while Vue weighs in at 91.9 kilobytes](./bundlephobia.png)

While tree shaking will drastically reduce the bundle size of Vue for smaller applications, Lit will still likely win out for a simple component system.

# Other Frameworks

Lit framework isn’t alone in being able to output to web components, however. In recent years, other frameworks have explored and implemented various methods of writing code for a framework that outputs to web components.

For example, the following frameworks have official support for creating web components without changing implementation code:

- [Vue](https://v3.vuejs.org/guide/web-components.html#definecustomelement)
- [Angular](https://angular.io/guide/elements)
- [Preact](https://github.com/preactjs/preact-custom-element)

Vue 3, in particular, has made massive strides in improving the web component development experience for their users.

What’s more is that these tools tend to have significantly larger ecosystems. Take Vue for example.

Want the ability to change pages easily? [Vue Router](https://router.vuejs.org/)

Want a global store solution? [Vuex
](https://vuex.vuejs.org/)Prefer similar class based components? [Vue Class Component Library](https://class-component.vuejs.org/)

Prebuilt UI components? [Ant Design](https://www.antdv.com/docs/vue/introduce/)

While some ecosystem tools might exist in Lit, they certainly don’t have the same breadth.

That’s not to say it’s all good in the general web component ecosystem. Some frameworks, like React, [have issues with Web Component interop](https://custom-elements-everywhere.com/), that may impact your ability to merge those tools together.

# Why Web Components?

You may be asking - if you’re going to use a framework like Vue or React anyway, why even bother with web components? Couldn’t you instead write an app in one of those frameworks, without utilizing web components?

You absolutely can, and to be honest - this is how most apps that use these frameworks are built.

But web components play a special role in companies that have multiple different projects: Consolidation.

Let’s say that you work for BigCorp - the biggest corporation in Corpville.

BigCorp has dozens and dozens of full-scale applications, and not all of them are using the same frontend framework. This might sound irresponsible of BigCorp’s system architects, but in reality, sometimes a framework is better geared towards specific applications. Additionally, maybe some of the apps were part of an acquisition or merger that brought them into the company.

After all, the user doesn’t care (or often, know) about what framework a tool is built with. You know what a user does care about? The fact that each app in a collection all have vastly different UIs and buttons.

![Two different apps, each with different text cutoff points in their button's text](./two_apps.png)

While this is clearly a bug, if both codebases implement the buttons on their own, you’ll inevitably end up with these types of problems; this being on top of the work-hours your teams have to spend redoing one-another’s work for their respective frameworks.

And that’s all ignoring how difficult it can be to get designers to have consistency between different project’s design components - like buttons.

Web Components solve this problem.

If you build a shared component system that exports web components, you can then use the same codebase across multiple frameworks.

Once the code is written and exported into web components, it’s trivial to utilize these new web components in your application. Like, it can be a [single line of code trivial.](https://v3.vuejs.org/guide/web-components.html#tips-for-a-vue-custom-elements-library)

From this point, you’re able to make sure the logic and styling of these components are made consistent between applications - even if different frameworks.

# Conclusion

While web components have had a long time in the oven, they came out swinging! And while Lit isn’t the only one at the table, they’ve certainly found a strong foothold in capabilities.

Lit’s lightweightness, paired with web component’s abilities to integrate between multiple frameworks is an incredible one-two punch that makes it a strong candidate for any shared component system.

What’s more, the ability to transfer knowledge from other frameworks makes it an easy tool to place in your toolbox for usage either now or in the future.

Regardless; whether you’re using Vue, React, Angular, Lit, Vanilla Web Components, or anything else, we wish you happy engineering!
