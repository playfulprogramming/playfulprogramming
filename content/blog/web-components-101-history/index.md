---
{
    title: "Web Components 101: History",
    description: "Web components have had a long history to get where they are today. Let's look back to see where they came from & their immense growth!",
    published: '2021-12-21T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev', 'history'],
    attached: [],
    license: 'coderpad',
    originalLink: 'https://coderpad.io/blog/web-components-101-history/',
    series: "Web Components 101",
    order: 1
}
---

Web components enjoy large-scale usage today. From YouTube to GitHub and many other major organizations, it’s safe to say they’ve made their way into commonplace frontend development practices.

That wasn’t always the case. After all, web components had to start somewhere. And web development can be particularly picky with what succeeds and what doesn’t.

So then, how did web components succeed? What was their path to broad adoption? And what are the origins behind the APIs used for modern web components?

Let’s walk through a short history of web components and the related ecosystem to answer these questions.

# 2010: The Early Days of MVC in JS

While the concept of [“Model View Controller”, also commonly called MVC](https://en.wikipedia.org/wiki/Model–view–controller), has been around for some time, in JavaScript itself it failed to take hold early on.

However, in 2010, there was an explosion around MVC and it’s related cousin: Model View View-Controller (MVVC) ). This explosion came courtesy of a slew of new frameworks that launched only a few months apart from one-another.

