---
{
  title: "Angular Internals: Lifecycle Methods and Effect Timings",
  description: "",
  published: "2024-12-08T21:52:59.284Z",
  tags: ["angular", "javascript", "webdev"],
  license: "cc-by-4",
  collection: "Angular Internals",
  order: 4
}
---

Hi! :)

<iframe data-frame-title="Timings No Conditional - StackBlitz" src="pfp-code:./timings-no-conditional?template=node&embed=1&file=src%2Fmain.ts"></iframe>

However, if you add a control flow block like `@if (bool) {}`, we can see the results change:

<iframe data-frame-title="Timings Conditional - StackBlitz" src="pfp-code:./timings-conditional?template=node&embed=1&file=src%2Fmain.ts"></iframe>
