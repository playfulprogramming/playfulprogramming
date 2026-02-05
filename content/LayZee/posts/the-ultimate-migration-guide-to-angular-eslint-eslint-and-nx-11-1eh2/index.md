---
{
title: "The ultimate migration guide to angular-eslint, ESLint and Nx 11",
published: "2020-12-13T23:30:20Z",
edited: "2021-04-22T20:04:51Z",
tags: ["angular", "nx", "eslint"],
description: "How to set up a new Nx workspace using angular-eslint or migrate an existing Nx workspace from ESLint or TSLint.",
originalLink: "https://dev.to/this-is-angular/the-ultimate-migration-guide-to-angular-eslint-eslint-and-nx-11-1eh2",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

*Cover photo by [Anastasia Taioglou](https://unsplash.com/photos/CTivHyiTbFw) on Unsplash.*

*Updated to Nx version 11.0.18.*

Nx version 11 has built-in support for Angular version 11 and ESLint using Nx and [angular-eslint](https://github.com/angular-eslint/angular-eslint) plugins which add Angular-specific lint rules and component template processing.

Let's explore different workspace configurations and discuss a few caveats. This guide includes options to use NPM, PNPM, or Yarn, Jest or Karma, as well as Cypress or Protractor. It includes guides both for setting up new Nx workspaces but also for migrating existing Nx workspaces that are either using ESLint or TSLint.

> Note that as of Nx 11, generation schematics are known as *generators*, builders are known as *executors*, and architect targets are known as *targets*.

# Table of contents

- [Prerequisites](#prerequisites)
- [Setting up a new Nx Angular workspace with angular-eslint](#setting-up-a-new-nx-angular-workspace-with-angulareslint)
  - [Option 1: Use the empty workspace preset](#option-1-use-the-empty-workspace-preset)
  - [Option 2: Use the angular workspace preset](#option-2-use-the-angular-workspace-preset)
- [Migrating an existing Nx 10 Angular workspace using ESLint](#migrating-an-existing-nx-10-angular-workspace-using-eslint)
- [Migrating an existing Nx 10 Angular workspace using TSLint](#migrating-an-existing-nx-10-angular-workspace-using-tslint)
- [Conclusion](#conclusion)
  - [Acknowledgements](#acknowledgements)

# Prerequisites {#prerequisites}

1. It's recommended to use Node.js 12 for Nx 11.
2. This guide assumes that Nx CLI version 11.x is installed globally.
3. Install Angular CLI version 11.x globally just in case.

# Setting up a new Nx Angular workspace with angular-eslint {#setting-up-a-new-nx-angular-workspace-with-angulareslint}

In this use case, we create a new Nx workspace. We can either use the `empty` workspace preset or the `angular` workspace preset.

## Option 1: Use the empty workspace preset {#option-1-use-the-empty-workspace-preset}

Using the `empty` workspace preset, we use `workspace.json` version 2 which is compatible with Nx plugins targeting Nx 11 or later.

1. Generate an Nx workspace.
   First, let's create a minimal Nx workspace.

   Using NPM CLI:

   ```
   npm init nx-workspace nrwl-airlines --npm-scope=nrwl-airlines --preset=empty --no-nx-cloud --package-manager=npm
   ```

   Using PNPM CLI:

   ```
   pnpm init nx-workspace nrwl-airlines --npm-scope=nrwl-airlines --preset=empty --no-nx-cloud --package-manager=pnpm
   ```

   Using Yarn CLI:

   ```
   yarn create nx-workspace nrwl-airlines --npm-scope=nrwl-airlines --preset=empty --no-nx-cloud --package-manager=yarn
   ```

2. Set base branch for `affected` commands.
   If you've been keeping up in 2020, the default branch of your Git repository is `main`. However, as of Nx version 11.0.18, the base branch for comparison is still set to `master`, regardless of your default Git settings.

   Using `main` default branch:

   ```
   npx json -I -f nx.json -e "this.affected.defaultBase = 'main';"
   ```

3. Delete TSLint.
   Nx includes TSlint by default. Now that it's fully end-of-life, it's time to move on. Delete the `tslint` package.

   Using NPM CLI:

   ```
   npm uninstall tslint
   ```

   Using Yarn CLI:

   ```
   yarn remove tslint
   ```

   Alternatively, use the following `preinstall` script to permanently remove Codelyzer and TSLint despite generators trying to add them back.

   Using NPM CLI:

   ```
   npx json -I -f package.json -e "this.scripts.preinstall = '(npm uninstall codelyzer || echo ✅ Codelyzer is already removed.) && (npm uninstall tslint || echo ✅ TSLint is already removed.)';"
   npm install
   ```

   Using PNPM CLI:

   ```
   npx json -I -f package.json -e "this.scripts.preinstall = '(pnpm remove codelyzer || echo ✅ Codelyzer is already removed.) && (pnpm remove tslint || echo ✅ TSLint is already removed.)';"
   pnpm install
   ```

   Using Yarn CLI:

   ```
   npx json -I -f package.json -e "this.scripts.preinstall = '(yarn remove codelyzer || echo ✅ Codelyzer is already removed.) && (yarn remove tslint || echo ✅ TSLint is already removed.)';"
   yarn install
   ```

4. Install and initialize the `@nrwl/angular` package.
   To be able to generate Angular projects, configurations, and classes, we need to install the `@nrwl/angular` package.

   Using NPM CLI:

   ```
   npm install @nrwl/angular
   nx generate @nrwl/angular:init
   ```

   Using PNPM CLI:

   ```
   pnpm add @nrwl/angular
   nx generate @nrwl/angular:init
   ```

   Using Yarn CLI:

   ```
   yarn add @nrwl/angular
   nx generate @nrwl/angular:init
   ```

5. Enable Angular strict mode.
   We prefer strict configurations for TypeScript and Angular. We enable strict mode for Angular application and library projects.

   ```
   npx json -I -f workspace.json -e "this.generators['@nrwl/angular:application'].strict = true;"
   npx json -I -f workspace.json -e "this.generators['@nrwl/angular:library'].strict = true;"
   ```

6. Use ESLint as linter.
   We configure ESLint as the default linter for all Angular application and library projects. This includes the angular-eslint plugins.

   ```
   npx json -I -f workspace.json -e "this.generators['@nrwl/angular:application'].linter = 'eslint';"
   npx json -I -f workspace.json -e "this.generators['@nrwl/angular:library'].linter = 'eslint';"
   ```

7. Configure unit test runner.
   Nx has built-in support for the Jest and Karma testing frameworks for Angular application and library projects.

   Use Jest:

   ```
   npx json -I -f workspace.json -e "this.generators['@nrwl/angular:application'].unitTestRunner = 'jest';"
   npx json -I -f workspace.json -e "this.generators['@nrwl/angular:library'].unitTestRunner = 'jest';"
   ```

   Use Karma:

   ```
   npx json -I -f workspace.json -e "this.generators['@nrwl/angular:application'].unitTestRunner = 'karma';"
   npx json -I -f workspace.json -e "this.generators['@nrwl/angular:library'].unitTestRunner = 'karma';"
   ```

8. Configure end-to-end test runner.
   Nx has built-in support for the Cypress and Protractor end-to-end testing frameworks for Angular application projects.

   Use Cypress:

   ```
   npx json -I -f workspace.json -e "this.generators['@nrwl/angular:application'].e2eTestRunner = 'cypress';"
   ```

   Use Protractor:

   ```
   npx json -I -f workspace.json -e "this.generators['@nrwl/angular:application'].e2eTestRunner = 'protractor';"
   ```

9. Generate an Angular application project.
   Because of our generators configuration, Angular application and library projects will be generated using ESLint and angular-eslint.

   ```
   nx generate @nrwl/angular:application --name=booking-app --prefix=booking --tags="type:app,scope:booking" --no-interactive
   ```

   We should also add project tags to the generated end-to-end testing project.

   ```
   npx json -I -f nx.json -e "this.projects['booking-app-e2e'].tags = ['type:e2e','scope:booking'];"
   ```

10. Use strict Angular build budgets.
    As of Nx version 11.0.18, the Angular build budgets do not adjust according to Angular strict mode. Let's use the same limits as Angular CLI 11 strict mode.

    The main bundle is set to warn at 500 KB and fail at 1 MB. Component styles are set to warn at 2 KB and fail at 4 KB.

    ```
    npx json -I -f workspace.json -e "this.projects['booking-app'].targets.build.configurations.production.budgets = [{ type: 'initial', maximumWarning: '500kb', maximumError: '1mb' }, { type: 'anyComponentStyle', maximumWarning: '2kb', maximumError: '4kb' }];"
    ```

11. Delete Codelyzer.
    Angular CLI version 11 includes Codelyzer by default when generating a workspace or an Angular application project. Now that TSlint is fully end-of-life, it's time to move on. Delete the `codelyzer` package.

    Using NPM CLI:

    ```
    npm uninstall codelyzer
    ```

    Using PNPM CLI:

    ```
    pnpm remove codelyzer
    ```

    Using Yarn CLI:

    ```
    yarn remove codelyzer
    ```

12. Generate an Angular workspace library.
    To make sure that our configurations also work for Angular libraries, we create a workspace library.

    ```
    nx generate @nrwl/angular:library feature-flight-search --directory=booking --prefix=booking --tags="type:feature,scope:booking" --buildable --enable-ivy --no-interactive
    ```

    We make good use of Nx 11's enhanced incremental Angular build and serve with computation caching by making the workspace library buildable (but not publishable) and Ivy-compiled.

13. Verify that linting works.
    Run the `lint` target on all projects to verify that ESLint with angular-eslint works.

    ```
    nx run-many --target=lint --all
    ```

We have now created an Nx workspace with an Angular application project and an Angular library workspace project. By using the `empty` workspace preset, we use version 2 of the Nx workspace configuration which uses the terms *executors*, *generators*, and *targets*.

In `workspace.json` we can verify that the `lint` targets use the `@nrwl/linter:eslint` executor.

The base `.eslintrc.json` configuration should mention the `@nrwl/nx/typescript` ESLint plugin. Open the `.eslintrc.json` files in the Angular application and library projects to verify that the `@nrwl/nx/angular`, `@nrwl/nx/angular-template`, and `@angular-eslint/template/process-inline-templates` ESLint plugins are enabled.

## Option 2: Use the angular workspace preset {#option-2-use-the-angular-workspace-preset}

As of Nx version 11.0.18, the `angular` workspace preset generates the initial Angular application project with angular-eslint, but generates the initial application and end-to-end testing projects without taking these parameters into account:

- `create-application`
- `e2e-test-runner`
- `no-interactive`
- `strict`
- `tags`
- `unit-test-runner`

and the `--linter` parameter is broken, always giving this error message:

```
>  NX   ERROR  Invalid linter

  It must be one of the following:

  eslint
  tslint
```

but ESLint with angular-eslint is the default linter.

Because of this, we have to delete the initial projects if we don't want the defaults, configure schematics and regenerate the Angular application and end-to-end testing projects.

1. Generate an Nx Angular workspace.

   Using NPM CLI:

   ```
   npm init nx-workspace nrwl-airlines --npm-scope=nrwl-airlines --preset=angular --app-name=booking-app --linter=eslint --no-nx-cloud --style=css --package-manager=npm
   ```

   Using PNPM CLI:

   ```
   pnpm init nx-workspace nrwl-airlines --npm-scope=nrwl-airlines --preset=angular --app-name=booking-app --linter=eslint --no-nx-cloud --style=css --package-manager=pnpm
   ```

   Using Yarn CLI:

   ```
   yarn create nx-workspace nrwl-airlines --npm-scope=nrwl-airlines --preset=angular --app-name=booking-app --linter=eslint --no-nx-cloud --style=css --package-manager=yarn
   ```

2. Set base branch for `affected` commands.
   If you've been keeping up in 2020, the default branch of your Git repository is `main`. However, as of Nx version 11.0.18, the base branch for comparison is still set to `master`, regardless of your default Git settings.

   Using `main` default branch:

   ```
   npx json -I -f nx.json -e "this.affected.defaultBase = 'main';"
   ```

3. Delete Codelyzer and TSlint.
   Nx version 11 includes Codelyzer by default when using the `angular` workspace preset. Now that TSlint is fully end-of-life, it's time to move on. Delete the `codelyzer` and `tslint` packages.

   Using NPM CLI:

   ```
   npm uninstall codelyzer tslint
   ```

   Using PNPM CLI:

   ```
   pnpm remove codelyzer tslint
   ```

   Using Yarn CLI:

   ```
   yarn remove codelyzer tslint
   ```

   Alternatively, use the following `preinstall` script to permanently remove Codelyzer and TSLint despite generators trying to add them back.

   Using NPM CLI:

   ```
   npx json -I -f package.json -e "this.scripts.preinstall = '(npm uninstall codelyzer || echo ✅ Codelyzer is already removed.) && (npm uninstall tslint || echo ✅ TSLint is already removed.)';"
   npm install
   ```

   Using PNPM CLI:

   ```
   npx json -I -f package.json -e "this.scripts.preinstall = '(pnpm remove codelyzer || echo ✅ Codelyzer is already removed.) && (pnpm remove tslint || echo ✅ TSLint is already removed.)';"
   pnpm install
   ```

   Using Yarn CLI:

   ```
   npx json -I -f package.json -e "this.scripts.preinstall = '(yarn remove codelyzer || echo ✅ Codelyzer is already removed.) && (yarn remove tslint || echo ✅ TSLint is already removed.)';"
   yarn install
   ```

4. Enable Angular strict mode.
   We prefer strict configurations for TypeScript and Angular. We enable strict mode for Angular application and library projects.

   ```
   npx json -I -f angular.json -e "this.schematics['@nrwl/angular:application'].strict = true;"
   npx json -I -f angular.json -e "this.schematics['@nrwl/angular:library'].strict = true;"
   ```

5. Configure unit test runner.
   Nx has built-in support for the Jest and Karma testing frameworks for Angular application and library projects.

   Use Jest:

   ```
   npx json -I -f angular.json -e "this.schematics['@nrwl/angular:application'].unitTestRunner = 'jest';"
   npx json -I -f angular.json -e "this.schematics['@nrwl/angular:library'].unitTestRunner = 'jest';"
   ```

   Use Karma:

   ```
   npx json -I -f angular.json -e "this.schematics['@nrwl/angular:application'].unitTestRunner = 'karma';"
   npx json -I -f angular.json -e "this.schematics['@nrwl/angular:library'].unitTestRunner = 'karma';"
   ```

6. Configure end-to-end test runner.
   Nx has built-in support for the Cypress and Protractor end-to-end testing frameworks for Angular application projects.

   Use Cypress:

   ```
   npx json -I -f angular.json -e "this.schematics['@nrwl/angular'].application.e2eTestRunner = 'cypress';"
   ```

   Use Protractor:

   ```
   npx json -I -f angular.json -e "this.schematics['@nrwl/angular'].application.e2eTestRunner = 'protractor';"
   ```

7. Consolidate schematics configurations.
   As of Nx version 11.0.18, passing `--preset=angular --linter=eslint` to create-nx-workspace creates duplicate entries for Angular application and library schematics defaults in `angular.json`. This will prevent the configuration from working. Let's fix this.

   Consolidate Angular application schematic configuration:

   ```
   npx json -I -f angular.json -e "this.schematics['@nrwl/angular:application'].linter = this.schematics['@nrwl/angular'].application.linter; delete this.schematics['@nrwl/angular'].application;"
   ```

   Consolidate Angular library schematic configuration:

   ```
   npx json -I -f angular.json -e "this.schematics['@nrwl/angular:library'].linter = this.schematics['@nrwl/angular'].library.linter; delete this.schematics['@nrwl/angular'].library;"
   ```

8. Regenerate application and end-to-end testing projects if using non-default test runners.
   If we configured Karma and Protractor instead of Jest and Cypress, we have to delete and regenerate the application and end-to-end testing projects.

   Delete end-to-end testing and application projects:

   ```
   nx generate @nrwl/workspace:remove booking-app-e2e
   nx generate @nrwl/workspace:remove booking-app
   ```

   Generate application and end-to-end testing projects:

   ```
   nx generate @nrwl/angular:application --name=booking-app --prefix=booking --no-interactive
   ```

   Delete root-level Jest configurations:

   ```
   rm jest.config.js
   rm jest.preset.js
   ```

9. Tag projects.

   Let's add project tags to the generated application and end-to-end testing projects.

   ```
   npx json -I -f nx.json -e "this.projects['booking-app'].tags = ['type:app','scope:booking'];"
   npx json -I -f nx.json -e "this.projects['booking-app-e2e'].tags = ['type:e2e','scope:booking'];"
   ```

10. Use strict Angular build budgets.
    As of Nx version 11.0.18, the Angular build budgets do not adjust according to Angular strict mode. Let's use the same limits as Angular CLI 11 strict mode.

    The main bundle is set to warn at 500 KB and fail at 1 MB. Component styles are set to warn at 2 KB and fail at 4 KB.

    ```
    npx json -I -f angular.json -e "this.projects['booking-app'].architect.build.configurations.production.budgets = [{ type: 'initial', maximumWarning: '500kb', maximumError: '1mb' }, { type: 'anyComponentStyle', maximumWarning: '2kb', maximumError: '4kb' }];"
    ```

11. Generate an Angular workspace library.
    To make sure that our configurations work for Angular libraries, we create a workspace library.

    ```
    nx generate @nrwl/angular:library --name=feature-flight-search --directory=booking --prefix=booking --tags="type:feature,scope:booking" --buildable --enable-ivy --no-interactive
    ```

    We make good use of Nx 11's enhanced incremental Angular build and serve with computation caching by making the workspace library buildable (but not publishable) and Ivy-compiled.

12. Delete Codelyzer.
    Angular CLI version 11 includes Codelyzer by default when generating a workspace or an Angular application project, so we have to delete it again.
    Using NPM CLI:

    ```
    npm uninstall codelyzer
    ```

    Using PNPM CLI:

    ```
    pnpm remove codelyzer
    ```

    Using Yarn CLI:

    ```
    yarn remove codelyzer
    ```

13. Verify that linting works.
    Run the `lint` target on all projects to verify that ESLint with angular-eslint works.

    ```
    nx run-many --target=lint --all
    ```

We have now created an Nx workspace with an Angular application project and an Angular library workspace project. By using the `angular` workspace preset, we use version 1 of the Nx workspace configuration which is exactly the same as what Angular CLI uses. It still uses the terms *builders*, *schematics*, and *architect targets*.

In `angular.json` we can verify that the `lint` targets use the `@nrwl/linter:eslint` executor.

The base `.eslintrc.json` configuration should mention the `@nrwl/nx/typescript` ESLint plugin. Open the `.eslintrc.json` files in the Angular application and library projects to verify that the `@nrwl/nx/angular`, `@nrwl/nx/angular-template`, and `@angular-eslint/template/process-inline-templates` ESLint plugins are enabled.

# Migrating an existing Nx 10 Angular workspace using ESLint {#migrating-an-existing-nx-10-angular-workspace-using-eslint}

When migrating to Nx 11, existing projects using ESLint will be migrated to include angular-eslint.

1. Create Nx 10 workspace with `angular` preset.
   For demonstration purposes, we generate a new Nx Angular workspace with a single application.

   Using NPM CLI:

   ```
   npm init nx-workspace@10 nrwl-airlines --npm-scope=nrwl-airlines --preset=angular --app-name=booking-app --strict --no-nx-cloud --style=css --package-manager=npm --linter=eslint
   ```

   Using PNPM CLI:

   ```
   pnpm init nx-workspace@10 nrwl-airlines --npm-scope=nrwl-airlines --preset=angular --app-name=booking-app --strict --no-nx-cloud --style=css --package-manager=pnpm --linter=eslint
   ```

   > Note that PNPM is only supported from Nx version 11 forward.

   Using Yarn CLI:

   ```
   yarn global add create-nx-workspace@10
   create-nx-workspace nrwl-airlines --npm-scope=nrwl-airlines --preset=angular --app-name=booking-app --strict --no-nx-cloud --style=css --package-manager=yarn --linter=eslint
   ```

2. Delete Codelyzer and TSLint.
   Nx includes Codelyzer and TSlint by default. Now that TSLint's fully end-of-life, it's time to move on. Delete the `codelyzer` and `tslint` packages.

   Using NPM CLI:

   ```
   npm uninstall codelyzer tslint
   ```

   Using Yarn CLI:

   ```
   yarn remove codelyzer tslint
   ```

   Alternatively, use the following `preinstall` script to permanently remove Codelyzer and TSLint despite generators trying to add them back.

   Using NPM CLI:

   ```
   npx json -I -f package.json -e "this.scripts.preinstall = '(npm uninstall codelyzer || echo ✅ Codelyzer is already removed.) && (npm uninstall tslint || echo ✅ TSLint is already removed.)';"
   npm install
   ```

   Using PNPM CLI:

   ```
   npx json -I -f package.json -e "this.scripts.preinstall = '(pnpm remove codelyzer || echo ✅ Codelyzer is already removed.) && (pnpm remove tslint || echo ✅ TSLint is already removed.)';"
   pnpm install
   ```

   Using Yarn CLI:

   ```
   npx json -I -f package.json -e "this.scripts.preinstall = '(yarn remove codelyzer || echo ✅ Codelyzer is already removed.) && (yarn remove tslint || echo ✅ TSLint is already removed.)';"
   yarn install
   ```

3. Consolidate schematics configurations.
   As of Nx version 11.0.18, passing `--preset=angular --linter=eslint` to create-nx-workspace creates duplicate entries for Angular application and library schematics defaults in `angular.json`. This will prevent the configuration from working. Let's fix this.

   Consolidate Angular application schematic configuration:

   ```
   npx json -I -f angular.json -e "this.schematics['@nrwl/angular:application'].linter = this.schematics['@nrwl/angular'].application.linter; delete this.schematics['@nrwl/angular'].application;"
   ```

   Consolidate Angular library schematic configuration:

   ```
   npx json -I -f angular.json -e "this.schematics['@nrwl/angular:library'].linter = this.schematics['@nrwl/angular'].library.linter; delete this.schematics['@nrwl/angular'].library;"
   ```

4. Generate an Angular workspace library.
   To have a slightly more realistic example, we also generate an Angular workspace library project.

   ```
   nx generate @nrwl/angular:library feature-flight-search --directory=booking --prefix=booking --tags="type:feature,scope:booking" --buildable --no-interactive
   ```

5. Delete Codelyzer.
   Angular CLI version 11 includes Codelyzer by default when generating a workspace or an Angular application project, so we have to delete it again.

   Using NPM CLI:

   ```
   npm uninstall codelyzer
   ```

   Using Yarn CLI:

   ```
   yarn remove codelyzer
   ```

6. Migrate to Nx 11.
   When updating to Nx 11, workspaces using ESLint will be migrated to also use angular-eslint.

   Using NPM CLI:

   ```
   nx migrate @nrwl/workspace
   npm install

   # Good point in time to review migrations.json and make a commit before applying selected migrations
   nx migrate --run-migrations=migrations.json
   npm install
   rm migrations.json
   ```

   Using PNPM CLI:

   ```
   nx migrate @nrwl/workspace
   pnpm install

   # Good point in time to review migrations.json and make a commit before applying selected migrations
   nx migrate --run-migrations=migrations.json
   pnpm install
   rm migrations.json
   ```

   Using Yarn CLI:

   ```
   nx migrate @nrwl/workspace
   yarn install

   # Good point in time to review migrations.json and make a commit before applying selected migrations
   nx migrate --run-migrations=migrations.json
   yarn install
   rm migrations.json
   ```

7. Verify that linting works.
   Run the `lint` target on all projects to verify that ESLint with angular-eslint works.

   ```
   nx run-many --target=lint --all
   ```

8. Update angular-eslint.
   As of Nx version 11.0.18, angular-eslint version 0.8.0-beta.1 is installed. Let's update it to the latest version.

   Using NPM CLI:

   ```
   npm install --save-dev @angular-eslint/eslint-plugin@latest @angular-eslint/eslint-plugin-template@latest @angular-eslint/template-parser@latest
   ```

   Using PNPM CLI:

   ```
   pnpm add --save-dev @angular-eslint/eslint-plugin@latest @angular-eslint/eslint-plugin-template@latest @angular-eslint/template-parser@latest
   ```

   Using Yarn CLI:

   ```
   yarn add @angular-eslint/eslint-plugin@latest @angular-eslint/eslint-plugin-template@latest @angular-eslint/template-parser@latest
   ```

9. Verify that linting works.
   Run the `lint` target on all projects to verify that ESLint with angular-eslint works with the latest version.

   ```
   nx run-many --target=lint --all
   ```

# Migrating an existing Nx 10 Angular workspace using TSLint {#migrating-an-existing-nx-10-angular-workspace-using-tslint}

As of Nx version 11.0.18, Nx hasn't got schematics for Nx Angular workspaces using TSLint to migrate to ESLint with angular-eslint.

Instead, we will use angular-eslint's TSLint to ESLint migration schematics and perform some manual configurations to match that of a fully migrated Nx Angular workspace using ESLint with angular-eslint.

For this example, we will use Nx' default test runners for the `angular` workspace preset. Currently, this means Cypress and Jest. For Protractor and Karma, only the configuration for the end-to-end test project will differ. Consider generating a new Nx workspace with Karma, Protractor, and ESLint as described elsehwere in this article to compare ESLint configurations.

> Note that the `angular` preset used in this guide uses `angular.json`. The angular-eslint migrations do not work for Nx workspaces using `workspace.json`.

1. Create an Nx 10 workspace using the `angular` preset.
   First we create a new Nx 10 workspace as an example. If you already have an existing workspace, adjust the following migration steps to your own workspace.

   Using NPM CLI:

   ```
   npm init nx-workspace@10 nrwl-airlines --npm-scope=nrwl-airlines --preset=angular --app-name=booking-app --strict --no-nx-cloud --style=css --package-manager=npm --linter=tslint
   ```

   Using PNPM CLI:

   ```
   pnpx create-nx-workspace@10 nrwl-airlines --npm-scope=nrwl-airlines --preset=angular --app-name=booking-app --strict --no-nx-cloud --style=css --package-manager=pnpm --linter=tslint
   ```

   > Note that PNPM is only supported from Nx version 11 forward.

   Using Yarn CLI:

   ```
   yarn global add create-nx-workspace@10
   create-nx-workspace nrwl-airlines --npm-scope=nrwl-airlines --preset=angular --app-name=booking-app --strict --no-nx-cloud --style=css --package-manager=yarn --linter=tslint
   ```

2. Generate an Angular workspace library.
   This libary project is also for demonstration purposes. This step is not needed if you have an existing Nx workspace.

   ```
   nx generate @nrwl/angular:library --name=feature-flight-search --directory=booking --prefix=booking --tags="type:feature,scope:booking" --buildable --no-interactive
   ```

3. Migrate to Nx 11.
   This is actually an optional step. All of the following steps work exactly the same for Nx 10.

   Using NPM CLI:

   ```
   nx migrate @nrwl/workspace
   npm install

   # Good point in time to review migrations.json and make a commit before applying selected migrations
   nx migrate --run-migrations=migrations.json
   npm install
   rm migrations.json
   ```

   Using PNPM CLI:

   ```
   nx migrate @nrwl/workspace
   pnpm install

   # Good point in time to review migrations.json and make a commit before applying selected migrations
   nx migrate --run-migrations=migrations.json
   pnpm install
   rm migrations.json
   ```

   Using Yarn CLI:

   ```
   nx migrate @nrwl/workspace
   yarn install

   # Good point in time to review migrations.json and make a commit before applying selected migrations
   nx migrate --run-migrations=migrations.json
   yarn install
   rm migrations.json
   ```

4. Migrate to angular-eslint.
   First, we temporarily rename `tsconfig.base.json` to `tsconfig.json` because the angular-eslint migrations aren't configured for solution-style TypeScript configurations which Nx uses since version 10.0.

   ```
   mv tsconfig.base.json tsconfig.json
   ```

   Now we run angular-eslint schematics to install necessary development dependencies such as `eslint-plugin-*`, `@angular-eslint/*`, and `@typescript-eslint/*` packages.

   Using NPM CLI:

   ```
   npm install --save-dev @angular-eslint/schematics
   nx generate @angular-eslint/schematics:ng-add
   ```

   Using PNPM CLI:

   ```
   pnpm add --save-dev @angular-eslint/schematics
   nx generate @angular-eslint/schematics:ng-add
   ```

   Using Yarn CLI:

   ```
   yarn add @angular-eslint/schematics
   nx generate @angular-eslint/schematics:ng-add
   ```

   This might downgrade the version of `eslint` already installed by Nx. If this happens, make sure to keep the version installed by Nx. For example the following

   Using NPM CLI:

   ```
   npm install --save-dev eslint@7.10.0
   ```

   Using PNPM CLI:

   ```
   pnpm add --save-dev eslint@7.10.0
   ```

   Using Yarn CLI:

   ```
   yarn add eslint@7.10.0
   ```

   Next, we run angular-eslint's TSLint to ESLint generator for each Angular application and library project in our workspace.

   In this step, you might see warnings like the following, depending on your TSLint rules:

   ```
   WARNING: Within "tslint.json", the following 1 rule(s) did not have known converters in https://github.com/typescript-eslint/tslint-to-eslint-config

     - nx-enforce-module-boundaries

   You will need to decide on how to handle the above manually, but everything else has been handled for you automatically.
   ```

   In the case of the `nx-enforce-module-boundaries` rule which is the only rule giving us warnings when using the example workspace generated by these steps, don't worry about them as we'll keep our root TSLint configuration file until the very last step. These are the lint rules used by the `nx workspace-lint` command.

   For ESLint, this rule is called `@nrwl/nx/enforce-module-boundaries` and we will add it to our root ESLint configuration in one of the following steps.

   Either run the generator manually for each project:

   ```
   # Migrate booking-app rules to angular-eslint
   nx generate @angular-eslint/schematics:convert-tslint-to-eslint booking-app

   # Migrate booking-app-e2e rules to angular-eslint
   nx generate @angular-eslint/schematics:convert-tslint-to-eslint booking-app-e2e

   # Migrate booking-feature-flight-search rules to angular-eslint
   nx generate @angular-eslint/schematics:convert-tslint-to-eslint booking-feature-flight-search
   ```

   or loop over the project names in `angular.json` and run the generator for each project in a script.

   Script using PowerShell:

   ```powershell
   foreach ($project in (Get-Content angular.json | ConvertFrom-Json -AsHashtable).projects.GetEnumerator()) { nx generate @angular-eslint/schematics:convert-tslint-to-eslint $project.Name }
   ```

   Script using Bash:

   ```bash
   for project in $(cat angular.json | npx json projects | npx json -M -a key); do nx generate @angular-eslint/schematics:convert-tslint-to-eslint $project; done
   ```

   Finally, we revert the temporary renaming of `tsconfig.base.json`.

   ```
   mv tsconfig.json tsconfig.base.json
   ```

5. Configure angular-eslint for Nx workspace.

   First, we remove unnecessary development dependencies.

   Using NPM CLI:

   ```
   npm uninstall @angular-eslint/builder @angular-eslint/schematics
   ```

   Using PNPM CLI:

   ```
   pnpm remove @angular-eslint/builder @angular-eslint/schematics
   ```

   Using Yarn CLI:

   ```
   yarn remove @angular-eslint/builder @angular-eslint/schematics
   ```

   Then we add required development dependencies.

   Using NPM CLI:

   ```
   npm install --save-dev @nrwl/eslint-plugin-nx eslint-config-prettier eslint-plugin-cypress
   ```

   Using PNPM CLI:

   ```
   pnpm add --save-dev @nrwl/eslint-plugin-nx eslint-config-prettier eslint-plugin-cypress
   ```

   Using Yarn CLI:

   ```
   yarn add --dev @nrwl/eslint-plugin-nx eslint-config-prettier eslint-plugin-cypress
   ```

   Next, we configure the root ESLint configuration.

   ```
   # Ignore all files not matched in overrides
   npx json -I -f .eslintrc.json -e "this.ignorePatterns = ['**/*'];"

   # Support ESLint plugins from `@nrwl/eslint-plugin-nx`
   npx json -I -f .eslintrc.json -e "this.plugins = ['@nrwl/nx'];"

   # Include tsx files
   # Can be left out from an Angular-only workspace
   npx json -I -f .eslintrc.json -e "this.overrides[0].files = ['*.ts', '*.tsx'];"

   # Match all TypeScript project configuration files
   npx json -I -f .eslintrc.json -e "this.overrides[0].parserOptions.project = './tsconfig.*?.json';"

   # This setting is not used by the Nrwl Linter
   npx json -I -f .eslintrc.json -e "delete this.overrides[0].parserOptions.createDefaultProgram;"

   # Replace angular-eslint plugins with the Nx TypeScript ESLint plugin as it uses them internally
   npx json -I -f .eslintrc.json -e "this.overrides[0].extends = ['plugin:@nrwl/nx/typescript'];"

   # Remove component template rule as this is defined in project-specific ESLint configurations
   npx json -I -f .eslintrc.json -e "this.overrides = this.overrides.slice(0, 1);"

   # Use Nx JavaScript ESLint plugin for js and jsx files
   # Can be left out from an Angular-only workspace
   npx json -I -f .eslintrc.json -e "this.overrides = [...this.overrides, { files: ['*.js', '*.jsx'], extends: ['plugin:@nrwl/nx/javascript'], rules: {} }];"

   # Remove angular-eslint rules that are added to project-specific ESLint configurations
   npx json -I -f .eslintrc.json -e "delete this.overrides[0].rules['@angular-eslint/component-selector'];"
   npx json -I -f .eslintrc.json -e "delete this.overrides[0].rules['@angular-eslint/directive-selector'];"
   ```

   The final change for the root ESLint configuration is to apply our workspace lint rules (and any other rules angular-eslint warned you about).

   ```
   # This is where we configure the workspace lint rules
   # Refer to the root TSLint configuration
   npx json -I -f .eslintrc.json -e "this.overrides = [{ files: ['*.ts', '*.tsx', '*.js', '*.jsx'], rules: { '@nrwl/nx/enforce-module-boundaries': ['error', { enforceBuildableLibDependency: true, allow: [], depConstraints: [{ sourceTag: '*', onlyDependOnLibsWithTags: ['*'] }] }] } }, ...this.overrides];"
   ```

   Now it's time to configure the per-project ESLint configurations. Let's start with the `booking-app` project.

   ```
   # Add Nx Angular ESLint plugin and the ESLint inline component template processor
   npx json -I -f apps/booking-app/.eslintrc.json -e "this.overrides[0].extends = ['plugin:@nrwl/nx/angular', 'plugin:@angular-eslint/template/process-inline-templates'];"

   # Match all TypeScript project configuration files
   npx json -I -f apps/booking-app/.eslintrc.json -e "this.overrides[0].parserOptions.project = [this.overrides[0].parserOptions.project[0].replace('/tsconfig.app.json', '/tsconfig.*?.json')];"

   # This setting is not used by the Nrwl Linter
   npx json -I -f apps/booking-app/.eslintrc.json -e "delete this.overrides[0].parserOptions.createDefaultProgram;"

   # Use the ESLint component template processor and recommended component template rules from angular-eslint
   npx json -I -f apps/booking-app/.eslintrc.json -e "this.overrides[1].extends = ['plugin:@nrwl/nx/angular-template', 'plugin:@angular-eslint/template/recommended'];"
   ```

   Next, we configure ESLint and angular-eslint for the `booking-feature-flight-search` project. We make the same changes as we did for the `booking-app` project, except we start by correcting the path to the root ESLint configuration because the project-specific configuration is three folders deep in the workspace.

   ```
   # Correct path to root ESLint configuration
   npx json -I -f libs/booking/feature-flight-search/.eslintrc.json -e "this.extends = '../' + this.extends;"

   # Add Nx Angular ESLint plugin and the ESLint inline component template processor
   npx json -I -f libs/booking/feature-flight-search/.eslintrc.json -e "this.overrides[0].extends = ['plugin:@nrwl/nx/angular', 'plugin:@angular-eslint/template/process-inline-templates'];"

   # Match all TypeScript project configuration files
   npx json -I -f libs/booking/feature-flight-search/.eslintrc.json -e "this.overrides[0].parserOptions.project = [this.overrides[0].parserOptions.project[0].replace('/tsconfig.lib.json', '/tsconfig.*?.json')];"

   # This setting is not used by the Nrwl Linter
   npx json -I -f libs/booking/feature-flight-search/.eslintrc.json -e "delete this.overrides[0].parserOptions.createDefaultProgram;"

   # Use the ESLint component template processor and recommended component template rules from angular-eslint
   npx json -I -f libs/booking/feature-flight-search/.eslintrc.json -e "this.overrides[1].extends = ['plugin:@nrwl/nx/angular-template', 'plugin:@angular-eslint/template/recommended'];"
   ```

   Finally, we configure ESLint for the `booking-app-e2e` project.

   ```
   # Use rules recommended by Cypress
   npx json -I -f apps/booking-app-e2e/.eslintrc.json -e "this.extends = ['plugin:cypress/recommended', this.extends];"

   # Delete rule for component templates
   npx json -I -f apps/booking-app-e2e/.eslintrc.json -e "this.overrides = this.overrides.slice(0, 1);"

   # Add rules specifically for the Cypress plugin loader
   npx json -I -f apps/booking-app-e2e/.eslintrc.json -e "this.overrides = [{ files: ['src/plugins/index.js'], rules: { '@typescript-eslint/no-var-requires': 'off', 'no-undef': 'off' } }, ...this.overrides];"

   # Match all TypeScript project configuration files
   npx json -I -f apps/booking-app-e2e/.eslintrc.json -e "this.overrides[1].parserOptions.project = [this.overrides[1].parserOptions.project[0].replace('/tsconfig.app.json', '/tsconfig.*?.json')];"

   # This setting is not used by the Nrwl Linter
   npx json -I -f apps/booking-app-e2e/.eslintrc.json -e "delete this.overrides[1].parserOptions.createDefaultProgram;"

   # Remove Angular declarable rules
   npx json -I -f apps/booking-app-e2e/.eslintrc.json -e "delete this.overrides[1].rules['@angular-eslint/component-selector'];"
   npx json -I -f apps/booking-app-e2e/.eslintrc.json -e "delete this.overrides[1].rules['@angular-eslint/directive-selector'];"
   ```

   Open `apps/booking-app-e2e/src/support/commands.ts` and put the following comment before the line which says `declare namespace Cypress {`:

   ```ts
   // eslint-disable-next-line @typescript-eslint/no-namespace
   ```

   In the same file, add this coment before the line which says `interface Chainabile<Subject> {`:

   ```ts
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   ```

6. Use Nrwl Linter builder.
   The final step is to replace `@angular-eslint/builder:lint` with `@nrwl/linter:eslint` in our workspace configuration.

   ```
   # Use Nrwl Linter
   npx json -I -f angular.json -e "this.projects['booking-app'].architect.lint.builder = '@nrwl/linter:eslint';"
   npx json -I -f angular.json -e "this.projects['booking-feature-flight-search'].architect.lint.builder = '@nrwl/linter:eslint';"
   npx json -I -f angular.json -e "this.projects['booking-app-e2e'].architect.lint.builder = '@nrwl/linter:eslint';"

   # Only lint js and ts files in the end-to-end test project
   npx json -I -f angular.json -e "this.projects['booking-app-e2e'].architect.lint.options.lintFilePatterns = [this.projects['booking-app-e2e'].architect.lint.options.lintFilePatterns[0].replace('*.ts', '*.{js,ts}')];"
   ```

7. Remove Codelyzer and TSLint.

   Using NPM CLI:

   ```
   npm uninstall codelyzer tslint
   rm tslint.json
   ```

   Using Yarn CLI:

   ```
   yarn remove codelyzer tslint
   rm tslint.json
   ```

   Alternatively, use the following `preinstall` script to permanently remove Codelyzer and TSLint despite generators trying to add them back.

   Using NPM CLI:

   ```
   npx json -I -f package.json -e "this.scripts.preinstall = '(npm uninstall codelyzer || echo ✅ Codelyzer is already removed.) && (npm uninstall tslint || echo ✅ TSLint is already removed.)';"
   npm install
   ```

   Using PNPM CLI:

   ```
   npx json -I -f package.json -e "this.scripts.preinstall = '(pnpm remove codelyzer || echo ✅ Codelyzer is already removed.) && (pnpm remove tslint || echo ✅ TSLint is already removed.)';"
   pnpm install
   ```

   Using Yarn CLI:

   ```
   npx json -I -f package.json -e "this.scripts.preinstall = '(yarn remove codelyzer || echo ✅ Codelyzer is already removed.) && (yarn remove tslint || echo ✅ TSLint is already removed.)';"
   yarn install
   ```

8. Verify that linting works.
   Run the `lint` target on all projects to verify that ESLint with angular-eslint works.

   ```
   nx run-many --target=lint --all
   ```

# Conclusion {#conclusion}

The `empty` preset for an Nx workspace is great, because it uses the new `workspace.json` version 2 schema with executors, generators, and targets. We can configure it however we want and it supports angular-eslint well.

A new Nx workspace can be created using the `angular` preset to keep using the `angular.json` workspace configuration.

An existing Nx 10 workspace using ESLint can migrate to angular-eslint without any issues. As part of migrating to Nx 11, angular-eslint will be installed and configured for existing projects using ESLint.

If we have an existing Nx 10 workspace using TSLint, we can migrate to Nx 11 without any issues, but there's not automatic migration from using TSLint to angular-eslint yet as of Nx version 11.0.18.

However, there are migrations for Angular CLI workspaces. We can use these as a starting point to install angular-eslint and create necessary ESLint configuration files and plugins.

To configure angular-eslint manually for an Nx workspace, we carefully adjust our ESLint configurations in the same way as a new Nx workspace would. Additionally, we switch to the Nrwl Linter instead of the angular-eslint builder.

No matter which combination of technologies we're using, it's possible to get rid of Codelyzer and TSLint today and start using angular-eslint instead.

Some Angular-specific TSLint rules from Codelyzer do not have corresponding angular-eslint rules implemented yet. At the time of writing, the missing rules are:

- `angular-whitespace`
- `contextual-decorator`
- `import-destructuring-spacing`
- `no-unused-css`
- `prefer-inline-decorator`
- `template-accessibility-alt-text`
- `template-accessibility-label-for`
- `template-accessibility-table-scope`
- `template-click-events-have-key-events`
- `template-conditional-complexity`
- `template-no-any`

Why should we migrate away from TSLint as fast as possible? On December 1st 2020, TSLint went fully end-of-life. No PRs or issues are accepted ever again. This means that any release of Angular, TypeScript, Node.js, or any of TSLint's dependencies can potentially break TSLint version 6.1.3, the last version to ever be published. TSLint was deprecated 2 years ago.

## Acknowledgements {#acknowledgements}

Thank you [James Henry](https://twitter.com/MrJamesHenry) for angular-eslint. Thank you Nrwl and [James Henry](https://twitter.com/MrJamesHenry) for angular-eslint support in Nx.
