---
{
  title: "The Framework Field Guide",
  associatedSeries: "Framework Field Guide",
  description: "A practical and free way to teach you Angular, React, and Vue all at once, removing that ever-present desire to switch careers all programmers have.\n\nCurrently in production.",
  authors: ["crutchcorn"],
  coverImg: "./cover.png",
  socialImg: "/framework_field_guide_social.png",
  type: "book",
  published: "2023-01-01T13:45:00.284Z",
  buttons: [{ text: "Get Notified of Release", url: "https://mailinglist.unicorn-utterances.com/subscribe" }],
  chapterList: [
    {
      order: '1', 
      title: "Preface",
      description: "Learning web development is a vital skill in a software engineer's toolbox. Let's talk about why you should learn it and what this book will cover.",
    }, 
    {
      order: '2', 
      title: "Introduction to Components",
      description: "Components are the core building block in which all applications written with React, Angular, and Vue are built. Let's explore what they are and how to build them.",
    }, 
    {
      order: '3', 
      title: "Dynamic HTML",
      description: "One of the primary advantages of using a framework is the ability to quickly generate dynamic HTML from JavaScript logic. Let's walk through some examples.",
    }, 
    {
      order: '4', 
      title: "Lifecycle Methods",
      description: "One way for JavaScript logic to run in components is for a framework to call a specific bit of JS when an event occurs. These are called 'Lifecycle methods'.",
    }, 
    {
      order: '5', 
      title: "Derived Values",
      description: "Often in application development, you'll want to base one variable's value off of another. There are a few ways of doing this - some easier than others.",
    }, 
    {
      order: '6', 
      title: "Forms",
      description: "Forms are a core part of any application. Even when a single input, it can be tricky to manage where the state should live. Let's learn how to do so with React, Angular, and Vue.",
    },
    {
      order: '?', 
      title: "... And much more!",
      description: ""
    }
  ]
}
---

<div style="display: flex; align-items: center; justify-content: center; flex-wrap: wrap">
<div  style="margin: 1rem; width: 128px; flex-shrink: 0;">
<img src="./crutchcorn.png" alt="" data-nozoom="true"/>
</div>
<p style="width: 1px; flex-grow: 1; flex-shrink: 1; min-width: 350px; font-weight: bold;">Hi! I'm <a href="https://crutchcorn.dev">Corbin Crutchley</a>, the author of "The Framework Field Guide" - the outline of which you're looking at!</p>
</div>

The Framework Field Guide will be available **for free** online alongside paid physical edition and will teach React, Angular, and Vue all at the same time.

> Are you really going to teach React, Angular, and Vue all at once?!

**Yes!**

Because all three of these frameworks have some fairly solid commonality between them, I'm able to have most of the concepts explained in shared headings and text bodies.
For instances where the frameworks diverge, you'll see tabs to see the relevant code samples.

For example, here's a "Hello world" component in each framework:

<!-- tabs:start -->
# React

```jsx
const Hello = () => {
	return <p>Hello, world!</p>
}
```

# Angular

```typescript
@Component({
  selector: "my-app",
  template: `<p>Hello, world!</p>`
})
class HelloWorldComp {}
```

# Vue

```javascript
const Hello = {
	template: `<p>Hello, world!</p>`
}
```

<!-- tabs:end -->

In the book print, these tabs will be turned into sub-headings.

## Who is this book for?

This book is primarily for three sets of people:

1) Newcomers, who are looking to learn these frameworks for the first time.
2) Engineers who've learned one framework and are looking for an easy way to learn one of the others.
3) Those looking to 1-up their knowledge of these frameworks' internals

