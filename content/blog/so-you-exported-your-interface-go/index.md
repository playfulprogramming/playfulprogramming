---
{
    title: "So you exported your Go interface",
    description: "A clever way to ensure your interface matches your struct, and why you shouldn't have made yourself do that in the first place.",
    published: "2023-08-21",
    authors: ["rusher2004"],
    tags: ["go"]
}
---

In this post I'll take you through the journey I took to find a Go no-no, a cool solution to help avoid, and what we learned about why just shouldn't have done it in the first place.



>It helps to know at least some Go, but if you're new to it, the comments should help you follow along. 
>
>The examples in this post are intended to look like real world code. So we won't be taking any shortcuts just for the sake of brevity.

I encountered an interesting problem recently in a library that we maintain that is an SDK written in Go for a third-party REST API. It's very handy, and provides an interface for all the methods needed to easily interact with this API.

It looks a lot like this.

```go
// FunAPI defines the methods for interacting with the Fun API.
type FunAPI interface {
	CustomerGet(CustomerGetInput) (CustomerGetOutput, error)
}

type CustomerGetInput struct {
	ID int
}

type CustomerGetOutput struct {
	ID    int
	Name  string
	Email string
}
```

And, of course, there is a struct that implements the FunAPI interface to provide the functionality to the user:

```go
// Client implements the FunAPI interface.
type Client struct {
	// we'd probably hold things here like an http client, auth token, etc.
}

func (c Client) CustomerGet(in CustomerGetInput) (CustomerGetOutput, error) {
	// doRequest makes the call to the Fun API. Imagine it's very clever.
	res, err := doRequest("GET", "/customer", in)
	if err != nil {
		return CustomerGetOutput{}, err
	}

	return CustomerGetOutput{
		ID:    res.id,
		Name:  res.name,
		Email: res.email,
	}, nil
}
```

This is great. We have a clear definition of what this library provides, with consistent inputs and outputs, and predictable behavior.

## Using the library

So let's use it! In our case, we use the API wrapper as a dependency in our own API, so I'll do the same here to keep things familiar.

Here's a basic implementation of a Server struct that handles routing and handling requests.

```go
// Server holds the router and Fun API interface, which makes it super
// easy to use in our handlers and mock out the Fun API in our tests.
type Server struct {
	api FunAPI
	mux *http.ServeMux
}

// handleCustomerGet handles GET /customer requests with input validation.
func (s Server) handleCustomerGet(w http.ResponseWriter, r *http.Request) {
	// get the id from the query string and do some validation
	id := r.URL.Query().Get("id")
	if id == "" {
		s.writeError(w, http.StatusBadRequest, "id is required")
		return
	}

	// make sure it's a valid id
	idInt, err := strconv.Atoi(id)
	if err != nil {
		s.writeError(w, http.StatusBadRequest, "id must be an integer")
		return
	}

	// now we have good input, let's call the API.
	in := CustomerGetInput{idInt}
	out, err := s.api.CustomerGet(in)
	if err != nil {
		s.writeError(w, http.StatusInternalServerError, "error calling Fun API: "+err.Error())
		return
	}

	// write out a JSON response
	if err := json.NewEncoder(w).Encode(out); err != nil {
		s.writeError(w, http.StatusInternalServerError, "error parsing Fun API response: "+err.Error())
		return
	}
}

// serve sets up the server and starts listening for requests
func serve() {
	c := Client{}
	s := Server{
		api: c,
		mux: http.NewServeMux(),
	}

	s.mux.HandleFunc("/customer", s.handleCustomerGet)
	s.mux.HandleFunc("/order", s.handleOrderPut)

	if err := http.ListenAndServe(":8080", s.mux); err != nil {
		log.Fatalf("error serving: %v", err)
	}
}
```

Great, we have a server that takes in requests to `GET /customer`, validates necessary input, and gives meaningful, uniform responses. So what do we do with that?

We test it!

## Testing the server

One of the great things about interfaces in Go is that it enables us to test our code without needing to setup environments with connections to outside services. We can mock the responses, and test the behavior of our code.

In our case, we're testing an HTTP server that uses a outside dependency, which means we want to be able to test the following:

1. we get the expected responses from bad input
2. we get relevant responses based on what the Fun API returns from our input
3. a baseline happy path

I *really* like table driven tests. Especially for cases like this where we have a wide variety of inputs and outputs per function that we want to test.