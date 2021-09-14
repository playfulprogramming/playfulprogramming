---
 {
    title: "GitHub Copilot is Amazing - It Won't Replace Developers",
    description: "",
    published: '2021-05-30T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['github copilot', 'tools'],
    attached: [],
    license: 'cc-by-nc-sa-4'
}
---

I recently touched on how [GitHub Copilot](https://copilot.github.com/), an AI-powered code generation tool from GitHub and OpenAI, [is going to shift the way we’ll need to do interviews](/posts/github-copilot-breaks-bad-interviews/). Copilot frankly is astonishing in its abilities to generate complex algorithm implementations from nothing more than a function name. This makes sense given it's training data of GitHub's publicly hosted community code ([a controversial decision](https://twitter.com/eevee/status/1410037309848752128)).

Some have taken these advanced algorithm assessment capabilities as a warning sign that developers will soon be fully automated using tech similar to Copilot, I’m not sold on that idea.

# Architecture

Let’s first remember what the job of an engineer or developer is. While on the surface, yes, developers do type code into their IDE - the real work is done in the developer’s mind. To code something is to consider a problem’s expected outcome, its constraints, edge cases, and to take those into account to decide on an implementation.

While Copilot is highly capable of generating *a* solution, it doesn’t know your engineering constraints. This is where architecture decisions come into play. Sure, you may know that you want a sorting algorithm - but *which* sorting algorithm may be more important than being able to implement it. After all, if you are wanting to implement a complex sort on a large dataset with limited memory, your biggest problems are likely to stem from knowing where to store your data in an [external sort](https://en.wikipedia.org/wiki/External_sorting) as opposed to the specific code syntax you’ll utilize to make that a reality.

That said, not every engineer is at or needs to be at an architectural level. Some of us are most comfortable when we can focus within our IDEs as opposed to meeting rooms where those constraints often come to light. However, there is a skill that every developer will need to develop as they code: Debugging.

# Bugs

Even when assisted by a tool like Copilot, bugs are inevitable in any system. Even if your code is perfection itself captured in text, we still have to rely on others code in upstream dependencies. Knowing how to work through finding the root cause and solving a bug is integral to development. Oftentimes, I find myself spending more time debugging complex issues than building a significant portion of fresh code.

Regardless of if you use the debugger or print statements (which, we all do at some point, be honest), Copilot isn’t able to automate that process for you.

# Refactors

Likewise, a common task in an existing codebase is to refactor it in order to be more secure, efficient, fast, readable, or otherwise better. While Copilot is able to glean context from the current file you’re presently in, refactors can often span multiple files as you modify the underlying abstractions in a codebase. Even then, while [GitHub says they’re adding support for full project-based context in the future](https://copilot.github.com/#faq-what-context-does-github-copilot-use-to-generate-suggestions), automated refactors would be extremely difficult to attain. 

> When I'm talking about automated refractors, I'm *not* talking about [codemods](https://www.sitepoint.com/getting-started-with-codemods/) powered by AST manipulation to, say, migrate from one version of a library to another. Codemods like those rely on consistent information existing for both versions of the library code being migrated. Further, these codemods don’t come for free and libraries must usually engineer specifically with automated migrations in mind.
>

In order to automate refactors, Copilot would not only need to know how things *were* done, but what the newer method of doing things is. After all, the previous code exists for a reason, what is it doing, why is it doing what it is, and how are we able to improve it? When application-wide refactors occur, a team often sits down and discusses the advantages of standards and sets a level of consistency to strive for. However, refactors often have hidden levels of complexity within. When actually diving into a refactor, there may be constraints in the new technology that may not have been known previously. When this occurs, the team must make decisions based on many parameters. A machine simply isn’t up for the task.

# Code Review

When GitHub Copilot first launched, there was a lot of discussion about how good its generated code would be in the end. Can Copilot understand the nuances in `useEffect`? Does it know that you need a consistent memory reference to avoid triggering change detection?

Maybe, but you can’t be certain it will get it right every time. However, the same can be said for others: you can’t be certain another person on the team will get it right every time.

This nuance brings another point against the concept of developers being fully automated by Copilot: Code review. 

Ideally, you shouldn't be allowing developers to push code directly to production on a regular basis. While there will always be emergency scenarios where this doesn't apply, it's dangerous to ignore the code review stage. This isn't to say that you shouldn't trust your developers, but we're only human after all. If [Google can make a single-character typo to wipe every ChromeOS laptop with a certain update installed](https://www.androidpolice.com/2021/07/20/a-new-chrome-os-91-update-is-breaking-chromebooks-like-a-bull-in-a-china-shop/), it's not impossible your team may make a similar mistake.

During this process of code review, your team may discover bugs, realize that an experience is impacted by planned implementation, or even point out a more optimized or easier-to-read implementation. Having this team environment allows for a more diverse pooled perspective on the code that's being contributed towards a codebase and results in a better product. 




# GitHub Copilot’s Strengths
None of this is to say that Copilot as a tool isn’t advantageous. Copilot is often able to make suggestions that impress me. In particular, if I have a somewhat repetitive task or are simply exploring a commonly implemented function, Copilot can fill in the blanks for me with only the name.

All of these utils are generated with Copilot using only the function name as an argument passed in:

```javascript
const reverseString = str => {
  return str.split('').reverse().join('');
}

const normalizePath = path => {
  return path.replace(/\/+/g, '/');
}

const stripBOM = str => {
  return str.replace(/^\uFEFF/, '');
}

const usageOfChar = (str, char) => {
  return str.split(char).length - 1;
}
```

While there may be _faster_ implementations of some of these, they're undoubtedly extremely readable and maintainable  - they're how I'd implement these functions myself! 

















```javascript
class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

// Copilot suggested all of this without any help whatsoever
class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    insert(data) {
        if (!this.root) {
            this.root = new Node(data);
        } else {
            this._insert(this.root, data);
        }
    }
```


This isn't all that was suggested by Copilot, however - [it generated a full implementation of a depth-first binary tree](https://github.com/CoderPad/github-copilot-interview-question/blob/main/questions/javascript/binary-depth-search.js)









While I wasn't a developer when traditional autocomplete tools (such as Intellisense) came into play of daily development, I'm certain there were arguments from some against using it as well.











It's important to remember that even GitHub isn't poising Copilot as a replacement to 







I find that developer tools do best for me when they become invisible. Copilot is able to do that quite well and gets out of your way when you don't need it





While [streaming on my Twitch](https://twitch.tv/crutchcorn) 

https://clips.twitch.tv/TacitFitIcecreamTriHard-KgJCKYYIEPqxe4dQ



# Learning Tool

I recently saw a tweet 



While I couldn't find that tweet again after searching for it later, it stuck out in my mind.



After all, when I am learning how to program something new, it's always been useful for me to see an implementation of how it's done elsewhere. I remember being in my first programming job as a Junior and learning so much simply by seeing how others in the team wrote similar code.



Now, my early career was somewhat formed by what I'd seen others do in codebases I was adjacent to. Because I was assigned tasks, the things I learned about tended to pertain specifically to those tasks. Further, I found it somewhat tricky to find . After all, [Google search is not kind to many symbols we use in programming](https://stackoverflow.com/a/3737197).





# Documentation



# Conclusion







GCP, I love ya, but your suggestion that [humans need not apply](https://www.youtube.com/watch?v=7Pq-S557XQU) isn’t quite here yet. At least not for developers.

After all, GitHub’s tool is called “Copilot”, not “Autopilot”



