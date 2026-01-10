---
{
title: "Speeding Up Angular Scully Builds in GitHub Actions",
published: "2021-04-19T07:38:45Z",
tags: ["github", "action", "angular", "devops"],
description: "In this article, we are going to learn how you can speed your Scully builds by re-using Angular build...",
originalLink: "https://mainawycliffe.dev/blog/speeding-angular-scully-builds-github-actions",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

In this article, we are going to learn how you can speed your Scully builds by re-using Angular build artifacts in GitHub Actions. In order to statically build your Angular website with Scully, first you have to do the Angular build and then use the build artifacts to generate a statically generated site using Scully.

It is common for most websites, that content can change without the source code of your website changing. Therefore, it can be wasteful to run an Angular build every time your website content changes.

Normally, Angular builds time are decent. But due to a number of factors, Angular builds could slow down, like in my case, running purge CSS against [Tailwindcss](https://tailwindcss.com/) extends the build time to over 7 minutes. Add everything else together, and my GitHub Actions would take over 12 minutes.

## Using GitHub Releases

First, we are going to need a place to store our Angular build artifacts. GitHub [releases](https://docs.github.com/en/github/administering-a-repository/about-releases) are a nice way, as it allows you to have a long-term storage of your artifacts that you can use anytime you want. This combined with `npm version` means ones you have your features ready; you can cut a release that will be used by subsequent builds as you continue to work on other features and/or improvements.

So, we are going to build our workflow to have two jobs, the first job will take care of building our Angular app, and creating a release and uploading our build artifacts to the release. While the second job will take care of Scully builds using the latest artifacts stored in GitHub releases and publishing our website to our hosting platform.

Whenever a new tag is added to the repository, we will create a release with the version no. of the tag and upload our angular builds to that release.

## Building our Angular App

### Listening to Tags

First, we will need to trigger our GitHub workflow every time a new tag is created. We will be using tags to create release version. This will allow us to use `npm version` to create new build artifacts for us to use during the publishing process.

```
on:
  push:
    tags:
      - "*"
```

> **NB:** In the publish our blog section, we will modify this section to listen to `repository_dispatch`, which we will use with webhooks to trigger the workflow when events outside our repository like blog post published occur, you can learn more [here](https://mainawycliffe.dev/blog/github-actions-trigger-via-webhooks).

We will limit this job to only run when a new tag is created using `startsWith(github.ref, 'refs/tags/')`. This will allow us to utilize the same workflow file for building and publishing, with them being two separate jobs.

```
jobs:
  build:
    if: startsWith(github.ref, 'refs/tags/')
    runs-on: ubuntu-latest
```

### Installing NPM Packages

Next, we will need to install NPM packages before we can build our angular app. In this case, we are using `yarn` but feel free to use your favorite package manager. We will start by checking out `(git checkout)` our repository. After that, we will then setup NodeJS and finally run yarn install to install our NPM packages.

```
steps:
  - uses: actions/checkout@v1
  - name: Setup Node
    uses: actions/setup-node@v1
    with:
      node-version: 12.x
  - name: yarn install
    run: yarn install
```

### Building Angular Project

And then, we can add a step to run `yarn build:prod` to build our Angular app in production.

```
- name: yarn build
  run:  yarn build:prod
```

### Creating a Release and Uploading Artifacts

Now that we have built our project, we are going to do two things next. We will zip the build artefacts and then create a release and upload our zipped artifact to the releases. We will use [papeloto/action-zip](https://github.com/marketplace/actions/easy-zip-files) action to zip the files:

```
- uses: papeloto/action-zip@v1
  with:
    files: "./dist/webapp/"
    dest: webapp.zip
```

> Replace `webapp` with the output directory of your angular project build.

And then, we are going to create a GitHub release and upload the above zipped artifact to the GitHub release. We will be using [ncipollo/release-action action](https://github.com/marketplace/actions/create-release), to accomplish this as shown below.

```
- name: Push Build to Releases
  uses: ncipollo/release-action@v1
  with:
    artifacts: "webapp.zip"
    token: ${{ secrets.GITHUB_TOKEN }}
```

Here is what our workflow looks so far:

```
name: Release a new Version

on:
  push:
    tags:
      - "*"

jobs:
  build:
    if: startsWith(github.ref, 'refs/tags/')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1

      - name: Setup Node
        uses: actions/setup-node@v1
        with:
          node-version: 12.x

      - name: yarn install
        run: yarn install

      - name: yarn build
        run:  yarn build:prod

      - uses: papeloto/action-zip@v1
        with:
          files: "./dist/webapp/"
          dest: webapp.zip

      - name: Push Build to Releases
        uses: ncipollo/release-action@v1
        with:
          artifacts: "webapp.zip"
          token: ${{ secrets.GITHUB_TOKEN }}
```

## Building Scully and Publishing Blog

Next, we are going to add a second job - `publishing` - that will download our Angular build artifacts from our repos latest release, run Scully build and upload the artifacts to our hosting platform.

First, we will need to listen to the on `repository_dispatch` as this is how we will trigger our website rebuild when the content on our CMS changes, as explained [here](https://mainawycliffe.dev/blog/github-actions-trigger-via-webhooks). Feel free to use any other GitHub action triggers suitable for your content management system i.e. on push to master on the blog directory if you are using markdown.

```
on:
  push:
    tags:
      - "*"

  repository_dispatch:
    types:
      - publish_blog
```

Next, we are going to create a publish job, which will run after the build job but if the build job doesn't run, it will run anyway. We will use the `if: always()` condition to run the job even if the build doesn't. This will run the publish job if a new blog post is published, which will skip the build job, but also when a new release is made, in which case you want the website to be published with changes that were released.

> The one downside of this approach is that the publish job will run even if the build job fails.

```
publish:
  runs-on: ubuntu-latest
  needs: [build]
  if: always()
```

Next, we will need to setup Node and run `yarn install` to install NPM packages as Scully needs both to run.

```
steps:
  - uses: actions/checkout@v1
  - name: Setup Node
    uses: actions/setup-node@v1
    with:
      node-version: 12.x
  - name: yarn install
    run: yarn install
```

After that, we are going to download our build artifact that we uploaded to GitHub release - `webapp.zip` - and unzip the content to the `dist/webapp` directory. To download the artifact from GitHub release, we will be using the [dsaltares/fetch-gh-release-asset](https://github.com/marketplace/actions/fetch-github-release-asset) action.

```
- uses: dsaltares/fetch-gh-release-asset@master
  with:
    repo: "USERNAME/REPOSITORY"
    version: "latest"
    file: "webapp.zip"
    target: "webapp.zip"
    token: ${{ secrets.GITHUB_PAT }}
```

> NB: For private repository, you will need a GitHub Personal Access Token `(PAT)` with at least the `org:hook` scope. Learn more [here](https://github.com/marketplace/actions/fetch-github-release-asset#token).

Next, we will create a directory to put the angular webapp build artifacts in and then unzip `webapp.zip` which we downloaded from GitHub releases.

```
- name: create dist directory
  run: mkdir -p dist/webapp

- name: Decompress
  uses: TonyBogdanov/zip@1.0
  with:
      args: unzip -qq ./webapp.zip -d ./dist/webapp
```

And finally, run `yarn scully` for statically site generation of our Angular app:

```
- name: Run scully
  run: yarn scully
```

Now we can deploy the Scully build artifact to your website. In this case we will use firebase hosting, which you can do as shown below.

```
- name: deploy firebase webapp
  uses: w9jds/firebase-action@master
  with:
    args: deploy --only hosting
  env:
    FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

And now our final GitHub Action Workflow looks like this:

```
name: Publish Blog

on:
  push:
    tags:
      - "*"

  repository_dispatch:
    types:
      - publish_blog
      - build_site

jobs:
  build:
    if: startsWith(github.ref, 'refs/tags/')
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v1

      - name: Setup Node
        uses: actions/setup-node@v1
        with:
          node-version: 12.x

      - name: yarn install
        run: yarn install

      - name: yarn build
        run:  yarn build:prod

      - uses: papeloto/action-zip@v1
        with:
          files: "./dist/webapp/"
          dest: webapp.zip

      - name: Push Build to Releases
        uses: ncipollo/release-action@v1
        with:
          artifacts: "webapp.zip"
          token: ${{ secrets.GITHUB_TOKEN }}

  publish:
    runs-on: ubuntu-latest
    needs: [build]
    if: always()

    steps:
      - uses: actions/checkout@v1

      - name: Setup Node
        uses: actions/setup-node@v1
        with:
          node-version: 12.x

      - name: yarn install
        run: yarn install

      - uses: dsaltares/fetch-gh-release-asset@master
        with:
          repo: "[USERNAME]/[REPO]"
          version: "latest"
          file: "webapp.zip"
          target: "webapp.zip"
          token: ${{ secrets.GITHUB_PAT }}

      - name: create dist directory
        run: mkdir -p dist/webapp

      - name: Decompress
        uses: TonyBogdanov/zip@1.0
        with:
            args: unzip -qq ./webapp.zip -d ./dist/webapp

      - name: Run scully
        run: yarn scully

      - name: deploy firebase webapp
        uses: w9jds/firebase-action@master
        with:
          args: deploy --only hosting
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

## Conclusion

In this article, we have looked at how we can optimize our Scully build time by splitting Angular builds and Scully builds, where we store our Angular builds and re-use the artifacts in future Scully builds.

This may not be necessary for your application if you are not using tools like purge CSS to remove unused CSS, since Angular builds are usually fast for small to medium size applications.

There are few things I skipped like caching NPM dependencies, which can shave off a few more seconds from your build time and I highly recommend you implement following instructions [here](https://github.com/marketplace/actions/cache).

### Links

- Use Webhooks to Trigger GitHub Actions - [Link](https://mainawycliffe.dev/blog/github-actions-trigger-via-webhooks).
- Getting Started with Scully - [Link](https://scully.io/docs/learn/getting-started/overview/).
- Getting Started with GitHub Actions - [Link](https://docs.github.com/en/actions/quickstart).
- About GitHub Releases - [Link](https://docs.github.com/en/github/administering-a-repository/about-releases).
- Angular CDK - Platform Module - [Link](https://mainawycliffe.dev/blog/angular-cdk-platform-module).
