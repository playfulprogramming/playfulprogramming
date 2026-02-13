---
{
title: "Level UP your RDBMS Productivity in GO",
published: "2023-12-05T13:30:00Z",
tags: ["go", "rdbms", "sql", "db"],
description: "IMPORTANT: All the things in this article are highly opinionated, and they are not a standard. I'm...",
originalLink: "https://davideimola.dev/blog/level-up-your-rdbms-productivity-in-go/"
}
---

> **IMPORTANT**: All the things in this article are highly opinionated, and they are not a standard. I'm just sharing my experience and what I think is the best way to do it.
> If you have a better way to do it, please let me know in the comments. Examples are in PostgreSQL, but you can use the same approach for MySQL, SQLite, etc.
>
> No DB have been harmed in the making of this article, but a couple was truncated. 🤫

## Let's start with the actual status

Handling SQL DataBases in GO, as for different languages, can bring a lot of pain and frustration.

We may encounter a lot of problems, like:

### Handling the DB Code

For sure, you have seen a lot of code like this:

```go
func (s *Store) ListUsers(ctx context.Context) ([]User, error) {
    rows, err := s.db.QueryContext(ctx, "SELECT * FROM users")
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var users []User
    for rows.Next() {
        var user User
        if err := rows.Scan(&user.ID, &user.Name, &user.Email); err != nil {
            return nil, err
        }
        users = append(users, user)
    }
    if err := rows.Err(); err != nil {
        return nil, err
    }
    return users, nil
}
```

Isn't it beautiful? ?? Let's be honest! It's not! Who loves writing again and again all this code? I don't!

No, Copilot (or any generative AI 🤖) is not the solution.

### Finding hidden errors in SQL

We may have a lot of errors in our SQL code that we can't find until we run the code.

Let's play! Can you find the error in this code? If, yes write it in the comments.

```go
func (s *Store) ListUsers(ctx context.Context) ([]User, error) {
    rows, err := s.db.QueryContext(ctx, "SELECT * FROM upsers")
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var users []User
    for rows.Next() {
        var user User
        if err := rows.Scan(&user.ID, &user.Name, &user.Email); err != nil {
            return nil, err
        }
        users = append(users, user)
    }
    if err := rows.Err(); err != nil {
        return nil, err
    }
    return users, nil
}
```

### SQL Injection

Security? What is that? 🤔 Let's take this code as example:

```go
func (s *Store) GetUser(ctx context.Context, id string) (*User, error) {
    var user User
    row := s.db.QueryRow(ctx, fmt.Sprintf("SELECT * FROM users WHERE id = %s", id)

    var u User

    err := row.Scan(&u.ID, &u.Name)
    return &user, nil
}
```

As you see, we are using `fmt.Sprintf` to build our query. This is a very bad practice because we are exposing ourself to SQL Injection.

SQL Injection is a code injection technique that might destroy your database. It is one of the most common web hacking techniques.

For example, in this case, if the user pass as `id` the value `1 OR 1=1` the query will be:

```sql
SELECT * FROM users WHERE id = 1 OR 1=1
```

And this will return all the users in the database.

### Code and Database Synchronization

Maintaining synchronization between code and the database schema is critical to avoid runtime errors:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
);
```

```go
func (s *Store) ListUsers(ctx context.Context) ([]User, error) {
    rows, err := s.db.QueryContext(ctx, "SELECT * FROM upsers")
    // ...
}
```

Adding a new column in the database without updating the code could lead to errors.

### Manual type sync and possible downtimes

Doing things manually is always a bad idea. Because we are humans and we make mistakes.

And if we are going to do things manually, we may have some downtime in our application. Because we need to stop the application, run the migration, and then start the application again.

This is not a good idea, especially if we have a lot of users.

### Automated tests with DB (Why mocking is not a good idea)

When performing unit tests, we are always going to mock the DB, because we don't want to bring the DB up and down for every test.

But, mocking the DB is not a good idea, because we are not testing the real code. We are testing a fake code that we wrote.

So, if we have a bug in our SQL code, we are not going to find it, until we are gonna run it somewhere.

## What can we do?

Ok, we have seen a lot of problems, but what can we do to solve them? 🤔

In this article, we are gonna see how to solve all these problems with the help of some tools and paradigms.

- SQL-first approach
- Migrations
- Test containers (or Docker test)

## SQL-first approach

The SQL-first approach is a paradigm that focuses on writing the SQL code first and then generate the code.

This approach is very useful because we are gonna focus on the SQL code and not how to handle it inside the code.

There are other approaches which you can use, like:

- ORM (Object Relational Mapping)
- Query Builders

### ORM

ORM is a programming technique that enables a seamless conversion between data stored in a relational database table to an object-oriented programming language.

So you are going to create a code like the following:

```go
// Read
var product Product
db.First(&product, 1) // find product with integer primary key
db.First(&product, "code = ?", "D42") // find product with code D42

