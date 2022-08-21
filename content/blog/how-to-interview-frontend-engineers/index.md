---
{
    title: "How to Interview Frontend Engineers",
    description: "Interviewing for frontend engineering positions can be difficult. Let's walk through some things you should focus on while interviewing.",
    published: '2021-05-28T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['interviewing', 'web', 'javascript'],
    attached: [],
    license: 'coderpad',
    originalLink: 'https://coderpad.io/blog/how-to-interview-frontend-engineers/'
}
---

Interviewing for frontend engineering positions can be difficult. There’s a lot to keep in mind for any interview, but frontend interviews always seem to have so many things to be cognizant of.

While we’ve discussed [5 tips for tech recruiting](https://coderpad.io/blog/5-tips-for-tech-recruiting/), let’s take a look at some of the things we feel are more specific to a frontend technical screening.

# JavaScript Baseline

Whether you’re using a JavaScript framework or simply adding logic to a vanilla JS website, good frontend candidates need to know some basics of JavaScript in order to create business logic.

Some codebases may follow OOP principles while others will heavily utilize functional programming paradigms. Make sure you ask frontend candidates questions that are relevant to your project. If your app extensively utilizes classes in JavaScript, you might ask about prototype inheritance or focus on the `this` keyword. Likewise, if you’re primarily using functional coding, you might check if they’re familiar with functions-as-values - asking them to make generic functions that utilize callbacks or returned functions.

Regardless of the code style you utilize, you may want to ask about JavaScript basics like variable scoping between `var`, `let`, or `const` and when each is appropriate. That said, try to avoid asking questions about niche specifics in a language. Unless you’re hiring for engineering work on a JavaScript runtime, your candidate doesn’t need to know the engine level specifics of things like “[Temporal Dead Zone](https://2ality.com/2015/10/why-tdz.html)”.

Likewise, “gotcha” questions specifically designed to be confusing or obtuse are unhelpful in gauging real-world problem-solving in any technical interview.

# Design Focus

As a frontend engineer, being able to build an app to match designs is important. If your interview process includes a design for your candidate to build, check to see how consistent their implementation is to your design. While minor changes in element sizing can be easily glossed over, they can impact a user’s view of the product. Ideally, you want to include a way to analyze the provided design for the engineer to check the values of padding and other measurements. Oftentimes in technical interviews, the only provided design is a screenshot - having to guess-and-check the pixel values proves a frustrating candidate experience.

If your exercise doesn’t include a design to utilize, I wouldn’t evaluate their skills based on the UX or UI. Unless the role you’re hiring for is a mixture of designer and engineering, keep in mind - engineers don’t necessarily need to have design skills.

## Different Screens

With mobile devices becoming more and more predominant in today’s society, it’s important to know that your candidate can scale the application’s UI to non-desktop devices. Even if a design isn’t provided, ask your candidate to include a view for smaller screens as well.

While JavaScript is more than able to conditionally render logic based on screen size, it’s suggested to utilize CSS’s media queries whenever possible. This allows your app to adjust to various-sized screens (and often helps with SEO).

# Frameworks

Most modern frontend applications are written with a framework like React or Vue. Luckily for engineers looking to switch roles, the core concepts of many of these frameworks are similar in nature.

You may want lead engineer or senior developer candidates to have in-depth knowledge of the specific framework you're utilizing to help other team members. For example, understanding `useMemo` or `useCallback` in React can be critical for ensuring your app has high performance. However, mid or entry-level developers can usually learn the framework's specifics on the job if they have a strong foundation of the core concepts from other experience.

Because of this, there are some things you can ask of a candidate that may have had more experience in a different frameworks.

## Lifecycles

Even frameworks that have recently moved away from highlighting lifecycle methods (such as React with Hooks), most frameworks have some concept of a lifecycle. Being able to have a candidate explain when and why a component will do its initial data capture, re-render, and un-render can help accentuate their core framework knowledge.

## Unidirectionality

While frameworks like Vue or Angular allow you to bubble events up from a child component to a parent, it’s generally accepted that keeping your application architecture unidirectional is the best practice. We’ve [written a bit about what that means in practice](https://coderpad.io/blog/master-react-unidirectional-data-flow/), but it’s something to be cognizant of when evaluating a candidate’s code submission.

# Empathy

A major part of collaborating within a team effectively is a candidate’s empathy for others. Remember, engineering often utilizes significantly more interpersonal skills than most give credit. It’s important that your engineers are able to communicate with one another effectively. Great engineers will even consider users in their daily work and raise concerns or thoughts when they see something that misaligns with the user’s experience in your app.

## Accessibility

Part of a front-end engineer’s role is to make sure that the application they’re building is usable by all users. Making sure that users with screen-readers, color blindness, or other impairments are able to use your application as easily as other users is important.

This could mean bringing up problems with color contrasts in a provided design, making sure that the candidate is using semantic HTML, or even that they’re utilizing the right `aria` attributes. Don’t forget that CSS can impact screen-reader support through properties like flexbox’s “[order](https://developer.mozilla.org/en-US/docs/Web/CSS/order)”

## Documentation

Empathy isn’t just something that should be expressed to users. After all, communication within a team is extremely important and much more frequent. One way that communication can be increased within a codebase is documentation. While many tend to think of documentation as dedicated docs pages shared with engineers, documentation can take many forms.

For example, code comments that explain how a particular bit of code can be a form of documentation. If you’re using a typed programming language like TypeScript in an interview, maybe explicit typings can be a form of documentation. Both of these can be demonstrated through a representative [Take-Home](https://coderpad.io/blog/hire-better-faster-and-in-a-more-human-way-with-take-homes/). Maybe the candidate is able to provide comments to a particularly confusing bit of code or add typing interfaces where `unknown` or `any` might’ve otherwise sufficed.

In other scenarios, creating example projects that showcase component’s design can help be a bridge of communication between designers, engineers, and product managers. You can help encourage candidates to add a development route that acts as a showcase of their UI components.

# Ignore Style Differences

While most of this article has been focused on things \***to\*** do and look for in an interview, let’s look at something that shouldn’t be focused on: code style. While there are certainly instances where `for` loops make more sense than `forEach`, or `function() {}` declarations are required instead of `() => {}` functions, most of the time they shouldn’t be taken as a positive or negative indicator of code quality. Some engineers might prefer newer syntaxes such as object destructuring but other engineers might have experience prior to the introduction of those syntax introductions.

There are exceptions to this - using a single `for` loop may be more performant than multiple. Maybe code maintenance and readability is more important than performance for parts of your application.

Regardless of code preferences, make sure to communicate expectations with your candidate ahead of time. There’s nothing worse than shifting goalposts when working on a project - especially during an interview

# Conclusion

While we feel that these points provide a good baseline of evaluation for technical screenings, interviews are dynamic and change from company to company. What are the things you look for during a frontend interview? Let us know [on Twitter](https://twitter.com/coderpad) or [on our community Slack](https://bit.ly/coderpad-slack) - we’d love to see you there!
