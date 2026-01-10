---
{
title: "Setting up an Nx workspace with nx-dotnet",
published: "2021-05-05T21:56:13Z",
edited: "2021-05-05T22:11:14Z",
tags: ["nx", "dotnet", "githubactions", "github"],
description: "Setting up an Nx workspace for .NET development with nx-dotnet. Also setting up a GitHub Actions CI workflow.",
originalLink: "https://dev.to/this-is-learning/setting-up-an-nx-workspace-with-nx-dotnet-893",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "12595",
order: 1
}
---


In this episode of Nx After Dark, we're creating an Nx workspace for .NET project by using [nx-dotnet](https://github.com/nx-dotnet/nx-dotnet). We're also setting up a GitHub Actions workflow.

{% youtube uS9RSoqTwVw %}

Follow the instructions below to set up a similar workspace or browse the end result at [github/LayZeeDK/nx-dotnet-workspace](https://github.com/LayZeeDK/nx-dotnet-workspace).

# Prerequisites
- .NET CLI
- Node.js
- PNPM
- Nx CLI

# Create Nx workspace

```powershell
# Install the Nx workspace generator
pnpm install --global create-nx-workspace
# Generate a blank Nx workspace
pnpm init nx-workspace nx-dotnet-workspace --preset=empty --pm=pnpm --npm-scope=dotnet --no-nx-cloud
```

# Configure Nx workspace

```powershell
# Install the "json" utility
npm install --global json
# Set the base branch to "main"
json -I -f nx.json -e "this.affected.defaultBase = 'main';"
```

# Add .NET capability

```powershell
# Add nx-dotnet
pnpm add --save-dev @nx-dotnet/core
# Initialize nx-dotnet
nx generate @nx-dotnet/core:init
```

# Configure Nx generator defaults

```powershell
# Prefer nx-dotnet generators
json -I -f workspace.json -e "this.cli.defaultCollection = '@nx-dotnet/core';"
# Set defaults for nx-dotnet's "app" and "lib" generators
json -I -f workspace.json -e "this.generators = { '@nx-dotnet/core:app': { language: 'C#', tags: 'type:api', template: 'webapi', testTemplate: 'xunit' }, '@nx-dotnet/core:lib': { language: 'C#', template: 'classlib', testTemplate: 'xunit' } };"
```

# Create web API project

```powershell
# Generate web API and testing projects
nx generate app weather-api
# Tag testing project with "type:test"
json -I -f nx.json -e "this.projects['weather-api-test'].tags = ['type:test'].concat(this.projects['weather-api-test'].tags.slice(1));"
# Set weather-api as default Nx project
json -I -f workspace.json -e "this.defaultProject = 'weather-api';"
```

# Generate GitHub Actions CI workflow

```powershell
# Install GitHub Actions .NET template
dotnet new -i TimHeuer.GitHubActions.Templates::1.0.5
# Generate GitHub Actions CI workflow
dotnet new workflow
```

# Use Nx for Build job

1. Remove the _Restore_ step from `.github/workflows/nx-dotnet-workspace.yaml`.
1. Add _Setup Node.js_ step after _Setup .NET Core SDK_ step:
   ```yml
   - name: Setup Node.js
     uses: actions/setup-node@v1
     with:
       node-version: 12.x
   - name: Install PNPM
     run: npm install --global pnpm
   - name: Install Nx dependencies
     run: pnpm install
   ```
1. Change the `run` command of the _Build_ step to:
   ```
   pnpm build
   ```
1. Change the `run` command of the _Test_ step to:
   ```
   pnpm test
   ```

# Adjust NPM scripts
1. Change the `build` script in `package.json` to:
    ```
    nx build --configuration=production
    ```
1. Change the `test` script in `package.json` to:
    ```
    nx test weather-api-test
    ```

# Dependency graph
No we can explore the dependency graph by running:
```powershell
pnpm dep-graph
```
or the affected depdency graph by running:
```powershell
pnpm affected:dep-graph
```

# CI workflow
The *Build* workflow is run on every push to the `main` branch.

Remove the condition (`if:`) from the *Build* job to enable the manual workflow trigger. We are then able to use the *Run workflow* button from the *Actions* tab in our GitHub repository.