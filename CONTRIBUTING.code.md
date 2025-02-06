# Contributing Code

Welcome to our code contribution guide! First off, thank you for considering contributing to our project. Whether you're fixing a typo in our documentation or implementing a new feature, your help makes this community better for everyone.

This guide will walk you through the process of contributing code to our project. Don't worry if you're new to this – we've all been there! We'll explain everything step by step.

## Before You Start

Before diving into code, here are a few things to keep in mind:

1. Our project aims to help people learn. This means we value clear, well-documented code over clever solutions.
2. No contribution is too small! Even fixing a typo is valuable.
3. It's totally okay to make mistakes. We're here to help and learn together.

## Getting Started

You'll need to know how to fork and clone a Git repository, if you don't, no worries!

Below are some helpful guides for learning how to fork and clone a repository:

- Forking[https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo]
- Cloning[https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository]

### Setting Up Your Development Environment

1. Fork the repository to your GitHub account
2. Clone your fork to your local machine
3. Install Node.js if you haven't already (we recommend the LTS version)
4. Install the project dependencies by running `npm install` in your terminal

Once you have everything installed, you'll have access to several helpful commands to make development easier. Here are the most important ones you'll use:

- `npm run dev`: Starts the development server. This is what you'll use most often while working on changes. It gives you a live preview of the site that updates as you make changes.

- `npm run format`: Automatically formats all your code using Prettier. Think of this as tidying up your room - it makes everything neat and consistent! Always run this before submitting your changes.

- `npm run lint`: Checks your code for potential problems. If it finds any issues, it will let you know what they are and how to fix them.

- `npm run lint:fix`: Like `lint`, but it will automatically fix any problems it can. For more complex issues, you might need to fix them manually.

- `npm test`: Runs our test suite to make sure everything is working correctly.

A typical development workflow looks like this:

1. Start the development server with `npm run dev`
2. Make your changes while watching the live preview
3. Run `npm run format` to tidy up your code (though if you set up VS Code as described above, you might not need this step!)
4. Run `npm run lint:fix` to catch and fix any potential issues
5. Commit your changes and create a PR

If any of these terms sound unfamiliar, don't worry! Here's what they mean:

- **Fork**: Think of this as making your own copy of our project on GitHub. It's like copying a Google Doc to edit it.
- **Clone**: This means downloading the code to your computer so you can work on it.
- **Dependencies**: These are the tools and libraries our project needs to run.

### Making Changes

🌟 **Pro Tip**: Small, incremental commits are better than large ones. Sometimes we might stumble down a rabbit hole we have no clue how to come out of.
This approach makes it so that you can easily revert to the "last known working" state of your changes.

When you want to make changes:

1. Create a new branch for your changes. Think of this as creating a new draft version that won't affect the main project until it's ready.

```bash
git checkout -b your-branch-name
```

2. Make your changes and commit them. A commit is like saving a document, but with a message explaining what you changed.

```bash
git add .
git commit -m "Describe what you changed here"
```

3. Push your changes to your fork.

```bash
git push origin your-branch-name
```

## Creating a Pull Request (PR)

Now comes the exciting part – sharing your changes with us! This is done through a Pull Request (PR).

### Important Things to Know About PRs

🌟 **Pro Tip**: Keep working on the same PR until it's merged! Here's why:

- When we request changes, you don't need to create a new PR. Just update your existing one.
- Think of it like editing a Google Doc – you don't create a new document every time someone suggests changes.
- All the discussion and history stays in one place, making it easier for everyone to follow.

### Code Review Process

We review all contributions to maintain quality and consistency. Here's what you should know:

1. **Timing**: Our reviewers are volunteers who do this in their spare time. While we try to review PRs as quickly as possible, it might take a few days. Think of it like submitting homework – your teacher needs time to grade it!

2. **Patience is Key**: We know you're excited about your contribution (we are too!), but please avoid:
   - Tagging reviewers repeatedly
   - Asking for updates multiple times a day
   - Opening multiple PRs for the same change

3. **Responding to Feedback**: When you receive review comments:
   - Take your time to understand the suggestions
   - It's okay to ask for clarification
   - Make the requested changes in the same PR
   - Push your updates to the same branch

