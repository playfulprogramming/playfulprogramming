---
{
    title: "Styling",
    description: "",
    published: '2025-01-01T22:12:03.284Z',
    tags: ["react", "angular", "vue", "webdev"],
    order: 3
}
---

<details>
<summary>What tools are we learning in this chapter?</summary>

Styling is a highly contested space in web development. Surely, no matter what tools I select 

</details>

// Talk about CSS and how to use it in their apps

// Talk about how CSS isn't scoped and can easily cause problems

# Utility Classes and Tailwind

// Talk about how you can build your own utility classes and avoid this scoping issue by never scoping

// Then talk about the benefits of having a pre-built utility system like Tailwind avoiding retraining for folks and providing sane out-of-the-box token defaults

# CSS Modules

"But not everyone wants to use utility classes for their solutions. For many, they just want to reuse their existing CSS knowledge with the scoping problem solved for them."

// Talk about how this is built into just about everything and solves the problems with CSS scoping


# CSS-in-JS 

// Talk about the benefits regarding typechecking, tokens, and more

// Then talk about the downsides of not working properly in SSR, SSG, or other static contexts

React: https://emotion.sh/docs/introduction

Also with React, talk about the `styled` API

Angular: https://stackblitz.com/edit/angular-ivy-v7vjkp?file=src%2Fapp%2Fapp.component.ts,src%2Fapp%2Fapp.component.html

Vue: https://stackblitz.com/edit/vue-ai8qpp?file=src%2FApp.vue

# Compiled CSS-in-JS

// Talk about how ASTs are able to explore your codebase pre-emtively and codegen CSS for you in a static way

React: https://panda-css.com/docs/installation/vite
Angular: https://panda-css.com/docs/installation/cli (Angular)
Vue: https://panda-css.com/docs/installation/vue
