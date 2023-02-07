---
{
	title: "Formik Works Great; Here's Why I Wrote My Own",
	description: "",
	published: "2023-02-25T04:45:30.247Z",
	authors: ["crutchcorn"],
	tags: ["react", "opinion"],
	attached: [],
	license: "cc-by-nc-sa-4"
}
---

If you've looked into form validation with React, [you'll likely have heard of Formik](https://github.com/jaredpalmer/formik). My first run-in with Formik was at a large company I worked; it was already established as the go-to form library for our projects, and I immediately fell in love with it.

My time at this company was in 2019, [right before Formik surpassed one million weekly downloads](https://npmtrends.com/formik). Thanks to my experience using Formik at this company, I was left with a strong recommendation in favor of the tool for all future React forms usage.

Fast forward to today. I'm leading a front-end team in charge of many applications. One such application we inherited was very heavily form-focused. Formik is still the wildly popular, broadly adopted intuitive forms API I used all those years ago.

So, if we loved Formik, why did we not only remove it from our projects but replace it with [a form library of our own](https://github.com/crutchcorn/houseform)?

I think this question is answered by taking a look at the whole story:

- Why is Formik great?
- Why don't we want to use Formik?
- What can be improved about Formik?
- What alternatives are there?
- How does our own form library differ?
- How did we write it?
- What's next?

# Why is Formik great?

See, I started web development [in 2016 with the advent of Angular 2](https://en.wikipedia.org/wiki/Angular_(web_framework)#Version_2). While it has its ups and downs, one of its strengths is in [its built-in abilities to do form validation](https://angular.io/guide/form-validation) - made only stronger when [recent versions of Angular (namely, 14) introduced fully typed forms](https://angular.io/guide/typed-forms).

React doesn't have this capability baked in, so during my early explorations into the framework I was dearly missing the ability to do validated forms for more complex operations.



While an Angular form might look something like this:

```

```





# Why don't we want to use Formik?



Fast forward to today. I'm leading a small frontend team in charge of a plethora of applications. One such application we inherited was very heavily form-focused.

<!-- Include fake screenshot of the app -->



<!-- Talk about maintainance issues -->



# What can be improved about Formik?

<!-- Talk about Form-centric API issues -->





# What alternatives are there?

<!-- Talk about React Hook Form -->







# How does our own form library differ?

<!-- Talk Field-first API -->







# How did we write HouseForm?

<!-- Talk about registration of Fields into Form, talk about Vite/Vitest/Vitepress -->



# What's next?

<!-- conclusion -->