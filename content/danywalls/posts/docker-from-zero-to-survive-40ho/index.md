---
{
title: "Docker from zero to survive",
published: "2021-11-02T17:16:47Z",
edited: "2021-11-02T22:09:52Z",
tags: ["docker", "devops", "cloudskills"],
description: "Be ready to deploy your apps with Docker is a one of higher-demand knowledge today, and this article...",
originalLink: "https://https://dev.to/playfulprogramming/docker-from-zero-to-survive-40ho",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

Be ready to deploy your apps with Docker is a one of higher-demand knowledge today, and this article will guide you (and me ) from zero to survive with Docker.

The guide key features are:

- Install and run docker
- Create and build images
- Mount volumes
- Create networks
- Publish in dockerhub
- Use Docker-compose.

After reading the docker official documentation, we understood that Docker gives us the freedom to run our applications everywhere, language and framework-agnostic, and unlock the following points.

- Easy way to deliver an application.
- Make easy setup sandbox for development.
- No version conflicts and environment consistency.
- Easy to know the dependencies and requirements of our apps.

## Install Docker and Run

The Docker provides an installer for Windows and Mac; for Linux, you need to write some commands. All steps are on the official docker website https://docs.docker.com/engine/install/ubuntu/ or use the following command scripts.

> It works in Ubuntu 20 or higher.

```bash
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable" -y
sudo apt update
sudo apt install docker-ce -y
sudo usermod -aG docker ${USER}
su - ${USER}
id -nG
sudo curl -L "https://github.com/docker/compose/releases/download/1.28.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
docker ps
```

If everything works,  test your Docker running the following command from terminal Docker run hello-world.

```bash
    docker run hello-world
    Unable to find image 'hello-world:latest' locally
    latest: Pulling from library/hello-world
    2db29710123e: Pull complete 
    Digest: sha256:37a0b92b08d4919615c3ee023f7ddb068d12b8387475d64c622ac30f45c29c51
    Status: Downloaded newer image for hello-world:latest
    Hello from Docker!
    This message shows that your installation appears to be working correctly.
```

The command, get the image, and run it! If you get the message, you are ready for the next step about Docker images.

## Docker Images

A Docker image is like a box. It can bring one or multiple services, apps, databases, web servers, cache, etc.

For example, if you want a webserver like Nginx, Docker pulls and runs an image with an Nginx server ready, so you don't need to install Linux, install Nginx, configure ports, etc.

If you already worked with git, it sounds familiar typing; Docker pull nginx, Docker finds in your machine for the image, if not then gets from Dockerhub.

> Dockerhub is like GitHub for Docker.

```bash
dany@dany:~$ docker pull nginx
Using default tag: latest
latest: Pulling from library/nginx
Digest: sha256:644a70516a26004c97d0d85c7fe1d0c3a67ea8ab7ddf4aff193d9f301670cf36
Status: Downloaded newer image for nginx:latest
docker.io/library/nginx:latest
```

Docker provides more commands to work with images like `docker images` lists all images in our machine.

```bash
dany@dany:~$ docker images
REPOSITORY TAG           IMAGE ID       CREATED         SIZE
nginx      latest        87a94228f133   2 weeks ago     133MB
```

Remove our images. We use `docker rmi imageid` or name.

```bash
dany@dany:~$ docker rmi nginx
Untagged: nginx:latest
Untagged: nginx@sha256:644a70516a26004c97d0d85c7fe1d0c3a67ea8ab7ddf4aff193d9f301670cf36
Deleted: sha256:87a94228f133e2da99cb16d653cd1373c5b4e8689956386c1c12b60a20421a02
```

> Sometimes, our image is linked with a container and needs to use -f to force remove it.

We are ready to run our containers!

## Running Containers

We have the nginx image in our machine, and then Docker helps us start the nginx and try to access the port provided by nginx; in short, it is like telling Docker.

*Hey Docker, please run nginx using port x and translate port x to port y from nginx*; the command version is `docker run -p 8080:80 nginx`.

The container start and show the logs into the terminal.

```bash
docker run  -p 8080:80 nginx
/docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
/docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/
/docker-entrypoint.sh: Launching /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh
10-listen-on-ipv6-by-default.sh: info: Getting the checksum of /etc/nginx/conf.d/default.conf
10-listen-on-ipv6-by-default.sh: info: Enabled listen on IPv6 
```

Ready, from the browser, go to http://localhost:8080, next step build our image.

## The Dockerfile

Building an image for Docker requires a particular file, "The Dockerfile" it contains all commands to Docker build, like code, and use docker build compiler and build the Docker image.

The Dockerfile is a yml, with a few commands most used instructions:

*FROM* The image where we want to start. e.g., FROM node:alpine.

*LABEL* add extra information, e.g., LABEL author=" Dany."

*ENV* declare variables, e.g., ENV NODE\_ENV=production.

*WORKDIR*  The location in the container. e.g. WORKDIR /var/www.

*COPY* Copy files to the container, e.g., COPY index.html /var/www.

*RUN* Executes the command in the container, e.g., RUN npm install.

*EXPOSE* Open a port to communicate with the container, e.g., EXPOSE 8080.

*ENTRYPOINT*   The command to start the container. e.g ENTRYPOINT \[./app.sh ]

Now, we have an idea of the main keywords, let's build an image with the following points.

- Create bases of a node:alpine, it comes with node.
- Define our name as the author
- Declare an environment variable
- Install the HTTP-server npm package.
- Set a working directory
- Copy an index.html file into the container.
- Run entry project, the HTTP-server.

## Build our Image

Create a file app.dockerfile

```yml
FROM  		node:alpine
LABEL  		author="Dany  Paredes"
ENV  		production=false
WORKDIR  	/var/www
COPY  		index.html  .
RUN  		npm  install  http-server  -g
EXPOSE  	8080
ENTRYPOINT  ["http-server"]
```

Create a file index.html with content like "Hello from Docker" in the same directory of the app.dockerfile.

```html
<h1>Hello! from docker!!</h1>
```

Build the image using the Docker build command and using -t flag to tell the name of our image and -f flag to tell which docker file to use.

> Skip use -f if the docker file name is Dockerfile.

```bash
docker build -t webdockerize -f app.dockerfile .
Sending build context to Docker daemon  3.072kB
Step 1/8 : FROM node:alpine..
Successfully built 437881e62fa2
Successfully tagged blog:latest
 ---> c0fc1c9c473b
```

Docker built the blog image. Next, list the docker-images, and the webdockerize is in our list.

```bash
dany@dany:~/Documents/dockriz$ docker images
REPOSITORY    TAG     IMAGE ID       CREATED         SIZE
webdockerize  latest  437881e62fa2   5 minutes ago   176MB
```

Ready to run the image with the command docker run and using the ports 8080.

```bash
docker run -p 8088:8080 webdockerize
Starting up http-server, serving ./
http-server version: 14.0.0
Available on:
  http://127.0.0.1:8080
  http://172.17.0.2:8080
Hit CTRL-C to stop the server
```

Our webserver is running. Go to http://localhost:8088, and it shows the hello docker page.

## Container with Volumes

To access the container to the local directory or use files from our machines,  we use our machine directory as part of the container instead of copying files to the images.

Docker with the flag -v (volumes) allows the container map host directory as part of the container. Close similar to the ports; the volume works the same way,  -v `external directory: internal directory`.

```bash
docker run -p 8088:8080 -v /home/dany/Documents/dockriz/app:/var/www danywalls/webdockerize
```

> Use ${PWD} if you want to take the current directory.

## Playing with the containers.

The container is ready, maybe run one or two instances, know which containers are running, get into the container or watch the output like logs; Docker provides a solution for each situation.

List active containers, `docker ps -a`.

```bash
docker ps -a
ID  IMAGE  COMMAND CREATED     STATUS       PORTS     NAMES
8a21256f7f3f   nginx     "/docker-entrypoint.…"   5 seconds ago   Exited       dazzling_ganguly
```

To get into the container shell, use the command docker exec -it containerid. It will give access to the container shell to play with it.

```bash
docker exec -it 34bb0840ddb5 sh
/var/www # ls
index.html
```

Get the output log from the container using `docker logs container`.

```bash
docker logs 8a21256f7f3f
/docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
/docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/
/docker-entrypoint.sh: Launching /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh
```

We can learn more about available commands running Docker --help or check out the docker guides https://docs.docker.com/go/guides/.

## Docker Network

Sometimes we need to run multiple containers of the same or other images and talk together, like an app with API or database. We can have a container with a database and another with the web app.

We use a bridge network to communicate between containers, and Docker allows us to use the `docker network` command.

To create a network using `docker network create` and the driver to use (you have multiple types), my example is bridge focus to communicate my containers between them.

```bash
docker network create --drive bridge danynetwork
```

Other handy commands are:

- `docker network ls`  get the list of network
- `docker network rm` network name remove a network

> Read more about network drivers https://docs.docker.com/network/#network-drivers

Run our container in specific network use --net and network name.

```bash
docker run -d --net=danynetwork -p 3050:3000 danywalls/webdockerize
```

## Dockerhub

Dockerhub is like the GitHub for our docker images. Create an account at https://hub.docker.com/, and login into the terminal with the command `docker login,` add your credentials, and our Docker is ready to store our images.

Run again to build with the flag -t and your username/name of the image.

```bash
docker build -t danywalls/webdockerize -f app.dockerfile .
```

Next, push the image using `docker push` and the last build image with tagged with your username.

```bash
dany@dany:~/Documents/dockriz$ docker push danywalls/webdockerize:latest
The push refers to repository [docker.io/danywalls/webdockerize]
2d6ed4627650: Pushed 
e9522abed4c4: Pushed 
a40075dcb1c2: Pushed 
bdfe600c60fd: Mounted from library/node 
e9b39456535c: Mounted from library/node 
d61ddabe4e93: Mounted from library/node 
e2eb06d8af82: Mounted from library/node 
latest: digest: sha256:e6fbc3dbf6bba15cf312d12ee6600bd4f27a2f49e05f105dc1a54c05550a68c5 size: 1783
```

Remove the local image using docker rmi.

```bash
docker rmi danywalls/webdockerize:latest 
Untagged: danywalls/webdockerize:latest
Untagged: danywalls/webdockerize@sha256:e6fbc3dbf6bba15cf312d12ee6600bd4f27a2f49e05f105dc1a54c05550a68c5
```

Get the image from dockerhub using the docker pull command.

```bash
docker pull danywalls/webdockerize:latest
latest: Pulling from danywalls/webdockerize
Digest: sha256:e6fbc3dbf6bba15cf312d12ee6600bd4f27a2f49e05f105dc1a54c05550a68c5
Status: Downloaded newer image for danywalls/webdockerize:latest
docker.io/danywalls/webdockerize:latest
```

## Docker Compose

All steps before commands, we can simplify using docker-compose.

Docker-Compose helps us define services using a YAML file, build multiple images, start and stop services and have everything in a single file.

Basic docker-compose  commands:

- `docker-compose build`: take all services and build the images.
- `docker-compose up` start all containers.
- `docker-compose down` stop all containers.

> Read more about docker-compose https://docs.docker.com/compose/

## The docker-compose.yml

Some docker key areas.

- version: '3.x' the version of files
- services: the declaration of our containers
- networks: define the network between containers.
- depends\_on: define a container dependency.

Create a file docker-compose.yml it, in the services area,
declare two containers, 'web' and 'API.'

images: tell where we get from local file or dockerhub.
ports: the expose port network: to add the container into a network.
depends\_on: if our container requires another before starting.

The docker-compose.yml looks like this:

```yml
version: '3.0'
services:
  web:
    image: danywalls/webdockerize
    ports:
      - '8080:8080'
    networks:
      - danynetwork
    depends_on:
      - api
  api:
    image: danywalls/apijson
    ports:
      - '3000:8080'
    networks:
      - danynetwork
networks:
  danynetwork:
    driver: bridge
```

Next, start our containers using docker-compose up.

```bash
 docker-compose up
Building with native build. Learn about native build in Compose here: https://docs.docker.com/go/compose-native-build/
Creating dockriz_api_1 ... done
Creating dockriz_web_1 ... done
```

The web and API work if you stop all the containers and network with the flag stop.

```bash
docker-compose stop
```

\##Done!
That's it! Hopefully, give you a bit of help with Docker about basic commands with Docker, deploy our apps, create our images, communicate between using networks and simplify the process using docker-compose.

If you enjoyed this post, share it!

Helpful links
https://typeofnan.dev/how-to-stop-all-docker-containers/
https://www.docker.com/sites/default/files/d8/2019-09/docker-cheat-sheet.pdf
