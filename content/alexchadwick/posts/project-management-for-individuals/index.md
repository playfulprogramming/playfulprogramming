---

{
    title: "Project Management for Individuals",
    description: "Having the ability to structure your projects (and these don't exclusively have to be programming related) gives you a massive advantage when it comes to being organised, and keeping your life organised.",
    published: '2022-07-26T15:45:03.000Z',
    tags: ['opinion'],
    license: 'cc-by-nc-sa-4'
}
---

# Project Management for Individuals

> Before I begin this post, I am **not** a project manager, but at my job, I perform a lot of project management as I work largely by myself on multiple projects, so any tips covered here I consider them to work for individuals, and maybe small teams, but will definitely not work for larger teams.

## Introduction

Project management is an underrated skill to have for anyone that isn't a project manager.

Having the ability to structure your projects (and these don't exclusively have to be programming related) gives you a massive advantage when it comes to being organised, and keeping your life organised.

And I felt I was lacking organisation when I started the job I'm currently at. I work on a variety of projects (ranging from internal tooling to commercial software), by myself. Since I had total control over the projects I worked on, when I worked on them and when I delivered them, it felt like I had no sort of pressure or deadline to work towards, nor did I have a structured way of working.

And jumping from one project to another because I got bored of one proved to be the wrong way to do things.

So I spent a weekend just researching basic project management, productivity tips for developers, different methodologies (agile, scrum, xp) and tried to find something that would suit my line of work, but this was difficult. Agile and Scrum were complete overkill, and XP was hard to grasp for someone that was new to managing projects.

So what I went and did, was develop a methodology of my own, that was tailored to my own needs, and in this post I'd like to share with you how you can do the same (or use mine!).

## My Methodology

I was looking for a methodology that would fit nicely in Azure DevOps Boards, so I could use it there, and that was clear enough that if more people were to join my team they would understand immediately how it worked, however the tips that I'll describe later on in this blog post will be aplicable to other software, as well as physical boards!

So I developed the most simple thing that would work.

### The task types

There are 2 task types:

* Tasks: You can nest tasks within tasks. They can be anything: feature implementation, refactoring, writing tests, chores, etc. Anything except issues or bugs

* Bugs: They can be nested under tasks, but not under other bugs. They must be atomic, meaning they can't be broken down into smaller pieces

### Tags

There are a few tags that I like to use when defining bugs and tasks:

* Feature: For tasks the implement a feature

* Refactor: For tasks that relate to a refactor of some sorts

* Chore: For tasks that may be boring / don't affect the end result too much like internal documentation and configuration

* Test: For tasks or bugs about testing

* Blocker: For bugs that are very urgent

By using these tags it becomes easier to manage tasks and bugs as you can filter through them. Some people might prefer making each tag it's own task type, but personally I prefer to have the one type of task with one or more tags instead.

### Branching

For branching I use the following method:

1. Create a task that the branch relates to

2. Create a branch with a brief description of what it's for and the task / bug number, e.g: 372-fix-document-view

3. Make your changes

4. Push your changes

5. Create a pull request

6. Merge with the main or trunk branch

7. Execute CI/CD operations to test and build the project

8. If all is successful, merge main and production branches

### Development Cycle

The development cycle, for those that don't know, is the process followed by an individual or team to develop software.

This is what my usual development cycle looks like:

1. Requirements: Firstly I gather the requirements of the product or feature

2. Design: I usually jot down on a notebook a rough design of the feature. Design here doesn't refer exclusively to UI, but also code design. How will I break this down? If I'm in the backend, do I need a new controller? Do I need to add a service?

3. Writing tests: I prefer test driven development, so firstly I write unit and integration tests where I can. And I make sure they all fail!

4. Implementation: Now that I've got the tests, I will program my implementation. For every test that succeeds I will create a commit.

5. Refactoring / Documenting: Now that it's implemented and working, I do some refactoring and documenting where needed to make it easier to understand.

6. CI: Now I will push all of my commits, and wait for the Continuous Integration pipeline to verify that all the testing, linting and building is successful

7. (Optional) CD: This step is optional because I don't always deploy the changes I make immediately. I'll only run a Continuous Delivery pipeline if I'm fixing an important bug, in which case, this step will take place immediately after CI. If not then I'll wait to accumulate a few features to deliver my updated application

8. Start again

## How do you come up with your own methodology?

This is an incredibly complex question, because you can make this as simple or as complicated as you like, and it might change depending on the tools you're using or the technologies you work with.

But I still wanted to put out a general sort of guide to coming up with your own methodology that can be applicable to your software projects, so here are my tips:

### 1. How do you want to break down your to-dos?

In my case, I wanted to break them down into Tasks and Bugs, each with optional tags. And it works great for me because it integrates well with Azure DevOps. But if you're using a different system then maybe you want to rethink this. Maybe you want Test Writing to be it's own type of task because you find it feels better in your system. It's *your* methodology so remember to tailor it to yourself.

### 2. Which branching strategy do you want?

There are many options. I like to go for a simple branching strategy as it's just me working on this, so I don't need anything overly complex, but maybe if you want more structure you can be more complicated. I like to have a branch per issue, then it all gets added to the same "nightly" branch which happens to be my default / main branch, and a production branch that triggers my CD.

### 3. What will your development cycle look like?

Whether it's well defined or not defined at all, you inevitably have some sort of routine that you follow when programming. Write this down, and also maybe consider if there are any improvements you could easily add to your routine. If you have trouble remembering when to commit for example (like me!) then try to set some sort time when you commit, like for example, when you've written 5 functions or when you've finished a step in your development cycle.

### 4. Miscellaneous bits

There are many other things that you can add to your methodology, but I chose to skip in mine. For example, a priority system, the fields you want your task types to have, do you want an effort system? Do you want to write a word document for a major feature? Do you want to include notes in the task?

You can also work out how your pipelines are going to work. Do you want Continuous Integration (CI) to be separate from your Continuous Delivery (CD)? Do you want the CI/CD pipeline run automatically or manually?

## Conclusion

Having your own methodology is incredibly handy for your personal projects, and even more so when you've got multiple going on at the same time.

There is no use in a methodology that doesn't work for you if you're working on a personal project, you'll be most productive when you follow a system that you feel comfortable using.

However, never close the doors to any suggestions anyone may have, and don't be afraid to try something new to see if it works for you as well. And with that said, please do offer me your suggestions to improve my own system! I'm always keen on new productivity tips and I'm very interested in finding out what other people do!
