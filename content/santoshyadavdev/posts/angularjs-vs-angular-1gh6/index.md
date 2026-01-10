---
{
title: "AngularJS vs Angular",
published: "2022-06-19T21:59:56Z",
edited: "2022-09-14T13:06:28Z",
tags: ["angular", "frontend", "framework"],
description: "NOTE As I write this blog post, the AngularJS has already reached EOL. It's been 10 months now.      ...",
originalLink: "https://dev.to/this-is-angular/angularjs-vs-angular-1gh6",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

**NOTE** As I write this blog post, the [AngularJS](https://angularjs.org/) has already reached EOL. It's been 10 months now.

## Introduction

I came across AngularJS for the first time around 2014 by my friend who created a small mobile App using Ionic. He was very excited and said we should choose AngularJS for our next project. I also like the framework because I wrote Jquery for 2 years and Razor templates. And AngularJS lets me write HTML templates and avoid the complexity of writing Jquery code by giving easy API.


Fast forward to the end of 2015, I convinced my manager to let me write our new Application in AngularJS we took 3 months but ended up delivering it in 4-5 months as we were doing it for the first time.

And AngularJS was my first front-end framework. 

### Writing AngularJS full-time

Around 2016 I moved to a new Job and started using AngularJS for the front-end with .Net with our backend and creating APIs. I started teaching AngularJS beginning Jan 2017.

### Coming across Angular

While writing AngularJS code and teaching it, I came across the [Angular](https://angular.io/) framework. Yes, they are 2 different frameworks. In 2017 Angular Version 4 was released. I started reading the docs and fell in love with Typescript. It felt very natural as I had been writing .Net code for years. And on top of it, it had the CLI available, and no manual configuration for including the webpack was needed.

Yes, I was way ahead of today's influencers who are unaware these 2 are different frameworks. I started learning and came across courses from [Deborah Kurata](https://twitter.com/DeborahKurata) around March 2017 I started teaching Angular and stopped teaching AngularJS. Even started getting good gigs to teach Angular.

## AngularJS Vs Angular

Enough of my backstory; let's talk about how these 2 frameworks differ. 

* **Language**: AngularJS was written in Javascript. When the Angular team decided to create Angular, they announced they would be using Typescript, which got backlash from the community. Till they realized its true power after 4 years, and now all frameworks use it. Later [Typescript type](https://www.npmjs.com/package/@types/angularjs) was created for AngularJS.

* **Template Engine**: Both frameworks used HTML as a template and provided some Built-in directives, with Angular being superior in type checking. 

* **API**: AngularJS and Angular have some equivalent APIs, like HTTP, forms, and routing. AngularJS had one of the most advanced router before any other framework.

* **CLI**: AngularJS has no official CLI. Angular introduced CLI with version 4.

* **Feature Complete**: Angular is more feature complete, including the Unit Testing framework and the build tools. Unlike AngularJS, where you had to do it manually.

* **Releases**: As informed, AngularJS reached EOL in Jan 2022, and no official support has been provided. On the other hand, Angular has an active development and releases major versions every 6 months.

* **Migration**: Migration from AngularJS to Angular is not as difficult as one may think. Angular has a [section](https://angular.io/guide/upgrade) dedicated to helping you migrate to the latest Angular version. Migrating to a new Angular version is easy thanks to [Angular CLI](https://update.angular.io/), which offers automated migration support. Angular CLI takes care of all the migration, and it takes a few hours to upgrade until and unless you are many versions behind. Also, [Sam](https://twitter.com/samjulien) has a [course](https://www.upgradingangularjs.com/) to help you upgrade from AngularJS to Angular.

## Why confusion between AngularJS and Angular

You might be wondering why so much misinformation is out there on Angular. Some blame goes to the team as well, let me explain.

When AngularJS was released in 2009, there was no npm, and frameworks were used by including scripts directly from CDN or your local file system. When npm became the official way of consuming Javascript packages, the AngularJS team decided to distribute it via npm, guess what they named it?

> Yes, you guessed it right
> Angular 
 
It was distributed as [Angular](https://www.npmjs.com/package/angular) on npm.

The current Angular framework is distributed as [@angular/core](https://www.npmjs.com/package/@angular/core). 

Even if you search for Angular npm on google, you get the below search result. The AngularJS is the first link, which helps a little now, as the message on top includes a link to Angular Core, which was not there a few years ago.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/t2fy27jubjig86v568cv.png) 


## What you can do

This blog is in no way to convince you to start using Angular. This is only for information purposes and to stop spreading misinformation about the Angular framework. 
If someone tells you next time if Angular has reached EOL, you can guide them to this blog.

## Conclusion

This blog takes a dig at people spreading hate and misinformation being spread about the Angular framework. The misinformation spread by such influencers is causing confusion in new learners. Sometimes, they miss the opportunities to become part of the community supporting it.

I may be too blunt writing it, but I respect all the content creators sharing fantastic knowledge. But I am tired of hearing from some influencers, "Angular is dead." No, the problem is you are not investing time researching or googling.

Direct appeal to those, please stay away from spreading false information or misleading new developers.

## References

- [AngularJs Docs](https://angularjs.org/)
- [Angular Docs](https://angular.io/guide/upgrade)
- [Angular Upgrade Course](https://www.upgradingangularjs.com/)
- [Angular Free Course on Freecodecamp](https://www.youtube.com/watch?v=3qBXWUpoPHo)
- [Extended AngularJS Support](https://goo.gle/angularjs-path-forward)

## I am Hiring

Also, I am hiring Angular developers for my team in Germany and Spain. If you are interested, send me a DM on [Twitter](https://twitter.com/SantoshYadavDev)

