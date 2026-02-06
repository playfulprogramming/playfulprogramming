---
{
title: "From Docker to Docker compose way!",
published: "2021-11-24T17:30:34Z",
edited: "2021-11-25T08:20:47Z",
tags: ["devops", "docker", "beginners"],
description: "If you work with docker, typing for every action is not a good deal, and sometimes it can be a...",
originalLink: "https://dev.to/this-is-learning/from-docker-to-docker-compose-way-56h",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

If you work with docker, typing for every action is not a good deal, and sometimes it can be a nightmare because a typo mistake breaks our process, rerunning all commands.

Today we will learn about how Docker-compose comes to make our experience with docker easy and fun.

The scope of the article is:

- Why docker-compose?
- How to create a docker-compose.yml file.
- Automate building images and environment variables.
- Orchestrate and communicate docker-compose. (Adding ports, volumes, and networks)
- Troubleshooting with Container logs and shells.

The idea is to move all our commands, and everyday tasks from the docker command line to docker-compose using a docker-compose.yml file and speed up our productivity.

If you don't have an idea about docker, please read the preview post about [docker from zero to survives](https://dev.to/this-is-learning/docker-from-zero-to-survive-40ho)

## Why docker-compose?

Most of our applications nowadays do not play alone. They need a database, storage service, security API, and more services around them, and each of them needs to become a container.

Docker-compose simplifies our life, performs it run with a single command, helps to build images, and orchestrates our containers.

In short, Docker-compose takes care of the application lifecycle and allows us to manage our containers' actions like start, stop, and simplify to get the status, publish and communicate between networks.

The Docker-compose command comes with three essential flags.

- `docker-compose build` Build containers defined into the docker-compose.yml.
- `docker-compose up`   Start the containers and networks.
- `docker-compose down`  Stop containers and networks.

All magic happens using the docker-compose.yml file behind, so let us talk about it.

## The Docker-compose file

Like dockerFile, we use the docker-compose.yml, and it has two primary vital areas the version it defines the schema supported and services that represent our containers definitions.

The services are the place to define our containers; it supports additional properties like image, builds,   environment, volumes, port, networks, and more.

> In YML files, the indentation matters and always use space.

We have the docker way and docker-compose; first is typing, and second is declaring the configuration into the docker-compose.yml.

Create a docker-compose.yml file with two properties the version and services.

- version: we tell docker which version of schema to use.
- the service declares the "web" container. In addition, add the image property and set it to nginx.

```yml
version: '3.0'
services:
  web:
    image: nginx
```

Save the file, run the command `docker-compose up`,
to build, create, and start the container.

```bash
dany@dany:~/Documents/docker-learn$ docker-compose up
Building with the native build. Learn about the native build in Compose here: https://docs.docker.com/go/compose-native-build/
Creating docker-learn_web_1 ... done
Attaching to docker-learn_web_1
web_1  | Starting up HTTP-server, serving ./
```

The docker-compose is already finished and shows the output into the terminal.

## Docker compose commands

We have more options for like start, stop and monitoring our containers.

The docker-compose accepts the following parameters.

`start`: Start containers without attaching to the terminal.

```bash
docker-compose start
```

`start -d`: Start the specific container and detach from the terminal with the -d flag.

```bash
docker-compose up  -d web
```

`--no-deps container name`: Start a specific container without dependencies.

```
docker-compose up --no-deps web
```

`ps`: Show active containers.

```bash
docker-compose ps 
```

`stop`: Stop containers.

```bash
docker-compose stop
```

## Ports

With our images ready, next step declare ports to access to the containers in the docker way is typing:

```bash
 docker run -p 80:80 imagename
```

In the docker-compose, add an extra property to the ports, for example:

```yml
  ports:
    - "3000:3000"
```

## Volumes

To save data from our container in our machines, we use the volumes, in the docker way is typing:

```bash
docker run -v $(PWD):/var/www imagename
```

In the docker-compose, add a new property volume with the host directory and container path.

```yml
  volumes:
   -./logs: var/www/logs
```

## Environment variables

To declare environment variable in the docker way is typing:

```bash
docker run --env NODE_ENV=production imagename
```

In docker-compose, we add an extra property environment with the list of all variables:

```yml
  enviroment:
    - NODE_ENV=production
    - APP_VERSION: 1.0
```

or  load form a file like:

```yml
env_file 
  - ./settings.env
  - ./app.env
```

## Bridge networks

We need a network to communicate apps, API, or databases using a  bridge network to allow communication between containers.

The docker way is typing.

```bash
docker network create --driver bridge network name
```

In docker-compose a new key `networks` with the name and type of driver:

```yml
networks:
      danynetwork:
        driver: bridge
```

## Use enviroment variables

In most scenarios, we want to have containers for production and development. We can tell to docker-compose which build to take for each environment using environment variables.

First, define our environment variable into the machines in Linux or Mac using export:

```bash
export WEB_ENV=dev
export WEB_ENV= prod
```

On windows machine with powershell.

```bash
$env:WEB_ENV = "dev"
```

Next step is to create two docker files with the names web.dev.dockerfile and web.prod.dockerfile

The web.dev.dockerfile uses an HTTP server on development mode.

```yml
FROM        node:alpine
LABEL       author=" Dany  Paredes"
WORKDIR     /var/www
COPY        src/index.html  .
RUN         npm  install  http-server  -g
EXPOSE      8080
ENTRYPOINT  ["http-server"]
```

The web.prod.dockerfile use nginx

```yml
FROM        nginx
LABEL       author="Production"
WORKDIR     /usr/share/nginx/HTML
COPY        src/index.html  .
EXPOSE      80
```

Edit the docker-compose.yml into the service, remove the image key, and add the build option to tell context, the file, and the dockerfile name.

The docker filename uses interpolation with our environment variable like `web.${WEB_ENV}.dockerfile` and gets the value of the environment variable, for example, dev.

```yml
version: '3.0'
services:
  web:
    build:
      context: .
      dockerfile: web.${WEB_ENV}.dockerfile
networks:
  danynetwork:
    driver: bridge
```

The docker-compose takes the environment variable WEB\_ENV on the build process and replaces the value nginx.${WEB\_ENV}.dockerfile with environmental value.

Into the terminal run `docker-compose build` , it will create our containers using the dev environment.

```bash
docker-compose build
Sending build context to Docker daemon  47.62kB
Successfully built f68d5cded665
Successfully tagged docker-learn_web:latest

```

We can use the environment variables on the publishing process to docker hub.

## Publish image to dockerhub

If you remember to publish our images into dockerhub,  we need to tell the dockerhub username and the image.

In the docker way:

```bash
docker push dockerhubusername/imagename
```

With the docker-compose, we declare another environment variable for the docker hub username like DOCKERHUBUSER.

```bash
export DOCKERHUBUSER=danywalls
```

Edit the docker-compose.yml and add container property `image` with the value of ${DOCKERHUBUSER} as part of the image name.

```yml
version: '3.0'
services:
  web:
    image: ${DOCKERHUBUSER}/web
    build:
      context: .
      dockerfile: web.${WEB_ENV}.dockerfile
    networks:
      - danynetwork
networks:
  danynetwork:
    driver: bridge
```

Next, run docker-compose push. It automatically publishes our image to dockerhub.

```bash
dany@dany:~/Documents/docker-learn$ docker-compose push
Pushing web (danywalls/web:latest)...
The push refers to repository [docker.io/danywalls/web]
latest: digest: sha256:c4ac44d2e318200eeafb03cdb7e64bc60d0da52092de5bacd69e2e9de10402c0 size: 1783
```

## Troblueshooting containers

The containers sometimes fail, or we need to see the logs.

In the docker way, we need to write the container id like:

```bash
docker logs myid
```

In docker-compose,  use the context of execution it shows the logs of all services declared into the docker-compose.yml

```bash
docker-compose logs 
```

Or pick a specific container using the name.

```bash
docker-compose logs web
```

And read the last five lines from the log.
docker-compose logs --tail=5

## Shell into a container

Sometimes we need to get access to the container and list or navigate inside of him.

In docker way:

```bash
docker exec it container id sh 
```

The docker-compose way is closely similar using the container name.

```bash
docker-compose exec web sh
```

## Summary

Well, in short, we learned how to use docker-compose to help us to orchestrate your containers and declare ports, volumes, variables, and networks into docker-compose files.

Also, read logs and use docker-compose commands used to start, stop, remove or list containers.

The docker-compose way makes easy our tasks with docker and simplify because we have a context about execution and containers.

Photo by <a href="https://unsplash.com/@frankiefoto?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">frank mckenna</a> on <a href="https://unsplash.com/s/photos/container?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
