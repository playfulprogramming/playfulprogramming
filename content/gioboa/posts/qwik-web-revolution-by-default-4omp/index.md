---
{
title: "Qwik: web revolution by default",
published: "2022-09-12T09:57:11Z",
edited: "2022-12-20T08:20:29Z",
tags: ["qwik", "framework", "webdev", "performance"],
description: "A few weeks ago I decided to create an e-commerce storefront based on real GraphQL APIs to sell...",
originalLink: "https://dev.to/this-is-learning/qwik-web-revolution-by-default-4omp",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---


A few weeks ago I decided to create an e-commerce storefront based on real [GraphQL](https://graphql.org/) APIs to sell items.
Before jumping into the code I decided to define some [not functional requirements](https://en.wikipedia.org/wiki/Non-functional_requirement) for my application.

Let's have a look at these metrics

![Metrics](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tvccawv1s13uh2yyvd84.jpg)

here there are a lot of real use cases that prove that performances are really important.
<br/>

## Which framework should I use?

Great, now with these requirements I know that I need to build a fast application that gives me also the possibility to be SEO compliant. 
SSR frameworks are so good for these needs and for this particular app I decided to try [Qwik City](https://qwik.builder.io/) because of these awesome features:<br/>
- Resumable technique
- O(1) framework
- Amazing [PageSpeed](https://pagespeed.web.dev/) results
<br/><br/>

## Resumable vs. Hydration

👇 extract from [Qwik docs](https://qwik.builder.io/docs/concepts/resumable/#resumable-vs-hydration)

The best way to explain how Qwik is different from the current generation of frameworks is to understand how they are working (hydration).

### **Hydration**:
When an SSR/SSG application boots up on a client, it requires that the framework on the client restore three pieces of information:

- **Listeners**: locate event listeners and install them on the DOM nodes to make the application interactive.

- **Component tree**: build up an internal data structure representing the application component tree.

- **Application state**: restore the application state.

Collectively, this is known as hydration. All current generations of frameworks require this step to make the application interactive.

[Hydration is expensive](https://www.builder.io/blog/hydration-is-pure-overhead) for two reasons:

- The frameworks have to download all of the component code associated with the current page.

- The frameworks have to execute the templates associated with the components on the page to rebuild the listener location and the internal component tree.

<img width="100%" style="width:100%" src="https://media.giphy.com/media/bPxVfeXd2v2Xuo40Tl/giphy.gif">

### **Resumable**:
The resumable approach is about pausing execution in the server and resuming execution in the client without having to replay and download all of the application logic.

A good mental model is that Qwik applications at any point in their lifecycle can be serialized and moved to a different VM instance (server to browser). There, the application simply resumes where the serialization stopped. No hydration is required. This is why we say that Qwik applications don't hydrate; they resume.

---

Qwik is different because it does not require hydration to resume an application on the client. Not requiring hydration is what makes the Qwik application startup instantaneous.

---
<br/>

## Blazing fast application

So far so good... we understand why Qwik is so fast, but what about performances?

### O(1) framework

![O(1) diagram](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/uclxdlhgyse29et1iezo.png)

With this new O(1) paradigm Qwik will download only the JavaScript needed in the visible viewport, if the user will scroll into an html with interaction, the framework will download lazily the JavaScript needed by that part.
Qwik knows which parts to download because it intelligently tracks the relationship between the html node and the JavaScript needed to make it interactive.
With this fine-grained download, if your application is growing in complexity, its initial bundle is proportional to the complexity of the first visible interactive part.
This is a mind-blowing feature!
I've done a lot of applications in my career and when the complexity is more than a "CRUD" or a simple "Hello World" the build time and bundle is a hard issue to digest.


### PageSpeed results
This is the most impressive area about Qwik and keeps in mind that a slow-loading website can hurt your Google rankings.
 
Have a look at my application results 🤯


![PageSpeed results](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/hvzhyzbutkyzz6kw3c8c.png)


🚀 Yes, these metrics are stunning and that's the result of a clever framework design.

- ✅ **Total Blocking Time** => 0ms  
- ✅ **Time to Interactive** => 1.0s 

For the reasons we saw before the first render is only html and a few Kb of JavaScript and these results are proof of that.

## Wrapping up
Many innovative techniques are taking hold in the world of the frontend, new concepts that wink at the performances and try to solve the most incomplete problems.
Qwik is defining his way to solve them and I have to say he is doing it great.

---

You can [follow me on Twitter](https://twitter.com/giorgio_boa), where I'm posting or retweeting interesting articles.
 
If you enjoyed this article don't forget to give ❤️ and if you have any questions or feedback then don't hesitate to drop them in the comments below. Bye 👋

{% embed https://dev.to/gioboa %}

_Special thanks to [@mhevery](https://dev.to/mhevery) for the use cases image and for reviewing this article._