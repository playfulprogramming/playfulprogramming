---
{
title: "Create a CI Workflow with Minimal Boilerplate Using Nx, Docker, and GitHub Actions",
published: "2024-08-04T11:14:05Z",
edited: "2025-07-10T14:03:01Z",
tags: ["tutorial", "nx", "ci"],
description: "In this post, I share my blueprint for a hybrid CI workflow that neither forces you to adapt to a...",
originalLink: "https://dev.to/this-is-learning/create-a-ci-workflow-with-minimal-boilerplate-using-nx-docker-and-github-actions-4l44",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

In this post, I share my blueprint for a hybrid CI workflow that neither forces you to adapt to a `cloud-only` nor `local-only` with **minimal** effort. Promising, right?

I am sure you have encountered the following scenario: you work in a monorepo, with several applications depending on external services (such as database, email server, authentication API ...) and libraries, and you want to set up a CI pipeline to validate your changes **quickly** and **efficiently**.

You may have tried different approaches, like running tests locally, using external CI services, or setting up a self-hosted CI server. However, each approach has limitations and challenges, such as **slow build times**, **complex configuration**, **inconsistent data across machines**, or **high maintenance costs**.

---

Let me give you some examples:

- "It works on my machine" syndrome: Developers struggle with inconsistent environments between local and CI setups, leading to false positives in local tests and failures in CI.

- Slow feedback loops: Large monorepos with multiple services can lead to lengthy CI pipelines, causing developers to wait hours for test results and slowing down the development process.

- Configuration drift: As projects grow, maintaining parity between local development environments and CI pipelines becomes increasingly challenging, leading to unexpected behavior and hard-to-reproduce bugs.

- Resource constraints: Running comprehensive test suites locally can overwhelm developers' machines, while scaling CI resources for peak demand can be prohibitively expensive.

- Dependency hell: Managing complex dependencies across multiple services in a monorepo can lead to conflicts between local and CI environments, causing unpredictable test results.

- Flaky tests: Inconsistent test environments or poorly managed states between test runs can result in intermittent failures, eroding trust in the CI process.

- "Push and pray" debugging: Developers make dummy commits and push changes to the remote repository just to trigger the CI pipeline. This is especially problematic when trying to debug or set up complex end-to-end tests that are hard to replicate locally. The process typically involves:

  1. Making a small, often meaningless change
  2. Committing and pushing the change
  3. Waiting for the CI pipeline to start
  4. Watching the initial setup steps complete (which can take several minutes)
  5. Finally, we will see the results of the e2e tests.
  6. If the tests fail, repeat the entire process with a new change

---

Beyond bridging the gap between local and CI environments, this blueprint offers several benefits:

- Consistent environments across local and CI setups
- Simplified configuration management using Docker Compose and DotenvX
- Efficient resource utilization and faster feedback loops with Nx Cloud and distributed testing
- Easy debugging and local CI simulation using Act
- A scalable approach that works for both small projects and large monorepos

At the end of this guide, I will discuss the challenges of running distributed end-to-end tests.

> **Note**: The source code for this tutorial is available on [GitHub](https://github.com/getlarge/cat-fostering/)!

## Project Composition

The blueprint is applied to a project called **Cat Fostering**, a fictitious application that connects cat fosterers with shelters and adopters. The project is a small mono repo, but larger projects can also benefit from the principles and techniques presented in this guide.

Some notable technologies used in the project:

- **NestJS**: The backend API for our project. It mainly serves as the target for our end-to-end tests, which validate the API's functionality and behavior.
- **Postgres**: Data storage for our backend application.
- **Ory Kratos**: Identity and user management system.
- **Ory Keto**: Access control system.
- **Jest**: A JavaScript testing framework with a focus on simplicity. In this guide, Jest is used to run both unit and end-to-end tests.

### GitHub Actions

GitHub Actions was introduced by GitHub in 2018, revolutionizing how developers automate their workflows. Before GitHub Actions, developers often relied on external CI services like Jenkins, Travis CI, or CircleCI. GitHub Actions brought CI/CD capabilities directly into the GitHub ecosystem, making it more **accessible** and tightly integrated with the code repository. With its YAML-based configuration and a vast marketplace of **reusable actions**, it simplified the setup of complex automation tasks and allowed for seamless integration with GitHub's other features, like pull requests and issues.

![Example GitHub Actions workflow](./miyu89ghr4ag8k9a283g.png)

### Nx Cloud

Nx Cloud, developed by the Nrwl team, complements the Nx build system by adding distributed computation and caching capabilities. Introduced to handle the growing complexity and scale of monorepos, Nx Cloud transformed CI pipelines by enabling faster builds and tests through **distributed execution**. It leverages powerful caching mechanisms to **avoid redundant work**, significantly reducing the time required to validate and deploy changes. Nx Cloud's detailed analytics and insights into CI performance further empower teams to optimize their workflows.

One of Nx Cloud's features is Nx Agents, which allows users to run tasks distributed across multiple agents.

Nx Agents automates the agent management process, making it easier to scale CI pipelines and distribute tasks efficiently.
The great news is that Nx recently made Nx Agents available in their free tier, making it accessible to a broader audience.

![Nx Agents in Hobby plan](./advf23rzzo1a5634e4d0.png)

GitHub Actions and Nx Cloud have democratized access to advanced CI/CD capabilities, making it easier for teams of all sizes to build, test, and deploy software.
They also work great together. Nx Cloud enhances the GitHub Actions experience with real-time feedback, insights into CI performance, and better log readability.

## Configure external services

One of the requirements of this blueprint is for the setup to **work seamlessly locally and in our CI runner**: we should be able to switch quickly from one stage (e.g., local dev, test, CI) to another and restart the services effortlessly.

That's where Docker Compose and DotenvX come to the rescue!

### Docker Compose

[Docker Compose](https://docs.docker.com/compose/) is a tool for defining and running multi-container Docker applications. It allows us to use a composable configuration file to declare how our services interact. We can create a multipurpose Compose file for local development, testing, and CI pipelines with [profiles](https://docs.docker.com/compose/profiles/), [environment variables](https://docs.docker.com/compose/environment-variables/), and [file merging](https://docs.docker.com/compose/multiple-compose-files/merge/).

#### Benefits of Docker Compose

- **Ease of Configuration**: Define services, networks, and volumes in a single file.
- **Flexible Environment Management**: Use environment variables for configuration.
- **Profiles**: Include/exclude services based on the profile selected when running `docker-compose up`.

#### Usage

In our example project, we will use `Docker Compose` (`docker-compose.yaml`) to manage the external services required for our application, heavily using **profiles** and **environment variables** to switch between different configurations.

The `docker-compose.` `yaml` file declares **services**, **networks**, and **volumes**. Each service represents a containerized application or service, networks define the communication channels between services, and volumes store persistent data.

Some services are the same across all profiles, such as the `Postgres` database, `Ory Kratos`, and `Ory Keto`.

```yaml
services:
  postgres:
    image: postgres:16
    volumes:
      - app_postgres_volume:/var/lib/postgresql/data
    ports:
      - '5432:5432'
    environment:
      - POSTGRES_USER=dbuser
      - POSTGRES_PASSWORD=secret
      - POSTGRES_DB=${POSTGRES_DB:-appdb}
    networks:
      - api
    profiles:
      - ci
      - dev
  # ...
  kratos:
    depends_on:
      - kratos-migrate
    image: oryd/kratos:v1.2.0
    ports:
      - '4433:4433'
      - '4434:4434'
    restart: unless-stopped
    command: serve -c /etc/config/kratos/kratos.yaml --dev --watch-courier
    volumes:
      - ${PWD}/infra/ory-kratos:/etc/config/kratos:ro
    networks:
      - api
    extra_hosts:
      - 'host.docker.internal:host-gateway'
    profiles:
      - ci
      - dev
  # ...
  keto:
    depends_on:
      - keto-migrate
    image: oryd/keto:v0.12.0
    ports:
      - '4466:4466'
      - '4467:4467'
    command: serve -c /etc/config/keto/keto.yaml
    restart: on-failure
    volumes:
      - ${PWD}/infra/ory-keto:/etc/config/keto:ro
    networks:
      - api
    profiles:
      - ci
      - dev
  # ...
```

> **Note**:
> When configuring `volumes` to mount host files or directories, it is important to use `${PWD}` variable instead of `.` to avoid issues with relative paths when running Docker Compose in GitHub Actions.

For the `ci` profile, we will include the `api` service, which is a `Docker` image of the NestJS application tested in the CI pipeline.

```yaml
services:
  # ...
  api:
    image: ghcr.io/getlarge/cat-fostering/cat-fostering-api:${DOCKER_API_TAG:-dev}
    pull_policy: never
    depends_on:
      - postgres
      - kratos
      - keto
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=test
      - ORY_ACTION_API_KEY=${ORY_ACTION_API_KEY:-unsecure_api_key}
      - ORY_KETO_ADMIN_URL=http://keto:4467
      - ORY_KETO_PUBLIC_URL=http://keto:4466
      - ORY_KRATOS_ADMIN_URL=http://kratos:4434
      - ORY_KRATOS_PUBLIC_URL=http://kratos:4433
      - PORT=3000
      - POSTGRES_URL=postgres://dbuser:secret@postgres:5432
      - POSTGRES_DB=${POSTGRES_DB:-cat_fostering_api_e2e}
    networks:
      - api
    profiles:
      - ci
    # ...
```

> **Note**:
>
> - This Compose configuration could be further optimized by using an override file that would remove the services not needed for the **ci** profile such as `keto-postgres`, `kratos-postgres`, `keto-migrate`, and `kratos-migrate` since values will be stored in memory.
> - DOCKER\_API\_TAG is an environment variable that will be set in the CI runner to pull the correct Docker image for the API service.

For the `dev` profile, we will include the `kratos-selfservice-ui-node`, a self-service UI for Ory Kratos, which is unnecessary for the CI pipeline since the e2e tests will run headless.

```yaml
services:
  # ...
  kratos-selfservice-ui-node:
    image: oryd/kratos-selfservice-ui-node:v1.2.0
    environment:
      - KRATOS_PUBLIC_URL=http://kratos:4433
      - KRATOS_BROWSER_URL=${KRATOS_BROWSER_URL:-http://127.0.0.1:4433}
      - COOKIE_SECRET=${COOKIE_SECRET:-cookie_secret_not_good_not_secure}
      - CSRF_COOKIE_NAME=${CSRF_COOKIE_NAME:-csrf_token_local}
      - CSRF_COOKIE_SECRET=${CSRF_COOKIE_SECRET:-csrf_cookie_secret_not_good_not_secure}
      - PORT=4455
    ports:
      - '4455:4455'
    networks:
      - api
    restart: on-failure
    profiles:
      - dev
  # ...
```

Now you can run the services using the following command:

```sh
# to run the services included in the ci profile
docker-compose up --profile ci

# to run the services included in the dev profile
docker-compose up --profile dev
```

That's a lot of environment variables, and I didn't even show you the ones used to generate the configuration files for Ory Kratos and Keto (e.g. `kratos.yaml`, `keto.yaml`)!

The following section will show how to simplify environment variables by sharing them. Of course, the solution should work for our CI runner and local development environments.

### DotenvX

[DotenvX](https://dotenvx.com) is a library that simplifies managing and sharing environment variables. With features like partial or complete public key encryption and easy grouping by stage name, safely sharing environment variables has never been easier!

Check out my article [Exploring DotenvX](https://dev.to/this-is-learning/exploring-dotenvx-46ng) for a detailed guide on how to use DotenvX.

> **Note**:
> I have a personal affinity with DotenvX (and Dotenv Vault) but there are other open-source solutions available for managing environment variables, such as [Infisical](https://github.com/Infisical/infisical) or [sops](https://github.com/getsops/sops). Feel free to explore and choose the one that best fits your needs.

## Configure CI pipeline

The CI workflow is divided into 4 phases:

### Setup

The setup prepares the work environment by cloning the repository, setting up Node.js, and installing the dependencies.

![Setup Phase](./rpamqfxfmj7d1rzy58gb.png)

### Run Tasks

The Nx Agents phase starts the agents and distributes the tasks across the agents. The agents will run the tasks in parallel for changed projects, speeding up the pipeline execution.
Only the tasks requiring no external services are running.

![Nx Agents Phase](./xbp4229e8jgomoym2knv.png)

### Setup External Services {#setup-external-services}

This phase will build a custom Docker image for the API, pull existing images, and configure them using Docker Compose and DotenvX.

![Prepare External Services Phase](./lrozg4hxe589dehsk28y.png)

### Run E2E Tests

The final phase runs the end-to-end tests for the projects that have changed.

![Run E2E Tests Phas](./eeuerf5nl9uhwz0tmqn0.png)

### Create GitHub Actions Workflow

The GitHub Actions workflow file is a YAML file that defines the steps to run in the CI pipeline. Creating a CI workflow with GitHub Actions is straightforward with Nx since you can use a generator to create the boilerplate for your CI workflow:

```sh
npx nx generate @nx/workspace:ci-workflow --ci=github
```

> **Note**:
> To know more about the GitHub Actions integration, head to the [Nx guide](https://nx.dev/ci/intro/tutorials/github-actions#configure-nx-on-github-actions).

The CI pipeline will include linting, building, and (unit) testing the project and running end-to-end tests that consume the HTTP API provided by the NestJS application.

#### Global Environment Variables

The `env` section defines the global environment variables used in the workflow. These variables are accessible at all workflow steps and can be used to store sensitive information such as access tokens or encryption keys.

`DOTENV_PRIVATE_KEY_CI` is set in GitHub Actions secrets and assigned to the `DOTENV_PRIVATE_KEY_CI` environment variable. This key will decrypt the environment variables in the `.env.ci` file.

```yaml
env:
  DOTENV_PRIVATE_KEY_CI: ${{ secrets.DOTENV_PRIVATE_KEY_CI }}
  POSTGRES_URL: postgres://dbuser:secret@localhost:5432
  POSTGRES_DB: cat_fostering_api_e2e
  # .... other environment variables
```

#### Nx Agents

Nx agents simplify the process by managing the agents' lifecycle and the distribution of the tasks. The `npx nx-cloud start-ci-run` command starts three agents that will stop after the `build` tasks are completed.

```yml
# ...
jobs:
  main:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - run: |
        npx nx-cloud start-ci-run --distribute-on="3 linux-small-js" --stop-agents-after="build"
      # ...
```

> **⚠️**
> Pay attention to `--stop-agents-after`!
> It informs the Nx Agents manager to stop the agents once the `build` tasks are finished running.
> By default, Nx agents will run indefinitely, which can lead to unexpected costs.
> Check all the available options in the [Nx documentation](https://nx.dev/ci/reference/nx-cloud-cli).

Before Nx Cloud Agents, users had to configure the agents and manage agents' lifecycles themselves, which could be challenging and time-consuming.

```yaml
agents:
  runs-on: ubuntu-latest
  timeout-minutes: 15
  strategy:
    matrix:
      agent: [1, 2]
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    - run: npm install
    - name: Start Nx Agent ${{ matrix.agent }}
      run: npx nx-cloud start-agent
```

> **Note**: A typical Agent configuration as a GitHub Actions job. Things become more complicated when installing custom dependencies, setting up external services and using dynamic agents count.

#### Install Dependencies

```yaml
jobs:
  main:
    runs-on: ubuntu-latest
    steps:
      # ...
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: |
            **/package-lock.json
            patches/*.patch
      - run: npm ci
      # ...
```

#### Define Base and Head Branches

When using `nx affected`, defining the base and head branches to compare the changes is essential.
The `nrwl/nx-set-shas@v4` action determines the commit SHA based on the successful completion of a specified workflow in a repository. It sets it as the base parameter for the `affected` command, the starting point for the comparison.

```yaml
jobs:
  main:
    runs-on: ubuntu-latest
    steps:
      # ...
      - uses: nrwl/nx-set-shas@v4
        with:
          workflow-id: 'ci.yml'
      # ...
```

#### Run Linting, Testing, and Building

Those checks can run in parallel to speed up the pipeline execution and do not require external services.

```yaml
jobs:
  main:
    runs-on: ubuntu-latest
    steps:
      # ...
      - run: npx nx format:check
      - run: npx nx affected -t lint test build
      # ...
```

#### Start Docker Services

- **npx nx run cat-fostering-api:container**: build a unique Docker image for the `cat-fostering-api` by tagging the image with the commit SHA (`$DOCKER_API_TAG`). The `api` service, in the Docker Compose `ci` profile, is using that image in the next step. It does not rely on Nx Agents.
- **npx @dotenvx/dotenvx run -- docker compose --profile ci -p cat-fostering up -d**: decrypt `env.ci` and start the services.
- **sleep 10**: wait for the services to start since we can't use `--wait --wait-timeout N` options, because Keto and Kratos migration containers, will exit before the Keto and Kratos services are ready.

```yaml
jobs:
  main:
    runs-on: ubuntu-latest
    steps:
      # ...
      - run: |
          npm run ory:generate:kratos -- -e .env.ci
          npm run ory:generate:keto -- -e .env.ci

      - run: echo "DOCKER_API_TAG=$(echo $GITHUB_SHA | cut -c 1-6)" >> $GITHUB_ENV

      - run: npx nx run cat-fostering-api:container --skip-nx-cache --no-agents --platforms=linux/amd64 --load=true --push-false --tags='ghcr.io/getlarge/cat-fostering/cat-fostering-api:${{ env.DOCKER_API_TAG }}'

      - run: npx @dotenvx/dotenvx run -- docker compose --profile ci -p cat-fostering up -d
        env:
          DOCKER_API_TAG: ${{ env.DOCKER_API_TAG }}

      - run: sleep 10
      # ...
```

> **Note**:
>
> - The `DOCKER_API_TAG` environment variable is set to the first 6 characters of the commit SHA.
> - The `cat-fostering-api:container` task relies on: [`@nx-tools/nx-container:build`](https://github.com/gperdomor/nx-tools/tree/main/plugins/nx-container) executor to build the Docker image.

#### Log Outputs in Nx Cloud

You can send commands' logs to Nx Cloud for a centralized place to view the logs and debug issues for future investigation.

```yaml
jobs:
  main:
    runs-on: ubuntu-latest
    steps:
      # ...
      - run: npx nx-cloud record -- docker ps
      - run: |
        npx nx-cloud record -- docker compose -p cat-fostering logs keto -n 500
      - run: |
        npx nx-cloud record -- docker compose -p cat-fostering logs kratos -n 500
      # ...
```

#### Run The End-to-End Tests {#run-the-end-to-end-tests}

The final step in the workflow is to run the end-to-end tests for projects that have changed, using the `nx affected -t e2e` command. Tests will run only in the GitHub Actions runner.

This phase is the slowest and could be the bottleneck in the CI pipeline. Later, we will discuss distributing the E2E test suite to speed up the pipeline execution.

```yaml
jobs:
  main:
    runs-on: ubuntu-latest
    steps:
      # ...
      - name: Run e2e tests
        run: npx nx affected -t e2e --no-agents
```

> **Note**:
>
> The complete workflow file can be found in the [GitHub repository](https://github.com/getlarge/cat-fostering/blob/main/.github/workflows/ci.yml)

## Setup Nx App

![Cat Fostering in Nx App](./756j4bxx1z8qqx4emx0u.png)

The setup process for the Nx app is well-explained in this [video by the Nx team](https://youtu.be/4VI-q943J3o?si=wTqoRrfnp_8pgLIe\&t=80) and includes the following steps:

1. Connect your GitHub organization to Nx Cloud.
2. Install the GitHub app.
3. Select the repository in the integration settings.
4. Authenticate the repository and add an access token in `nx.json` (be cautious of potential cache poisoning with write access tokens).

For a detailed guide, refer to the [Nx documentation](https://nx.dev/ci/intro/tutorials/github-actions#connect-your-workspace-to-nx-cloud).

## Run CI Workflow Locally

Debugging CI workflows is cumbersome and relatively slow, and there is a limit to *how many coffee cups you can drink in a day* ☕️.
Instead of the usual **commit-trigger-debug** loop, you can use [Act](https://github.com/nektos/act) to run your GitHub Actions workflows locally.

When I discovered Act a few years ago, it was still in its infancy and supported only a few features. Since then, it has come a long way and now supports most of the GitHub Actions features, including secrets, environment variables, and Docker containers.

> **Note**:
> Here is the [list of unsupported features](https://nektosact.com/not_supported.html) in Act.

Check out the [Act documentation](https://nektosact.com/installation/index.html) to install Act on your machine.

### Running Act

> ⚠️ The setup is specific to macOS with Docker Desktop and may not work on all platforms.

Load the environment variables from the `.env` file:

```sh
# Makes the GH token available to Act to interact with GH API
export GITHUB_TOKEN=$(gh auth token)
# This key enables decrypting environment variables from .env.ci
export DOTENV_PRIVATE_KEY_CI=$(cat .env.keys | grep DOTENV_PRIVATE_KEY_CI | cut -d '=' -f2 | tr -d '"')
```

After setting up Act, you can run the CI workflow locally with the following command:

```sh
act push --container-daemon-socket="unix:///var/run/docker.sock" \
--bind --env-file='' -s GITHUB_TOKEN="${GITHUB_TOKEN}" \
-s DOTENV_PRIVATE_KEY_CI=${DOTENV_PRIVATE_KEY_CI} -e github_event.tmp
```

- **push**: triggers the `push` event in the GitHub Actions workflow.
- **container-daemon-socket**: binds the Docker socket to the Act container, allowing the container to start other containers.
- **bind**: the current directory is bound to the Act container, allowing the container to access the files in the current directory (⚠️ be cautious with this option)
- **env-file**: instruct Act to NOT load the environment variables from a `.env` file.
- **s**: set the `GITHUB_TOKEN` and `DOTENV_PRIVATE_KEY_CI` secrets in the Act container.

> **Note**:
> When developing a custom GitHub Action, you can also consider the [Local Action CLI](https://github.com/github/local-action) which is lightweight and faster than Act.

## Configure E2E Test Splitting

As said in the [previous section](#run-the-end-to-end-tests), the E2E test job is the slowest of the CI pipeline. To speed up the pipeline, Nx allows [splitting the E2E tests](https://nx.dev/ci/features/split-e2e-tasks) into multiple tasks.

**How does it work?**

This feature relies on Nx's [inferred tasks](https://nx.dev/concepts/inferred-tasks) to add targets dynamically based on a plugin configuration.

### Workspace configuration

Since Jest executes the unit and e2e tests, I configured the `@nx/jest` plugin to automatically create one task for the unit tests(`test`) and another for E2E tests (`e2e`).
The **ciTargetName** option will create distinct targets for each E2E test file, allowing them to run in parallel, have a separate cache, and make [identifying flaky tests](https://nx.dev/ci/features/flaky-tasks) easier.

```json
// nx.json
{
  // ...
  "plugins": [
    // ...
    {
      "plugin": "@nx/jest/plugin",
      "exclude": ["apps/cat-fostering-api-e2e/**/*"],
      "options": {
        "targetName": "test"
      }
    },
    {
      "plugin": "@nx/jest/plugin",
      "include": ["apps/cat-fostering-api-e2e/**/*"],
      "options": {
        "targetName": "e2e",
        "ciTargetName": "e2e-ci"
      }
    }
  ]
  // ...
}
```

The generated e2e tasks in the `cat-fostering-api-e2e`:

![cat-fostering-api-e2e nx project](./qo3grm3hh3fk3xb98m5y.png)

> **Tips**:
> This view is generated by the `nx show project cat-fostering-api-e2e` command.

While splitting E2E tests can significantly speed up CI pipelines by parallelizing tests' execution, there are some pitfalls to be aware of. Let's discuss them in the following sections.

### Setup and Teardown Hooks

#### TSConfig Paths

If you plan to import internal libraries into your global hooks scripts, configure Jest hooks to **register the TypeScript project** before importing the libraries:

```ts
import { registerTsProject } from '@nx/js/src/internal';
const cleanupRegisteredPaths = registerTsProject('../../tsconfig.base.json');

import {
  generateOryKetoConfig,
  generateOryKratosConfig,
} from '@cat-fostering/ory-config-generators';
import { createTestConnection } from '@cat-fostering/pg-config';
import { join } from 'node:path';

import { restartService } from './helpers';

const applicationEnvPath = join(
  __dirname,
  '..',
  '..',
  '..',
  'cat-fostering-api',
  '.env.ci'
);
const dockerEnvPath = join(__dirname, '..', '..', '..', '..', '.env.ci');

export default async (): Promise<void> => {
  console.log('\nSetting up...\n');
  // ...
  generateOryKetoConfig(dockerEnvPath);
  restartService('keto');
  generateOryKratosConfig(dockerEnvPath);
  restartService('kratos');
  globalThis.__DB_CONNECTION__ = await createTestConnection(applicationEnvPath);
  restartService('api');
};

cleanupRegisteredPaths();
```

#### Shared Resources

If you rely on setup and teardown hooks in your E2E tests, be aware that these **hooks are triggered for each task** generated by Nx. This can lead to unexpected behavior if the hooks depend on shared/global resources or state.

One workaround is to skip the setup and teardown hooks conditionally by checking the `NX_TASK_TARGET_TARGET` environment variable:

```ts
// ...
export default async (): Promise<void> => {
  console.log('\nSetting up...\n');
  const __TEARDOWN_MESSAGE__ = '\nTearing down...\n';
  globalThis.__TEARDOWN_MESSAGE__ = __TEARDOWN_MESSAGE__;

  if (process.env.NX_TASK_TARGET_TARGET?.includes('e2e-ci')) {
    return;
  }

  if (process.env.NX_TASK_TARGET_TARGET === 'e2e') {
    generateOryKetoConfig(dockerEnvPath);
    restartService('keto');
    generateOryKratosConfig(dockerEnvPath);
    restartService('kratos');
    globalThis.__DB_CONNECTION__ = await createTestConnection(
      applicationEnvPath
    );
    restartService('api');
  }
};
// ...
```

> **Note**
>
> - The `NX_TASK_TARGET_TARGET` environment variable is set by Nx to indicate the target being executed.
> - During my evaluation, I found that the `NX_TASK_TARGET_TARGET` environment variable was undefined in certain conditions I was not able to reproduce.
> - See the [Nx documentation](https://nx.dev/reference/environment-variablest) for a complete list of environment variables set and interpreted by Nx.

### E2E Tests in the CI Pipeline

When executing E2E tests on a single runner, you only need to pull and start Docker Compose services within that runner. However, for distributed E2E tests, initiating services on each runner or agent is required.

Let's explore how to configure Nx agents to incorporate our [Docker Compose services](#setup-external-services).

## Configure Nx Agents

### Custom Launch Templates

When the default Nx Agents configurations do not fulfill your needs, you can write custom launch templates to customize Nx agents' configuration and environment.

In this template, you can define the machine specs by changing the `resource-class` and `image`, and you can also configure the agent's routine (`init-steps`) to install external dependencies and setup services.

Example of a custom launch template that installs Node modules and browsers for E2E tests:

```yaml
# .nx/workflows/agents.yaml
launch-templates:
  custom-linux-small-js:
    resource-class: 'docker_linux_amd64/small'
    image: 'ubuntu22.04-node20.11-v7'
    init-steps:
      - name: Checkout
        uses: 'nrwl/nx-cloud-workflows/v4/workflow-steps/checkout/main.yaml'
      - name: Restore Node Modules Cache
        uses: 'nrwl/nx-cloud-workflows/v4/workflow-steps/cache/main.yaml'
        inputs:
          key: 'package-lock.json|yarn.lock|pnpm-lock.yaml'
          paths: 'node_modules'
          base-branch: 'main'
      - name: Install Node Modules
        uses: 'nrwl/nx-cloud-workflows/v4/workflow-steps/install-node-modules/main.yaml'
```

> **Note**:
>
> - You can find more launch templates in the [Nx Cloud Workflows repository](https://github.com/nrwl/nx-cloud-workflows/blob/main/launch-templates/linux.yaml).
> - As usual, the right place to get started with custom launch templates is the [Nx documentation](https://nx.dev/ci/reference/launch-templates#getting-started-with-custom-launch-templates)

To configure the Nx Agents to use the custom launch template, use the `--distribute-on` argument with the custom launch template name:

```sh
npx nx-cloud start-ci-run --distribute-on="3 custom-linux-small-js" \
--stop-agents-after="e2e-ci" --require-explicit-completion \
--with-env-vars="DOTENV_PRIVATE_KEY_CI,POSTGRES_DB,POSTGRES_URL"
```

### Pitfalls

#### CPU Availability

The number of CPUs varies with agent size, affecting the `--parallel` argument. The number of CPUs available is as follows:

- Small: 1 vCPU, 2GB RAM
- Medium: 2 vCPU, 4GB RAM
- Medium Plus: 3 vCPU, 6GB RAM
- Large: 4 vCPU, 8GB RAM
- Large Plus: 4 vCPU, 10GB RAM
- Extra Large: 8 vCPU, 16GB RAM
- Extra Large Plus: 10 vCPU, 20GB RAM

> **Source**: [Nx Cloud pricing](https://nx.app/pricing#plan-details)

It would be a good idea to make the number of CPUs available as an environment variable or an output of the `npx nx-cloud start-ci-run` command to avoid hardcoding the number of parallel tasks. If any member of Nx teams is reading this, please consider this feature in the future! 🙏

Since the medium agent has **two vCPU**, ideally, you would run **two tasks in parallel**:

```yaml
jobs:
  main:
    - run: |
        npx nx-cloud start-ci-run --distribute-on="3 linux-medium-js" --stop-agents-after="build"
    - run: npx nx affected -t lint test build --parallel=2
```

#### Nx Agent Limitations

To run distributed E2E tests, we need to configure custom Nx agents, install Docker, and start all the necessary external services on which our application depends.

However, Docker can not be installed in custom agents unless you are an enterprise customer. Refer to [this issue](https://github.com/nrwl/nx-cloud-workflows/issues/52) for more information.

Unfortunately, in our case, this is a showstopper for running E2E tests distributedly and benefits from splitting tests. I believe Nrwl teams are smart and will provide this feature for every user in the future. To be continued... 👀

## Conclusion

In this post, I showed you how to set up a hybrid CI workflow that works seamlessly in local and CI environments. This approach is so simple we could call it low-code CI/CD!

I hope you enjoyed this guide and that you can apply this knowledge to your projects.

Stay tuned for more content on Nx, Docker, and GitHub Actions!

## Further readings

- [Fast Effortless CI](https://nx.dev/blog/fast-effortless-ci)
- [Split E2E tasks](https://nx.dev/ci/features/split-e2e-tasks)
- [Detect Flaky Tests](https://nx.dev/ci/features/flaky-tasks)
- [Dynamic Nx Agents Allocation](https://nx.dev/ci/features/dynamic-agents)
