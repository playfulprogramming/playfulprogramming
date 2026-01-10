---
{
title: "My Impressions of Docker Development Containers",
published: "2021-07-22T13:49:54Z",
tags: ["docker", "vscode", "tooling", "programming"],
description: "Docker development containers enable developers to set up development environment faster and...",
originalLink: "https://mainawycliffe.dev/blog/my-impressions-of-docker-development-containers",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

Docker development containers enable developers to set up development environment faster and consistently. With docker development containers, you can configure a container with all required tools and SDKs necessary for a project's development environment, which can easily and consistently be recreated with little to no **hassle**.

For instance, take an Angular project, this requires a few things to get started, like Typescript, NodeJS, Angular CLI, etc. This can easily be created using docker and once set up can easily be re-created on demand. As you can imagine, this can have several benefits, which we will look at later.

On its own, it still leaves much to be desired though. But, a while back the Visual Studio Code team released a pack of extensions for remote development. These extensions enabled you to work with development environment hosted remotely such as docker containers, among others and continue with development workflow as you would if they were on your local PC.

Combined with VS Code Remote - Container's extension, part of [Visual Studio Remote extensions pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers), which enables you to use docker as a full-fledged development environment. The Remote Container extension, provides you with tools to connect to a docker container and carry on with your development workflow on the container. 

On top of that, it provides tools to:

* Generate Docker Environment Configurations for different environment requirements like Typescript, Golang, etc. This allows you fine-grained control over your development environment with exactly the dependencies you need to enable your development workflow. 
* Clone a repository directly to docker containers. You can target different branches and PRs, allowing you to have a development environment per PR if need be.

## Benefits For Development

For one, since docker containers are isolated environments, collision between different development environment dependencies is greatly reduced if not entirely eliminated. How many times have you required to have different versions of the same dependency installed, for instance NodeJS? Docker development container would eliminate such collisions entirely, reducing the need for tools such as NVM.

Secondly, it is easier to onboard developers, as the development environment are already specified and it's a matter of building the containers. This makes it easy to onboard developers as they can set up their environment faster and go straight to understanding what actually matters to the organization. 

On top of on boarding new developers, reviewing PRs is easier, as you can easily and quickly create a new development environment per PR for review purpose. VS Code remote container extension provides you with tools to enable clone repository, branches or PRs into development containers, making this a more viable approach.

Another key benefit is keeping your development environments up to date across team members becomes easier. When you come back from a vacation, with a single command, you can update your development environment making easy to continue as if you never left with little to no hinderances. 

Fully compatibility with GitHub Code Spaces. GitHub code spaces is a remote development environment that uses docker development containers under the hood. While still in beta and a lot could change, as of the moment of writing, they are fully compatible. This means that you can easily take your development environment on the road without needing to configure anything after the initial configuration. GitHub code spaces will provide you with all the computing power you need while on the road.

## Cons

Steep learning curve. While VS Code helps to set up common development environments like NodeJS, Typescript, etc., setting a fine-grained environment will require you to understand docker and dockerfiles. This can be a barrier to people who aren't familiar to docker and adds an extra barrier to getting up to speed.

## Conclusion

In this article, we looked at Docker development containers and the benefits of using them. I am hoping that the benefits we looked at above convinced you to give docker development containers a try. 

If you are looking to get started, here some resources for you:

* [Developing inside a Container using Visual Studio Code Remote Development](https://code.visualstudio.com/docs/remote/containers)
* [Use containers for development | Docker Documentation](https://docs.docker.com/language/nodejs/develop/)
* [Develop with Docker | Docker Documentation](https://docs.docker.com/develop/)