[Knockout was one of the first to introduce strict MVC patterns inside of JavaScript in July 2010](https://github.com/knockout/knockout/releases/tag/v1.0.0). Knockout supported observable-based UI binding. Here, you could declare a Model, and bind data from said model directly to your HTML.

```html
<!-- Demo of KnockoutJS -->
<table class="mails" data-bind="with: chosenFolderData">
    <thead><tr><th>Subject</th></tr></thead>
    <tbody data-bind="foreach: mails">
        <tr><td data-bind="text: subject"></td></tr>
    </tbody>
</table>
<script>
function WebmailViewModel() {
    // Data
    var self = this;
    self.chosenFolderData = ko.observable();

    $.get('/mail', { folder: 'Inbox'}, self.chosenFolderData)
};

ko.applyBindings(new WebmailViewModel());
</script>
```

![A list of emails based on their subjects](./knockout_demo.png)

While this works great for UI binding, it lacks the componentization aspect we’ve come to expect from modern frameworks.

---

This was improved in the ecosystem when [Backbone saw its first release in October 2010](https://github.com/jashkenas/backbone/releases/tag/0.1.0). It introduced a `[View](https://backbonejs.org/#View-extend)`, similar to what we might expect a component to be like today.

```javascript
var DocumentRow = Backbone.View.extend({
  tagName: "li",
  className: "document-row",
  events: {
    "click .icon":          "open",
    "click .button.edit":   "openEditDialog",
    "click .button.delete": "destroy"
  },
  initialize: function() {
    this.listenTo(this.model, "change", this.render);
  },
  render: function() {
    ...
  }
});
```

Here, we can see that we can now bind events, classes, and more to a single tag. This aligns better with the types of components we’d see in, say, React or Lit.

---

But that’s not all we saw in October that year. We also saw the [initial release of Angular.js](https://github.com/angular/angular.js/releases/tag/v0.9.0) only 10 days after Backbone’s release.

Here, we can see that it introduced a concept of controllers into the document, similar to the `Model`s of Knockout. It allowed two-way bindings from UI to data and back.

```html
<div ng-controller="TodoListController as todoList">
  <ul>
    <li ng-repeat="todo in todoList.todos">{{todo.text}}</li>
  </ul>
  <form ng-submit="todoList.addTodo()">
    <input
      type="text"
      ng-model="todoList.todoText"
    />
    <input class="btn-primary" type="submit" value="add" />
  </form>
</div>
<script>
  angular
    .module("todoApp", [])
    .controller("TodoListController", function () {
      var todoList = this;
      todoList.todos = [
        { text: "learn AngularJS" },
        { text: "build an AngularJS app" },
      ];

      todoList.addTodo = function () {
        todoList.todos.push({ text: todoList.todoText });
        todoList.todoText = "";
      };
    });
</script>
```

While Angular was the last of the three mentioned here, it had a huge impact. It was the first time Google released a JavaScript-based MVC based library into the wild.

Not only did they build the library, [they used it to build Google’s Feedback tool](https://www.youtube.com/watch?v=r1A1VR0ibIQ) - which powers almost all of Google’s products today. This represented a shift from their prior Java-based “[Google Web Toolkit” (GWT)](http://www.gwtproject.org/) that was widely used before.

Later, with the [acquisition of DoubleClick](https://www.nytimes.com/2007/04/14/technology/14DoubleClick.html), the team that was working on the [migration of the DoubleClick platform for Google decided to use Angular.js as well](https://www.youtube.com/watch?v=r1A1VR0ibIQ).

# 2011: A Glimmer in W3C Standard’s Eye

With Angular.js continuing to grow within Google, it’s no surprise that they continued researching in-JavaScript HTML bindings.

On this topic, Alex Russel - then a Senior Staff Engineer at Google, working on the web platform team - [gave a talk at the Fronteers conference](https://fronteers.nl/congres/2011/sessions/web-components-and-model-driven-views-alex-russell).

In this talk, he introduces a host of libraries that allow building custom elements with experimental new APIs.

```html
<script>
class Comment extends HTMLElement {

  constructor(attrs = {}) {
    super(attrs);
    this.textContent = attrs.text || lorem;
    this.shadow = new ShadowRoot(this);
    this.buildUI();
  }

  buildUI() { ... }
}

HTMLElement.register('x-comment', Comment);

var c = new Comment("Howdy, pardner!");
document.body.appendChild(c);
</script>

<x-comment>...</x-comment>
```

Here, he utilized the [TraceUR compiler](https://web.archive.org/web/20210311050620/https://github.com/google/traceur-compiler) (a precursor to Babel) to add classes (remember, [`class` wouldn’t land in JavaScript stable until ES6 in 2015](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)) to build a new “custom element”.

This combined with their [new MDV library](https://web.archive.org/web/20110509081454/http://code.google.com/p/mdv) in order to create a similar development environment to what we have in browser APIs today.

It’s important to note that at this stage, nothing was formalized inside of a specification - It was all experimental libraries acting as playgrounds for APIs.

That would change soon after.

# 2013: Things Start Heating Up

In early 2013 the Google team created a [Working Draft of a specification for Custom Elements](https://web.archive.org/web/20130608123733/http://www.w3.org/TR/custom-elements/). Alongside similar working drafts for Shadow DOM APIs, they were colloquially called “[Custom Elements v0](https://www.html5rocks.com/en/tutorials/webcomponents/customelements/)”.

With [Google Chrome’s release in 2008](https://googleblog.blogspot.com/2008/09/fresh-take-on-browser.html), they had the ability to quickly implement these non-standard APIs into Chrome in order to allow application developers to utilize them before specification stabilization.

One such example of this was [Polymer, which was a component library based on v0 APIs to provide two-way UI binding using MVC.](https://web.archive.org/web/20130515211406/http://www.polymer-project.org/) It’s initial alpha release was announced in early 2013, alongside the specifications.

At [Google Dev Summit 2013, they walked through its capabilities ](https://www.youtube.com/watch?v=DH1vTVkqCDQ)and how it was able to run in other browsers by utilizing polyfills.

---

Facebook, not one to be outdone on the technical engineering front, [introduced React into public in 2013](https://www.youtube.com/watch?v=GW0rj4sNH2w)

While Polymer went deeper into the MVC route, [React relied more heavily on unidirectionality](https://coderpad.io/blog/master-react-unidirectional-data-flow/) in order to avoid state mutations.

# 2016 & 2017: Formative Years

While only the year prior, Polymer 1.0 was released with the usage of v0 custom element spec, [2016 saw the release of the custom element v1 specification](https://web.archive.org/web/20161030051600/http://w3c.github.io/webcomponents/spec/custom/).

This new version of the specification was not backwards compatible, and as a result required a shift to the new version of the specification in order to function properly. Polyfills were continued to be used as a stop-gate for browsers that didn’t have a v0 implementation.

While [v1 was already implemented into Chrome in late 2016](https://web.archive.org/web/20161101052413/http://caniuse.com/#feat=custom-elementsv1), it wasn’t until 2017 with the release of Polymer 2.0 that it would be adopted back into the library that helped draft the specification.

Because of this, while [YouTube’s new Polymer rewrite](https://blog.youtube/news-and-events/a-sneak-peek-at-youtubes-new-look-and/) theoretically was a huge step towards the usage of web components, it posed a problem. Browsers like [Firefox without a v0 implementation were forced to continue to use Polyfills](https://web.archive.org/web/20180724154806/https://twitter.com/cpeterso/status/1021626510296285185), which are slower than native implementations.

# 2018 and Beyond: Maturity

2018 is where Web Components really found their foothold.

For a start, [Mozilla implemented the v1 specification APIs into their stable release of Firefox](https://www.mozilla.org/en-US/firefox/63.0/releasenotes/), complete with dedicated devtools. Finally, developers could use all of the web components’ APIs in their app, cross-browser, and without any concern for non-Chrome performance.

On top of that, React’s unidirectionality seemed to have won over the Polymer team. The Polymer team announced that it would [migrate away from bidirectional binding and towards a one-way bound `LitElement`](https://www.polymer-project.org/blog/2018-05-02-roadmap-update#libraries)

That `LitElement` would then turn into a dedicated framework called “[Lit](https://coderpad.io/blog/web-components-101-lit-framework/)”, developed to replace Polymer as its successor, that would hit [v1 in 2019](https://github.com/lit/lit/releases/tag/v1.0.0) and [v2 in 2021](https://github.com/lit/lit/releases/tag/lit%402.0.0).

# Timeline

Whew! That’s a lot to take in. Let’s see it all from a thousand foot view:

- 2010:
  - [Knockout.js released](https://github.com/knockout/knockout/releases/tag/v1.0.0)
  - [Backbone.js alpha released](https://github.com/jashkenas/backbone/releases/tag/0.1.0)
  - [Angular.js made open-source](https://web.archive.org/web/20100413141437/http://getangular.com/)

- 2011:
  - [MDV (Polymer predecessor) introduced at a conference](https://fronteers.nl/congres/2011/sessions/web-components-and-model-driven-views-alex-russell)

- 2013:
  - [Working draft spec for Web Components (v0) released](https://web.archive.org/web/20130608123733/http://www.w3.org/TR/custom-elements/)
  - [Polymer (Google’s web component framework) announced](https://www.youtube.com/watch?v=DH1vTVkqCDQ)
  - [React open-sourced](https://www.youtube.com/watch?v=GW0rj4sNH2w)

- 2015:
  - [Polymer 1.0 released](https://web.archive.org/web/20150814004009/https://www.polymer-project.org/1.0/)

- 2016:
  - [Custom elements v1 spec released](https://web.archive.org/web/20161030051600/http://w3c.github.io/webcomponents/spec/custom/)
  - [YouTube rewritten in Polymer](https://blog.youtube/news-and-events/a-sneak-peek-at-youtubes-new-look-and/)

- 2017:
  - [Polymer 2.0 released](https://github.com/Polymer/polymer/releases/tag/v2.0.0)

- 2018:
  - [Polymer announces start of migration to “LitElement”](https://www.polymer-project.org/blog/2018-05-02-roadmap-update#libraries)
  - [Firefox enables web components (Polyfills no longer needed)](https://www.mozilla.org/en-US/firefox/63.0/releasenotes/)

- 2019:
  - [Lit framework 1.0 released](https://github.com/lit/lit/releases/tag/v1.0.0)

- 2021
  - [Lit 2.0 released](https://github.com/lit/lit/releases/tag/lit%402.0.0)

# Conclusion

In the past 10 years we’ve seen massive changes to the web development ecosystem. No more is this more apparent than the development and continued growth of web components.

Hopefully this should put any future learnings about web components and [framework comparisons](https://coderpad.io/blog/web-components-101-framework-comparison/) into perspective.

We’ve waited a long time to see many of these ideas fully standardized into the web platform, and, now that they’re here, they’re helping accelerate growth of many platforms.

Want to learn how to build them yourself?

We have articles about how to build web components [without a framework](https://coderpad.io/blog/intro-to-web-components-vanilla-js/) as well as using [Google’s Lit framework](https://coderpad.io/blog/web-components-101-lit-framework/).