This book will be starting with the very basics of what a component is, all the way into re-creating the core elements of
these frameworks from scratch. Don't believe me? [**Here's sneak peek of the "React Internals" chapter I wrote via a Twitter thread where I build `useState` in Vanilla JS**](https://twitter.com/crutchcorn/status/1527059744392814592).

## When does it release?

This book is still currently in production, and as such won't be available immediately. If you want early access to the book
while it's being worked on, feel free to [reach out to me on Twitter](https://twitter.com/crutchcorn/).

Otherwise, if you want to be notified when the book releases, you can [join our Discord](https://discord.com/invite/FMcvc6T)
or sign up to be notified via email when the book releases.

<form action="https://app.convertkit.com/forms/1254394/subscriptions" class="seva-form formkit-form" method="post" style="border: none;"
    data-sv-form="1254394" data-uid="882d42bb6f" data-format="inline" data-version="5"
    data-options="{&quot;settings&quot;:{&quot;after_subscribe&quot;:{&quot;action&quot;:&quot;redirect&quot;,&quot;success_message&quot;:&quot;Success! Now check your email to confirm your subscription.&quot;,&quot;redirect_url&quot;:&quot;https://unicorn-utterances.com/confirm&quot;},&quot;analytics&quot;:{&quot;google&quot;:null,&quot;fathom&quot;:null,&quot;facebook&quot;:null,&quot;segment&quot;:null,&quot;pinterest&quot;:null,&quot;sparkloop&quot;:null,&quot;googletagmanager&quot;:null},&quot;modal&quot;:{&quot;trigger&quot;:&quot;timer&quot;,&quot;scroll_percentage&quot;:null,&quot;timer&quot;:5,&quot;devices&quot;:&quot;all&quot;,&quot;show_once_every&quot;:15},&quot;powered_by&quot;:{&quot;show&quot;:false,&quot;url&quot;:&quot;https://convertkit.com/features/forms?utm_campaign=poweredby&amp;utm_content=form&amp;utm_medium=referral&amp;utm_source=dynamic&quot;},&quot;recaptcha&quot;:{&quot;enabled&quot;:false},&quot;return_visitor&quot;:{&quot;action&quot;:&quot;hide&quot;,&quot;custom_content&quot;:&quot;&quot;},&quot;slide_in&quot;:{&quot;display_in&quot;:&quot;bottom_right&quot;,&quot;trigger&quot;:&quot;timer&quot;,&quot;scroll_percentage&quot;:null,&quot;timer&quot;:5,&quot;devices&quot;:&quot;all&quot;,&quot;show_once_every&quot;:15},&quot;sticky_bar&quot;:{&quot;display_in&quot;:&quot;top&quot;,&quot;trigger&quot;:&quot;timer&quot;,&quot;scroll_percentage&quot;:null,&quot;timer&quot;:5,&quot;devices&quot;:&quot;all&quot;,&quot;show_once_every&quot;:15}},&quot;version&quot;:&quot;5&quot;}"
    min-width="400 500 600 700 800">
    <div data-style="clean">
        <ul class="formkit-alert formkit-alert-error" data-element="errors" data-group="alert"></ul>
        <div data-element="fields" data-stacked="false" class="seva-fields formkit-fields">
            <div class="formkit-field"><input class="formkit-input" aria-label="Your first name"
                    style="color: rgb(0, 0, 0); border-color: rgb(227, 227, 227); border-radius: 4px; font-weight: 400;"
                    name="fields[first_name]" placeholder="Your first name" type="text"></div>
            <div class="formkit-field"><input class="formkit-input" name="email_address"
                    style="color: rgb(0, 0, 0); border-color: rgb(227, 227, 227); border-radius: 4px; font-weight: 400;"
                    aria-label="Your email address" placeholder="Your email address" required="" type="email"></div>
            <button data-element="submit" class="formkit-submit formkit-submit"
                style="color: rgb(255, 255, 255); background-color: rgb(18, 125, 179); border-radius: 4px; font-weight: 400;">
                <div class="formkit-spinner">
                    <div></div>
                    <div></div>
                    <div></div>
                </div><span class="">Notify Me</span>
            </button>
        </div>
    </div>
</form>

> I promise you won't get spammed with emails if you sign up for notifications. Again, the book is free and we will never share or sell your email with anyone.