// Update - update product's price to 200
db.Model(&product).Update("Price", 200)
// Update - update multiple fields
db.Model(&product).Updates(Product{Price: 200, Code: "F42"}) // non-zero fields
```

I don't like so much, not ony because I think the APIs built for Go are not ugly, but you are not writing SQL code, you are writing code that is going to generate SQL code. Also, you can't use all the features of the DB.

### Query Builders

Query Builders are tools or libraries that provide a way to programmatic and or fluent way to create SQL queries.

For example, you can write code like this:

```go
users := sq.Select("*").From("users").Join("emails USING (email_id)")

active := users.Where(sq.Eq{"deleted_at": nil})

sql, args, err := active.ToSql()

sql == "SELECT * FROM users JOIN emails USING (email_id) WHERE deleted_at IS NULL"
```

The problem with this approach is that you don't generate type-safe code. You are just generating a string that you are going to pass to the DB.

So, you still need to map your data and maintains all the types.

Also, just for the record, I don't like the syntax of this library. I think it's not so readable. Because, you are mixing the SQL code with the Go code.

### SQL-first approach vs ORM vs Query Builders

I think the SQL-first approach is the best approach because you are writing SQL code and you are generating type-safe code.

Also, you can use all the features of the DB, like JSONB filtering, etc.

So I have made this table to compare the different approaches:

| Feature                        | SQL-first | ORM       | Query Builders |
| ------------------------------ | --------- | --------- | -------------- |
| Type-safe                      | ✅         | ✅         | ❌              |
| All DB features                | ✅         | ❌         | ✅              |
| Protect you from SQL Injection | ✅         | ✅         | ❌              |
| Clean API                      | ✅         | ❌ (in GO) | ❌              |
| Code generation                | ✅         | ❌         | ❌              |
| I like it                      | ✅✅✅✅      | ❌         | ❌              |

### Use a mixed approach

The best thing you can do is to use a mixed approach. You can use the SQL-first approach for the most common queries and then use the ORM or Query Builders for the rest.

Because, not all the queries are the same. Some queries are very simple and you don't need to write a lot of code, but some queries are very complex and you need to write a lot of code.

Also they may change during the execution depending to different factors. So, an SQL-first approach is not the best solution in this case.

## Migrations

Migrations are a way to keep your DB schema in sync with your code. They are very useful because you can keep track of all the changes you made to the DB.

Also, you can use them to create the DB schema from scratch.

The migrations consists of 2 parts:

- Up - The code that is going to be executed when you are going to run the migration
- Down - The code that is going to be executed when you are going to rollback the migration

For example, let's say that we want to create a table called `users` with the following schema:

```sql
-- migrate:up

