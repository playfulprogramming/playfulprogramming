---
{
title: "The history of Model-View-Presenter",
published: "2020-11-18T11:05:09Z",
edited: "2020-11-24T20:34:03Z",
tags: ["webdev", "history", "modelviewpresenter", "modelviewcontroller"],
description: "Dust off the history books and discover the origins of the MVP pattern.",
originalLink: "https://dev.to/this-is-learning/the-history-of-model-view-presenter-420h",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---


*Smalltalk was the incubator for Model-View-Controller and also played a role in Model-View-Presenter. [Photo by Joey deVilla](http://www.globalnerdy.com/2008/08/16/my-stack-of-old-computer-books/).*

*Original publication date: 2020-10-29.*

[Big Ball of Mud](http://www.laputan.org/mud/mud.html), spaghetti code, technical debt. Easily some of the least desirable terms to describe our applications.

With modern web applications taking care of more and more system concerns as time progresses, we find ourselves looking for battle-hardened, proven practices that have stood the test of time.

Does it even makes sense to speak of software architecture for the front-end or is it a pipe dream? It turns out that the challenge of maintaining a complex front-end is a problem that was identified at least as early as the 1970s.

Join me, as we dust off the history books and discover the origins of the Model-View-Presenter design pattern from a modern web perspective.

# Model-View-Controller
Model-View-Controller (MVC), the older brother of Model-View-Presenter, [was first introduced](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller#History) for the programming language Smalltalk by Trygve Reenskaug in the 1970s. Back then, a fair amount of logic was required just to capture user input. This was handled by the controller, and a Model-View-Controller triad existed for every single user control on the screen.

As the web emerged during the 1990s, the interest in Model-View-Controller increased because of WebObjects for NeXT and Java. It was further popularised in the 2000s by server-side web frameworks such as Struts and Spring (Java), Django (Python), Rails (Ruby), and ASP.NET MVC (C# and friends). Usually, the framework routed requests to the relevant controller by using a so-called __front controller__.

# Model-View-Presenter
![](https://dev-to-uploads.s3.amazonaws.com/i/v8w64f6yniemqsk5igj3.png)
*Figure from the paper “[MVP: Model-View-Presenter — The Taligent Programming Model for C++ and Java](http://www.wildcrest.com/Potel/Portfolio/mvp.pdf)” by [Mike Potel](https://www.linkedin.com/in/mikepotel/).*

In the early 1990s, Model-View-Presenter (MVP) was [first described and used](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93presenter#History) with C++ by Taligent. In the late 1990s, Taligent introduced it to the Java platform and Dolphin adapted it to their Smalltalk UI framework.

In the late 2000s, Microsoft began advocating Model-View-Presenter for developing rich applications with .NET such as Windows Forms, Silverlight, SharePoint, and ASP.NET.

---

Several variations of the Model-View-Presenter pattern emerged through the first decades it was used. To learn about the differences, read the material on the Taligent and Dolphin Smalltalk variants in the article “[Interactive Application Architecture Patterns](http://aspiringcraftsman.com/2007/08/25/interactive-application-architecture/#the-model-view-presenter-pattern)” by Derek “Aspiring Craftsman” Greer.

---

# JavaScript
![](https://dev-to-uploads.s3.amazonaws.com/i/yaukww7v7splmwwmj1ve.png)
*A handful of examples from the first generation of UI frameworks for JavaScript.*

In the late 2000s and early 2010s, the first generation of UI frameworks—such as AngularJS, Backbone, Dojo Toolkit, Ember, JavaScriptMVC, and Knockout—introduced the Model-View-Controller and Model-View-View Model (MVVM) patterns to client-side web development. This allowed us to separate the presentational logic from the application state while keeping the horizontal software layers synchronised.

The current generation of UI frameworks such as Angular, Aurelia, Dojo, Inferno, Preact, React, Svelte, and Vue are component-based. They focus on UI widgets but leave the details of separating the presentational layers from the rest of the application up to us.

# Model-View-Presenter in modern web applications
![](https://dev-to-uploads.s3.amazonaws.com/i/9s3uzivyqh5f2vkas5v5.png)
*Model-View-Presenter can be fitted for the Angular platform. Figure from my talk “[Model-View-Presenter with Angular](http://youtu.be/D_ytOCPQrI0)” ([slides](https://bit.do/mvp-slides)).*

Identifying that the popular UI frameworks have no design pattern of choice for separating our applications into horizontal software layers, we have to pick one and apply it on our own if we want to enforce separation of concerns.

Drawing from the wisdom of the React community, I have described a variant of the Model-View-Presenter pattern that is well-fitted for the Angular platform. Read "[Model-View-Presenter with Angular](https://dev.to/this-is-angular/model-view-presenter-with-angular-533h)" to learn more.