🌟 **Pro Tip**: Disagreeing with proposed changes is perfectly fine! Being rude or disrespectful is not. Always remember, there is an actual human being on the other side of the screen who is just trying to help. Always keep your discussions as focused as possible and your critiques constructive. Most importantly, always be kind!

## Best Practices

### Code Style and Formatting

We use Prettier to maintain consistent code formatting across the project. This takes the hassle out of styling decisions - no more debates about tabs vs spaces!

Here's what you need to know:

1. Always run `npm run format` before submitting your PR. This ensures your code follows our formatting standards.
    - This should be done automatically, but it does not hurt to make sure.

2. If you're using VS Code (our recommended editor), you can install the Prettier extension and set it to "Format on Save". This way, your code will always be formatted correctly as you work.

Beyond formatting, here are some style guidelines we follow:

1. Use clear, descriptive variable names. Instead of `x`, use something like `userCount`
2. Add comments to explain complex logic
3. Break long functions into smaller, focused ones
4. Use TypeScript types to make your code more maintainable

If you're new to Prettier or TypeScript, don't worry! The formatting commands will help you get things right, and we're happy to help with type definitions during code review.

### Documentation

If you're adding new features, please include:

- A clear description of what the feature does
- Any new configuration options
- Examples of how to use it

### Setting Up Your Editor

If you're using Visual Studio Code (VS Code), which we recommend, here's how to get the best experience:

1. Install the "Prettier - Code formatter" extension from the VS Code marketplace
2. Open VS Code's settings (you can press Ctrl+, or Cmd+, on Mac)
3. Search for "format on save" and check the box
4. Search for "default formatter" and select "Prettier" from the dropdown

That's it! Now your code will automatically format itself whenever you save a file.

## Common Scenarios to Avoid (AKA: Things We've All Done!)

Contributing to open source can sometimes feel like learning to dance – there might be a few stumbles along the way, but that's totally normal! Here are some common situations we've seen (and experienced ourselves):

### The "Eager Beaver" Syndrome

Sometimes contributors get so excited to help (which is awesome!) that they'll take on a huge feature as their first contribution. While we love the enthusiasm, it's like trying to run a marathon when you're just starting to jog. Starting with smaller contributions helps you get familiar with the codebase and our workflow first.

### The "Kitchen Sink" Pull Request

This is when someone fixes a small bug but also decides to refactor three components, update some styles, and rename a bunch of variables while they're at it. It's like going to the store for milk and coming back with a whole grocery cart! Smaller, focused changes are much easier to review and get merged.

### The "Ghost Commenter"

This is when someone opens a PR, receives some feedback, and then disappears for weeks without any response. We totally understand that life gets busy (we're all volunteers too!), but it's helpful to let us know if you need more time or if you're no longer able to work on the PR. Even a quick "hey, I'll get to this next week" helps us know what's going on.

### The "Start From Scratch" Approach

We sometimes see contributors delete their PR and create a new one when they receive feedback. It's like throwing away your essay and starting a new one because your teacher suggested some edits! Instead, you can just update your existing PR - it keeps all the context and discussion in one place.

### The "Surprise Package" PR

Sometimes folks submit PRs without opening an issue first or discussing the change. It's like cooking a surprise meal for someone without checking if they have any dietary restrictions! While we appreciate the initiative, it's usually better to discuss bigger changes first to make sure they align with our project's direction.

Remember: We've all been there! These situations are so common that we thought they deserved their own section in this guide. The key is to learn from them and keep contributing. 😊

## Getting Help

Stuck? No problem! Here's how to get help:

1. Check our documentation first
2. Look through closed PRs for similar issues
3. Ask in our Discord community
   - Use the `#pfp-developers` channel
   - Provide context about what you're trying to do
   - Share any error messages you're seeing

Remember: There are no silly questions! We were all beginners once, and we're here to help each other learn and grow.

## Thank You!

Every contribution helps make our community better. Thank you for taking the time to contribute! If you have suggestions for improving this guide, feel free to open a PR for that too.

Happy coding! 🎉