CREATE TABLE users (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- migrate:down

DROP TABLE users;
```

Migrations are usually stored inside a directory within the source code and they are named with a timestamp and a name.

They can be executed in 2 ways:

- Manually: You can run the migration manually with a CLI
- Automatically: You can run the migration automatically when the application starts
  - By running the migration inside the code
  - By running the migration through a Job or a CronJob

### Evolutionary Database Design

Evolutionary Database Design is a technique that allows you to evolve your database schema in a simple and agile way.

The idea is to create a migration for every change you make to the DB schema. So, you can keep track of all the changes you made.

If you want to add a breaking change, you must introduce it in multiple steps. Because, you can't break the application.

If you want to learn more about this technique, I suggest you to read the following article at this [link](https://martinfowler.com/articles/evodb.html).

## Test containers (or Docker Test)

Of firstly we have talked about the problems of mocking the DB. So, how can we test our code without mocking the DB?

The answer is simple: **Test containers**.

Test containers are a way to run a real DB instance inside a container and then run the tests against it. So, we are going to test the real implementation of the code.

For example, let's say that we want to test a code which is going to interact with a DB.

With test containers, we can run a real DB instance inside a container and then run the tests against it.

There's no magic here. We are just running a real DB in a "Dockerized" environment. So, you are sure that the code is working as expected where it's gonna run.

Also, you can run the tests in parallel, because you are not sharing the DB instance with other tests.

The best thing is that you can run the tests in your CI/CD pipeline. So, you are sure that the code is working as expected. You must simply have a Docker environment.

This thing does not apply only to the DB, but to all the external services you are using in your application, like Redis, Kafka, etc.

## Let's code

Ok, now that we have seen the theory, let's see how to do it in practice.

For the purpose of this article, we are going to set up a simple application that is going to handle users.

The application is going to expose the following proto service.

```proto
service UsersService {
  rpc CreateUser(CreateUserRequest) returns (CreateUserResponse) {}
  rpc ListUsers(ListUsersRequest) returns (ListUsersResponse) {}
  rpc DeleteUser(DeleteUserRequest) returns (DeleteUserResponse) {}
  rpc GetUser(GetUserRequest) returns (GetUserResponse) {}
}
```

I have decided to use [gRPC](https://grpc.io/) because it's a very simple protocol and it's very easy to use.

So, let's start with the code.

### Create the schema

The first thing we are going to do is to create the schema of the DB.

As we want to maintain the track of our changes to the DB, we are going to use migrations. In this case, we are going to use [dbmate](https://github.com/amacneil/dbmate). But, you can use any other tool you want.

So, let's create the first migration by performing the following commands in the terminal:

```bash
dbmate n init_users_table
```

This is going to create a new migration file called `XXXXXXXXXXXXX_init_users_table.sql`, where `XXXXXXXXXXXXX` is a timestamp.

Now, let's open the file and write the following code:

```sql
-- migrate:up

CREATE TABLE users (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- migrate:down

DROP TABLE users;
```

As you see, we have created a table called `users` with the following columns:

- `id` - The ID of the user
- `name` - The name of the user
- `created_at` - The creation date of the user
- `updated_at` - The update date of the user

Now, let's run the migration by creating a `.env` file with the environment variable with the DB connection string, and after performing the following command in the terminal:

```bash
dbmate up
```

This is going to create the table in the DB and a schema file which is going to be used by the code generator.

### Generate the code

Now, we are going to generate the code. For this purpose, we are going to use [sqlc](https://sqlc.dev).

First of all we need to create a sqlc configuration file called `sqlc.yaml` with the following content:

```yaml
version: "2"
sql:
  - engine: "postgresql"
    queries: "internal/queries/"
    schema: "db/migrations/"
    gen:
      go:
        package: "queries"
        out: "internal/queries/"
        sql_package: "pgx/v5"
```

This is going to tell sqlc where to find the queries and the schema files, and where to generate the code.

Now, let's create the queries file called `internal/queries/users.sql` with the following content:

```sql
-- name: ListUsers :many
SELECT * FROM users LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: CountUsers :one
SELECT COUNT(*) FROM users;

-- name: CreateUser :one
INSERT INTO users (name) VALUES (@name) RETURNING *;

-- name: DeleteUser :one
DELETE FROM users WHERE id = @id RETURNING *;

-- name: GetUser :one
SELECT * FROM users WHERE id = @id LIMIT 1;
```

As you see, we have created the queries we need to handle the users. We have also added some arguments to the queries.

Now, let's generate the code by performing the following command in the terminal:

```bash
sqlc generate
```

This is going to generate the code inside the `internal/queries` directory.

Going back to the implementation of the service we are going to import the generated package and by using the generated `Queries` struct.

For example, let's say that we want to implement the `ListUsers` method. We are going to write the following code:

```go
type srv struct {
	q *queries.Queries
}

func NewUsersService(q *queries.Queries) usersv1connect.UsersServiceHandler {
	return &srv{
		q: q,
	}
}

func (s srv) ListUsers(ctx context.Context, req *connect_go.Request[v1.ListUsersRequest]) (*connect_go.Response[v1.ListUsersResponse], error) {
	users, err := s.q.ListUsers(ctx, queries.ListUsersParams{
		Offset: req.Msg.Offset,
		Limit:  req.Msg.Limit,
	})
	if err != nil {
		return nil, err
	}

	tot, err := s.q.CountUsers(ctx)

	res := make([]*v1.User, len(users))
	for i, user := range users {
		res[i] = newUser(user)
	}

	return connect_go.NewResponse(&v1.ListUsersResponse{
		Users: res,
		Totat: int32(tot),
	}), nil
}
```

As you see, we are using the generated `Queries` struct to perform all the queries we need.

### Run the tests

Now, let's run the tests. For this purpose, we are going to use [dockertest](https://github.com/ory/dockertest), but test containers is also a good solution.

First of all, we need to configure the Postgres container, in dockertest, first of all we need to create a `Pool` and creating the resource.

The resource can be internally expose py performing a port mapping. In this case, we are going to expose the port `5432/tcp` as we are working with Postgres, dockertest is going to find a free port and expose it.

The container can be configured by passing environment variables, arguments, etc.

As the code is a bit long, I'm not going to paste it here, but you can find it [here](https://github.com/davideimola/rdbms-productivity-in-go/blob/68c979eadb608e7e5c29dd075c142262e94a3ca0/internal/testutils/pg.go).

Now, let's write the actual test. Firstly we need to perform the `InitPostgres` function to initialize the Postgres container inside the `TestMain` function.

Then, we need to create a new `Queries` struct by passing the connection string to the `NewUsersService` function.

Now, we can perform the tests. For example, let's say that we want to test the `ListUsers` method. We are going to write the following code:

```go
func TestListEmptyUsers(t *testing.T) {
	ctx := context.Background()
	req := connect.NewRequest(&v1.ListUsersRequest{
		Offset: 0,
		Limit:  10,
	})

	resp, err := usersCli.ListUsers(ctx, req)
	if err != nil {
		t.Fatalf("Could not list users: %s", err)
	}

	assert.Nil(t, err)
	assert.Equal(t, int32(0), resp.Msg.Totat)
}
```

By running the test, we are going to see that the test is passing!

## Conclusions

In this article, we have seen how to improve our RDBMS productivity in GO. We have seen how to use the SQL-first approach, migrations, and test containers.

We have also seen the benefits of using these tools and how to use them in a real application.

If you want to see the full code, you can find it [here](https://github.com/davideimola/rdbms-productivity-in-go).

I hope you have enjoyed this article. If you have any questions, please let me know in the comments.
