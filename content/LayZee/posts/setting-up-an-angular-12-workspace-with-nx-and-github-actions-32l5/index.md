---
{
title: "Setting up an Angular 12 workspace with Nx and GitHub Actions",
published: "2021-05-21T13:21:54Z",
tags: ["nx", "angular", "github", "githubactions"],
description: "Setting up an Angular 12 workspace with Nx. Also setting up a GitHub Actions CI workflow with Nx Cloud support.",
originalLink: "https://dev.to/this-is-learning/setting-up-an-angular-12-workspace-with-nx-and-github-actions-32l5",
coverImg: "cover-image.png",
socialImg: "social-image.png",
collection: "Nx After Dark",
order: 2
}
---

In this episode of Nx After Dark, we're creating an Nx workspace for an Angular 12 app called Energy Insights. We're also setting up a GitHub Actions workflow and connecting it to Nx Cloud.

<iframe src="https://www.youtube.com/watch?v=g5AoLY3jqD4"></iframe>

Follow the instructions below to set up a similar workspace or browse the end result at [github/LayZeeDK/energy-insights](https://github.com/LayZeeDK/energy-insights).

# Prerequisites

- Node.js 14.x
- PNPM

> Note that there's currently an issue with using Cypress with PNPM. Let me know if you figure out how to fix it. Until then, remove Cypress from the workspace or use either Yarn or NPM.

# Create Nx workspace

```powershell
# Install the Nx workspace generator
pnpm install --global create-nx-workspace
# Generate a blank Nx workspace
pnpm init nx-workspace my-workspace --preset=empty --pm=pnpm --npm-scope=my-workspace --nx-cloud
```

# Configure Nx workspace

```powershell
# Install the "json" utility
npm install --global json
# Set the base branch to "main"
json -I -f nx.json -e "this.affected.defaultBase = 'main';"
```

# Add Angular capability

```powershell
# Add Angular capability
pnpm add --save-dev @nrwl/angular
# Initialize Angular workspace
nx generate @nrwl/angular:init
```

# Generate Angular app project

```powershell
# Generate Angular app project
nx generate app my-app
```

See the video for examples of:

- Setting up generator defaults
- Creating a GitHub Actions CI workflow
- Setting up GitHub workflow triggers
- Connecting Nx Cloud for distributed computation caching
- Remove Cypress
