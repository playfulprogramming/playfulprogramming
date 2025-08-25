---
{
  title: "Sharing Code Across Python Microservices with Poetry, Pip, and Docker",
  description: "When working on multiple Python projects within a microservices architectured solution, it makes sense to reuse code.",
  published: '2025-08-25',
  tags: ["python"],
  license: 'cc-by-4'
}
---

When building Python microservices, you often end up duplicating utility functions, models, or exception classes across services.

Instead of duplicating code, you can package shared logic into a reusable module and install it like any other dependency in each microservice.

In this tutorial, we’ll look at:

- Structure your project with multiple services
- Extract shared code into a common module
- Use Poetry to manage the shared module
- Use pip + Docker to install it into your services cleanly

By the end of this tutorial, you will have a working set up like this:

<!-- ::start:filetree -->
  - `my-project/`
    - `shared/` Shared module managed with Poetry
      - `pyproject.toml`
      - `shared/`
        - `main.py`
    - `apps/`
      - `app-one/` Flask app with pip + Docker
        - `Dockerfile`
        - `main.py`
      - `app-two/` Flask app with pip + Docker
        - `Dockerfile`
        - `main.py`
    - `docker-compose.yml`
<!-- ::end:filetree -->

## Platform

This article supposes that users will be using MacOS. The equivalent action can be done on any platform.

## Create docker-compose.yml file

We'll use Docker to run our microservices, and define them using a docker-compose.yml file.

> 💡 **Docker & Docker Compose**
> Docker is a tool to package code and dependencies into isolated containers.
> Docker Compose allows you to define and run multiple containers together using a `docker-compose.yml` file.

Let’s start by creating a Docker Compose file in the root of the project, this can be done with the command `touch docker-compose.yml`. Now let's add the code to this file.

```yaml
version: "3.9"

services:
  app1:
    build:
      context: .
      dockerfile: ./apps/app-one/Dockerfile
    ports:
      - "5001:5000"

  app2:
    build:
      context: .
      dockerfile: ./apps/app-two/Dockerfile
    ports:
      - "5002:5000"
```

Here's a quick breakdown of what this file does.

- The services key defines the services of the project. When docker builds and runs the project, each service will have its own container
- On the level below the services is the name of each service. In our example, we have two services, `app-one` and `app-two`. Both are identical.
- The build key has two subkeys, `context` and `dockerfile`. Context refers to the location that each container will have visibility of the project. In our case, each container will be able to access files in the root of the folder. This will allow them to reference code in the shared folder. The Dockerfile contains instructions Docker uses to build each container image.
- The other subkey of each app is the `ports` subkey. This maps a port on your local machine (left side, e.g. 5001) to the container’s internal port (right side, 5000, which Flask uses). So when you visit localhost:5001, Docker forwards that request to port 5000 inside the app1 container.

## Create shared module

Now we can create the module that will be shared between each app. Let's start by creating the folder and files using the following command: `mkdir shared && cd shared && touch pyproject.toml && mkdir shared && cd shared && touch utils.py`.

This creates the shared/ folder and an empty `pyproject.toml` file, as well as another shared folder with an empty `utils.py` file. Now let's add the code to these files. First the utils module, this will be a simple log statement.

Paste the following code in the `utils.py` file.

```python
import logging

def log_info(message):
    logging.info(f"[SHARED LOG] {message}")
```

This function simply logs a message using `logging.info`. We will use this function as the imported code from the shared module.

Let's now paste the code below to the `pyproject.toml` file.

```po
[tool.poetry]
name = "shared"
version = "0.1.0"
description = "Shared Python code for microservices"
authors = ["Your Name <your_name@email.com>"]
packages = [{ include = "shared" }]
license = "MIT License"

[tool.poetry.dependencies]
python = ">=3.13.5"


[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
```

> While we use Poetry to manage the shared module, we install it in services using `pip install ./shared`. This works because Poetry produces a standard pyproject.toml compatible with pip

## Create app-one service

Let's now create the first microservice. First we need to create the files and folders, from the root directory we run the command `cd ../.. && mkdir apps && cd apps && mkdir app-one && cd app-one && touch Dockerfile && touch main.py`.

Now copy the following code to the main.py file in the app-one folder.

```python
from flask import Flask
import logging
from shared.utils import log_info

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)

@app.route("/")
def home():
    log_info("App1 called home endpoint")
    return "Hello from App1!"
```

The above code defines a Flask server application with a home API endpoint which uses the `log_info` function from the shared module. This home endpoint will return the text "Hello from App1!". It also creates a log configuration to allow messages to be logged to the console.

We can now move onto the `Dockerfile`, paste this code into this file.

```docker
# use this image as the base
FROM python:3.13.5-slim

# set the working directory
WORKDIR /app

# copy shared Python code
COPY shared/ ./shared

# install packages in the `./shared` folder's pyproject.toml file
RUN pip install --no-cache-dir ./shared

# copy the app-one service
COPY apps/app-one .

# install the flask package
RUN pip install flask

# open port 5000
EXPOSE 5000

# set Flask environment variables
ENV FLASK_ENV=development
ENV FLASK_DEBUG=1
ENV FLASK_APP=main

# run the flask app; --host allows external requests; --port uses port 5000 for the flask app, the requests to that port will be forwarded to the running flask app
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
```

This Dockerfile is what will be used to create the server for the app-one service. There are descriptive comments which explain what is happening in the configuration of the server in the Dockerfile.

## Create app-two service

It's now time to create the app-two service, which will be a mirror of the app-one service. We can make a copy of the app-one folder and make a few changes to it. Let's go back to the apps folder, you should currently be in the app-one folder. If so, type this command in your terminal: `cd .. && cp -R app-one app-two`. You should now have a `./apps/app-two` folder as well.

In the `./apps/app-two/Dockerfile` file, on line 14, replace `COPY apps/app-one .` with `COPY apps/app-two .`.

Then , in the `./apps/app-two/main.py` file, on line 14, replace the home function with the following.

```python
def home():
    log_info("App2 called home endpoint")
    return "Hello from App2!"
```

## Run app with Docker

We need to go back to the project root to run the project with Docker. If you followed the instructions above, you would now be in the `apps` folder. Run the command `cd ..`.

You can now run the app with `docker compose up --build`. Navigate to `http://localhost:5001`. You should see "Hello from App1!" in your browser and "App1 called home endpoint" in the Docker logs. Navigating to `http://localhost:5002` will show "App2 called home endpoint" in the browser and "Hello from App2!" in the Docker logs.

By splitting shared logic into a reusable Poetry-managed module, and installing it cleanly into each microservice via Docker and pip, you’ve created a maintainable foundation for working with Python microservices. This pattern prevents code duplication, makes testing easier, and keeps your services modular. From here, you can expand your shared module, add more services, and introduce automated testing or CI/CD workflows to take your system to the next level.
