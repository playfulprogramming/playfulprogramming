---
{
  title: "About time - how to unit test code that depends on time",
  published: "2023-12-19",
  edited: "2023-12-19",
  tags: ['cpp', 'testing'],
  originalLink: "https://playfulprogramming.blogspot.com/2023/12/about-time.html"
}
---

Suppose that the logic of your program depends on time. That is, you need to keep track of when something in the past
happened, and what time it is now, and the logic of what to do depends on how much time passed between that previous
event and now.

There are many programs with this kind of behaviour. My experience is primarily from networking, where we need to figure
out if a response is timely or late. Such systems often uses timers, i.e. on some action, request a notification at a
specific point in time in the future.

How do you design such a system so that it is testable?

The naïve approach, to just call `std::chrono::<some_clock>::now()`, whenever you need a time stamp, makes unit-tests
more or less impossible, so avoid that.

# Approach 1, the alias clock

Instead of directly referring to `std::chrono::<some_clock>::now()` in your code, you refer to `app_clock::now()`, and
in system builds `app_clock` is defined to be `std::chrono::<some_clock>`, but in unit-tests, they're some test clock.

This is an improvement. In the tests, you now have a means to control what time it is and how time advances. However, a
major drawback is that you need to have different builds of your unit under test depending on situation.

# Approach 2, template specialization access

This is a neat trick, using (abusing?) how the template machinery works in C++.

Create an encapsulation like this:

```cpp
template <typename ...>
constexpr auto clock_impl = std::chrono::some_clock{};

template <typename ... Ts>
struct app_clock
{
    static
    std::chrono::some_clock::time_point now()
    {
        return clock_impl<Ts...>.now();
    }
};
```

Now whenever you call `app_clock::now()`, it will call `clock_impl<>.now()` which is `std::chrono::<some_clock>::now()`.

For our tests, we can define a `test_clock`.

```cpp
struct test_clock
{
    using time_point = std::chrono::some_clock::time_point;
    static time_point now() { return {};}
};

template <>
constexpr auto clock_impl<> = test_clock{};
```

Now we have a specialization for `clock_impl` that is our `test_clock`. It is imperative that the signatures
of `test_clock::now()` and the default `std::chrono::some_clock::now()` are identical.

See an example at [https://godbolt.org/z/GbWYaGc7q](https://godbolt.org/z/GbWYaGc7q)

This overcomes the need for having separate compilations for tests and production.

# Approach 3, the clock factory

In this case, whenever the program needs to know what time it is, it calls `clock_factory::get_clock()`, which in
production code returns some encapsulation of `std::chrono::<some_clock>`.

This is better. Now the only code that differs between a unit test build and a production build is
what `clock_factory::get_clock()` returns.

Unfortunately these factories tends to be singletons, with all the problems that they bring.

If you want to model your test clock as a mock, you have the additional problem of how to ensure that the test code and
the unit under test sees the same clock. It's also really difficult to correctly provide all the right expectations for
the mock without over constraining the tests (exactly how many times should the time be asked for, and what time should
be reported on each call?)

# Approach 4, clocks from above

Instead of having code ask for clocks from factories, you can model your program so that every class that needs to know
the time has a constructor that accepts a clock and stores it as a member variable.

This gets rid of the singleton (yay!!!), but it adds a lot of extra storage and all the other problems remain.

# Approach 5, pass time stamps

Here the problem is turned on its head. What if the code doesn't need to ask for the time, but can be told what time it
is?

An observation is that many systems like this only need to know the time at a few places in the code, typically at the
source of events. Get the time when a message is received. Get the time on user input. Get the time when receiving a
signal. Get the time when a timer fires.

Then, all actions that come as a result of these events, are passed the time stamp.

Passing a chrono `time_point` is cheap (it's typically a 64-bit value passed in a register).

Now tests become easy. All tests of code that needs to know the time are given time points as input, controlled in full
by the test code.

An additional advantage is that you can (should!) instrument your timer code so that for every timer that fires, you
keep track of how late (or early!) it fired. This is typically much more interesting than to measure CPU-load.

The disadvantage is a loss in precision of time. Some cycles will pass between getting the time stamp at the event
source and the logic decision that depends on the time. The programs that I have experience in writing are not bothered
with that loss of precision. Your program may be different, in which case one of the other approaches may be a better
choice.

# Which to choose?

If you can live with the loss of precision from Approach 5, pass time stamps, I think that is the preferred way. It
makes everything so much easier. If the loss of precision is unacceptable, Alternative 2, template specialization access
is probably the best option.
