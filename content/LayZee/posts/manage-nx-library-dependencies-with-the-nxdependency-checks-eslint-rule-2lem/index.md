---
{
title: "Manage Nx library dependencies with the @nx/dependency-checks ESLint rule",
published: "2023-07-06T21:56:24Z",
edited: "2025-08-20T22:18:47Z",
tags: ["nx", "eslint", "npm", "angular"],
description: "The `@nx/dependency-checks` ESLint rule is an invaluable tool in managing peer dependencies of a buildable or publishable Nx library.",
originalLink: "https://https://dev.to/playfulprogramming/manage-nx-library-dependencies-with-the-nxdependency-checks-eslint-rule-2lem",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

*Cover art by DALL-E.*

Nx 16.4 introduces the `@nx/dependency-checks` ESLint rule to the `@nx/linter` package for verifying, adding, removing, and updating `peerDependencies` in the `package.json` source configuration file of buildable or publishable Nx library projects.

> 💡 **Tip**
> Prefer at least Nx version 16.5 when using the `@nx/dependency-checks` lint rule. Significant bugs were patched in this version.

This is a replacement for the `updateBuildableProjectDepsInPackageJson` and `buildableProjectDepsInPackageJsonType` Nx build executor options so expect them to be deprecated. In fact, they are turned off by default in Nx 16.6 (but migrated to `true` for existing projects) and these options shouldn't be used for a project using the `@nx/dependency-checks` ESLint rule.

Let's start with instructions on adding the lint rule to a library project.

## Enabling @nx/dependency-checks in .eslintrc.json

To enable the `@nx/dependency-checks` ESLint rule in a buildable or publishable library project, open its `.eslintrc.json` ESLint configuration file and add the following settings to the `overrrides` array in the file.

```json
{
  "overrides": [
    {
      "files": ["{package,project}.json"],
      "parser": "jsonc-eslint-parser",
      "rules": {
        "@nx/dependency-checks": "error"
      }
    }
  ]
}
```

<figcaption>Excerpt of the <code>overrides</code> section of the project-specific <code>.eslintrc.json</code> file.</figcaption>

This enables the `@nx/dependency-checks` ESLint rule with default options.

> ℹ️ **Info**
> We do not have to install `json-eslint-parser` as a dependency in our workspace as it is a direct dependency of the `@nx/eslint-plugin` package, not a peer dependency.

The lint rule scans the project's `package.json` and `project.json` files. Because of this, we must also add these files to the lint file patterns in the `project.json` configuration file as described in the next section.

## Including configuration files in the lint target

To pass the `package.json` and `project.json` files to ESLint, we must add them to the `lintFilePatterns` option for the `@nx/linter:eslint` Nx executor as seen in the following code snippet.

```json
{
  "targets": {
    "lint": {
      "executor": "@nx/linter:eslint",
      "outputs": ["{options.outputFile}"],
      "options": {
        "lintFilePatterns": [
          "libs/ui-design-system/**/*.ts",
          "libs/ui-design-system/**/*.html",
          "libs/ui-design-system/package.json",
          "libs/ui-design-system/project.json"
        ]
      }
    }
  }
}
```

<figcaption>Excerpt of the <code>targets</code> section of the <code>project.json</code> file.</figcaption>

In addition to the existing lint file patterns, we add one listing the path of the project's `package.json` file and one listing the path of the `project.json` file, for example:

- `"libs/ui-design-system/package.json"`
- `"libs/ui-design-system/project.json"`

## Configuring @nx/dependency-checks options

The `@nx/dependency-checks` ESLint rule supports a range of options. Let's have a look at the default settings and then explore them all.

To match the default ESLint rule options, we add the following to the library project's `.eslintrc.json` ESLint configuration file.

```json
{
  "overrides": [
    {
      "files": ["{package,project}.json"],
      "parser": "jsonc-eslint-parser",
      "rules": {
        "@nx/dependency-checks": [
          "error",
          {
            "buildTargets": ["build"],
            "checkMissingDependencies": true,
            "checkObsoleteDependencies": true,
            "checkVersionMismatches": true,
            "ignoredDependencies": []
          }
        ]
      }
    }
  ]
}
```

<figcaption>Excerpt of the <code>overrides</code> section of the project-specific <code>.eslintrc.json</code> file.</figcaption>

### The buildTargets option

We use `buildTargets` to instruct the lint rule about the Nx target(s) that we use to build the library. This is used to determine the library's dependencies.

### The checkMissingDependencies option

This lint check determines the library's dependencies from its source code and compares it to the dependencies and peer dependencies listed in its `package.json` file.

As an example, we add the following Button Angular component to a library.

```typescript
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'myorg-button',
  imports: [MatButtonModule],
  template: `<button mat-button><ng-content /></button>`,
})
export class MyOrgButtonComponent {}
```

If we don't add `@angular/material` and its peer dependency `@angular/cdk` to the library's `package.json` file, we get lint errors like the following.

```
libs\ui-design-system\package.json
  4:3  error  The "ui-design-system" uses the package "@angular/material", but it is missing from the project's "package.json"  @nx/dependency-checks
  4:3  error  The "ui-design-system" uses the package "@angular/cdk", but it is missing from the project's "package.json"  @nx/dependency-checks
```

<figcaption>Example lint error output when the <code>checkMissingDependencies</code> option is enabled.</figcaption>

As long as our library doesnot directly depend on `@angular/cdk`, we can choose to ignore the detected `@angular/cdk` peer dependency as installing the `@angular/material` package should prompt consumers to install `@angular/cdk` as well. See how to ignore a detected dependency in the the section *The ignoredDependencies list*.

### The checkObsoleteDependencies option

Enable the `checkObsoleteDependencies` option to detect dependencies that are listed in the library's `package.json` file but are unused by its source code.

As an example, our `MyOrgButtonComponent` doesn't depend on `@angular/common` but it was added to the `peerDependencies` array of the library's `package.json` file by the `@nx/angular:library` generator. Since it is no longer a dependency, we get a lint error like the following.

```
libs\ui-design-system\package.json
  7:5  error  The "@angular/common" package is not used by "ui-design-system"  @nx/dependency-checks
```

<figcaption>Example lint error output when the <code>checkObsoleteDependencies</code> option is enabled.</figcaption>

On the other hand, we want to keep `tslib` in the `dependencies` section of the Angular library's `package.json` file so we must add it to the ´ignoredDependencies´ list as described in the *The ignoredDependencies list* section.

### The checkVersionMismatches option

The lint check enabled when the value of the `checkVersionMismatches` option is set to `true` verifies that the version range listed in the library's `package.json` file includes the version installed in the Nx workspace.

As an example, our Nx workspace uses Angular with the following version range listed in the `dependencies` array of the `package.json` file in the root of the workspace.

```json
{
  "dependencies": {
    "@angular/core": "~16.1.0",
  }
}
```

<figcaption>Excerpt of the <code>dependencies</code> section of the workspace-level <code>package.json</code> file.</figcaption>

The `package.json` file of our example Angular library has the following version range for `@angular/core`.

```json
{
  "peerDependencies": {
    "@angular/core": "^15.1.0"
  }
}
```

<figcaption>Excerpt of the <code>peerDependencies</code> section of the project's <code>package.json</code> file.</figcaption>

When we lint the library, we get a lint error like the following.

```
libs\ui-design-system\package.json
  6:5  error  The version specifier does not contain the installed version of "@angular/core" package: 16.1.3  @nx/dependency-checks
```

<figcaption>Example lint error output when the <code>checkVersionMismatches</code> option is enabled.</figcaption>

### The ignoredDependencies list

To exclude certain packages from the dependency checks, we add them to the `ignoredDependencies` array. This option does not support glob patterns.

For example, when we generate an Angular library, the Angular-specific classes use the `@angular/core` package which has a peer dependency on `zone.js` and `rxjs`. As long as our library don't have direct dependencies on these packages, we can choose to add them to the `ignoredDependencies` list as seen in the following code snippet.

```json
{
  "overrides": [
    {
      "files": ["{package,project}.json"],
      "parser": "jsonc-eslint-parser",
      "rules": {
        "@nx/dependency-checks": [
          "error",
          {
            "buildTargets": ["build"],
            "checkMissingDependencies": true,
            "checkObsoleteDependencies": true,
            "checkVersionMismatches": true,
            "ignoredDependencies": [
              "rxjs",
              "zone.js"
            ]
          }
        ]
      }
    }
  ]
}
```

<figcaption>Excerpt of the <code>overrides</code> section of the project-specific <code>.eslintrc.json</code> file.</figcaption>

In the section *The checkObsoleteDependencies option*, we said that we want to keep `tslib` in the `dependencies` section of the Angular library's `package.json` file. To do so, we must add it to the `ignoredDependencies` list as seen in the following code snippet.

```json
{
  "overrides": [
    {
      "files": ["{package,project}.json"],
      "parser": "jsonc-eslint-parser",
      "rules": {
        "@nx/dependency-checks": [
          "error",
          {
            "buildTargets": ["build"],
            "checkMissingDependencies": true,
            "checkObsoleteDependencies": true,
            "checkVersionMismatches": true,
            "ignoredDependencies": [
              "rxjs",
              "tslib",
              "zone.js"
            ]
          }
        ]
      }
    }
  ]
}
```

<figcaption>Excerpt of the <code>overrides</code> section of the project-specific <code>.eslintrc.json</code> file.</figcaption>

As described in the section *The checkMissingDependencies option*, we can choose to ignore the `@angular/cdk` peer dependency as well as long as our library has no direct dependency on `@angular/cdk`. Let's add it to the `ignoredDependencies`, keeping in mind that if we add an import statement targeting `@angular/cdk`, we must remove this package from the `ignoredDependencies` list again.

```json
{
  "overrides": [
    {
      "files": ["{package,project}.json"],
      "parser": "jsonc-eslint-parser",
      "rules": {
        "@nx/dependency-checks": [
          "error",
          {
            "buildTargets": ["build"],
            "checkMissingDependencies": true,
            "checkObsoleteDependencies": true,
            "checkVersionMismatches": true,
            "ignoredDependencies": [
              "@angular/cdk",
              "rxjs",
              "tslib",
              "zone.js"
            ]
          }
        ]
      }
    }
  ]
}
```

<figcaption>Excerpt of the <code>overrides</code> section of the project-specific <code>.eslintrc.json</code> file.</figcaption>

## @nx/dependency-checks lint fixers

Lint fixers are available for the following `@nx/dependency-checks` ESLint rule options.

- `checkMissingDependencies`
- `checkObsoleteDependencies`
- `checkVersionMismatches`

> ℹ️ **Info**
> The lint fixers for the `checkMissingDependencies` and `checkVersionMismatches` lint checks insert or replace version ranges in the Nx library's `package.json` file with the ones listed in the Nx workspace's root-level `package.json` file. This usually works well with buildable libraries but make sure to verify version ranges for publishable libraries.

The lint fixer for the `checkMissingDependencies` ESLint rule option adds dependencies to the `peerDependencies` or `dependencies` section of the library's `package.json` file, depending on which section is declared first.

## Ignoring test-setup.ts and similar files

The `@nx/dependency-checks` ESLint rule detects dependencies in files like `test-setup.ts` that are in the `sourceRoot` of a project. When using `create-nx-workspace` version 16.5 or newer, the solution for this is already set up for us. In existing Nx workspaces, we either run the `add-test-setup-to-inputs-ignore` Nx migration from the `@nx/jest` package or manually add the pattern `"!{projectRoot}/src/test-setup.[jt]s"` to `nx.json#namedInputs.production` as seen in the following code snippet.

```json
{
  "namedInputs": {
    "production": [
      "default",
      "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
      "!{projectRoot}/tsconfig.spec.json",
      "!{projectRoot}/jest.config.[jt]s",
      "!{projectRoot}/src/test-setup.[jt]s",
      "!{projectRoot}/.eslintrc.json"
    ]
  }
}
```

<figcaption>Excerpt of the <code>namedInputs</code> section of the <code>nx.json</code> file.</figcaption>

As you can see in the previous code snippet, `jest.config.js` and `jest.config.ts` are also ignored.

## Conclusion

The `@nx/dependency-checks` ESLint rule introduced to the `@nx/linter` package in version 16.4 is an invaluable tool in managing peer dependencies of a buildable or publishable Nx library.

Its built-in lint fixers is a semi-automated way of resolving peer dependency issues in the `package.json` source configuration file of a library. Library dependencies are detected based on the library's source code.

This ESLint rule is a replacement for the `updateBuildableProjectDepsInPackageJson` and `buildableProjectDepsInPackageJsonType` Nx build executor options.
