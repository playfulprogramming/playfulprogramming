---
{
title: "Stop using the defaultProject Nx CLI setting and start using NX_DEFAULT_PROJECT",
published: "2023-05-30T06:26:51Z",
edited: "2025-08-22T06:55:19Z",
tags: ["nx", "angular", "deprecation"],
description: "The defaultProject Nx CLI setting is deprecated. However, there's a hidden alternative.",
originalLink: "https://dev.to/this-is-learning/stop-using-the-defaultproject-nx-cli-setting-and-start-using-nxdefaultproject-2ka5",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---


*Cover image by DALL-E.*

The `defaultProject` setting for the Nx CLI was originally inherited from the Angular CLI. In integrated and standalone Nx workspaces, the `defaultProject` setting is located in `nx.json`. In package-based Nx workspaces, `defaultProject` is located in `package.json#nx`. While it was removed from Angular CLI version 16, it is still present but unofficially deprecated in Nx version 16.x as evident by [the `nx.json` reference](https://nx.dev/reference/nx-json) which doesn't list it.

As of Nx 16.2, a `defaultProject` setting is still configured when using [`create-nx-workspace`](npmjs.com/package/create-nx-workspace) to generate a standalone Nx workspace. However, it is safe to remove this setting as Nx detects the `project.json` file in the root directory of a standalone workspace.

In this article, we discuss why the `defaultProject` is being deprecated, which use cases it affects with example commands not depending on it, and finally the viable replacement for `defaultProject`.

## Why will `defaultProject` be removed?

The `defaultProject` setting is being depreacted and eventually removed because it doesn't make sense in integrated and package-based Nx workspaces where the preferred project usually varies between teams and developers and so shouldn't be committed to a configuration shared between most or all teams and developers.

Standalone Nx workspaces can have more than one project but the original project is defined in a `package.json` or `project.json` file in the root workspace directory which Nx detects to infer the project for Nx CLI commands run from this directory.

## What does `defaultProject` affect?

Let's explore most of the use cases affected by the `defaultProject` setting and how we can complete them without this setting.

### Running tasks

An Nx workspace defines projects, targets, and, optionally, configurations.

To run a task for a specific configuration of a project target, we use the following command format.

```powershell
nx run <project>:<target>[:<configuration>]
```

or

```powershell
nx run <project>:<target> [--configuration=<configuration>]
```

For example, to start a task running the `build` target on the `my-app` project, we use the following command.

```powershell
nx run my-app:build
```

Common target names have alias commands, for example the following command is an alias of the previous `nx run` command.

```powershell
nx build my-app
```

To make sure we use the `production` build configuration, we prepend `:production` to our `nx run` command as seen in the following.

```powershell
nx run my-app:build:configuration
```

The aliased version is as follows.

```powershell
nx build my-app --configuration=production
```

### Running generators

Some Nx generators and Angular schematics require a `--project` option but use the `defaultProject` setting when omitted, for example `@nx/component` and `@schematics/angular:component`.

Without a `deafultProject` setting, we must pass a `--project` option as seen in the following example.

```powershell
nx generate @nx/angular:component button --standalone --project=my-app
```

## What should I use instead of `defaultProject`?

Although the preferred project isn't the same for all teams or developers, it is still convenient to leave out the same project name for most task runs and generators.

As a viable replacement for the `defaultProject` setting, we can use [the `NX_DEFAULT_PROJECT` environment variable](https://nx.dev/reference/environment-variables) which is planned to outlive the `defaultProject` setting as we have many options for setting this in individual environments, both for CI and local development use cases.

When we set the value of the `NX_DEFAULT_PROJECT` environment variable to a project name, both task running and code generation works as if we had specified the `defaultProject` setting but without committing it to a shared configuration.

For example, with the `NX_DEFAULT_PROJECT` environment variable set to `my-app`, we can use the following build commands.

```powershell
# build the app
nx run build
# or
nx build

# build the app in production mode
nx run build:production
# or
nx build --configuration=production
```

Additionally, we can use generators and schematics that require a `--project` option witout specifying a project.

```powershell
nx generate @nx/angular:component button --standalone
# or
nx generate @schematics/angular:component button --standalone
```

## Conclusion

In this article, we learned that `defaultProject` is being deprecated and removed because it is no longer necessary for standalone Nx workspaces and in the case of integrated or package-based Nx workspaces, different teams and developers often want a different default project. Because of this, we shouldn't commit a shared setting.

We learned how the `defaultProject` setting affects the `nx run` command as well as Nx generators and Angular schematics that require a `--project` option.

Finally, we learned how we can use the `NX_DEFAULT_PROJECT` environment variable to configure an individual environment for CI tasks or local development in the same way as we would have used the `defaultProject` setting in the past but without committing a setting to a shared configuration.