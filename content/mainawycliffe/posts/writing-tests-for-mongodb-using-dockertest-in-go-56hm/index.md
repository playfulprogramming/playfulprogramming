---
{
title: "Writing Tests for MongoDB using Dockertest in Go",
published: "2022-01-03T18:31:09Z",
tags: ["go", "docker", "testing", "mongodb"],
description: "Dockertest enables us to use Docker to create containers to run our tests against. With dockertest,...",
originalLink: "https://mainawycliffe.dev/blog/using-dockertest-to-write-integration-tests-against-mongodb/",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

Dockertest enables us to use Docker to create containers to run our tests against. With dockertest, we can use it to create a Docker container for our tests, which we can then connect to and run our tests against. And then remove the container afterward. This means that every time we run the tests, we get a sanitized environment that is not contaminated by the test data from previous tests.

## Prerequisites

- Prior knowledge in MongoDB, Go, and Docker.
- Docker: You can find installation instructions can be found [here](https://docs.docker.com/engine/install/).
- Golang: You can find installation instructions can be found [here](https://go.dev/doc/install).

## Getting Started

In this tutorial, we will run how we can use dockertest to write tests for our MongoDB database.

To demonstrate how to use dockertest for testing, we will build a very barebone todo app backend. It will have a few methods that will use MongoDB to store and retrieve the todos. We will have a few methods: `AddTodo`, `DeleteTodo`, `GetTodo`, `ListTodos` and `ToggleTodo` and here is the code implementation of the above methods:

```go
var db *mongo.Client

func TestMain(m *testing.M) {
	// Setup
	pool, err := dockertest.NewPool("")
	if err != nil {
		log.Fatalf("Could not connect to docker: %s", err)
	}
	
	environmentVariables := []string{
		"MONGO_INITDB_ROOT_USERNAME=root",
		"MONGO_INITDB_ROOT_PASSWORD=password",
	}
	
	resource, err := pool.Run("mongo", "5.0", environmentVariables)
	if err != nil {
		log.Fatalf("Could not start resource: %s", err)
	}

	// exponential backoff-retry, because the application in the container might not be ready to accept connections yet
	if err = pool.Retry(func() error {
		var err error
		db, err = mongo.Connect(
			context.TODO(),
			options.Client().ApplyURI(
				fmt.Sprintf("mongodb://root:password@localhost:%s", resource.GetPort("27017/tcp")),
			),
		)
		if err != nil {
			return err
		}
		return db.Ping(context.TODO(), nil)
	}); err != nil {
		log.Fatalf("Could not connect to docker: %s", err)
	}

	// seed data

	// Run tests
	exitCode := m.Run()

	// Teardown
	// When you're done, kill and remove the container
	if err = pool.Purge(resource); err != nil {
		log.Fatalf("Could not purge resource: %s", err)
	}

	// Exit
	os.Exit(exitCode)
}
```

Now that we have our barebone todo app backend, let's write tests for it using dockertest. The first thing we are going to do is install dockertest by running the following command:

```sh
go get -u github.com/ory/dockertest/v3
```

## Setup and Teardown using TestMain

We are going to be using `TestMain` to set up our MongoDB container using dockertest for testing and remove the container after we are done running the tests.

`TestMain` in Go provides us with more control on how our tests are run, in our case, allowing us to use dockertest to set up a MongoDB container and connect to it and after the tests have run, remove it. This ensures that for every test we run, we have a fresh database to run tests against that is not contaminated by test data from the previous tests.

### Setup MongoDB Docker Container

We are going to start by defining a database client variable to store the MongoDB connection to the test database that will be spun up. We will pass this client to the `Todo` struct that we will create when running the tests.

```go
var db *mongo.Client

func TestMain(m *testing.M) {
  // setup and teardown code goes in here 
}
```

Next, inside the `TestMain` function, we are going to create a new `Pool`. A `Pool` is a dockertest struct that represents a connection to the Docker API and is used to create and remove the docker container when running tests.

```go
pool, err := dockertest.NewPool("")

if err != nil {
	log.Fatalf("Could not connect to docker: %s", err)
}
```

> **NB:** Please make sure to import dockertest properly - to include the version of dockertest: `github.com/ory/dockertest/v3` and not `github.com/ory/dockertest` as VS Code might import it.

And then, we are going to define a few environment variables that will be passed to our MongoDB containers. For the MongoDB container, we need to pass the `MONGO_INITDB_ROOT_USERNAME` and `MONGO_INITDB_ROOT_PASSWORD` which are going to set the credentials for the superuser for our MongoDB Database. The environment variables are defined as a String Array, with each entry of the array being a string in the following format: `KEY=VALUE`.

```go
environmentVariables := []string{
	"MONGO_INITDB_ROOT_USERNAME=root",
	"MONGO_INITDB_ROOT_PASSWORD=password",
}
```

Next, we need to create a docker container using the `pool.Run` function which accepts the docker image to use, the tag, and the environment variables we defined above.

```go
resource, err := pool.Run("mongo", "5.0", environmentVariables)
if err != nil {
	log.Fatalf("Could not start resource: %s", err)
}
```

And the final step for the setup is to try and connect to our MongoDB container and we will do this by creating a database client and pinging our database to ensure we can connect to our MongoDB container successfully.

```go
if err = pool.Retry(func() error {
	var err error
	db, err = mongo.Connect(
		context.TODO(),
		options.Client().ApplyURI(
				fmt.Sprintf("mongodb://root:password@localhost:%s", resource.GetPort("27017/tcp")),
		),
	)
	if err != nil {
		return err
	}
	return db.Ping(context.TODO(), nil)
}); err != nil {
	log.Fatalf("Could not connect to docker: %s", err)
}
```

After that, we can seed our database with test data if we have any. And then we can run our package tests by calling `m.Run()`.

```go
// seed data

// Run tests
exitCode := m.Run()
```

### Teardown

Once our tests are all done, we are going to kill and remove the container.

```go
if err = pool.Purge(resource); err != nil {
	log.Fatalf("Could not purge resource: %s", err)
}
```

And finally, we can call `os.Exit()` passing the exit code from `m.Run()` above.

```go
os.Exit(exitCode)
```

And that's it for our `TestMain`, here is what the method should look like now:

```go
var db *mongo.Client

func TestMain(m *testing.M) {
	// Setup
	pool, err := dockertest.NewPool("")
	if err != nil {
		log.Fatalf("Could not connect to docker: %s", err)
	}

	environmentVariables := []string{
		"MONGO_INITDB_ROOT_USERNAME=root",
		"MONGO_INITDB_ROOT_PASSWORD=password",
	}

	resource, err := pool.Run("mongo", "5.0", environmentVariables)
	if err != nil {
		log.Fatalf("Could not start resource: %s", err)
	}

	// exponential backoff-retry, because the application in the container might not be ready to accept connections yet
	if err = pool.Retry(func() error {
		var err error
		db, err = mongo.Connect(
			context.TODO(),
			options.Client().ApplyURI(
				fmt.Sprintf("mongodb://root:password@localhost:%s", resource.GetPort("27017/tcp")),
			),
		)
		if err != nil {
			return err
		}
		return db.Ping(context.TODO(), nil)
	}); err != nil {
		log.Fatalf("Could not connect to docker: %s", err)
	}

	// seed data

	// Run tests
	exitCode := m.Run()

	// Teardown
	// When you're done, kill and remove the container
	if err = pool.Purge(resource); err != nil {
		log.Fatalf("Could not purge resource: %s", err)
	}

	// Exit
	os.Exit(exitCode)
}
```

Next, let's write a few tests for our code:

## Writing Tests Against MongoDB

We will start by writing the simplest one, the `AddTodo` test. We are going to add a todo and then assert that error is nil and also check in the database to make sure that the todo exists in the database:

```go
func TestAddTodo(t *testing.T) {
	todos := Todos{
		client: db,
	}
	createdAt := primitive.Timestamp{
		T: uint32(time.Now().Unix()),
		I: 0,
	}
	todo := model.Todo{
		Todo:      "test",
		IsDone:    false,
		CreatedAt: createdAt,
		UpdatedAt: createdAt,
	}
	// add todo
	todo, err := todos.AddTodo(todo)
	// assert error is nil
	assert.Nil(t, err)
	// assert todo ID is not not nil
	assert.NotNil(t, todo.ID)
	// fetch todo from the database
	todoGet, err := todos.GetTodo(todo.ID.Hex())
	// assert error is nil
	assert.Nil(t, err)
	// assert todo is equal to the todo returned from the database
	assert.Equal(t, todoGet, todo)
}
```

For the `GetTodo` test, we are going to add a new todo first and then use `GetTodo` method to retrieve the todo we added and assert that they are Equal:

```go
func TestGetTodo(t *testing.T) {
	todos := Todos{
		client: db,
	}
	createdAt := primitive.Timestamp{
		T: uint32(time.Now().Unix()),
		I: 0,
	}
	todo := model.Todo{
		Todo:      "Test Get Todo",
		IsDone:    false,
		CreatedAt: createdAt,
		UpdatedAt: createdAt,
	}
	todoAdd, err := todos.AddTodo(todo)
	assert.Nil(t, err)
	todoGet, err := todos.GetTodo(todoAdd.ID.Hex())
	assert.Nil(t, err)
	assert.Equal(t, todoGet.Todo, todo.Todo)
}
```

And the final test I want to focus on is the test for `ToggleTodo` which marks a todo as done or vice versa based on the current status. In this one, we are going to add a todo and then toggle, retrieve it from the database and then check `IsDone` is not equal to the original `IsDone` property.

```go
func TestToggleTodo(t *testing.T) {
	todos := Todos{
		client: db,
	}
	createdAt := primitive.Timestamp{
		T: uint32(time.Now().Unix()),
		I: 0,
	}
	todo := model.Todo{
		Todo:      "Test Toggle Todo",
		IsDone:    false,
		CreatedAt: createdAt,
		UpdatedAt: createdAt,
	}
	todoAdd, err := todos.AddTodo(todo)
	assert.Nil(t, err)
	err = todos.ToggleTodo(todoAdd.ID.Hex())
	assert.Nil(t, err)
	todoGet, err := todos.GetTodo(todoAdd.ID.Hex())
	assert.Nil(t, err)
	assert.NotEqual(t, todoGet.IsDone, todo.IsDone)
}
```

The rest of the tests can be found [here](https://github.com/mainawycliffe/todo-dockertest-golang-mongo-demo/blob/main/todos/todos_test.go) on GitHub.

## Conclusion

In this article, we learned how we can use dockertest to create MongoDB containers that we can write tests against. Dockertest uses docker to create a test container during the setup process and remove the docker container after all tests have run ensuring a sanitized test Database every time.

For more information on dockertest, you can find the repository [here](https://github.com/ory/dockertest).

### Source Code

You can find the source code for the examples given in this article [here](https://github.com/mainawycliffe/todo-dockertest-golang-mongo-demo).
